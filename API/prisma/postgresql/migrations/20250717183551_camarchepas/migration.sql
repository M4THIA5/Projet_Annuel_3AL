/*
  Warnings:

  - You are about to drop the column `nom` on the `Objet` table. All the data in the column will be lost.
  - Added the required column `name` to the `Objet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Objet" DROP COLUMN "nom",
ADD COLUMN     "name" TEXT NOT NULL;
