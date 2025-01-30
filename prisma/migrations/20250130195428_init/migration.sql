/*
  Warnings:

  - You are about to drop the column `createdById` on the `AdBoard` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `AdBoard` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADVERTISER', 'OWNER');

-- DropForeignKey
ALTER TABLE "AdBoard" DROP CONSTRAINT "AdBoard_createdById_fkey";

-- DropIndex
DROP INDEX "AdBoard_createdById_idx";

-- AlterTable
ALTER TABLE "AdBoard" DROP COLUMN "createdById",
ADD COLUMN     "ownerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL;

-- CreateIndex
CREATE INDEX "AdBoard_ownerId_idx" ON "AdBoard"("ownerId");

-- AddForeignKey
ALTER TABLE "AdBoard" ADD CONSTRAINT "AdBoard_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
