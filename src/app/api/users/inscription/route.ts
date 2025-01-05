import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

//Création d'un user
export async function POST(request: NextRequest) {
    const body = await request.json();

    const hashedPassword = await bcrypt.hash(body.mdp, 10);

    const data = await prisma.user.create({
        data: {
            nom: body.nom,
            prenom: body.prenom,
            email: body.email,
            mdp: hashedPassword,
            role: "user",
            verified: false
        }
        
    });

    return NextResponse.json(data);
}
//Modification d'informations d'un user en fonction de son id
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, email, password, nom, prenom, adresse, role, verified } = body;

        if (!id) {
            return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { id },
        });

        if (!existingUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        let hashedPassword;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                email: email || existingUser.email,
                mdp: hashedPassword || existingUser.mdp,
                nom: nom || existingUser.nom,
                prenom: prenom || existingUser.prenom,
                adresse: adresse !== undefined ? adresse : existingUser.adresse,
                role: role || existingUser.role,
                verified: verified !== undefined ? verified : existingUser.verified,
            },
        });

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}