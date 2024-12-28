import prisma from "@/app/libs/prismadb";
import { Ad, AdBoard } from "@/types/ad";
import { parse } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";

// Create a new Ad Board
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
      imageUrl: adBoard.imageUrl ?? "",
    },
  });
};

// Fetch all Ad Boards
export const getAdBoards = async () => {
  return await prisma.adBoard.findMany();
};

// Create a new Ad
export const createAdAsync = async (ad: Ad) => {
  const {
    title,
    downloadLink,
    adBoardId,
    adDisplayStartDate,
    adDisplayEndDate,
    adDuration,
    thumbnailUrl,
  } = ad;

  const parsedStartDate = parse(
    adDisplayStartDate,
    "EEE MMM dd yyyy",
    new Date()
  );
  const parsedEndDate = parse(adDisplayEndDate, "EEE MMM dd yyyy", new Date());

  // Convert to UTC using date-fns-tz
  const utcStartDate = zonedTimeToUtc(parsedStartDate, "UTC");
  const utcEndDate = zonedTimeToUtc(parsedEndDate, "UTC");

  return await prisma.ad.create({
    data: {
      title,
      downloadLink,
      adBoardId,
      adDisplayStartDate: utcStartDate,
      adDisplayEndDate: utcEndDate,
      adDuration,
      thumbnailUrl,
    },
  });
};

// Fetch all Ads
export const getAds = async () => {
  return await prisma.ad.findMany({
    include: {
      adBoard: true, // Include related AdBoard details
    },
  });
};

// Delete an Ad board and all its Ads
export const deleteAdBoardAsync = async (id: string) => {
  return await prisma.adBoard.delete({
    where: {
      id,
    },
  });
};

// Update an Ad Board
export const updateAdBoardAsync = async (adBoard: AdBoard) => {
  const { id, boardName, location, boardType, dailyRate, ownerContact } =
    adBoard;

  return await prisma.adBoard.update({
    where: {
      id,
    },
    data: {
      boardName,
      location,
      boardType,
      dailyRate,
      ownerContact,
    },
  });
};
