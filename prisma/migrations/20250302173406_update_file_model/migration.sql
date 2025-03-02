/*
  Warnings:

  - You are about to drop the column `userId` on the `File` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `File` DROP FOREIGN KEY `File_userId_fkey`;

-- DropIndex
DROP INDEX `File_userId_fkey` ON `File`;

-- AlterTable
ALTER TABLE `File` DROP COLUMN `userId`;
