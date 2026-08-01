"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Search, ShoppingCart, MapPin, User, ShieldCheck, LogOut } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { useCart } from "@/store/cart";
import { useState } from "react";

export function Header() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items } = useCart();
  const cartCount = items.reduce((s, i) => s + i.qty, 0);
  const [category, setCategory] = useState("Toutes");
  const [search, setSearch] = useState("");

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  const goToCatalog = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (category !== "Toutes") params.set("category", category);
    if (search) params.set("q", search);
    router.push(`/catalog?${params.toString()}`);
  };

  return (
    <div className="lq-header">
      <div className="lq-topbar">
        <div className="lq-topbar-inner">
          <Link href="/" className="lq-logo">
            <span className="lq-logo-mark" />
            NOVA
          </Link>

          <Link href="/account" className="lq-deliver">
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <MapPin size={13} /> Livrer à
            </span>
            <strong>Yaoundé, CM</strong>
          </Link>

          <form className="lq-searchbar" onSubmit={goToCatalog}>
            <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Catégorie">
              <option value="Toutes">Toutes catégories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input
              placeholder="Rechercher sur NOVA…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" aria-label="Rechercher"><Search size={18} /></button>
          </form>

          <div className="lq-topbar-right">
            {session ? (
              <>
                <Link href="/account" className="lq-nav-link">
                  {session.user?.name || session.user?.email}
                  <small>Compte &amp; commandes</small>
                </Link>
                {isAdmin && (
                  <Link href="/admin" className="lq-nav-link">
                    <ShieldCheck size={13} style={{ marginRight: 4, verticalAlign: -2 }} />
                    Admin
                  </Link>
                )}
                <button
                  className="lq-icon-btn"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  aria-label="Déconnexion"
                  title="Se déconnecter"
                >
                  <LogOut size={17} />
                </button>
              </>
            ) : (
              <Link href="/login" className="lq-nav-link">
                Connexion<small>ou créer un compte</small>
              </Link>
            )}
            <Link href="/cart" className="lq-icon-btn" aria-label="Panier">
              <ShoppingCart size={17} />
              {cartCount > 0 && <span className="lq-badge">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </div>

      <div className="lq-catstrip">
        <div className="lq-catstrip-inner">
          <Link href="/">Accueil</Link>
          <Link href="/catalog">Tout le catalogue</Link>
          {CATEGORIES.map((c) => (
            <Link key={c} href={`/catalog?category=${encodeURIComponent(c)}`}>
              {c}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}