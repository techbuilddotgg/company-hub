/*
  Warnings:

  - Added the required column `companyId` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `projects` ADD COLUMN `companyId` VARCHAR(191) NOT NULL;
