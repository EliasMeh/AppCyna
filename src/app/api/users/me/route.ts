import { NextRequest, NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  console.log('GET /api/users/me - Request received');

  const token = req.cookies.get('token')?.value;

  if (!token) {
    console.warn('GET /api/users/me - No token found in cookies');
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('✅ User found via token:', user.email, '| Role:', user.role);

    return NextResponse.json({ user });
  } catch (error) {
    console.error('🔒 Token invalid or expired:', error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
