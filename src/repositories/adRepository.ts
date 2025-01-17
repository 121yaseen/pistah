import prisma from "@/app/libs/prismadb";
import { Ad, User } from "@/types/ad";

// Fetch all ads
export const getAds = async (startDate: string, endDate: string) => {
  const parsedStartDate = new Date(startDate);
  const parsedEndDate = new Date(endDate);

  return await prisma.ad.findMany({
    where: {
      adDisplayStartDate: {
        lte: parsedEndDate,
      },
      adDisplayEndDate: {
        gte: parsedStartDate,
      },
    },
  });
};

// Create a new Ad
export const createAdAsync = async (ad: Ad, createdUser: User) => {
  const {
    title,
    downloadLink,
    adBoardId,
    adDisplayStartDate,
    adDisplayEndDate,
    adDuration,
    thumbnailUrl,
    remarks,
    videoUrl,
  } = ad;

  const utcStartDate = new Date(
    adDisplayStartDate.split("T")[0] + "T00:00:00.000Z"
  );
  const utcEndDate = new Date(
    adDisplayEndDate.split("T")[0] + "T00:00:00.000Z"
  );

  console.log({
    title,
    downloadLink,
    adBoardId,
    adDisplayStartDate: utcStartDate,
    adDisplayEndDate: utcEndDate,
    adDuration,
    thumbnailUrl,
    createdById: createdUser.id,
    remarks,
    videoUrl,
  });

  return await prisma.ad.create({
    data: {
      title,
      downloadLink,
      adBoardId,
      adDisplayStartDate: utcStartDate,
      adDisplayEndDate: utcEndDate,
      adDuration,
      thumbnailUrl,
      createdById: createdUser.id,
      remarks,
      videoUrl,
    },
  });
};

export const deleteAd = async (id: string, userId: string) => {
  const ad = await prisma.ad.findUnique({
    where: {
      id,
    },
  });

  if (!ad) {
    throw new Error("Ad not found ");
  }

  if (ad.createdById !== userId) {
    throw new Error("You are not authorized to delete this ad");
  }

  return await prisma.ad.delete({
    where: {
      id,
    },
  });
};
