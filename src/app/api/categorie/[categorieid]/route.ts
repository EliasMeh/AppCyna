import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const categorieId = Number(url.pathname.split('/').pop());

  const data = await prisma.categorie.findFirst({
    where: { id: categorieId },
    include: {
      produits: true,
    },
  });

  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const url = new URL(request.url);
  const categorieId = Number(url.pathname.split('/').pop());

  try {
    if (!categorieId || isNaN(categorieId)) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    const category = await prisma.categorie.findUnique({
      where: { id: categorieId },
      include: { produits: true },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    await prisma.categorie.delete({
      where: { id: categorieId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
