import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/app/libs/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email } = req.query;

  if (req.method === "GET") {
    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Invalid email address" });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { Company: true },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "PUT") {
    const { name, email, company } = req.body;
    const id = req.query.email as string;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    if (!name || !email || !company?.name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          name,
          email,
          Company: {
            update: {
              where: { id: company.id },
              data: {
                name: company.name,
              },
            },
          },
        },
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
