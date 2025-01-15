import prisma from "@/app/libs/prismadb";
import { Ad, User } from "@/types/ad";
import { parse } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";

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

  const startOfDayStartDate = new Date(
    parsedStartDate.getFullYear(),
    parsedStartDate.getMonth(),
    parsedStartDate.getDate()
  );
  const startOfDayEndDate = new Date(
    parsedEndDate.getFullYear(),
    parsedEndDate.getMonth(),
    parsedEndDate.getDate()
  );

  const utcStartDate = zonedTimeToUtc(startOfDayStartDate, "UTC").toISOString();
  const utcEndDate = zonedTimeToUtc(startOfDayEndDate, "UTC").toISOString();

  console.log(
    title,
    downloadLink,
    adBoardId,
    adDisplayStartDate,
    adDisplayEndDate,
    adDuration,
    thumbnailUrl,
    createdUser.id,
    videoUrl
  );
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
      videoUrl,
    },
  });
};
