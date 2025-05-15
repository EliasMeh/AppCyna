import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import twilio from 'twilio';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET!; // Assure-toi qu’il est bien dans le fichier .env
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Add DEBUG mode constant
const DEBUG_MODE = process.env.NODE_ENV === 'development';

// Add these interfaces at the top of the file after the imports
interface TwilioError extends Error {
  code?: number;
  message: string;
}

interface VerificationError extends Error {
  message: string;
  code?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { email, mdp } = await request.json();
    console.log('📥 Connexion attempt:', { email, mdp });

    if (!email || !mdp) {
      console.log('⚠️ Email or password missing');
      return NextResponse.json(
        { error: 'Missing email or password' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.log('❌ No user found with that email');
      return NextResponse.json(
        { error: 'Mot de passe ou email invalide' },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(mdp, user.mdp);
    if (!passwordMatch) {
      console.log('❌ Invalid password');
      return NextResponse.json(
        { error: 'Mot de passe ou email invalide' },
        { status: 401 }
      );
    }

    // If user is admin, require 2FA
    if (user.role === 'ADMIN') {
      try {
        // Generate a 6-digit code
        const verificationCode = Math.floor(
          100000 + Math.random() * 900000
        ).toString();
        console.log('🔢 Generated verification code for admin');

        // Store the code first
        await prisma.verificationCode.create({
          data: {
            code: verificationCode,
            userId: user.id,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
          },
        });
        console.log('💾 Verification code stored in database');

        // Format the phone number to ensure it's in E.164 format
        const formattedPhone = user.phone?.startsWith('+')
          ? user.phone
          : `+33${user.phone?.replace(/^0/, '')}`;

        if (DEBUG_MODE) {
          // In development, just return the code without sending SMS
          console.log('🔑 DEBUG MODE: Verification code:', verificationCode);
          return NextResponse.json({
            requires2FA: true,
            userId: user.id,
            debug: {
              verificationCode,
              message: 'Debug mode: SMS not sent',
            },
          });
        } else {
          // Production mode - actually send SMS
          try {
            const message = await twilioClient.messages.create({
              body: `Votre code de vérification CYNA est: ${verificationCode}`,
              to: formattedPhone,
              from: process.env.TWILIO_PHONE_NUMBER,
            });

            console.log('📱 SMS sent successfully:', message.sid);

            return NextResponse.json({
              requires2FA: true,
              userId: user.id,
              message: 'Verification code sent successfully',
            });
          } catch (twilioError: unknown) {
            if (
              twilioError instanceof Error &&
              (twilioError as TwilioError).code === 21608
            ) {
              return NextResponse.json(
                {
                  error:
                    'Phone number not verified with Twilio. Please contact support.',
                  requiresVerification: true,
                  details: DEBUG_MODE ? twilioError.message : undefined,
                },
                { status: 400 }
              );
            }
            throw twilioError;
          }
        }
      } catch (error: unknown) {
        console.error('📱 2FA Error:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
          {
            error: 'Failed to setup 2FA verification.',
            details: DEBUG_MODE ? errorMessage : undefined,
          },
          { status: 500 }
        );
      }
    }

    // ✅ Génération du token avec le rôle inclus
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: '24h' }
    );

    console.log('🔐 JWT created:', token);

    const response = NextResponse.json({
      message: 'Login successful',
      user,
      token,
    });

    // ✅ Enregistre le cookie correctement
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: false, // ✅ Désactive secure en dev
      path: '/',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
    });

    console.log(
      '✅ Cookie set with token for user:',
      user.email,
      '| Role:',
      user.role
    );
    return response;
  } catch (error) {
    console.error('💥 Login error:', error);
    return NextResponse.json(
      {
        error: 'An unexpected error occurred during login',
        details: DEBUG_MODE ? error : undefined,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
