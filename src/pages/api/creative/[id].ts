import { deleteAdService } from "@/services/adService";
import { getLoggedInUser } from "@/services/userService";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid ad ID" });
  }

  try {
    const user = await getLoggedInUser(req);
    if (!user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    await deleteAdService(id, user.id);
    return res.status(200).json({ message: "Ad deleted successfully" });
  } catch (error) {
    console.error("Error deleting ad:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
