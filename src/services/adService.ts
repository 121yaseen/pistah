import { getAds } from "@/repositories/adRepository";
import { createAdAsync, getAdBoards } from "@/repositories/adBoardRepository";
import { Ad } from "@/types/ad";

export const fetchFilteredAds = async () => {
  const ads = await getAds();
  const adBoards = await getAdBoards();

  console.log(ads);
  console.log(adBoards);
  const filteredAds = ads.map((ad) => {
    const adBoard = adBoards.find((board) => board.id == ad.adBoardId);
    return { ...ad, adBoard: adBoard || undefined };
  });
  console.log(filteredAds);
  return filteredAds;
};

export const createAd = async (adData: Ad) => {
  await createAdAsync(adData); // Save ad using the repository
};
