-- CreateEnum
CREATE TYPE "QueueItemType" AS ENUM ('MASTER', 'RELEASE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "insertedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QueueItem" (
    "id" TEXT NOT NULL,
    "insertedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "QueueItemType" NOT NULL,
    "discogsId" INTEGER NOT NULL,
    "artists" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "thumb" TEXT,

    CONSTRAINT "QueueItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QueueHistory" (
    "id" TEXT NOT NULL,
    "insertedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "type" "QueueItemType" NOT NULL,
    "discogsId" INTEGER NOT NULL,

    CONSTRAINT "QueueHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "QueueItem_id_key" ON "QueueItem"("id");

-- CreateIndex
CREATE UNIQUE INDEX "QueueHistory_id_key" ON "QueueHistory"("id");

-- AddForeignKey
ALTER TABLE "QueueItem" ADD CONSTRAINT "QueueItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueHistory" ADD CONSTRAINT "QueueHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
