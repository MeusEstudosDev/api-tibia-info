/*
  Warnings:

  - Added the required column `user_agent` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "loc" TEXT,
ADD COLUMN     "org" TEXT,
ADD COLUMN     "region" TEXT,
ADD COLUMN     "timezone" TEXT,
ADD COLUMN     "user_agent" TEXT NOT NULL;
