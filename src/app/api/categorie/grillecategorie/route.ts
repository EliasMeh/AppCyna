import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get the active grille configuration
    const activeGrille = await prisma.grilleCategorie.findFirst({
      where: {
        active: true,
      },
      include: {
        categorie1: true,
        categorie2: true,
        categorie3: true,
      },
    });

    return NextResponse.json(activeGrille);
  } catch (error) {
    console.error('Error fetching grille categorie:', error);
    return NextResponse.json(
      { error: 'Failed to fetch grille categorie' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Deactivate all existing grilles
    await prisma.grilleCategorie.updateMany({
      where: { active: true },
      data: { active: false },
    });

    // Create new grille configuration
    const newGrille = await prisma.grilleCategorie.create({
      data: {
        categorie1Id: data.categorie1Id || null,
        categorie2Id: data.categorie2Id || null,
        categorie3Id: data.categorie3Id || null,
        active: true,
      },
      include: {
        categorie1: true,
        categorie2: true,
        categorie3: true,
      },
    });

    return NextResponse.json(newGrille);
  } catch (error) {
    console.error('Error creating grille categorie:', error);
    return NextResponse.json(
      { error: 'Failed to create grille categorie' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { error: 'Grille ID is required' },
        { status: 400 }
      );
    }

    const updatedGrille = await prisma.grilleCategorie.update({
      where: { id },
      data: updateData,
      include: {
        categorie1: true,
        categorie2: true,
        categorie3: true,
      },
    });

    return NextResponse.json(updatedGrille);
  } catch (error) {
    console.error('Error updating grille categorie:', error);
    return NextResponse.json(
      { error: 'Failed to update grille categorie' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Grille ID is required' },
        { status: 400 }
      );
    }

    await prisma.grilleCategorie.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Grille deleted successfully' });
  } catch (error) {
    console.error('Error deleting grille categorie:', error);
    return NextResponse.json(
      { error: 'Failed to delete grille categorie' },
      { status: 500 }
    );
  }
}
