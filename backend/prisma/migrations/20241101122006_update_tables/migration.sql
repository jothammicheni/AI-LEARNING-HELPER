/*
  Warnings:

  - You are about to drop the column `contentType` on the `Chapters` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chapters" DROP COLUMN "contentType",
ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Courses" ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isStated" BOOLEAN NOT NULL DEFAULT false;
