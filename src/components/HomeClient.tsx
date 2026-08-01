"use client";

import { TrustBadges } from "./TrustBadges";
import { useRouter } from "next/navigation";
import { ChevronRight, Zap } from "lucide-react";
import { Icon } from "./Icon";
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

export function HomeClient({ products }: { products: Product[] }) {
  const router = useRouter();
  const { addToCart } = useCart();

  const featured = products.slice(0, 4);
  const deals = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);

  const orbLayout = [
    { icon: "Headphones", top: "10%", left: "8%", size: 74, delay: "0s" },
    { icon: "Watch", top: "58%", left: "4%", size: 58, delay: "0.6s" },
    { icon: "Smartphone", top: "6%", left: "62%", size: 66, delay: "0.3s" },
    { icon: "Camera", top: "62%", left: "68%", size: 70, delay: "0.9s" },
    { icon: "Speaker", top: "36%", left: "40%", size: 90, delay: "0s" },
  ];

  const openProduct = (id: string) => router.push(`/product/${id}`);
  const goToCatalogWithCategory = (c: string) => router.push(`/catalog?category=${encodeURIComponent(c)}`);

  return (
    <>
      <section className="lq-hero lq-container">
        <div className="lq-hero-grid">
          <div>
            <span className="lq-eyebrow">Nouvelle collection tech</span>
            <h1 className="lq-display">La tech, sculptée<br />dans le verre liquide.</h1>
            <p className="lead">Casques, smartphones, ordinateurs et objets connectés — livraison rapide, avis vérifiés, prix nets, enveloppés dans une identité visuelle fluide et translucide.</p>
            <div style={{ display: "flex", gap: 14 }}>
              <button className="lq-btn lq-btn-primary" onClick={() => router.push("/catalog")}>
                Explorer le catalogue <ChevronRight size={16} />
              </button>
              <button className="lq-btn lq-btn-ghost" onClick={() => router.push("/catalog")}>
                Nos meilleures ventes
              </button>
            </div>
          </div>
          <div className="lq-glass lq-hero-panel">
            <div className="lq-shine" />
            {orbLayout.map((o, i) => (
              <div
                key={i}
                className="lq-orb lq-float"
                style={{ top: o.top, left: o.left, width: o.size, height: o.size, animationDelay: o.delay }}
              >
                <Icon name={o.icon} size={o.size * 0.42} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lq-container" style={{ marginBottom: 20 }}>
  <TrustBadges />
</section>

      <section className="lq-container" style={{ margin: "10px 0 30px" }}>
        <div className="lq-cat-row">
          {CATEGORIES.map((c) => (
            <div key={c} className="lq-glass lq-cat-pill" onClick={() => goToCatalogWithCategory(c)}>
              <span className="lq-cat-icon">
                <Icon name={(products.find((p) => p.category === c) || { icon: "Package" }).icon} size={20} />
              </span>
              <span>{c}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="lq-container" style={{ marginBottom: 30 }}>
        <div className="lq-glass lq-deals">
          <span className="tag"><Zap size={13} /> Offres du jour</span>
          <span style={{ color: "var(--text-muted)", fontSize: 13 }}>Sélection mise à jour en continu, dans la limite des stocks disponibles.</span>
        </div>
        <div className="lq-grid">
          {deals.map((p) => <ProductCard key={p.id} product={p} onOpen={openProduct} addToCart={addToCart} />)}
        </div>
      </section>

      <section className="lq-container" style={{ marginBottom: 70 }}>
        <div className="lq-section-title">
          <h2 className="lq-display">Sélection du moment</h2>
          <button className="lq-link" onClick={() => router.push("/catalog")}>Tout voir <ChevronRight size={15} /></button>
        </div>
        <div className="lq-grid">
          {featured.map((p) => <ProductCard key={p.id} product={p} onOpen={openProduct} addToCart={addToCart} />)}
        </div>
      </section>
    </>
  );
}