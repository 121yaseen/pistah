import { NextApiRequest, NextApiResponse } from "next";
import { createUser } from "@/services/userService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "Invalid input." });
    }

    try {
      const newUser = await createUser(name, email, password);
      res
        .status(201)
        .json({ message: "User created successfully.", user: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to create user." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} not allowed.` });
  }
}
