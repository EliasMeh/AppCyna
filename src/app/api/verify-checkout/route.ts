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

    // Validate session ID
    if (!sessionId || typeof sessionId !== 'string' || !sessionId.startsWith('cs_')) {
      return NextResponse.json({ 
        error: 'Invalid session ID format' 
      }, { status: 400 });
    }

    // Retrieve the checkout session with line items
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'subscription']
    });

    if (!session) {
      return NextResponse.json({ 
        error: 'Session not found' 
      }, { status: 404 });
    }

    const userId = parseInt(session.metadata?.userId || '0');
    if (!userId) {
      return NextResponse.json({ 
        error: 'User information not found' 
      }, { status: 400 });
    }

    try {
      // Get cart items for the user
      const cartItems = await prisma.panier.findMany({
        where: { userId },
        include: { produit: true }
      });

      // Generate unique subscription IDs for each item
      const subscriptionPromises = cartItems.map(async (item, index) => {
        const uniqueStripeSubId = session.subscription 
          ? `${session.subscription.toString()}_${index}` 
          : `sub_${Date.now()}_${index}`;

        const subscription = await prisma.subscription.create({
          data: {
            userId: userId,
            produitId: item.produitId,
            startDate: new Date(),
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: 'active',
            stripeSubId: uniqueStripeSubId,
            cancelAtPeriodEnd: false
          }
        });

        // Create payment record with unique payment ID
        await prisma.payment.create({
          data: {
            subscriptionId: subscription.id,
            userId: userId,
            amount: item.produit.prix,
            currency: 'EUR',
            stripePaymentId: session.payment_intent 
              ? `${session.payment_intent.toString()}_${index}`
              : `pi_${Date.now()}_${index}`,
            status: 'succeeded'
          }
        });

        return subscription;
      });

      // Wait for all subscriptions to be created
      const createdSubscriptions = await Promise.all(subscriptionPromises);

      // Clear the cart
      await prisma.panier.deleteMany({
        where: { userId }
      });

      return NextResponse.json({
        success: true,
        message: 'Payment verified and subscriptions created successfully',
        subscriptions: createdSubscriptions.map(sub => sub.id)
      });

    } catch (dbError) {
      console.error('Database error:', dbError);
      if (typeof dbError === 'object' && dbError !== null && 'code' in dbError && dbError.code === 'P2002') {
        return NextResponse.json({ 
          error: 'Duplicate subscription ID detected' 
        }, { status: 409 });
      }
      return NextResponse.json({ 
        error: 'Failed to create subscriptions' 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to verify payment'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}