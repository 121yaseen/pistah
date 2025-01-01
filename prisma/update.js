import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function assignRandomUserToAds() {
  try {
    // Step 1: Fetch all user IDs
    const users = await prisma.user.findMany({
      select: { id: true }, // Only fetch the user IDs to reduce data load
    });

    console.log("Fetched user IDs:", users);

    if (users.length === 0) {
      console.log("No users found in the database.");
      return;
    }

    // Step 2: Fetch all ads where createdById is null
    const adsWithoutCreator = await prisma.ad.findMany({
      where: {
        createdById: "",
      },
    });

    if (adsWithoutCreator.length === 0) {
      console.log("No ads without a createdById.");
      return;
    }

    // Step 3: Assign a random user ID to each ad without a createdById
    for (const ad of adsWithoutCreator) {
      const randomUser = users[Math.floor(Math.random() * users.length)];

      await prisma.ad.update({
        where: {
          id: ad.id,
        },
        data: {
          createdById: randomUser.id,
        },
      });

      console.log(
        `Updated ad with ID: ${ad.id}, assigned to user ID: ${randomUser.id}`
      );
    }

    console.log("All ads without createdById have been updated.");
  } catch (error) {
    console.error("Error updating ads:", error);
  } finally {
    await prisma.$disconnect();
  }
}

assignRandomUserToAds();
