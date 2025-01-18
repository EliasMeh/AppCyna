import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import exp from "constants";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const text = await prisma.text.findFirst();
        return NextResponse.json(text, { status: 200 });
    } catch (error) {
        console.error('Error handling text:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { content } = body;

        // Validate input
        if (!content) {
            return NextResponse.json({ error: 'Missing content' }, { status: 400 });
        }

        // Check if there is an existing text
        const existingText = await prisma.text.findFirst();

        let text;
        if (existingText) {
            // Update the existing text
            text = await prisma.text.update({
                where: { id: existingText.id },
                data: { content },
            });
        } else {
            // Create a new text
            text = await prisma.text.create({
                data: { content },
            });
        }

        return NextResponse.json(text, { status: 200 });
    } catch (error) {
        console.error('Error handling text:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}