/*
  Warnings:

  - Added the required column `coverPath` to the `Courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Courses" ADD COLUMN     "coverPath" TEXT NOT NULL;
