-- CreateTable
CREATE TABLE "Ad" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "downloadLink" TEXT NOT NULL,
    "adBoardId" TEXT NOT NULL,
    "adDisplayStartDate" TIMESTAMP(3) NOT NULL,
    "adDisplayEndDate" TIMESTAMP(3) NOT NULL,
    "adDuration" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "remarks" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL DEFAULT '',
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdBoard" (
    "id" TEXT NOT NULL,
    "boardName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "dimensions" TEXT NOT NULL,
    "boardType" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL,
    "dailyRate" DOUBLE PRECISION NOT NULL,
    "operationalHours" TEXT NOT NULL,
    "ownerContact" TEXT NOT NULL,
    "lastMaintenanceDate" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdBoard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "profilePicUrl" TEXT DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refreshToken" TEXT,
    "accessToken" TEXT,
    "accessTokenExpires" TIMESTAMP(3),

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userid" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Ad_title_idx" ON "Ad"("title");

-- CreateIndex
CREATE INDEX "Ad_adBoardId_idx" ON "Ad"("adBoardId");

-- CreateIndex
CREATE INDEX "Ad_createdById_idx" ON "Ad"("createdById");

-- CreateIndex
CREATE INDEX "Ad_adDisplayStartDate_idx" ON "Ad"("adDisplayStartDate");

-- CreateIndex
CREATE INDEX "Ad_adDisplayEndDate_idx" ON "Ad"("adDisplayEndDate");

-- CreateIndex
CREATE INDEX "AdBoard_boardName_idx" ON "AdBoard"("boardName");

-- CreateIndex
CREATE INDEX "AdBoard_location_idx" ON "AdBoard"("location");

-- CreateIndex
CREATE INDEX "AdBoard_createdById_idx" ON "AdBoard"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_name_idx" ON "User"("name");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE INDEX "Account_provider_idx" ON "Account"("provider");

-- CreateIndex
CREATE INDEX "Account_providerAccountId_idx" ON "Account"("providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Company_userid_key" ON "Company"("userid");

-- CreateIndex
CREATE INDEX "Company_name_idx" ON "Company"("name");

-- AddForeignKey
ALTER TABLE "Ad" ADD CONSTRAINT "Ad_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ad" ADD CONSTRAINT "Ad_adBoardId_fkey" FOREIGN KEY ("adBoardId") REFERENCES "AdBoard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdBoard" ADD CONSTRAINT "AdBoard_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
