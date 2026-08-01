import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customerEmail, orderId } = body;

    // items: [{ name, price, qty }]
    const lineItems = items.map((item: { name: string; price: number; qty: number }) => ({
      price_data: {
        currency: "eur",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100), // Stripe attend des centimes
      },
      quantity: item.qty,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: customerEmail,
      success_url: `${request.nextUrl.origin}/checkout/success?orderId=${orderId}`,
      cancel_url: `${request.nextUrl.origin}/checkout`,
      metadata: { orderId },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la session de paiement" },
      { status: 500 }
    );
  }
}