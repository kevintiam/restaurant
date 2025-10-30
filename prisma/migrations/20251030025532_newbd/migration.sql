/*
  Warnings:

  - A unique constraint covering the columns `[reference_commande]` on the table `Commande` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Commande" ADD COLUMN "reference_commande" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Commande_reference_commande_key" ON "Commande"("reference_commande");
