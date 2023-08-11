/*
  Warnings:

  - You are about to drop the `Gender` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX `User_genderId_fkey` ON `User`;

-- DropTable
DROP TABLE `Gender`;
