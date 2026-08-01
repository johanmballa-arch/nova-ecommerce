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
    <div className="lq-glass lq-card" onClick={() => onOpen(product.id)}>
      <div className="lq-card-visual">
        {product.prime && <span className="lq-prime-badge">Livraison rapide</span>}
        {hasImage ? (
          <img
            src={product.images![0]}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Icon name={product.icon} size={44} />
        )}
      </div>
      <div className="lq-card-cat">{product.category}</div>
      <div className="lq-card-name lq-display">{product.name}</div>
      <div className="lq-rating">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} size={12} fill={i <= Math.round(product.rating) ? "#ffa41c" : "none"} color="#ffa41c" />
        ))}
        <span className="count">{product.reviews.toLocaleString("fr-FR")}</span>
      </div>
      <div className="lq-card-tagline">{product.tagline}</div>
      <div className="lq-card-footer">
        <span className="lq-price">{fmt(product.price)}</span>
      </div>
      {addToCart && (
        <button
          className="lq-btn lq-btn-primary lq-card-cta"
          onClick={(e) => { e.stopPropagation(); addToCart(product.id, 1); }}
        >
          <ShoppingCart size={14} /> Ajouter au panier
        </button>
      )}
    </div>
  );
}