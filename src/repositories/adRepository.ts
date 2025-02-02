import prisma from "@/app/libs/prismadb";
import { Ad, User } from "@/types/ad";

// Fetch all ads within the given date range
export const getAds = async (startDate: string, endDate: string) => {
  const bookings = await prisma.booking.findMany({
    where: {
      startDate: { lte: new Date(endDate) },
      endDate: { gte: new Date(startDate) },
    },
    include: {
      ad: {
        include: {
          createdUser: true,
        },
      },
      adBoard: true,
    },
  });
  // Transform bookings to match the old Ad structure
  const ads = bookings.map((booking) => ({
    ...booking.ad,
    adDisplayStartDate: booking.startDate,
    adDisplayEndDate: booking.endDate,
    adBoard: booking.adBoard,
    bookings: [booking], // Simplified, assuming one booking per ad for this transformation
  }));

  return ads;
};

// Create a new ad
export const createAdAsync = async (ad: Ad, createdUser: User) => {
  const createdAd = await prisma.ad.create({
    data: {
      title: ad.title,
      downloadLink: ad.downloadLink,
      thumbnailUrl: ad.thumbnailUrl,
      remarks: ad.remarks ?? "",
      adDuration: ad.adDuration,
      videoUrl: ad.videoUrl || "",
      createdById: createdUser.id,
    },
  });

  // Create a booking to associate the ad with an ad board and dates
  await prisma.booking.create({
    data: {
      adId: createdAd.id,
      adBoardId: ad.adBoardId,
      startDate: new Date(ad.adDisplayStartDate),
      endDate: new Date(ad.adDisplayEndDate),
      userId: createdUser.id,
    },
  });

  return createdAd;
};

// Delete an Ad by ID
export const deleteAd = async (id: string, userId: string) => {
  const ad = await prisma.ad.findUnique({
    where: { id },
  });

  if (!ad) {
    throw new Error("Ad not found");
  }

  if (ad.createdById !== userId) {
    throw new Error("Unauthorized to delete this ad");
  }

  // Delete associated bookings first
  await prisma.booking.deleteMany({
    where: { adId: id },
  });

  // Then delete the ad
  return await prisma.ad.delete({ where: { id } });
};

// Update an Ad by ID
export const updateAd = async (
  id: string,
  adData: Partial<Ad>,
  userId: string
) => {
  const ad = await prisma.ad.findUnique({
    where: { id },
  });

  if (!ad) {
    throw new Error("Ad not found");
  }

  if (ad.createdById !== userId) {
    throw new Error("Unauthorized to update this ad");
  }

  const updatedAd = await prisma.ad.update({
    where: { id },
    data: {
      title: adData.title,
      downloadLink: adData.downloadLink,
      thumbnailUrl: adData.thumbnailUrl,
      remarks: adData.remarks,
      adDuration: adData.adDuration,
      videoUrl: adData.videoUrl,
    },
  });

  // Update the associated booking
  await prisma.booking.updateMany({
    where: { adId: id },
    data: {
      startDate: adData.adDisplayStartDate
        ? new Date(adData.adDisplayStartDate)
        : undefined,
      endDate: adData.adDisplayEndDate
        ? new Date(adData.adDisplayEndDate)
        : undefined,
      adBoardId: adData.adBoardId,
    },
  });

  return updatedAd;
};
