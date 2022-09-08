/*
  Warnings:

  - The primary key for the `Match` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `codeGame` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the `Player` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `player_one` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player_one_score` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player_two` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player_two_score` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_matchCodeGame_fkey";

-- AlterTable
ALTER TABLE "Match" DROP CONSTRAINT "Match_pkey",
DROP COLUMN "codeGame",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "player_one" INTEGER NOT NULL,
ADD COLUMN     "player_one_score" INTEGER NOT NULL,
ADD COLUMN     "player_two" INTEGER NOT NULL,
ADD COLUMN     "player_two_score" INTEGER NOT NULL,
ADD CONSTRAINT "Match_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Player";
