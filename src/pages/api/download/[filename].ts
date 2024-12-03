import { NextApiRequest, NextApiResponse } from "next";
import { list } from "@vercel/blob";
import path from "path";

const mimeTypes: { [key: string]: string } = {
  ".mp4": "video/mp4",
  ".mp3": "audio/mp3",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
  // Add more mime types as needed
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let { filename } = req.query;

  if (!filename || typeof filename !== "string") {
    return res.status(400).json({ error: "Filename is required" });
  }
  filename = "ad-1.mp4";
  try {
    const { blobs } = await list({
      prefix: filename,
      limit: 1,
    });

    if (blobs.length === 0) {
      return res.status(404).json({ error: "File not found" });
    }

    const blob = blobs[0];
    const extname = path.extname(filename).toLowerCase();
    const contentType = mimeTypes[extname] || "application/octet-stream";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.redirect(blob.url);
  } catch (error) {
    console.error("Error fetching blob:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
