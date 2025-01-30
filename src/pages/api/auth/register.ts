import { NextApiRequest, NextApiResponse } from "next";
import { createUser } from "@/services/userService";
import { createCompany } from "@/services/companyService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, email, password, companyName } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "Invalid input." });
    }

    try {
      const newUser = await createUser(name, email, password);
      await createCompany(companyName, newUser.id);
      res.status(201).json({
        message: "User created successfully.",
      });
    } catch (error) {
      console.error("Error creating user:", (error as Error).message);
      if (error instanceof Error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((error as any).code === "P2002") {
          res.status(400).json({ error: "Email already in use." });
        } else {
          res.status(500).json({ error: "Something went wrong." });
        }
      } else {
        res.status(500).json({ error: "An unexpected error occurred." });
      }
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} not allowed.` });
  }
}
