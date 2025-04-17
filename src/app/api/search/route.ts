import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is missing' },
      { status: 400 }
    );
  }

  try {
    const results = await prisma.produit.findMany({
      where: {
        nom: {
          contains: query,
          mode: 'insensitive',
        },
      },
    });

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('Error fetching search results:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
