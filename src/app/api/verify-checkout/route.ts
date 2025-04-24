import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    // Validate session ID format
    if (!sessionId || typeof sessionId !== 'string' || !sessionId.startsWith('cs_')) {
      return NextResponse.json({ 
        error: 'Invalid session ID format' 
      }, { status: 400 });
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json({ 
        error: 'Session not found' 
      }, { status: 404 });
    }

    // Verify payment status
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ 
        error: 'Payment not completed' 
      }, { status: 400 });
    }

    const userId = session.metadata?.userId;
    if (!userId) {
      return NextResponse.json({ 
        error: 'User information not found' 
      }, { status: 400 });
    }

    try {
      // Clear the user's cart
      await prisma.panier.deleteMany({
        where: { userId: parseInt(userId) },
      });

      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully'
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({ 
        error: 'Failed to update user data' 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Stripe verification error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to verify payment'
    }, { status: 500 });
  }
}