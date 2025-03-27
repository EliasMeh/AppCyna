import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

// Updated transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Use Gmail service instead of custom SMTP config
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

// Verify connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Aucun compte associé à cette adresse email" },
        { status: 404 }
      );
    }

    // Generate reset link
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/users/reset-password?email=${encodeURIComponent(email)}`;

    // Send email with updated configuration
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Réinitialisation de mot de passe - AppCyna",
      html: `
        <h1>Réinitialisation de mot de passe</h1>
        <p>Vous avez demandé une réinitialisation de mot de passe.</p>
        <p>Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe :</p>
        <a href="${resetLink}">Réinitialiser mon mot de passe</a>
        <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
      `,
    });

    return NextResponse.json(
      { message: "Email de réinitialisation envoyé avec succès" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error sending reset email:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de l'email" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}