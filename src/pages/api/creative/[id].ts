import { deleteAdService } from "@/services/adService";
import { getLoggedInUser } from "@/services/userService";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Invalid ad ID" });
  }

  try {
    const loggedInUser = await getLoggedInUser(req);
    if (!loggedInUser || !loggedInUser.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await deleteAdService(id, loggedInUser.id);
    return res.status(200).json({ message: "Ad deleted successfully" });
  } catch (error) {
    console.error("Error deleting ad:", error);
    return res.status(500).json({ message: (error as Error).message });
  }
}
