import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Tous les champs sont obligatoires" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 6 caractères" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cet e-mail" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // On stocke la demande en attente (upsert : remplace si déjà une demande en cours pour cet email)
    await prisma.pendingSignup.upsert({
      where: { email },
      create: { email, name, password: hashedPassword, code, expiresAt },
      update: { name, password: hashedPassword, code, expiresAt },
    });

    await sendVerificationEmail(email, code);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la création du compte" },
      { status: 500 }
    );
  }
}