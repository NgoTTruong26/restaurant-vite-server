/*
  Warnings:

  - You are about to drop the column `firstName` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Admin` DROP COLUMN `firstName`,
    ADD COLUMN `fullName` VARCHAR(255) NOT NULL DEFAULT 'Leanne Madona';

-- AlterTable
ALTER TABLE `User` DROP COLUMN `firstName`,
    ADD COLUMN `fullName` VARCHAR(255) NOT NULL DEFAULT 'Leanne Madona';
