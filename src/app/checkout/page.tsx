"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard } from "lucide-react";
import { fmt } from "@/lib/utils";
import { useCart } from "@/store/cart";

type Product = {
  id: string;
  name: string;
  price: number;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", address: "", city: "", zip: "",
  });

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  const cartItems = items
    .map((c) => ({ ...c, product: products.find((p) => p.id === c.id) }))
    .filter((i) => i.product);

  const subtotal = cartItems.reduce((s, i) => s + i.product!.price * i.qty, 0);
  const shipping = subtotal > 0 && subtotal < 500 ? 9.9 : 0;
  const total = subtotal + shipping;

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const requiredFilled = form.name && form.email && form.address && form.city && form.zip;

  const submit = async () => {
    if (!requiredFilled || submitting) return;
    setSubmitting(true);

    try {
      // 1. Créer la commande en base (statut PENDING)
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map((i) => ({
            productId: i.product!.id,
            qty: i.qty,
            price: i.product!.price,
          })),
          total,
          customerName: form.name,
          customerEmail: form.email,
        }),
      });

      if (!orderRes.ok) throw new Error("Erreur lors de la création de la commande");
      const order = await orderRes.json();

      // 2. Créer la session de paiement Stripe
      const stripeRes = await fetch("/api/checkout/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map((i) => ({
            name: i.product!.name,
            price: i.product!.price,
            qty: i.qty,
          })),
          customerEmail: form.email,
          orderId: order.id,
        }),
      });

      if (!stripeRes.ok) throw new Error("Erreur lors de la création du paiement");
      const { url } = await stripeRes.json();

      // 3. Rediriger vers la page de paiement Stripe
      window.location.href = url;
    } catch (err) {
      console.error(err);
      alert("Une erreur est survenue. Réessaie.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="lq-container" style={{ padding: "40px 24px 90px" }}>
        <div className="lq-glass lq-empty">Chargement…</div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="lq-container" style={{ padding: "40px 24px 90px" }}>
        <div className="lq-glass lq-empty">
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
      <h2 className="lq-display" style={{ marginBottom: 22 }}>Finaliser la commande</h2>
      <div className="lq-detail-grid" style={{ gridTemplateColumns: "1.5fr 1fr", alignItems: "start" }}>
        <div className="lq-glass" style={{ padding: 24 }}>
          <div className="lq-display" style={{ fontSize: 16, marginBottom: 14 }}>Livraison</div>
          <div className="lq-form-grid">
            <div className="lq-field">
              <label>Nom complet</label>
              <input className="lq-input" value={form.name} onChange={set("name")} placeholder="Awa Ngo" />
            </div>
            <div className="lq-field">
              <label>E-mail</label>
              <input className="lq-input" value={form.email} onChange={set("email")} placeholder="awa@mail.com" />
            </div>
            <div className="lq-field" style={{ gridColumn: "1 / -1" }}>
              <label>Adresse</label>
              <input className="lq-input" value={form.address} onChange={set("address")} placeholder="Rue, quartier" />
            </div>
            <div className="lq-field">
              <label>Ville</label>
              <input className="lq-input" value={form.city} onChange={set("city")} placeholder="Yaoundé" />
            </div>
            <div className="lq-field">
              <label>Code postal</label>
              <input className="lq-input" value={form.zip} onChange={set("zip")} placeholder="00237" />
            </div>
          </div>

          <div
            className="lq-display"
            style={{ fontSize: 16, margin: "26px 0 8px", display: "flex", alignItems: "center", gap: 8 }}
          >
            <CreditCard size={17} /> Paiement sécurisé par carte
          </div>
          <p style={{ fontSize: 12.5, color: "var(--text-faint)" }}>
            Tu seras redirigé vers une page de paiement sécurisée Stripe. Aucune donnée bancaire n'est stockée sur nos serveurs.
          </p>
        </div>

        <div className="lq-glass" style={{ padding: 22 }}>
          <div className="lq-display" style={{ fontSize: 16, marginBottom: 10 }}>Ta commande</div>
          {cartItems.map((i) => (
            <div key={i.id} className="lq-summary-row">
              <span>{i.product!.name} × {i.qty}</span>
              <span>{fmt(i.product!.price * i.qty)}</span>
            </div>
          ))}
          <div className="lq-summary-row">
            <span>Livraison</span>
            <span>{shipping === 0 ? "Offerte" : fmt(shipping)}</span>
          </div>
          <div className="lq-summary-row total">
            <span>Total</span>
            <span>{fmt(total)}</span>
          </div>
          <button
            className="lq-btn lq-btn-primary"
            disabled={!requiredFilled || submitting}
            style={{ width: "100%", justifyContent: "center", marginTop: 18 }}
            onClick={submit}
          >
            {submitting ? "Redirection vers le paiement…" : "Procéder au paiement"}
          </button>
        </div>
      </div>
    </div>
  );
}