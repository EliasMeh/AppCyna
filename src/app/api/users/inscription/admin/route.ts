import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

//Création d'un admin
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nom, prenom, email, mdp } = body;

    // Validate input
    if (!nom || !prenom || !email || !mdp) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(mdp, 10);

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        nom,
        prenom,
        email,
        mdp: hashedPassword,
        role: 'ADMIN',
        verified: false,
      },
    });

    // Return success response
    return NextResponse.json(
      {
        user: {
          id: newUser.id,
          email: newUser.email,
          nom: newUser.nom,
          prenom: newUser.prenom,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
