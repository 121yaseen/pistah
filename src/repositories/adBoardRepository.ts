import prisma from "@/app/libs/prismadb";
import { AdBoard, User } from "@/types/ad";

// Create a new Ad Board
export const createAdBoardAsync = async (
  adBoard: AdBoard,
  createdUser: User
) => {
  const { boardName, location, boardType, dailyRate, ownerContact } = adBoard;

  console.log(adBoard);
  return await prisma.adBoard.create({
    data: {
      boardName,
      location,
      dimensions: "10x20 ft",
      boardType: boardType ?? "Static",
      isAvailable: true,
      dailyRate,
      operationalHours: "9 AM - 5 PM",
      ownerContact,
      lastMaintenanceDate: new Date().toISOString(),
      imageUrl: "[" + adBoard.imageUrls?.toString() + "]",
      createdById: createdUser.id,
    },
  });
};

// Fetch all Ad Boards
export const getAdBoards = async (createdBy: User) => {
  return await prisma.adBoard.findMany({
    where: {
      createdById: createdBy.id,
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

// Delete an Ad board and all its Ads
export const deleteAdBoardAsync = async (id: string, user: User) => {
  return await prisma.adBoard.delete({
    where: {
      id,
      createdById: user.id,
    },
  });
};

// Update an Ad Board
export const updateAdBoardAsync = async (adBoard: AdBoard, user: User) => {
  const {
    id,
    boardName,
    location,
    boardType,
    dailyRate,
    ownerContact,
    imageUrls,
  } = adBoard;

  const existingAdBoard = await prisma.adBoard.findUnique({
    where: {
      id,
      createdById: user.id,
    },
  });

  if (!existingAdBoard) {
    throw new Error("Ad board not found");
  }

  return await prisma.adBoard.update({
    where: {
      id,
    },
    data: {
      boardName,
      location,
      boardType,
      dailyRate,
      ownerContact,
      imageUrl: "[" + imageUrls?.toString() + "]",
    },
  });
};
