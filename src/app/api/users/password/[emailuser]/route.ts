import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { emailuser: string } }
) {
  try {
    const userEmail = decodeURIComponent(params.emailuser);
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return NextResponse.json(
        { error: "Format d'email invalide" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { newPassword } = body;

    if (!newPassword || typeof newPassword !== "string") {
      return NextResponse.json(
        { error: "Nouveau mot de passe requis" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    const updatedUser = await prisma.user.update({
      where: {
        email: userEmail,
      },
      data: {
        mdp: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        role: true,
        // Excluding password from response
      },
    });

    return NextResponse.json(
      {
        message: "Mot de passe mis à jour avec succès",
        user: updatedUser
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du mot de passe" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}