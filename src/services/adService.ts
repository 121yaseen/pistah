import { getAdBoards } from "@/repositories/adBoardRepository";
import { getAds } from "@/repositories/adRepository";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const fetchFilteredAds = async (date: string) => {
  const ads = await getAds();
  const adBoards = await getAdBoards();

  // const requestedDate = new Date(date);

  // const filteredAds = ads.filter(
  //   (ad) =>
  //     requestedDate >= new Date(ad.adDisplayStartDate) &&
  //     requestedDate <= new Date(ad.adDisplayEndDate)
  // );

  const filteredAds = ads.map((ad) => {
    const adBoard = adBoards.find((board) => board.id == ad.adBoardId);
    return { ...ad, adBoard: adBoard || undefined };
  });
  return filteredAds;
};
