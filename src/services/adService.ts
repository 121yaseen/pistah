import { getAds, getAdBoards } from "../repositories/adRepository";

export const fetchFilteredAds = async (date: string) => {
  const ads = await getAds();
  const adBoards = await getAdBoards();
  console.log(date);
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
