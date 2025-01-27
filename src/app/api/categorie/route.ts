import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const categories = await prisma.categorie.findMany({
            include: {
                produits: true
            }
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { nom, produits } = body;

        if (!nom || !produits) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newCategorie = await prisma.categorie.create({
            data: {
                nom,
                produits: {
                    create: produits
                }
            },
        });

        return NextResponse.json(newCategorie, { status: 201 });
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}