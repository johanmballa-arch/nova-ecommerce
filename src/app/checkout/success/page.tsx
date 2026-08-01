"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { fmt } from "@/lib/utils";
import { useCart } from "@/store/cart";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { clearCart } = useCart();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    clearCart();

    // On récupère juste les infos de la commande (déjà mise à jour par le webhook)
    // On réessaie plusieurs fois car le webhook peut arriver avec un léger délai
    let attempts = 0;
    const checkOrder = () => {
      fetch(`/api/orders/${orderId}`)
        .then((res) => res.json())
        .then((data) => {
          setOrder(data);
          if (data.status === "PAID" || attempts >= 5) {
            setLoading(false);
          } else {
            attempts++;
            setTimeout(checkOrder, 1000);
          }
        })
        .catch(() => setLoading(false));
    };

    checkOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="lq-container" style={{ padding: "60px 24px 100px", display: "flex", justifyContent: "center" }}>
        <div className="lq-glass lq-empty">Confirmation du paiement…</div>
      </div>
    );
  }

  return (
    <div className="lq-container" style={{ padding: "60px 24px 100px", display: "flex", justifyContent: "center" }}>
      <div className="lq-glass" style={{ padding: 40, textAlign: "center", maxWidth: 460 }}>
        <div
          style={{
            width: 60, height: 60, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))",
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px",
          }}
        >
          <Check size={28} color="#060812" />
        </div>
        <h2 className="lq-display">Paiement confirmé</h2>
        <p style={{ color: "var(--text-muted)", margin: "12px 0 6px" }}>
          Merci ! Ta commande{" "}
          {order && <span className="lq-mono">#{order.id.slice(0, 8).toUpperCase()}</span>} est confirmée et en cours de traitement.
        </p>
        {order && (
          <p className="lq-mono" style={{ fontSize: 22, fontWeight: 700, margin: "14px 0 22px" }}>
            {fmt(order.total)}
          </p>
        )}
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button className="lq-btn lq-btn-ghost" onClick={() => router.push("/account")}>
            Voir mes commandes
          </button>
          <button className="lq-btn lq-btn-primary" onClick={() => router.push("/")}>
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}