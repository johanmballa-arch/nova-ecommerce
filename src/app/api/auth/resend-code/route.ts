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

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Compte introuvable" }, { status: 404 });
    }
    if (user.emailVerified) {
      return NextResponse.json({ error: "E-mail déjà vérifié" }, { status: 400 });
    }

    const code = generateCode();
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: { verificationCode: code, verificationCodeExpires: expires },
    });

    await sendVerificationEmail(email, code);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de l'envoi" }, { status: 500 });
  }
}