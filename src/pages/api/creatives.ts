import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { uploadToS3 } from "@/services/s3Service";
import { createAd, fetchFilteredAds } from "@/services/adService";
import { getLoggedInUser } from "@/services/userService";

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = async (req: NextApiRequest) => {
  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
    (resolve, reject) => {
      const form = formidable();
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({ fields, files });
      });
    }
  );
};

const processFields = (fields: formidable.Fields) => {
  const {
    title,
    downloadLink,
    adBoardId,
    adDisplayStartDate,
    adDisplayEndDate,
    adDuration,
    videoUrl,
    remarks,
  } = fields as { [key: string]: string | string[] };

  return {
    adTitle: Array.isArray(title) ? title[0] : title,
    adDownloadLink: Array.isArray(downloadLink)
      ? downloadLink[0]
      : downloadLink,
    adAdBoardId: Array.isArray(adBoardId) ? adBoardId[0] : adBoardId,
    adAdDisplayStartDate: Array.isArray(adDisplayStartDate)
      ? adDisplayStartDate[0]
      : adDisplayStartDate,
    adAdDisplayEndDate: Array.isArray(adDisplayEndDate)
      ? adDisplayEndDate[0]
      : adDisplayEndDate,
    adAdDuration: Array.isArray(adDuration) ? adDuration[0] : adDuration,
    adVideoUrl: Array.isArray(videoUrl) ? videoUrl[0] : videoUrl,
    adRemarks: Array.isArray(remarks) ? remarks[0] : remarks,
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await getLoggedInUser(req);

  if (req.method === "POST") {
    try {
      const { fields, files } = await parseForm(req);
      const {
        adTitle,
        adDownloadLink,
        adAdBoardId,
        adAdDisplayStartDate,
        adAdDisplayEndDate,
        adAdDuration,
        adVideoUrl,
        adRemarks,
      } = processFields(fields);

      if (
        !adTitle ||
        !adAdBoardId ||
        !adAdDisplayStartDate ||
        !adAdDisplayEndDate ||
        !adAdDuration ||
        !files.thumbnail
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const thumbnailFile = Array.isArray(files.thumbnail)
        ? files.thumbnail[0]
        : files.thumbnail;

      if (thumbnailFile.size > 5 * 1024 * 1024) {
        return res
          .status(400)
          .json({ error: "Thumbnail must be less than 5MB" });
      }

      const ROOT_DIR = "/safe/upload/directory";
      const resolvedPath = fs.realpathSync(
        path.resolve(ROOT_DIR, thumbnailFile.filepath)
      );
      const fileBuffer = await fs.promises.readFile(resolvedPath);
      const thumbnailUrl = await uploadToS3(
        fileBuffer,
        thumbnailFile.originalFilename || "default-filename"
      );

      const newAd = await createAd(
        {
          id: "",
          title: adTitle,
          downloadLink: adDownloadLink ?? "",
          adBoardId: adAdBoardId,
          adDisplayStartDate: adAdDisplayStartDate,
          adDisplayEndDate: adAdDisplayEndDate,
          adDuration: adAdDuration,
          thumbnailUrl,
          remarks: adRemarks,
          videoUrl: adVideoUrl ?? "",
        },
        user
      );

      return res.status(201).json(newAd);
    } catch (error) {
      console.error("Error creating ad:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "GET") {
    let { startDate, endDate } = req.query;

    if (!startDate) {
      startDate = new Date().toISOString();
    }
    if (!endDate) {
      endDate = new Date().toISOString();
    }

    try {
      const ads = await fetchFilteredAds(
        startDate as string,
        endDate as string,
        user
      );
      return res.status(200).json(ads);
    } catch (error) {
      console.error("Error fetching ads:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
