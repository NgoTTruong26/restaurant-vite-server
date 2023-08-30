-- CreateTable
CREATE TABLE `_AdminToRole` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_AdminToRole_AB_unique`(`A`, `B`),
    INDEX `_AdminToRole_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ModifyAdmin` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ModifyAdmin_AB_unique`(`A`, `B`),
    INDEX `_ModifyAdmin_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_AdminToRole` ADD CONSTRAINT `_AdminToRole_A_fkey` FOREIGN KEY (`A`) REFERENCES `Admin`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AdminToRole` ADD CONSTRAINT `_AdminToRole_B_fkey` FOREIGN KEY (`B`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ModifyAdmin` ADD CONSTRAINT `_ModifyAdmin_A_fkey` FOREIGN KEY (`A`) REFERENCES `Admin`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ModifyAdmin` ADD CONSTRAINT `_ModifyAdmin_B_fkey` FOREIGN KEY (`B`) REFERENCES `Admin`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
