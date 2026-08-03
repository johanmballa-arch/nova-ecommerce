import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code, newPassword } = body;

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 6 caractères" },
        { status: 400 }
      );
    }

    const reset = await prisma.passwordReset.findFirst({
      where: { email, code },
      orderBy: { createdAt: "desc" },
    });

    if (!reset) {
      return NextResponse.json({ error: "Code incorrect" }, { status: 400 });
    }

    if (reset.expiresAt < new Date()) {
      return NextResponse.json({ error: "Ce code a expiré" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    await prisma.passwordReset.deleteMany({ where: { email } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la réinitialisation" },
      { status: 500 }
    );
  }
}