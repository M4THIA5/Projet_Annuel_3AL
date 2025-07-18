/*
  Warnings:

  - Added the required column `userId` to the `Objet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Objet" ADD COLUMN     "TrocId" TEXT,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Objet" ADD CONSTRAINT "Objet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
