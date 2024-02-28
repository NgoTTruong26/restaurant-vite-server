/*
  Warnings:

  - The values [CANCELLED] on the enum `BookingStatus_name` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `BookingStatus` MODIFY `name` ENUM('PENDING', 'CONFIRMED', 'SUCCESS') NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `avatarUrl` VARCHAR(255) NULL;
