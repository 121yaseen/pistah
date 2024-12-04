import prisma from "@/app/libs/prismadb";
import { AdBoard } from "@/types/ad";

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

// Fetch all ad boards
export const getAdBoards = async () => {
  return await prisma.adBoard.findMany();
};
