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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await getLoggedInUser(req);

  if (req.method === "POST") {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form:", err);
        return res.status(500).json({ error: "Error parsing form data" });
      }
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

      const adTitle = Array.isArray(title) ? title[0] : title;
      const adDownloadLink = Array.isArray(downloadLink)
        ? downloadLink[0]
        : downloadLink;
      const adAdBoardId = Array.isArray(adBoardId) ? adBoardId[0] : adBoardId;
      const adAdDisplayStartDate = Array.isArray(adDisplayStartDate)
        ? adDisplayStartDate[0]
        : adDisplayStartDate;
      const adAdDisplayEndDate = Array.isArray(adDisplayEndDate)
        ? adDisplayEndDate[0]
        : adDisplayEndDate;
      const adAdDuration = Array.isArray(adDuration)
        ? adDuration[0]
        : adDuration;
      const adVideoUrl = Array.isArray(videoUrl) ? videoUrl[0] : videoUrl;
      const adRemarks = Array.isArray(remarks) ? remarks[0] : remarks;

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
        : (files.thumbnail as formidable.File);

      if (thumbnailFile.size > 5 * 1024 * 1024) {
        return res
          .status(400)
          .json({ error: "Thumbnail must be less than 5MB" });
      }
      let thumbnailUrl = "";
      try {
        const ROOT_DIR = "/safe/upload/directory";
        const resolvedPath = fs.realpathSync(
          path.resolve(ROOT_DIR, thumbnailFile.filepath)
        );

        const fileBuffer = await fs.promises.readFile(resolvedPath);
        thumbnailUrl = await uploadToS3(
          fileBuffer,
          thumbnailFile.originalFilename || "default-filename"
        );
      } catch (error) {
        console.error("Error creating ad:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (
        adVideoUrl !== null &&
        adVideoUrl !== "" &&
        typeof adVideoUrl == "string"
      ) {
        console.log("adVideoUrl: ", adVideoUrl);
        const newAd = await createAd(
          {
            title: adTitle,
            downloadLink: adVideoUrl,
            adBoardId: adAdBoardId,
            adDisplayStartDate: adAdDisplayStartDate,
            adDisplayEndDate: adAdDisplayEndDate,
            adDuration: adAdDuration,
            thumbnailUrl,
            remarks: adRemarks,
          },
          user
        );
        return res.status(201).json(newAd);
      }
      const newAd = await createAd(
        {
          title: adTitle,
          downloadLink: adDownloadLink,
          adBoardId: adAdBoardId,
          adDisplayStartDate: adAdDisplayStartDate,
          adDisplayEndDate: adAdDisplayEndDate,
          adDuration: adAdDuration,
          thumbnailUrl,
          remarks: adRemarks,
        },
        user
      );

      return res.status(201).json(newAd);
    });
  } else if (req.method === "GET") {
    // Get the start and end date from the query params
    let { startDate, endDate } = req.query;

    // if the start or end date is missing, replace the with todays date
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
