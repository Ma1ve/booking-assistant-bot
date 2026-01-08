/*
  Warnings:

  - You are about to drop the column `userId` on the `TelegramAccount` table. All the data in the column will be lost.
  - You are about to drop the column `telegram` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[personId]` on the table `TelegramAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "TelegramAccount" DROP CONSTRAINT "TelegramAccount_userId_fkey";

-- AlterTable
ALTER TABLE "TelegramAccount" DROP COLUMN "userId",
ADD COLUMN     "personId" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "telegram",
ADD COLUMN     "personId" INTEGER;

-- CreateTable
CREATE TABLE "Person" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TelegramAccount_personId_key" ON "TelegramAccount"("personId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelegramAccount" ADD CONSTRAINT "TelegramAccount_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;
