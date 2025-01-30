import prisma from "@/app/libs/prismadb";
import { AdBoard, User } from "@/types/ad";

// Create a new Ad Board
export const createAdBoardAsync = async (
  adBoard: AdBoard,
  createdUser: User
) => {
  return await prisma.adBoard.create({
    data: {
      boardName: adBoard.boardName,
      location: adBoard.location,
      boardType: adBoard.boardType,
      dailyRate: adBoard.dailyRate,
      dimensions: adBoard.dimensions,
      isAvailable: adBoard.isAvailable,
      operationalHours: adBoard.operationalHours,
      ownerContact: adBoard.ownerContact,
      lastMaintenanceDate: adBoard.lastMaintenanceDate,
      imageUrl: adBoard.imageUrl.join(","),
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

// Delete an Ad board and all related Ads
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
  const result = await prisma.adBoard.updateMany({
    where: {
      id: adBoard.id,
      createdById: user.id,
    },
    data: {
      boardName: adBoard.boardName,
      location: adBoard.location,
      boardType: adBoard.boardType,
      dailyRate: adBoard.dailyRate,
      ownerContact: adBoard.ownerContact,
      imageUrl: adBoard.imageUrl.join(","),
    },
  });

  if (result.count === 0) {
    throw new Error("Ad board not found");
  }

  return await prisma.adBoard.findUniqueOrThrow({
    where: { id: adBoard.id },
  });
};
