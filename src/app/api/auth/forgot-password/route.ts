import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "E-mail requis" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // On ne révèle jamais si un compte existe ou non (sécurité) : on répond toujours succès
    if (!user) {
      return NextResponse.json({ success: true });
    }

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // On supprime les anciennes demandes pour cet email, puis on en crée une nouvelle
    await prisma.passwordReset.deleteMany({ where: { email } });
    await prisma.passwordReset.create({
      data: { email, code, expiresAt },
    });

    await sendVerificationEmail(email, code);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du code" },
      { status: 500 }
    );
  }
}