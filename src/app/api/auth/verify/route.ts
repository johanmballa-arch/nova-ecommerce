import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { error: "E-mail et code requis" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "Compte introuvable" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: "E-mail déjà vérifié" }, { status: 400 });
    }

    if (user.verificationCode !== code) {
      return NextResponse.json({ error: "Code incorrect" }, { status: 400 });
    }

    if (!user.verificationCodeExpires || user.verificationCodeExpires < new Date()) {
      return NextResponse.json({ error: "Ce code a expiré" }, { status: 400 });
    }

    await prisma.user.update({
      where: { email },
      data: {
        emailVerified: true,
        verificationCode: null,
        verificationCodeExpires: null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la vérification" },
      { status: 500 }
    );
  }
}