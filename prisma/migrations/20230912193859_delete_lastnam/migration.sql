/*
  Warnings:

  - You are about to drop the column `lastName` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Admin` DROP COLUMN `lastName`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `lastName`;
