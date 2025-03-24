import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const produitId = url.pathname.split('/').pop();

    if (!produitId || isNaN(Number(produitId))) {
        return NextResponse.json({ 
            error: 'Invalid product ID' 
        }, { 
            status: 400 
        });
    }

    try {
        const image = await prisma.image.findFirst({
            where: { 
                produitId: Number(produitId) 
            },
            select: {
                id: true,
                data: true,
                produitId: true
            }
        });

        if (!image || !image.data) {
            console.log(`No image found for product ${produitId}`);
            return NextResponse.json({ 
                error: 'Image not found',
                productId: produitId 
            }, { 
                status: 404 
            });
        }

        // Log successful image fetch
        console.log(`Found image for product ${produitId}:`, {
            imageId: image.id,
            hasData: !!image.data,
            dataLength: image.data.length,
            firstBytes: Array.from(image.data.slice(0, 4))
        });

        return NextResponse.json({
            id: image.id,
            data: image.data,
            produitId: image.produitId
        }, { 
            status: 200 
        });

    } catch (error) {
        console.error('Error fetching image:', {
            productId: produitId,
            error: error instanceof Error ? error.message : 'Unknown error'
        });

        return NextResponse.json({ 
            error: 'Failed to fetch image',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { 
            status: 500 
        });
    } finally {
        await prisma.$disconnect();
    }
}