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

    // Check for existing subscription first
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        stripeSessionId: sessionId,
      },
    });

    if (existingSubscription) {
      return NextResponse.json(
        {
          code: 'DUPLICATE_SUBSCRIPTION',
          error: 'This subscription has already been processed',
        },
        { status: 409 }
      );
    }

    // Validate session ID
    if (
      !sessionId ||
      typeof sessionId !== 'string' ||
      !sessionId.startsWith('cs_')
    ) {
      return NextResponse.json(
        {
          error: 'Invalid session ID format',
        },
        { status: 400 }
      );
    }

    // Retrieve the checkout session with line items
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'subscription'],
    });

    if (!session) {
      return NextResponse.json(
        {
          error: 'Session not found',
        },
        { status: 404 }
      );
    }

    const userId = parseInt(session.metadata?.userId || '0');
    if (!userId) {
      return NextResponse.json(
        {
          error: 'User information not found',
        },
        { status: 400 }
      );
    }

    try {
      // Get cart items for the user
      const cartItems = await prisma.panier.findMany({
        where: { userId },
        include: { produit: true },
      });

      // Generate unique subscription IDs for each item
      const subscriptionPromises = cartItems.map(async (item, index) => {
        // Create truly unique IDs by combining multiple unique elements
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const uniqueStripeSubId = `sub_${timestamp}_${randomString}_${index}`;
        const uniquePaymentId = `pi_${timestamp}_${randomString}_${index}`;

        const subscription = await prisma.subscription.create({
          data: {
            userId: userId,
            produitId: item.produitId,
            startDate: new Date(),
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: 'active',
            stripeSubId: uniqueStripeSubId,
            stripeSessionId: sessionId,
            cancelAtPeriodEnd: false,
          },
        });

        // Create payment record with unique payment ID
        await prisma.payment.create({
          data: {
            subscriptionId: subscription.id,
            userId: userId,
            amount: item.produit.prix,
            currency: 'EUR',
            stripePaymentId: uniquePaymentId,
            status: 'succeeded',
          },
        });

        return subscription;
      });

      // Wait for all subscriptions to be created
      const createdSubscriptions = await Promise.all(subscriptionPromises);

      // Clear the cart
      await prisma.panier.deleteMany({
        where: { userId },
      });

      return NextResponse.json({
        success: true,
        message: 'Payment verified and subscriptions created successfully',
        subscriptions: createdSubscriptions.map((sub) => sub.id),
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      if (
        dbError instanceof Error &&
        'code' in dbError &&
        dbError.code === 'P2002'
      ) {
        const error = dbError as { code: string; meta?: { target?: string[] } };
        if (error.meta?.target?.includes('stripeSessionId')) {
          return NextResponse.json(
            {
              error: 'This session has already been processed',
              code: 'DUPLICATE_SESSION',
            },
            { status: 409 }
          );
        }
      }
      throw dbError;
    }
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to verify payment',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
