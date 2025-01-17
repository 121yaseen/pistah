import prisma from "@/app/libs/prismadb";
import { AdBoard, User } from "@/types/ad";

// Create a new Ad Board
export const createAdBoardAsync = async (
  adBoard: AdBoard,
  createdUser: User
) => {
  const { boardName, location, boardType, dailyRate, ownerContact, imageUrls } =
    adBoard;

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
      imageUrl: imageUrls ? `[${imageUrls.join(",")}]` : "[]",
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
      adBoard: true,
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

  const updateData = {
    boardName,
    location,
    boardType,
    dailyRate,
    ownerContact,
    imageUrl: imageUrls ? `[${imageUrls.join(",")}]` : "[]",
  };

  const result = await prisma.adBoard.updateMany({
    where: {
      id,
      createdById: user.id,
    },
    data: updateData,
  });

  if (result.count === 0) {
    throw new Error("Ad board not found");
  }

  return await prisma.adBoard.findUniqueOrThrow({
    where: {
      id,
    },
  });
};
