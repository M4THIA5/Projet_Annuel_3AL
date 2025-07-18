/*
  Warnings:

  - Added the required column `address` to the `Sortie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sortie" ADD COLUMN     "address" TEXT NOT NULL;
