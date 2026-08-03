"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { CATEGORIES } from "@/lib/constants";
import { useCart } from "@/store/cart";

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
};

const PRICE_BANDS = [
  { label: "Tous les prix", min: 0, max: Infinity },
  { label: "Moins de 100 €", min: 0, max: 100 },
  { label: "100 € – 500 €", min: 100, max: 500 },
  { label: "500 € – 1 000 €", min: 500, max: 1000 },
  { label: "Plus de 1 000 €", min: 1000, max: Infinity },
];

export function CatalogClient({
  products,
  initialCategory,
  initialQuery,
}: {
  products: Product[];
  initialCategory: string;
  initialQuery: string;
}) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [category, setCategory] = useState(initialCategory);
  const [q, setQ] = useState(initialQuery);
  const [sort, setSort] = useState("relevance");
  const [band, setBand] = useState(PRICE_BANDS[0]);

  const filtered = useMemo(() => {
    let list = products.filter(
      (p) =>
        (category === "Toutes" || p.category === category) &&
        p.price >= band.min &&
        p.price <= band.max &&
        p.name.toLowerCase().includes(q.toLowerCase())
    );
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [products, category, band, q, sort]);

  const openProduct = (id: string) => router.push(`/product/${id}`);

  return (
    <div className="lq-container" style={{ padding: "20px 24px 70px" }}>
      <div className="lq-breadcrumb">
        <button onClick={() => setCategory("Toutes")}>Catalogue</button>
        {category !== "Toutes" && (
          <>
            <span>›</span>
            <span className="current">{category}</span>
          </>
        )}
      </div>

      <div className="lq-section-title">
  <h2 className="lq-display">{category === "Toutes" ? "Tous les résultats" : category}</h2>
</div>

      <div className="lq-glass lq-filters">
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 200 }}>
          <Search size={15} color="var(--text-faint)" />
          <input
            className="lq-input"
            style={{ border: "none", background: "none", flex: 1 }}
            placeholder="Rechercher un produit…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <select className="lq-select" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="relevance">Pertinence</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
          <option value="rating">Mieux notés</option>
        </select>
      </div>

      <div className="lq-catalog-layout">
        <aside className="lq-glass lq-sidebar">
          <div className="group">
            <h4>Catégorie</h4>
            <button
              className={`lq-filter-cat ${category === "Toutes" ? "active" : ""}`}
              onClick={() => setCategory("Toutes")}
            >
              Toutes les catégories
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`lq-filter-cat ${category === c ? "active" : ""}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="group">
            <h4>Prix</h4>
            <div className="lq-price-chip-row">
              {PRICE_BANDS.map((b) => (
                <button
                  key={b.label}
                  className={`lq-price-chip ${band.label === b.label ? "active" : ""}`}
                  onClick={() => setBand(b)}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {filtered.length === 0 ? (
          <div className="lq-glass lq-empty">
            <p>Aucun produit ne correspond à ta recherche.</p>
          </div>
        ) : (
          <div className="lq-grid">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} onOpen={openProduct} addToCart={addToCart} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}