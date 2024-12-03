import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed AdBoards
  await prisma.adBoard.createMany({
    data: [
      {
        boardName: "Downtown Billboard #1",
        location: "123 Main Street, Downtown",
        dimensions: "10x20 ft",
        boardType: "Digital",
        isAvailable: true,
        dailyRate: 5000,
        operationalHours: "24/7",
        ownerContact: "John Doe, +1-234-567-890",
        lastMaintenanceDate: new Date("2024-01-15"),
      },
      {
        boardName: "City Bus Digital Board",
        location: "Route: City Center to Airport",
        dimensions: "6x3 ft",
        boardType: "Moving Digital",
        isAvailable: false,
        dailyRate: 8000,
        operationalHours: "6 AM - 10 PM",
        ownerContact: "Jane Smith, +1-987-654-321",
        lastMaintenanceDate: new Date("2024-10-01"),
      },
    ],
  });

  // Retrieve the created AdBoards to get their generated IDs
  const adBoards = await prisma.adBoard.findMany();
  const downtownBillboard = adBoards.find(
    (board) => board.boardName === "Downtown Billboard #1"
  );
  const cityBusBoard = adBoards.find(
    (board) => board.boardName === "City Bus Digital Board"
  );

  // Seed Ads
  await prisma.ad.createMany({
    data: [
      {
        title: "Holiday Sale Ad",
        downloadLink:
          "https://drive.google.com/file/d/1HaRREfyGlks28fUJ2IevKRuwq6j0B4E5/view?usp=sharing",
        adBoardId: downtownBillboard.id,
        adDisplayStartDate: new Date("2024-11-10"),
        adDisplayEndDate: new Date("2024-11-30"),
        adDuration: "30 seconds",
      },
      {
        title: "Black Friday Ad",
        downloadLink:
          "https://drive.google.com/file/d/1HaRREfyGlks28fUJ2IevKRuwq6j0B4E5/view?usp=sharing",
        adBoardId: cityBusBoard.id,
        adDisplayStartDate: new Date("2024-11-25"),
        adDisplayEndDate: new Date("2024-11-27"),
        adDuration: "15 seconds",
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
