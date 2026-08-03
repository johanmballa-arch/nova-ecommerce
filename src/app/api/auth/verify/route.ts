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

    const pending = await prisma.pendingSignup.findUnique({ where: { email } });

    if (!pending) {
      return NextResponse.json(
        { error: "Aucune inscription en attente pour cet e-mail" },
        { status: 404 }
      );
    }

    if (pending.code !== code) {
      return NextResponse.json({ error: "Code incorrect" }, { status: 400 });
    }

    if (pending.expiresAt < new Date()) {
      return NextResponse.json({ error: "Ce code a expiré" }, { status: 400 });
    }

    // Le code est valide : on crée vraiment le compte
    const user = await prisma.user.create({
      data: {
        name: pending.name,
        email: pending.email,
        password: pending.password,
        role: "CLIENT",
        emailVerified: true,
      },
    });

    // Nettoyage : on supprime la demande en attente
    await prisma.pendingSignup.delete({ where: { email } });

    return NextResponse.json({
      success: true,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la vérification" },
      { status: 500 }
    );
  }
}