import { getAds } from "@/repositories/adRepository";
import { createAdAsync, getAdBoards } from "@/repositories/adBoardRepository";
import { Ad } from "@/types/ad";

export const fetchFilteredAds = async (startDate: string, endDate: string) => {
  const ads = await getAds(startDate, endDate);
  const adBoards = await getAdBoards();

  const filteredAds = ads.map((ad) => {
    const adBoard = adBoards.find((board) => board.id == ad.adBoardId);
    return { ...ad, adBoard: adBoard || undefined };
  });
  return filteredAds;
};

export const createAd = async (adData: Ad) => {
  await createAdAsync(adData); // Save ad using the repository
};
