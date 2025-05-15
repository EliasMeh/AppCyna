import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);

    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    // Get the category of the current product
    const currentProduct = await prisma.produit.findUnique({
      where: { id: productId },
      select: { categorieId: true }
    });

    if (!currentProduct?.categorieId) {
      return NextResponse.json([]);
    }

    // Get the first similar product from the same category
    const similarProduct = await prisma.produit.findFirst({
      where: {
        categorieId: currentProduct.categorieId,
        id: { not: productId }, // Exclude current product
      },
      select: {
        id: true,
        nom: true,
        prix: true,
        quantite: true,
        images: true,
      },
    });

    return NextResponse.json(similarProduct ? [similarProduct] : []);
  } catch (error) {
    console.error('Error fetching similar product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch similar product' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}