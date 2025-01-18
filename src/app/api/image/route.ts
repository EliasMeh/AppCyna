import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { imageData, produitId } = body;

        // Validate input
        if (!imageData) {
            return NextResponse.json({ error: 'Missing image data' }, { status: 400 });
        }

        // Create the new image
        const newImage = await prisma.image.create({
            data: {
                data: imageData, // Store base64 string directly
                produitId: produitId || null, // Optional produitId
            },
        });

        return NextResponse.json(newImage, { status: 201 });
    } catch (error) {
        console.error('Error storing image:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET() {
    const data = await prisma.image.findMany();
    console.log(data);
    return NextResponse.json(data);
}