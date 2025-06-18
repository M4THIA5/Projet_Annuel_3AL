/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Neighborhood` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Neighborhood_name_key" ON "Neighborhood"("name");
