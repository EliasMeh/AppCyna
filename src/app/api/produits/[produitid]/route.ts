import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const produitid = Number(url.pathname.split('/').pop());

    const data = await prisma.produit.findFirst({
      where: { id: produitid },
      include: {
        images: true,
        categorie: true, // Include the category relation
      },
    });

    if (!data) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const produitid = Number(url.pathname.split('/').pop());
    const body = await request.json();

    // Add stock and placement validation
    if (typeof body.quantite === 'number' && body.quantite < 0) {
      return NextResponse.json(
        { error: 'Stock cannot be negative' },
        { status: 400 }
      );
    }

    if (typeof body.placement === 'number' && body.placement < 0) {
      return NextResponse.json(
        { error: 'Placement cannot be negative' },
        { status: 400 }
      );
    }

    const currentProduct = await prisma.produit.findUnique({
      where: { id: produitid },
    });

    if (!currentProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // If this is a stock update from checkout
    if (body.updateStock) {
      const newQuantity = currentProduct.quantite - body.quantity;

      if (newQuantity < 0) {
        return NextResponse.json(
          {
            error: 'Insufficient stock',
            availableQuantity: currentProduct.quantite,
          },
          { status: 400 }
        );
      }

      const updatedProduct = await prisma.produit.update({
        where: { id: produitid },
        data: {
          quantite: newQuantity,
        },
      });

      return NextResponse.json(updatedProduct);
    }

    // Regular product update
    const updatedProduct = await prisma.produit.update({
      where: { id: produitid },
      data: {
        nom: body.nom,
        prix: body.prix,
        description: body.description,
        quantite: body.quantite,
        categorieId: body.categorieId,
        placement: body.placement || 0, // Add placement with default value
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Error updating product' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
