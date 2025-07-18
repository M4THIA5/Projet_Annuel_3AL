/*
  Warnings:

  - You are about to drop the column `name` on the `Objet` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Objet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nom` to the `Objet` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Objet_name_key";

-- AlterTable
ALTER TABLE "Objet" DROP COLUMN "name",
ADD COLUMN     "nom" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Objet_id_key" ON "Objet"("id");
