/*
  Warnings:

  - Added the required column `placement` to the `Produit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Produit" ADD COLUMN     "placement" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "GrilleCategorie" (
    "id" SERIAL NOT NULL,
    "categorie1Id" INTEGER,
    "categorie2Id" INTEGER,
    "categorie3Id" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GrilleCategorie_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GrilleCategorie" ADD CONSTRAINT "GrilleCategorie_categorie1Id_fkey" FOREIGN KEY ("categorie1Id") REFERENCES "Categorie"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrilleCategorie" ADD CONSTRAINT "GrilleCategorie_categorie2Id_fkey" FOREIGN KEY ("categorie2Id") REFERENCES "Categorie"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrilleCategorie" ADD CONSTRAINT "GrilleCategorie_categorie3Id_fkey" FOREIGN KEY ("categorie3Id") REFERENCES "Categorie"("id") ON DELETE SET NULL ON UPDATE CASCADE;
