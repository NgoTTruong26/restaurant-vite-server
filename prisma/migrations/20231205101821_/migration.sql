/*
  Warnings:

  - You are about to alter the column `name` on the `BookingStatus` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `BookingStatus` MODIFY `name` ENUM('PENDING', 'CONFIRMED', 'SUCCESS', 'CANCELLED') NOT NULL;
