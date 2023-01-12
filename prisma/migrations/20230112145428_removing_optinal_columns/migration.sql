/*
  Warnings:

  - Made the column `userId` on table `comment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gameId` on table `comment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gameId` on table `gamelikes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `gamelikes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gameId` on table `genregame` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gameId` on table `plataformgame` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gameId` on table `requirement` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gameId` on table `screenshoot` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_gameId_fkey`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_userId_fkey`;

-- DropForeignKey
ALTER TABLE `gamelikes` DROP FOREIGN KEY `GameLikes_gameId_fkey`;

-- DropForeignKey
ALTER TABLE `gamelikes` DROP FOREIGN KEY `GameLikes_userId_fkey`;

-- DropForeignKey
ALTER TABLE `genregame` DROP FOREIGN KEY `GenreGame_gameId_fkey`;

-- DropForeignKey
ALTER TABLE `plataformgame` DROP FOREIGN KEY `PlataformGame_gameId_fkey`;

-- DropForeignKey
ALTER TABLE `requirement` DROP FOREIGN KEY `Requirement_gameId_fkey`;

-- DropForeignKey
ALTER TABLE `screenshoot` DROP FOREIGN KEY `ScreenShoot_gameId_fkey`;

-- AlterTable
ALTER TABLE `comment` MODIFY `userId` VARCHAR(191) NOT NULL,
    MODIFY `gameId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `gamelikes` MODIFY `gameId` VARCHAR(191) NOT NULL,
    MODIFY `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `genregame` MODIFY `gameId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `plataformgame` MODIFY `gameId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `requirement` MODIFY `gameId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `screenshoot` MODIFY `gameId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `GenreGame` ADD CONSTRAINT `GenreGame_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `Game`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlataformGame` ADD CONSTRAINT `PlataformGame_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `Game`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ScreenShoot` ADD CONSTRAINT `ScreenShoot_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `Game`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Requirement` ADD CONSTRAINT `Requirement_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `Game`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `Game`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GameLikes` ADD CONSTRAINT `GameLikes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GameLikes` ADD CONSTRAINT `GameLikes_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `Game`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
