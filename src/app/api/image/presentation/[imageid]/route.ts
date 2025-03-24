import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Cache duration in seconds
const CACHE_MAX_AGE = 60 * 60 * 24; // 24 hours
const STALE_WHILE_REVALIDATE = 60 * 60; // 1 hour

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const produitId = url.pathname.split('/').pop();

    if (!produitId || isNaN(Number(produitId))) {
        return new Response(
            JSON.stringify({ error: 'Invalid product ID' }), 
            { 
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
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
            return new Response(
                JSON.stringify({ 
                    error: 'Image not found',
                    productId: produitId 
                }), 
                { 
                    status: 404,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
        }

        // Log successful image fetch
        console.log(`Found image for product ${produitId}:`, {
            imageId: image.id,
            hasData: !!image.data,
            dataLength: image.data.length,
            firstBytes: Array.from(image.data.slice(0, 4))
        });

        return new Response(
            JSON.stringify({
                id: image.id,
                data: image.data,
                produitId: image.produitId
            }), 
            { 
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': `public, max-age=${CACHE_MAX_AGE}, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`,
                    'CDN-Cache-Control': `public, max-age=${CACHE_MAX_AGE}`,
                    'Vercel-CDN-Cache-Control': `public, max-age=${CACHE_MAX_AGE}`,
                    'ETag': `"image-${image.id}"`,
                }
            }
        );

    } catch (error) {
        console.error('Error fetching image:', {
            productId: produitId,
            error: error instanceof Error ? error.message : 'Unknown error'
        });

        return new Response(
            JSON.stringify({ 
                error: 'Failed to fetch image',
                details: error instanceof Error ? error.message : 'Unknown error'
            }), 
            { 
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
    } finally {
        await prisma.$disconnect();
    }
}