import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-03-31.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = parseInt(session.metadata?.userId || '0');

    // Get cart items for the user
    const cartItems = await prisma.panier.findMany({
      where: { userId },
      include: { produit: true },
    });

    // Create subscriptions for each item
    await Promise.all(
      cartItems.map((item) =>
        prisma.subscription.create({
          data: {
            userId,
            produitId: item.produitId,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            status: 'active',
            stripeSubId: session.subscription?.toString() || null,
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            cancelAtPeriodEnd: false
          },
        })
      )
    );

    // Clear the user's cart
    await prisma.panier.deleteMany({
      where: { userId },
    });
  }

  return NextResponse.json({ received: true });
}