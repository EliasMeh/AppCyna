import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { produitId: string } }
) {
  try {
    // Await the params to resolve
    const id = await Promise.resolve(params.produitId);
    const produitId = parseInt(id);

    if (isNaN(produitId)) {
      console.error('Invalid ID format:', id);
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const images = await prisma.image.findMany({
      where: { produitId },
      select: {
        id: true,
        data: true,
      },
    });

    if (!images || images.length === 0) {
      console.log(`No images found for product ${produitId}`);
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
