-- AlterTable
ALTER TABLE `Admin` ADD COLUMN `dateBirth` DATETIME(3) NULL,
    ADD COLUMN `genderId` VARCHAR(191) NULL,
    ADD COLUMN `nationality` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `nationality` VARCHAR(255) NULL;

-- AddForeignKey
ALTER TABLE `Admin` ADD CONSTRAINT `Admin_genderId_fkey` FOREIGN KEY (`genderId`) REFERENCES `Gender`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
