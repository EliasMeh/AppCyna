import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-03-31.basil',
});

export async function POST(request: NextRequest) {
  try {
    const { items, userId, customerEmail } = await request.json();

    // Get user data first
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        stripeCustomerId: true,
        email: true,
        verified: true 
      }
    });

    // Validate request data
    if (!items?.length) {
      return NextResponse.json({
        error: 'Invalid Request',
        details: 'No items provided in the cart',
        code: 'INVALID_ITEMS'
      }, { status: 400 });
    }

    if (!userId || !customerEmail) {
      return NextResponse.json({
        error: 'Invalid Request',
        details: 'Missing user information',
        code: 'INVALID_USER_INFO'
      }, { status: 400 });
    }

    // Get or create Stripe customer
    if (!user) {
      return NextResponse.json({
        error: 'User Not Found',
        details: 'Unable to find user record',
        code: 'USER_NOT_FOUND'
      }, { status: 404 });
    }

    let stripeCustomerId = user.stripeCustomerId;

    try {
      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: customerEmail,
          metadata: { userId: userId.toString() }
        });
        stripeCustomerId = customer.id;

        await prisma.user.update({
          where: { id: userId },
          data: { stripeCustomerId: customer.id }
        });
      }

      const lineItems = items.map((item: any) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.produit?.nom || item.name,
            description: 'Monthly subscription',
          },
          unit_amount: Math.round((item.produit?.prix || item.price) * 100),
          recurring: { interval: 'month' },
        },
        quantity: item.quantite || item.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: lineItems,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
        metadata: { userId: userId.toString() },
      });

      return NextResponse.json({ sessionId: session.id });
      
    } catch (stripeError) {
      console.error('Stripe error:', stripeError);
      if (stripeError instanceof Stripe.errors.StripeError) {
        return NextResponse.json({
          error: 'Payment Processing Error',
          details: stripeError.message,
          code: stripeError.type
        }, { status: 400 });
      }
      throw stripeError; // Re-throw if not a Stripe error
    }

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({
      error: 'Server Error',
      details: error instanceof Error ? error.message : 'An unexpected error occurred',
      code: 'INTERNAL_SERVER_ERROR'
    }, { status: 500 });
  }
}