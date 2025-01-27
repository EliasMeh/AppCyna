/*
  Warnings:

  - Added the required column `quantite` to the `Produit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Produit" ADD COLUMN "quantite" INTEGER DEFAULT 0;