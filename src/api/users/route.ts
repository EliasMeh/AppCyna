import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function GET() {
    const data = await prisma.user.findMany();
    return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const data = await prisma.user.create({
        data: {
            id: body.id,
            mdp: hashedPassword,
            nom: body.nom,
            prenom: body.prenom,
            adresse: body.adresse,
            email: body.email,
            role: body.role
        }
    });

    return NextResponse.json(data);
}