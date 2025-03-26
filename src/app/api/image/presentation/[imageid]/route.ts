import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Cache configuration
const REVALIDATE_TIME = 3600; // 1 hour in seconds

// Route segment config (Corrected: Using a hardcoded value instead of variable)
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache revalidation time directly set to 1 hour

let requestCount = 0;

export async function GET(request: NextRequest) {
    requestCount++;
    const startTime = performance.now();
    const url = new URL(request.url);
    const produitId = url.pathname.split('/').pop();

    console.log(`\n🔍 [Cache Debug] Request #${requestCount} for image ${produitId}`, {
        timestamp: new Date().toISOString(),
        isCacheEnabled: true,
        revalidateTime: REVALIDATE_TIME,
        headers: Object.fromEntries(request.headers),
    });

    if (!produitId || isNaN(Number(produitId))) {
        console.warn(`⚠️ Invalid product ID requested: ${produitId}`);
        return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 200 });
    }

    try {
        const image = await prisma.image.findFirst({
            where: { produitId: Number(produitId) },
            select: {
                id: true,
                data: true,
                produitId: true
            }
        });

        const endTime = performance.now();
        const duration = endTime - startTime;

        if (!image?.data) {
            console.log(`❌ No image found for product ${produitId}`);
            return NextResponse.json({ success: true, data: null }, { status: 200 });
        }

        console.log(`✅ Image found for product ${produitId}:`, {
            requestNumber: requestCount,
            duration: `${duration.toFixed(2)}ms`,
            dataSize: image.data.length,
            timestamp: new Date().toISOString()
        });

        return new NextResponse(
            JSON.stringify({
                success: true,
                id: image.id,
                data: image.data,
                produitId: image.produitId,
                debug: {
                    requestNumber: requestCount,
                    duration: duration.toFixed(2),
                    timestamp: new Date().toISOString()
                }
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': `public, max-age=${REVALIDATE_TIME}, s-maxage=${REVALIDATE_TIME}, stale-while-revalidate=59`,
                    'CDN-Cache-Control': `public, max-age=${REVALIDATE_TIME}`,
                    'Next-Cache-Tags': `image-${produitId}`,
                    'X-Cache-Debug': `Request #${requestCount}`,
                    'X-Response-Time': `${duration.toFixed(2)}ms`,
                    'Vary': 'Accept'
                }
            }
        );

    } catch (error) {
        console.error('❌ Error fetching image:', error);
        return NextResponse.json(
            { success: false, error: 'Server error' },
            { status: 200 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
