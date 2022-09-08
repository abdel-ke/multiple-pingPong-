/*
  Warnings:

  - The primary key for the `Match` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `matchId` on the `Player` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_matchId_fkey";

-- AlterTable
ALTER TABLE "Match" DROP CONSTRAINT "Match_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Match_pkey" PRIMARY KEY ("codeGame");

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "matchId",
ADD COLUMN     "matchCodeGame" TEXT;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_matchCodeGame_fkey" FOREIGN KEY ("matchCodeGame") REFERENCES "Match"("codeGame") ON DELETE SET NULL ON UPDATE CASCADE;
