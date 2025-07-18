/*
  Warnings:

  - You are about to drop the column `name` on the `Objet` table. All the data in the column will be lost.
  - Added the required column `nom` to the `Objet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Objet" DROP COLUMN "name",
ADD COLUMN     "nom" TEXT NOT NULL;
