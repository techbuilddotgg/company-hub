/*
  Warnings:

  - You are about to drop the column `companyId` on the `project_boards` table. All the data in the column will be lost.
  - Added the required column `projectId` to the `project_boards` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `project_boards` DROP COLUMN `companyId`,
    ADD COLUMN `projectId` VARCHAR(191) NOT NULL;
