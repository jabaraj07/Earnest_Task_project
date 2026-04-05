-- AlterTable
ALTER TABLE `task` ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `priority` VARCHAR(191) NOT NULL DEFAULT 'low';
