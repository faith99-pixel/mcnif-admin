/*
  Warnings:

  - A unique constraint covering the columns `[buffetId]` on the table `BuffetDiscount` will be added. If there are existing duplicate values, this will fail.
  - Made the column `description` on table `buffet` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `buffetsession` DROP FOREIGN KEY `BuffetSession_buffetId_fkey`;

-- AlterTable
ALTER TABLE `buffet` ADD COLUMN `imageUrl` VARCHAR(191) NULL,
    MODIFY `description` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `BuffetDiscount_buffetId_key` ON `BuffetDiscount`(`buffetId`);

-- AddForeignKey
ALTER TABLE `BuffetSession` ADD CONSTRAINT `BuffetSession_buffetId_fkey` FOREIGN KEY (`buffetId`) REFERENCES `Buffet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
