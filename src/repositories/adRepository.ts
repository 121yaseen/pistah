import prisma from "@/app/libs/prismadb";

// Fetch all ads
export const getAds = async () => {
  return await prisma.ad.findMany();
};
