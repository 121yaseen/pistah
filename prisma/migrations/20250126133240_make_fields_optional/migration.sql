/*
  Warnings:

  - The `boardType` column on the `AdBoard` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `userid` on the `Company` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'OWNER', 'ADMIN');

-- CreateEnum
CREATE TYPE "BoardType" AS ENUM ('DIGITAL', 'STATIC', 'LED', 'BILLBOARD');

-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_userid_fkey";

-- DropIndex
DROP INDEX "Company_userid_key";

-- DropIndex
DROP INDEX "User_name_idx";

-- AlterTable
ALTER TABLE "AdBoard" ADD COLUMN     "description" TEXT DEFAULT 'No description provided',
DROP COLUMN "boardType",
ADD COLUMN     "boardType" "BoardType" NOT NULL DEFAULT 'STATIC';

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "userid",
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER',
ALTER COLUMN "password" SET NOT NULL;

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "adId" TEXT NOT NULL,
    "adBoardId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdBoard_isAvailable_idx" ON "AdBoard"("isAvailable");

-- CreateIndex
CREATE INDEX "AdBoard_dailyRate_idx" ON "AdBoard"("dailyRate");

-- CreateIndex
CREATE UNIQUE INDEX "Company_userId_key" ON "Company"("userId");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_adId_fkey" FOREIGN KEY ("adId") REFERENCES "Ad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_adBoardId_fkey" FOREIGN KEY ("adBoardId") REFERENCES "AdBoard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
