"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Check, ShoppingCart, Star, Truck } from "lucide-react";
import { Icon } from "./Icon";
import { fmt } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { TrustBadges } from "./TrustBadges";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  icon: string;
  rating: number;
  reviews: number;
  tagline: string | null;
  prime: boolean;
  specs: Record<string, string> | null;
  images?: string[];
};

export function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const hasImage = product.images && product.images.length > 0;
  const specs = product.specs || {};

  return (
    <div className="lq-container" style={{ padding: "20px 24px 70px" }}>
      <div className="lq-breadcrumb">
        <button onClick={() => router.push("/catalog")}>Catalogue</button>
        <span>›</span>
        <button onClick={() => router.push(`/catalog?category=${encodeURIComponent(product.category)}`)}>
          {product.category}
        </button>
        <span>›</span>
        <span className="current">{product.name}</span>
      </div>

      <div className="lq-detail-grid">
        {/* Visuel plein cadre avec texte incrusté */}
        <div className="lq-detail-visual">
          {hasImage ? (
            <img src={product.images![0]} alt={product.name} className="lq-detail-img" />
          ) : (
            <div className="lq-detail-fallback">
              <Icon name={product.icon} size={140} />
            </div>
          )}

          {product.prime && <span className="lq-prime-badge lq-detail-badge-top">Livraison rapide</span>}

          <div className="lq-detail-overlay">
            <span className="lq-card-cat" style={{ background: "rgba(0,0,0,0.35)", borderColor: "rgba(255,255,255,0.25)", color: "#fff" }}>
              {product.category}
            </span>
            <h1 className="lq-display lq-detail-overlay-title">{product.name}</h1>
            <div className="lq-rating" style={{ color: "rgba(255,255,255,0.85)" }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={14} fill={i <= Math.round(product.rating) ? "#ffa41c" : "none"} color="#ffa41c" />
              ))}
              <span style={{ color: "#fff" }}>{product.rating} · {product.reviews.toLocaleString("fr-FR")} avis</span>
            </div>
          </div>
        </div>

        {/* Colonne infos / achat */}
        <div>
          <p style={{ color: "var(--text-muted)", margin: "0 0 16px", lineHeight: 1.6 }}>
            {product.tagline}
          </p>

          <div className="lq-glass" style={{ padding: 18, marginBottom: 20 }}>
            <div style={{ fontSize: 30, fontWeight: 700, color: "var(--price-red)" }} className="lq-display">
              {fmt(product.price)}
            </div>
            <div
              style={{
                fontSize: 13,
                color: product.stock > 10 ? "#7ee0a0" : "var(--accent-warm)",
                margin: "8px 0 4px",
              }}
            >
              {product.stock > 10 ? "En stock" : `Plus que ${product.stock} en stock`}
            </div>
            <div
              style={{
                fontSize: 12.5,
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 16,
              }}
            >
              <Truck size={14} /> Livraison estimée sous 2 à 4 jours
            </div>

            <div className="lq-qty" style={{ marginBottom: 14 }}>
              <div className="lq-glass lq-stepper">
                <button
                  className="lq-btn-ghost"
                  style={{ border: "none", borderRadius: 0 }}
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  <Minus size={14} />
                </button>
                <span style={{ width: 40, textAlign: "center", fontWeight: 600 }}>{qty}</span>
                <button
                  className="lq-btn-ghost"
                  style={{ border: "none", borderRadius: 0 }}
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                className="lq-btn lq-btn-primary"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => {
                  addToCart(product.id, qty);
                  setAdded(true);
                  setTimeout(() => setAdded(false), 1600);
                }}
              >
                {added ? (
                  <>
                    Ajouté <Check size={16} />
                  </>
                ) : (
                  <>
                    Ajouter au panier <ShoppingCart size={16} />
                  </>
                )}
              </button>
              <button
                className="lq-btn lq-btn-buy"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => {
                  addToCart(product.id, qty);
                  router.push("/cart");
                }}
              >
                Acheter maintenant
              </button>
            </div>
          </div>

          <table className="lq-spec-table lq-mono">
            <tbody>
              {Object.entries(specs).map(([k, v]) => (
                <tr key={k}>
                  <td>{k}</td>
                  <td>{String(v)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <TrustBadges />
      </div>
    </div>
  );
}