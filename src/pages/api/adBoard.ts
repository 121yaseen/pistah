import { NextApiRequest, NextApiResponse } from "next";
import { createAdBoard, deleteAdBoard } from "@/services/adBoardService";
import { AdBoard } from "@/types/ad";
import { getAdBoards } from "@/repositories/adBoardRepository";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { adBoard }: { adBoard: AdBoard } = req.body;

    if (!adBoard) {
      return res.status(400).json({ error: "AdBoard data is required" });
    }

    try {
      const createdAdBoard = await createAdBoard(adBoard);
      return res.status(201).json(createdAdBoard);
    } catch (error) {
      console.error("Error creating ad board:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  if (req.method === "GET") {
    try {
      const adBoards = await getAdBoards();
      return res.status(200).json(adBoards);
    } catch (error) {
      console.error("Error fetching ad boards:", error);
      return res.status(500).json({ error: "Failed to fetch ad boards" });
    }
  }

  if (req.method === "PUT") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (req.method === "DELETE") {
    try {
      const response = await deleteAdBoard(req.query.id as string);
      return res.status(204).json(response);
    } catch (error) {
      console.error("Error deleting ad board:", error);
      return res.status(500).json({ error: "Failed to delete ad board" });
    }
  }

  res.setHeader("Allow", ["POST", "GET"]);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
