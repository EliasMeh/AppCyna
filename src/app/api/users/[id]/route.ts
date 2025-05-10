import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  try {
    // Extract the ID from the URL path
    const { pathname } = request.nextUrl;
    const segments = pathname.split('/');
    const userId = parseInt(segments[segments.length - 1]);

    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const body = await request.json();
    const { nom, prenom, email, adresse } = body;

    if (!nom || !prenom || !email || !adresse) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { nom, prenom, email, adresse },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: unknown) {
    console.error('Error updating user:', error);
    const message =
      error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      {
        error: 'Failed to update user',
        details: message,
      },
      { status: 500 }
    );
  }
}
