"use client";

import { Star, ShoppingCart } from "lucide-react";
import { Icon } from "./Icon";
import { fmt } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  icon: string;
  rating: number;
  reviews: number;
  tagline: string | null;
  prime: boolean;
  images?: string[];
};

export function ProductCard({
  product,
  onOpen,
  addToCart,
}: {
  product: Product;
  onOpen: (id: string) => void;
  addToCart?: (id: string, qty: number) => void;
}) {
  const hasImage = product.images && product.images.length > 0;

  return (
    <div className="lq-card-full" onClick={() => onOpen(product.id)}>
      {hasImage ? (
        <img src={product.images![0]} alt={product.name} className="lq-card-full-img" />
      ) : (
        <div className="lq-card-full-fallback">
          <Icon name={product.icon} size={48} />
        </div>
      )}

      {product.prime && <span className="lq-prime-badge lq-card-full-badge">Livraison rapide</span>}

      <div className="lq-card-full-overlay">
        <span className="lq-card-cat" style={{ background: "rgba(0,0,0,0.4)", borderColor: "rgba(255,255,255,0.25)", color: "#fff" }}>
          {product.category}
        </span>
        <div className="lq-card-full-name lq-display">{product.name}</div>
        <div className="lq-rating" style={{ color: "rgba(255,255,255,0.85)" }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} size={12} fill={i <= Math.round(product.rating) ? "#ffa41c" : "none"} color="#ffa41c" />
          ))}
          <span style={{ color: "#fff" }}>{product.reviews.toLocaleString("fr-FR")}</span>
        </div>
        <div className="lq-card-full-footer">
          <span className="lq-price" style={{ color: "#fff" }}>{fmt(product.price)}</span>
        </div>
        {addToCart && (
          <button
            className="lq-btn lq-btn-primary lq-card-cta"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product.id, 1);
            }}
          >
            <ShoppingCart size={14} /> Ajouter au panier
          </button>
        )}
      </div>
    </div>
  );
}