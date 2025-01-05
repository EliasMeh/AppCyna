import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Validate input
        if (!email || !password) {
            return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
        }

        // Find the user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        // Verify the password
        const isPasswordValid = await bcrypt.compare(password, user.mdp);
        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        // Return success response
        return NextResponse.json({ message: 'Login successful', user: { id: user.id, email: user.email, nom: user.nom, prenom: user.prenom } }, { status: 200 });
    } catch (error) {
        console.error('Error verifying user:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}