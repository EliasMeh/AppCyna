/*
  Warnings:

  - Made the column `quantite` on table `Produit` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Produit" ALTER COLUMN "quantite" SET NOT NULL,
ALTER COLUMN "quantite" DROP DEFAULT;
