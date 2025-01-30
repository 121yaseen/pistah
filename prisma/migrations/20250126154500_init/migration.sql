/*
  Warnings:

  - Changed the type of `boardType` on the `AdBoard` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `userId` on table `Company` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_userId_fkey";

-- DropIndex
DROP INDEX "AdBoard_dailyRate_idx";

-- DropIndex
DROP INDEX "AdBoard_isAvailable_idx";

-- AlterTable
ALTER TABLE "Ad" ALTER COLUMN "downloadLink" DROP NOT NULL,
ALTER COLUMN "thumbnailUrl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "AdBoard" ALTER COLUMN "description" DROP DEFAULT,
DROP COLUMN "boardType",
ADD COLUMN     "boardType" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "status" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL;

-- DropEnum
DROP TYPE "BoardType";

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "BoardAvailability" (
    "id" TEXT NOT NULL,
    "adBoardId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "capacity" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BoardAvailability_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BoardAvailability" ADD CONSTRAINT "BoardAvailability_adBoardId_fkey" FOREIGN KEY ("adBoardId") REFERENCES "AdBoard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
