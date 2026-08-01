import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/orders → créer une nouvelle commande
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, total, customerName, customerEmail } = body;

    if (!items || items.length === 0 || !customerName || !customerEmail) {
      return NextResponse.json(
        { error: "Données de commande incomplètes" },
        { status: 400 }
      );
    }

    // On cherche si un utilisateur existe déjà avec cet email, sinon on le crée
    let user = await prisma.user.findUnique({
      where: { email: customerEmail },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: customerEmail,
          name: customerName,
          password: "temp_no_auth", // pas d'authentification pour l'instant
        },
      });
    }

    // Création de la commande avec ses articles
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total,
        status: "PENDING",
        items: {
          create: items.map((item: { productId: string; qty: number; price: number }) => ({
            productId: item.productId,
            quantity: item.qty,
            price: item.price,
          })),
        },
      },
      include: {
        items: { include: { product: true } },
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la commande" },
      { status: 500 }
    );
  }
}

// GET /api/orders → récupérer toutes les commandes (pour l'admin)
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        items: { include: { product: true } },
      },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des commandes" },
      { status: 500 }
    );
  }
}