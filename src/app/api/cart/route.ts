import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
      const body = await request.json();
      const userId = parseInt(body.userId);
      const produitId = parseInt(body.produitId);
      const quantite = parseInt(body.quantite) || 1;
  
      console.log('Received cart request:', { userId, produitId, quantite });
  
      // Validate parsed values
      if (isNaN(userId) || isNaN(produitId)) {
        return NextResponse.json({ 
          error: 'Invalid user ID or product ID' 
        }, { status: 400 });
      }
  
      // Check if product exists and has stock
      const product = await prisma.produit.findUnique({
        where: { id: produitId }
      });
  
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
  
      if (product.quantite < quantite) {
        return NextResponse.json({ 
          error: 'Not enough stock available' 
        }, { status: 400 });
      }
  
      // Check existing cart item
      const existingItem = await prisma.panier.findFirst({
        where: {
          userId: userId,
          produitId: produitId
        }
      });
  
      let cartItem;
      if (existingItem) {
        // Update quantity if item exists
        cartItem = await prisma.panier.update({
          where: { id: existingItem.id },
          data: { quantite: existingItem.quantite + quantite },
          include: {
            produit: true
          }
        });
      } else {
        // Create new cart item
        cartItem = await prisma.panier.create({
          data: {
            userId,
            produitId,
            quantite
          },
          include: {
            produit: true
          }
        });
      }
  
      return NextResponse.json(cartItem);
    } catch (error) {
      console.error('Cart error:', error);
      return NextResponse.json({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const cartItems = await prisma.panier.findMany({
      where: {
        userId: parseInt(userId)
      },
      include: {
        produit: {
          include: {
            images: true
          }
        }
      }
    });

    return NextResponse.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const cartItemId = searchParams.get('cartItemId');
        const newQuantite = searchParams.get('quantite');

        if (!cartItemId || !newQuantite) {
            return NextResponse.json({ 
                error: 'Cart item ID and quantity are required' 
            }, { status: 400 });
        }

        // Check if cart item exists
        const existingItem = await prisma.panier.findUnique({
            where: { id: parseInt(cartItemId) }
        });

        if (!existingItem) {
            return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
        }

        // Check if product has enough stock
        const product = await prisma.produit.findUnique({
            where: { id: existingItem.produitId }
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        if (product.quantite < parseInt(newQuantite)) {
            return NextResponse.json({ 
                error: 'Not enough stock available' 
            }, { status: 400 });
        }

        // Update cart item
        const updatedItem = await prisma.panier.update({
            where: { id: parseInt(cartItemId) },
            data: { quantite: parseInt(newQuantite) },
            include: {
                produit: {
                    include: {
                        images: true
                    }
                }
            }
        });

        return NextResponse.json(updatedItem);
    } catch (error) {
        console.error('Error updating cart:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}