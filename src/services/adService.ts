import {
  createAdAsync,
  getAds,
  deleteAd,
  updateAd,
} from "@/repositories/adRepository";
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
    .filter((ad) => ad.adBoard && adBoardMap.has(ad.adBoard.id))
    .map((ad) => ({ ...ad, adBoard: adBoardMap.get(ad.adBoard.id) }));

  return filteredAds;
};

export const createAd = async (adData: Ad, createdUser: User) => {
  return await createAdAsync(adData, createdUser);
};

export const deleteAdService = async (id: string, userId: string) => {
  return await deleteAd(id, userId);
};

export const updateAdService = async (
  id: string,
  adData: Partial<Ad>,
  userId: string
) => {
  return await updateAd(id, adData, userId);
};
