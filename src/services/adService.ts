import { createAdAsync, getAds, deleteAd } from "@/repositories/adRepository";
import { getAdBoards } from "@/repositories/adBoardRepository";
import { Ad, User } from "@/types/ad";

export const fetchFilteredAds = async (
  startDate: string,
  endDate: string,
  createdUser: User
) => {
  const [ads, adBoards] = await Promise.all([
    getAds(startDate, endDate),
    getAdBoards(createdUser),
  ]);

  const adBoardMap = new Map(adBoards.map((board) => [board.id, board]));

  const filteredAds = ads
    .filter((ad) => adBoardMap.has(ad.adBoardId))
    .map((ad) => ({ ...ad, adBoard: adBoardMap.get(ad.adBoardId) }));

  return filteredAds;
};

export const createAd = async (adData: Ad, createdUser: User) => {
  console.log(adData);
  await createAdAsync(adData, createdUser);
};

export const deleteAdService = async (id: string, userId: string) => {
  await deleteAd(id, userId);
};
