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

    const pending = await prisma.pendingSignup.findUnique({ where: { email } });
    if (!pending) {
      return NextResponse.json(
        { error: "Aucune inscription en attente pour cet e-mail" },
        { status: 404 }
      );
    }

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.pendingSignup.update({
      where: { email },
      data: { code, expiresAt },
    });

    await sendVerificationEmail(email, code);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de l'envoi" }, { status: 500 });
  }
}