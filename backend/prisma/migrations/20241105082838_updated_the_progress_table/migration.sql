/*
  Warnings:

  - You are about to drop the column `chapterId` on the `Progress` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Progress` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Progress" DROP CONSTRAINT "Progress_chapterId_fkey";

-- DropForeignKey
ALTER TABLE "Progress" DROP CONSTRAINT "Progress_userId_fkey";

-- AlterTable
ALTER TABLE "Progress" DROP COLUMN "chapterId",
DROP COLUMN "userId",
ADD COLUMN     "chaptersId" INTEGER,
ADD COLUMN     "usersUserId" INTEGER;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_usersUserId_fkey" FOREIGN KEY ("usersUserId") REFERENCES "Users"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_chaptersId_fkey" FOREIGN KEY ("chaptersId") REFERENCES "Chapters"("id") ON DELETE SET NULL ON UPDATE CASCADE;
