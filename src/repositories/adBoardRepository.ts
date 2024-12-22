import prisma from "@/app/libs/prismadb";
import { Ad, AdBoard } from "@/types/ad";

// Create a new Ad Board
export const createAdBoardAsync = async (adBoard: AdBoard) => {
  const { boardName, location, boardType, dailyRate, ownerContact } = adBoard;

  return await prisma.adBoard.create({
    data: {
      boardName,
      location,
      dimensions: "10x20 ft",
      boardType: boardType ?? "Static",
      isAvailable: true,
      dailyRate,
      operationalHours: "9 AM - 6 PM",
      ownerContact,
      lastMaintenanceDate: new Date().toISOString(),
    },
  });
};

// Fetch all Ad Boards
export const getAdBoards = async () => {
  return await prisma.adBoard.findMany();
};

// Create a new Ad
export const createAdAsync = async (ad: Ad) => {
  const {
    title,
    downloadLink,
    adBoardId,
    adDisplayStartDate,
    adDisplayEndDate,
    adDuration,
    //thumbnailUrl,
  } = ad;

  return await prisma.ad.create({
    data: {
      title,
      downloadLink,
      adBoardId, // No need to convert as Prisma handles ObjectId automatically
      adDisplayStartDate: new Date(adDisplayStartDate),
      adDisplayEndDate: new Date(adDisplayEndDate),
      adDuration,
      //thumbnailUrl,
    },
  });
};

// Fetch all Ads
export const getAds = async () => {
  return await prisma.ad.findMany({
    include: {
      adBoard: true, // Include related AdBoard details
    },
  });
};
