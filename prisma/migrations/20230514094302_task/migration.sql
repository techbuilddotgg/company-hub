/*
  Warnings:

  - You are about to drop the `projects` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `project_board_taks` MODIFY `description` VARCHAR(191) NULL,
    MODIFY `taskPriorityId` VARCHAR(191) NULL,
    MODIFY `taskTypeId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `projects`;

-- CreateTable
CREATE TABLE `project` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `companyId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
