import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const data = await prisma.produit.findMany();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { nom, prix, description, categorieId } = body;

        if (!nom || !prix || !description) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newProduit = await prisma.produit.create({
            data: {
                nom,
                prix,
                description,
                quantite: body.quantite || 0, // default value if quantite is not provided
                ...(categorieId && { categorie: { connect: { id: categorieId } } })
            },
        });

        return NextResponse.json(newProduit, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}