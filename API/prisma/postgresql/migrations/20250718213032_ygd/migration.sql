/*
  Warnings:

  - A unique constraint covering the columns `[nom]` on the table `Rooms` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Rooms_nom_key" ON "Rooms"("nom");
