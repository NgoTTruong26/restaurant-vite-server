-- CreateTable
CREATE TABLE `BookingForChildren` (
    `id` VARCHAR(191) NOT NULL,
    `childrenCategoryId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Booking` (
    `id` VARCHAR(191) NOT NULL,
    `buffetMenuId` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `bookingTime` VARCHAR(191) NOT NULL,
    `bookingDate` VARCHAR(191) NOT NULL,
    `numberPeople` INTEGER NOT NULL,
    `note` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_BookingToBookingForChildren` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_BookingToBookingForChildren_AB_unique`(`A`, `B`),
    INDEX `_BookingToBookingForChildren_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BookingForChildren` ADD CONSTRAINT `BookingForChildren_childrenCategoryId_fkey` FOREIGN KEY (`childrenCategoryId`) REFERENCES `ChildrenCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_buffetMenuId_fkey` FOREIGN KEY (`buffetMenuId`) REFERENCES `BuffetMenu`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BookingToBookingForChildren` ADD CONSTRAINT `_BookingToBookingForChildren_A_fkey` FOREIGN KEY (`A`) REFERENCES `Booking`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BookingToBookingForChildren` ADD CONSTRAINT `_BookingToBookingForChildren_B_fkey` FOREIGN KEY (`B`) REFERENCES `BookingForChildren`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
