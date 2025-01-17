import prisma from "@/app/libs/prismadb";
import { Ad, User } from "@/types/ad";
import { parse } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";

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

  const parsedStartDate = parse(
    adDisplayStartDate,
    "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
    new Date()
  );
  const parsedEndDate = parse(
    adDisplayEndDate,
    "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
    new Date()
  );

  const utcStartDate = zonedTimeToUtc(parsedStartDate, "UTC").toISOString();
  const utcEndDate = zonedTimeToUtc(parsedEndDate, "UTC").toISOString();

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
    throw new Error("Ad not found");
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
