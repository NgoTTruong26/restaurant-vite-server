/*
  Warnings:

  - Added the required column `bookingStatusId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Booking` ADD COLUMN `bookingStatusId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `BookingStatus` (
    `id` VARCHAR(191) NOT NULL,
    `step` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BookingStatus_step_key`(`step`),
    UNIQUE INDEX `BookingStatus_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_bookingStatusId_fkey` FOREIGN KEY (`bookingStatusId`) REFERENCES `BookingStatus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
