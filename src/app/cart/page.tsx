"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Minus, Plus, Trash2, ChevronRight } from "lucide-react";
import { Icon } from "@/components/Icon";
import { fmt } from "@/lib/utils";
import { useCart } from "@/store/cart";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  icon: string;
};

export default function CartPage() {
  const router = useRouter();
  const { items, updateQty, removeItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des produits:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const cartItems = items
    .map((c) => ({ ...c, product: products.find((p) => p.id === c.id) }))
    .filter((i) => i.product);

  const subtotal = cartItems.reduce((s, i) => s + (i.product!.price * i.qty), 0);
  const shipping = subtotal > 0 && subtotal < 500 ? 9.9 : 0;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="lq-container" style={{ padding: "40px 24px 90px" }}>
        <div className="lq-glass lq-empty">Chargement du panier…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lq-container" style={{ padding: "40px 24px 90px" }}>
        <div className="lq-glass lq-empty">
          <p>Erreur : {error}</p>
          <button className="lq-btn lq-btn-primary" style={{ marginTop: 16 }} onClick={() => window.location.reload()}>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="lq-container" style={{ padding: "40px 24px 90px" }}>
        <div className="lq-glass lq-empty">
          <ShoppingCart size={30} style={{ marginBottom: 12, opacity: 0.5 }} />
          <p>Ton panier est vide.</p>
          <button className="lq-btn lq-btn-primary" style={{ marginTop: 16 }} onClick={() => router.push("/catalog")}>
            Découvrir le catalogue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lq-container" style={{ padding: "20px 24px 90px" }}>
      <h2 className="lq-display" style={{ marginBottom: 22 }}>Ton panier</h2>
      <div className="lq-detail-grid" style={{ gridTemplateColumns: "1.6fr 1fr", alignItems: "start" }}>
        <div>
          {cartItems.map((i) => (
            <div key={i.id} className="lq-glass lq-cart-row">
              <div className="lq-cart-visual">
                <Icon name={i.product!.icon} size={28} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{i.product!.name}</div>
                <div style={{ fontSize: 12.5, color: "var(--text-faint)" }}>{i.product!.category}</div>
              </div>
              <div className="lq-glass lq-stepper" style={{ background: "rgba(255,255,255,0.04)" }}>
                <button
                  className="lq-btn-ghost"
                  style={{ border: "none", borderRadius: 0, width: 30, height: 30 }}
                  onClick={() => updateQty(i.id, Math.max(1, i.qty - 1))}
                >
                  <Minus size={12} />
                </button>
                <span style={{ width: 30, textAlign: "center", fontSize: 13.5 }}>{i.qty}</span>
                <button
                  className="lq-btn-ghost"
                  style={{ border: "none", borderRadius: 0, width: 30, height: 30 }}
                  onClick={() => updateQty(i.id, i.qty + 1)}
                >
                  <Plus size={12} />
                </button>
              </div>
              <div style={{ width: 80, textAlign: "right", fontWeight: 700 }}>
                {fmt(i.product!.price * i.qty)}
              </div>
              <button className="lq-icon-btn" onClick={() => removeItem(i.id)} aria-label="Retirer">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
        <div className="lq-glass" style={{ padding: 22 }}>
          <div className="lq-display" style={{ fontSize: 18, marginBottom: 6 }}>Résumé</div>
          <div className="lq-summary-row"><span>Sous-total</span><span>{fmt(subtotal)}</span></div>
          <div className="lq-summary-row"><span>Livraison</span><span>{shipping === 0 ? "Offerte" : fmt(shipping)}</span></div>
          <div className="lq-summary-row total"><span>Total</span><span>{fmt(total)}</span></div>
          <button
            className="lq-btn lq-btn-primary"
            style={{ width: "100%", justifyContent: "center", marginTop: 18 }}
            onClick={() => router.push("/checkout")}
          >
            Passer commande <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}