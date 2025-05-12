import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET!; // Assure-toi qu’il est bien dans le fichier .env

export async function POST(request: NextRequest) {
  try {
    const { email, mdp } = await request.json();
    console.log('📥 Connexion attempt:', { email, mdp });

    if (!email || !mdp) {
      console.log('⚠️ Email or password missing');
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.log('❌ No user found with that email');
      return NextResponse.json({ error: 'Mot de passe ou email invalide' }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(mdp, user.mdp);
    if (!passwordMatch) {
      console.log('❌ Invalid password');
      return NextResponse.json({ error: 'Mot de passe ou email invalide' }, { status: 401 });
    }

    // ✅ Génération du token avec le rôle inclus
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: '24h' }
    );

    console.log('🔐 JWT created:', token);

    const response = NextResponse.json({ message: 'Login successful', user });

    // ✅ Enregistre le cookie correctement
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: false, // ✅ Désactive secure en dev
      path: '/',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
    });

    console.log('✅ Cookie set with token for user:', user.email, '| Role:', user.role);
    return response;
  } catch (error) {
    console.error('💥 Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
