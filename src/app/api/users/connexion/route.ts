import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET!; // Store in .env

export async function POST(request: NextRequest) {
  try {
    const { email, mdp } = await request.json();
    console.log('Received body:', { email, mdp }); // Debugging

    if (!email || !mdp) {
      console.log('Validation failed: Missing email or password');
      return NextResponse.json(
        { error: 'Missing email or password' },
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(mdp, user.mdp))) {
      return NextResponse.json(
        { error: 'Mot de passe ou email invalide' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: '24h',
    });

    // Set cookie with JWT token (httpOnly & secure)
    const response = NextResponse.json({ message: 'Login successful', user });
    response.headers.set(
      'Set-Cookie',
      `token=${token}; HttpOnly; Secure; Path=/`
    );

    return response;
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
