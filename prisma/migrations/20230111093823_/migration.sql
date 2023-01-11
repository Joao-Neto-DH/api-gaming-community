/*
  Warnings:

  - You are about to drop the column `yearSell` on the `game` table. All the data in the column will be lost.
  - Added the required column `yearSold` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `game` DROP COLUMN `yearSell`,
    ADD COLUMN `yearSold` INTEGER NOT NULL,
    MODIFY `description` TEXT NOT NULL;
