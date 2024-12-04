import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Seed AdBoards
  console.log("Seeding AdBoards...");
  const adBoardData = [
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
    {
      boardName: "Airport Entrance Billboard",
      location: "City Airport Entrance",
      dimensions: "8x4 ft",
      boardType: "Static",
      isAvailable: true,
      dailyRate: 6000,
      operationalHours: "7 AM - 9 PM",
      ownerContact: "Mark Spencer, +1-456-789-123",
      lastMaintenanceDate: new Date("2024-09-12"),
    },
  ];

  await prisma.adBoard.createMany({ data: adBoardData });

  // Retrieve the created AdBoards to use their IDs
  console.log("Fetching created AdBoards...");
  const adBoards = await prisma.adBoard.findMany();

  const findAdBoardIdByName = (name) => {
    const adBoard = adBoards.find((board) => board.boardName === name);
    if (!adBoard) {
      throw new Error(`AdBoard with name "${name}" not found.`);
    }
    return adBoard.id;
  };

  // Seed Ads
  console.log("Seeding Ads...");
  const adData = [
    {
      title: "Holiday Sale Ad",
      downloadLink:
        "https://drive.google.com/file/d/1HaRREfyGlks28fUJ2IevKRuwq6j0B4E5/view?usp=sharing",
      adBoardId: findAdBoardIdByName("Downtown Billboard #1"),
      adDisplayStartDate: new Date("2024-11-10"),
      adDisplayEndDate: new Date("2024-11-30"),
      adDuration: "30 seconds",
    },
    {
      title: "Black Friday Ad",
      downloadLink:
        "https://drive.google.com/file/d/1HaRREfyGlks28fUJ2IevKRuwq6j0B4E5/view?usp=sharing",
      adBoardId: findAdBoardIdByName("City Bus Digital Board"),
      adDisplayStartDate: new Date("2024-11-25"),
      adDisplayEndDate: new Date("2024-11-27"),
      adDuration: "15 seconds",
    },
    {
      title: "Airport Promo Ad",
      downloadLink:
        "https://drive.google.com/file/d/1HaRREfyGlks28fUJ2IevKRuwq6j0B4E5/view?usp=sharing",
      adBoardId: findAdBoardIdByName("Airport Entrance Billboard"),
      adDisplayStartDate: new Date("2024-12-01"),
      adDisplayEndDate: new Date("2024-12-15"),
      adDuration: "20 seconds",
    },
    {
      title: "Winter Clearance Sale",
      downloadLink:
        "https://drive.google.com/file/d/1HaRREfyGlks28fUJ2IevKRuwq6j0B4E5/view?usp=sharing",
      adBoardId: findAdBoardIdByName("Downtown Billboard #1"),
      adDisplayStartDate: new Date("2024-12-01"),
      adDisplayEndDate: new Date("2024-12-31"),
      adDuration: "25 seconds",
    },
    {
      title: "Summer Deals Ad",
      downloadLink:
        "https://drive.google.com/file/d/1HaRREfyGlks28fUJ2IevKRuwq6j0B4E5/view?usp=sharing",
      adBoardId: findAdBoardIdByName("City Bus Digital Board"),
      adDisplayStartDate: new Date("2024-06-01"),
      adDisplayEndDate: new Date("2024-06-30"),
      adDuration: "10 seconds",
    },
    {
      title: "Luxury Brands Promotion",
      downloadLink:
        "https://drive.google.com/file/d/1HaRREfyGlks28fUJ2IevKRuwq6j0B4E5/view?usp=sharing",
      adBoardId: findAdBoardIdByName("Airport Entrance Billboard"),
      adDisplayStartDate: new Date("2024-12-10"),
      adDisplayEndDate: new Date("2025-01-05"),
      adDuration: "40 seconds",
    },
    {
      title: "Event Launch Ad",
      downloadLink:
        "https://drive.google.com/file/d/1HaRREfyGlks28fUJ2IevKRuwq6j0B4E5/view?usp=sharing",
      adBoardId: findAdBoardIdByName("Downtown Billboard #1"),
      adDisplayStartDate: new Date("2024-10-01"),
      adDisplayEndDate: new Date("2024-10-15"),
      adDuration: "35 seconds",
    },
  ];

  await prisma.ad.createMany({ data: adData });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
