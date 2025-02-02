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
      description: adBoard.description,
      boardType: adBoard.boardType,
      dailyRate: adBoard.dailyRate,
      dimensions: adBoard.dimensions,
      isAvailable: adBoard.isAvailable,
      operationalHours: adBoard.operationalHours,
      ownerContact: adBoard.ownerContact,
      lastMaintenanceDate: adBoard.lastMaintenanceDate,
      imageUrl: JSON.stringify(adBoard.imageUrl),
      ownerId: createdUser.id,
    },
  });
};

// Fetch all Ad Boards owned by a user
export const getAdBoards = async (createdBy: User) => {
  const adBoards = await prisma.adBoard.findMany({
    where: {
      ownerId: createdBy.id,
    },
    include: {
      bookings: {
        include: {
          ad: {
            include: {
              createdUser: true,
            },
          },
        },
      },
    },
  });

  // Transform adBoards to match the old AdBoard structure
  const transformedAdBoards = adBoards.map((adBoard) => ({
    ...adBoard,
    ads: adBoard.bookings.map((booking) => ({
      ...booking.ad,
      adDisplayStartDate: booking.startDate,
      adDisplayEndDate: booking.endDate,
    })),
  }));

  return transformedAdBoards;
};

// Delete an Ad Board and all related Bookings
export const deleteAdBoardAsync = async (id: string, user: User) => {
  // Delete associated bookings first
  await prisma.booking.deleteMany({
    where: { adBoardId: id },
  });

  // Then delete the ad board
  return await prisma.adBoard.delete({
    where: {
      id,
      ownerId: user.id,
    },
  });
};

// Update an Ad Board
export const updateAdBoardAsync = async (adBoard: AdBoard, user: User) => {
  const result = await prisma.adBoard.updateMany({
    where: {
      id: adBoard.id,
      ownerId: user.id,
    },
    data: {
      boardName: adBoard.boardName,
      location: adBoard.location,
      description: adBoard.description,
      boardType: adBoard.boardType,
      dailyRate: adBoard.dailyRate,
      dimensions: adBoard.dimensions,
      isAvailable: adBoard.isAvailable,
      operationalHours: adBoard.operationalHours,
      ownerContact: adBoard.ownerContact,
      lastMaintenanceDate: adBoard.lastMaintenanceDate,
      imageUrl: JSON.stringify(adBoard.imageUrl),
    },
  });

  if (result.count === 0) {
    throw new Error("Ad board not found");
  }

  return await prisma.adBoard.findUniqueOrThrow({
    where: { id: adBoard.id },
  });
};
