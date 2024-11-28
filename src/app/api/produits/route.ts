import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handle(req, res) {
  const produits = await prisma.produit.findMany();
  res.json(produits);
}