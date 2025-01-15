import type { NextApiRequest, NextApiResponse } from "next";
import { getPresignedUploadUrl } from "@/services/s3Service";

// Utility function to map file extensions to content types
const getContentTypeFromFileName = (fileName: string): string => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "mp4":
      return "video/mp4";
    case "mkv":
      return "video/x-matroska";
    case "avi":
      return "video/x-msvideo";
    case "mov":
      return "video/quicktime";
    case "webm":
      return "video/webm";
    default:
      throw new Error("Unsupported video file type.");
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      const { fileName } = req.body;

      if (!fileName) {
        return res
          .status(400)
          .json({ error: "Missing fileName in request body." });
      }

      // Determine the content type dynamically
      let contentType;
      try {
        contentType = getContentTypeFromFileName(fileName);
      } catch (error) {
        return res.status(400).json({ error: (error as Error).message });
      }

      // Generate the presigned URL
      const presignedUrl = await getPresignedUploadUrl(fileName, contentType);
      return res.status(200).json({ url: presignedUrl });
    } else {
      return res.status(405).json({ error: "Method not allowed. Use POST." });
    }
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return res.status(500).json({ error: (error as Error).message });
  }
}
