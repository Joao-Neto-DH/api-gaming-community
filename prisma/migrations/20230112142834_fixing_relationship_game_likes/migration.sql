/*
  Warnings:

  - You are about to drop the `_gamelikestouser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_gametogamelikes` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `like` to the `GameLikes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `PlataformGame` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_gamelikestouser` DROP FOREIGN KEY `_GameLikesToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_gamelikestouser` DROP FOREIGN KEY `_GameLikesToUser_B_fkey`;

-- DropForeignKey
ALTER TABLE `_gametogamelikes` DROP FOREIGN KEY `_GameToGameLikes_A_fkey`;

-- DropForeignKey
ALTER TABLE `_gametogamelikes` DROP FOREIGN KEY `_GameToGameLikes_B_fkey`;

-- AlterTable
ALTER TABLE `gamelikes` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `gameId` VARCHAR(191) NULL,
    ADD COLUMN `like` TINYINT NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `userId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `plataformgame` ADD COLUMN `value` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `_gamelikestouser`;

-- DropTable
DROP TABLE `_gametogamelikes`;

-- AddForeignKey
ALTER TABLE `GameLikes` ADD CONSTRAINT `GameLikes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GameLikes` ADD CONSTRAINT `GameLikes_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `Game`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
