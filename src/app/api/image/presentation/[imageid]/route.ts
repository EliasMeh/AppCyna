import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const produitId = url.pathname.split('/').pop();

    try {
        const image = await prisma.image.findFirst({
            where: { produitId: Number(produitId) },
        });
        if (!image) {
            return NextResponse.json({ error: 'No images found for this produitId' }, { status: 404 });
        }
        return NextResponse.json(image, { status: 200 });
    } catch (error) {
        console.error('Error fetching images:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}