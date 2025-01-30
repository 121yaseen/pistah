import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/app/libs/prismadb";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { uploadToS3 } from "@/services/s3Service";
import { updateUserProfile } from "@/services/userService";
import { Role } from "@/types/ad";

const SAFE_ROOT_DIR = "/var/www/uploads";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email } = req.query;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Invalid email address" });
  }

  if (req.method === "GET") {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { company: true }, // Updated casing to match schema
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "PUT") {
    const form = formidable({ multiples: false });

    try {
      const { fields, files } = await new Promise<{
        fields: formidable.Fields;
        files: formidable.Files;
      }>((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) {
            reject(err);
            return;
          }
          resolve({ fields, files });
        });
      });

      const { name, companyName, role } = fields; // Added role field
      let profilePicUrl = "";

      if (files.profilePic) {
        const file = Array.isArray(files.profilePic)
          ? files.profilePic[0]
          : files.profilePic;

        const normalizedFilePath = path.resolve(SAFE_ROOT_DIR, file.filepath);
        const fileBuffer = await fs.promises.readFile(normalizedFilePath);
        profilePicUrl = await uploadToS3(
          fileBuffer,
          file.originalFilename || `profile-pic-${email}`
        );
      }

      const updatedUser = await updateUserProfile(email, {
        name: Array.isArray(name) ? name[0] : name,
        companyName: Array.isArray(companyName) ? companyName[0] : companyName,
        profilePicUrl,
        role: Array.isArray(role)
          ? (role[0] as Role)
          : (role as unknown as Role),
      });

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error processing request:", error);
      return res.status(500).json({ error: "Failed to process request" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
