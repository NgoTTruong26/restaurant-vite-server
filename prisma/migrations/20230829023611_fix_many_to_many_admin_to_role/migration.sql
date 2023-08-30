/*
  Warnings:

  - You are about to drop the `AdminsRoles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `AdminsRoles` DROP FOREIGN KEY `AdminsRoles_adminId_fkey`;

-- DropForeignKey
ALTER TABLE `AdminsRoles` DROP FOREIGN KEY `AdminsRoles_modifiedByAdminId_fkey`;

-- DropForeignKey
ALTER TABLE `AdminsRoles` DROP FOREIGN KEY `AdminsRoles_roleId_fkey`;

-- DropTable
DROP TABLE `AdminsRoles`;
