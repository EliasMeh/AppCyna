import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    const data = await prisma.produit.findMany();
    return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { nom, prix, description } = body;

        if (!nom || !prix || !description) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newProduit = await prisma.produit.create({
            data: {
                nom,
                prix,
                description,
            },
        });

        return NextResponse.json(newProduit, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}