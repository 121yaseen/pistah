import { NextApiRequest, NextApiResponse } from "next";
import { createAdAsync } from "../../repositories/adBoardRepository";
import { fetchFilteredAds } from "@/services/adService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("req.method", req.method);

  if (req.method === "POST") {
    const adData = req.body;

    // Validate adData before proceeding
    if (
      !adData.title ||
      !adData.downloadLink ||
      !adData.adBoardId ||
      !adData.adDisplayStartDate ||
      !adData.adDisplayEndDate ||
      !adData.adDuration ||
      !adData.thumbnailUrl
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const newAd = await createAdAsync(adData); // Call the createAdAsync function
      return res.status(201).json(newAd);
    } catch (error) {
      console.error("Error creating ad:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  if (req.method === "GET") {
    // const date = Array.isArray(req.query.date)
    //   ? req.query.date[0]
    //   : req.query.date;

    // if (!date) {
    //   return res.status(400).json({ error: "Date is required" });
    // }

    try {
      const ads = await fetchFilteredAds();
      return res.status(200).json(ads);
    } catch (error) {
      console.error("Error fetching ads:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // Unsupported method
  res.setHeader("Allow", ["POST", "GET"]);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
