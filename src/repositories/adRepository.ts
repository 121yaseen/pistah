import prisma from "@/app/libs/prismadb";

// Fetch all ads
export const getAds = async (startDate: string, endDate: string) => {
  return await prisma.ad.findMany({
    where: {
      adDisplayStartDate: {
        lte: new Date(endDate),
      },
      adDisplayEndDate: {
        gte: new Date(startDate),
      },
    },
  });
};
