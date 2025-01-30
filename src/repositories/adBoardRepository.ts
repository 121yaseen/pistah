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
      description: adBoard.description, // Added description field
      boardType: adBoard.boardType,
      dailyRate: adBoard.dailyRate,
      dimensions: adBoard.dimensions,
      isAvailable: adBoard.isAvailable,
      operationalHours: adBoard.operationalHours,
      ownerContact: adBoard.ownerContact,
      lastMaintenanceDate: adBoard.lastMaintenanceDate,
      imageUrl: JSON.stringify(adBoard.imageUrl), // Store as JSON string
      ownerId: createdUser.id, // Updated field
    },
  });
};

// Fetch all Ad Boards owned by a user
export const getAdBoards = async (createdBy: User) => {
  return await prisma.adBoard.findMany({
    where: {
      ownerId: createdBy.id, // Updated field
    },
    include: {
      ads: true, // Include related ads
      bookings: true, // Include related bookings
    },
  });
};

// Delete an Ad Board and all related Ads and Bookings
export const deleteAdBoardAsync = async (id: string, user: User) => {
  await prisma.booking.deleteMany({
    where: { adBoardId: id },
  });

  await prisma.ad.deleteMany({
    where: { adBoardId: id },
  });

  return await prisma.adBoard.delete({
    where: {
      id,
      ownerId: user.id, // Updated field
    },
  });
};

// Update an Ad Board
export const updateAdBoardAsync = async (adBoard: AdBoard, user: User) => {
  const result = await prisma.adBoard.updateMany({
    where: {
      id: adBoard.id,
      ownerId: user.id, // Updated field
    },
    data: {
      boardName: adBoard.boardName,
      location: adBoard.location,
      description: adBoard.description, // Added field
      boardType: adBoard.boardType,
      dailyRate: adBoard.dailyRate,
      dimensions: adBoard.dimensions,
      isAvailable: adBoard.isAvailable,
      operationalHours: adBoard.operationalHours,
      ownerContact: adBoard.ownerContact,
      lastMaintenanceDate: adBoard.lastMaintenanceDate,
      imageUrl: JSON.stringify(adBoard.imageUrl), // Store as JSON string
    },
  });

  if (result.count === 0) {
    throw new Error("Ad board not found");
  }

  return await prisma.adBoard.findUniqueOrThrow({
    where: { id: adBoard.id },
  });
};
