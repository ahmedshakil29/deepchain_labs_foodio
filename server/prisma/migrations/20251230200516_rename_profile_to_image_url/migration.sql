/*
  Warnings:

  - You are about to drop the column `profileUrl` on the `User` table. All the data in the column will be lost.
  - Made the column `address` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "profileUrl",
ADD COLUMN     "imageUrl" TEXT,
ALTER COLUMN "address" SET NOT NULL;
