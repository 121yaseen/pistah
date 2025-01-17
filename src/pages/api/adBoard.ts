import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import {
  createAdBoard,
  deleteAdBoard,
  updateAdBoard,
} from "@/services/adBoardService";
import { AdBoard } from "@/types/ad";
import { getAdBoards } from "@/repositories/adBoardRepository";
import formidable from "formidable";
import { AdBoardType } from "@/app/enums/AdBoardType";
import { getLoggedInUser } from "@/services/userService";
import { uploadToS3 } from "@/services/s3Service";

export const config = {
  api: {
    bodyParser: false,
  },
};

function parseAsArray(str: string): string[] {
  return str
    .slice(1, -1)
    .split(",")
    .map((item) => item.trim());
}

const handleImageUpload = async (
  files: formidable.Files,
  res: NextApiResponse
): Promise<string[]> => {
  if (!files.image) return [];

  const images = Array.isArray(files.image) ? files.image : [files.image];
  const imageUrls: string[] = [];

  for (const image of images) {
    if (image.size > 5 * 1024 * 1024) {
      res
        .status(400)
        .json({ error: "Each inventory image must be less than 5MB" });
      return [];
    }

    try {
      const fileBuffer = await fs.promises.readFile(image.filepath);
      const imageUrl = await uploadToS3(
        fileBuffer,
        image.originalFilename || "default-filename"
      );
      imageUrls.push(imageUrl);
    } catch (error) {
      console.error("Error uploading image to S3:", error);
      res.status(500).json({ error: "Failed to upload image" });
      return [];
    }
  }
  return imageUrls;
};

const processAdBoardData = (
  fields: formidable.Fields
): Omit<AdBoard, "id" | "imageUrl"> & { id?: string; imageUrls?: string[] } => {
  const {
    boardName,
    location,
    dailyRate,
    ownerContact,
    boardType,
    id,
    imageUrls,
  } = fields as { [key: string]: string | string[] };

  return {
    id: Array.isArray(id) ? id[0] : id,
    boardName: Array.isArray(boardName) ? boardName[0] : boardName,
    location: Array.isArray(location) ? location[0] : location,
    dailyRate: Number(Array.isArray(dailyRate) ? dailyRate[0] : dailyRate),
    ownerContact: Array.isArray(ownerContact) ? ownerContact[0] : ownerContact,
    boardType: Array.isArray(boardType)
      ? (boardType[0] as AdBoardType)
      : (boardType as AdBoardType),
    imageUrls: Array.isArray(imageUrls)
      ? imageUrls
      : imageUrls
      ? [imageUrls]
      : undefined,
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await getLoggedInUser(req);

  const form = formidable();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form:", err);
      return res.status(500).json({ error: "Error parsing form data" });
    }

    if (req.method === "POST") {
      const adBoardData = processAdBoardData(fields);

      if (
        !adBoardData.boardName ||
        !adBoardData.location ||
        !adBoardData.dailyRate ||
        !adBoardData.ownerContact ||
        !adBoardData.boardType
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const imageUrls = await handleImageUpload(files, res);
      if (res.statusCode !== 200) return;
      const adBoard: AdBoard = { ...adBoardData, imageUrls, id: "" };
      try {
        const response = await createAdBoard(adBoard, user);
        return res.status(201).json(response);
      } catch (error) {
        console.error("Error creating ad board:", error);
        return res.status(500).json({ error: "Failed to create ad board" });
      }
    } else if (req.method === "GET") {
      try {
        const adBoards = await getAdBoards(user);
        return res.status(200).json(
          adBoards.map((adBoard) => ({
            ...adBoard,
            imageUrls: parseAsArray(adBoard.imageUrl),
          }))
        );
      } catch (error) {
        console.error("Error fetching ad boards:", error);
        return res.status(500).json({ error: "Failed to fetch ad boards" });
      }
    } else if (req.method === "PUT") {
      const adBoardData = processAdBoardData(fields);

      if (
        !adBoardData.id ||
        !adBoardData.boardName ||
        !adBoardData.location ||
        !adBoardData.dailyRate ||
        !adBoardData.ownerContact ||
        !adBoardData.boardType
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const imageUrls = await handleImageUpload(files, res);
      if (res.statusCode !== 200) return;

      const adBoard: AdBoard = {
        ...adBoardData,
        imageUrls: adBoardData.imageUrls
          ? [...adBoardData.imageUrls, ...imageUrls]
          : imageUrls,
        id: adBoardData.id,
      };

      try {
        const response = await updateAdBoard(adBoard, user);
        return res.status(200).json(response);
      } catch (error) {
        console.error("Error updating ad board:", error);
        return res.status(500).json({ error: "Failed to update ad board" });
      }
    } else if (req.method === "DELETE") {
      try {
        const response = await deleteAdBoard(req.query.id as string, user);
        return res.status(204).json(response);
      } catch (error) {
        console.error("Error deleting ad board:", error);
        return res.status(500).json({ error: "Failed to delete ad board" });
      }
    } else {
      res.setHeader("Allow", ["POST", "GET", "PUT", "DELETE"]);
      return res
        .status(405)
        .json({ error: `Method ${req.method} Not Allowed` });
    }
  });
}
