/*
  Warnings:

  - Added the required column `prixTotalPasse` to the `PreviousOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prixUnitaire` to the `PreviousOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PreviousOrder" ADD COLUMN     "prixTotalPasse" INTEGER NOT NULL,
ADD COLUMN     "prixUnitaire" INTEGER NOT NULL;
