/*
  Warnings:

  - You are about to alter the column `dateBirth` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `dateBirth` DATETIME(3) NULL;
