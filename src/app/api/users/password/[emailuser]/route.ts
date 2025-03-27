import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  try {
    // Extraction du paramètre dynamique "emailuser" depuis l'URL
    const emailuser = request.nextUrl.pathname.split("/").pop() ?? "";

    const userEmail = decodeURIComponent(emailuser);

    // Validation du format d'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return NextResponse.json(
        { error: "Format d'email invalide" },
        { status: 400 }
      );
    }

    // Lecture du corps de la requête
    const body = await request.json();
    const { newPassword } = body;

    if (!newPassword || typeof newPassword !== "string") {
      return NextResponse.json(
        { error: "Nouveau mot de passe requis" },
        { status: 400 }
      );
    }

    // Vérification si l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Hachage du nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mise à jour du mot de passe de l'utilisateur
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
        // Exclut le mot de passe dans la réponse pour des raisons de sécurité
      },
    });

    // Réponse en cas de succès
    return NextResponse.json(
      {
        message: "Mot de passe mis à jour avec succès",
        user: updatedUser,
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
    // Fermeture de la connexion à Prisma
    await prisma.$disconnect();
  }
}
