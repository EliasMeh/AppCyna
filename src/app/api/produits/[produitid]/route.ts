import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const produitid = Number(url.pathname.split("/").pop());

        const data = await prisma.produit.findFirst({
            where: { id: produitid },
            include: {
                images: true // Include the images relation
            }
        });

        if (!data) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const url = new URL(request.url);
        const produitid = Number(url.pathname.split("/").pop());
        const body = await request.json();

        const updatedProduct = await prisma.produit.update({
            where: { id: produitid },
            data: {
                nom: body.nom,
                prix: body.prix,
                description: body.description,
                quantite: body.quantite,
                categorieId: body.categorieId
            }
        });

        return NextResponse.json(updatedProduct);
    } catch (error) {
        return NextResponse.json({ error: "Error updating product" }, { status: 500 });
    }
}