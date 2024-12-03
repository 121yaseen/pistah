import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fetch all ads
export const getAds = async () => {
  return await prisma.ad.findMany();
};

// Fetch all ad boards
export const getAdBoards = async () => {
  return await prisma.adBoard.findMany();
};
