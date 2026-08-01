"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingCart, TrendingUp, Users, Plus, Trash2, Upload,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
} from "recharts";
import { Icon } from "@/components/Icon";
import { CATEGORIES } from "@/lib/constants";
import { fmt } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  icon: string;
  images: string[];
};

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  product: { name: string; category: string };
};

type Order = {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  user: { name: string | null; email: string };
  items: OrderItem[];
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En traitement",
  PAID: "Payée",
  SHIPPED: "Expédiée",
  CANCELLED: "Annulée",
};

const STATUS_CLASS: Record<string, string> = {
  PENDING: "proc",
  PAID: "proc",
  SHIPPED: "ship",
  CANCELLED: "done",
};

const STATUS_CYCLE = ["PENDING", "PAID", "SHIPPED"];

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [tab, setTab] = useState<"overview" | "products" | "orders">("overview");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [newP, setNewP] = useState({
    name: "", description: "", category: CATEGORIES[0], price: "", stock: "", icon: "Package",
    imageUrl: "",
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user as any)?.role !== "ADMIN") {
      router.push("/login");
    }
  }, [session, status, router]);

  const loadData = async () => {
    setLoading(true);
    const [productsRes, ordersRes] = await Promise.all([
      fetch("/api/products"),
      fetch("/api/orders"),
    ]);
    setProducts(await productsRes.json());
    setOrders(await ordersRes.json());
    setLoading(false);
  };

  useEffect(() => {
    if (session && (session.user as any)?.role === "ADMIN") {
      loadData();
    }
  }, [session]);

  if (status === "loading" || !session || (session.user as any)?.role !== "ADMIN") {
    return (
      <div className="lq-container" style={{ padding: "40px 24px 90px" }}>
        <div className="lq-glass lq-empty">Vérification des accès…</div>
      </div>
    );
  }

  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const chartData = CATEGORIES.map((c) => ({
    name: c.split(" ")[0],
    ventes: orders.reduce(
      (s, o) =>
        s +
        o.items
          .filter((i) => i.product.category === c)
          .reduce((s2, i) => s2 + i.quantity, 0),
      0
    ),
  })).filter((d) => d.ventes > 0);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setNewP((p) => ({ ...p, imageUrl: data.url }));
      } else {
        alert("Erreur lors de l'upload : " + data.error);
      }
    } catch (err) {
      alert("Erreur lors de l'upload de l'image");
    } finally {
      setUploading(false);
    }
  };

  const addProduct = async () => {
    if (!newP.name || !newP.price) return;
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newP.name,
        description: newP.description || "Nouveau produit ajouté par l'admin",
        category: newP.category,
        price: newP.price,
        stock: newP.stock || 0,
        icon: newP.icon,
        images: newP.imageUrl ? [newP.imageUrl] : [],
      }),
    });
    if (res.ok) {
      setNewP({ name: "", description: "", category: CATEGORIES[0], price: "", stock: "", icon: "Package", imageUrl: "" });
      if (fileInputRef.current) fileInputRef.current.value = "";
      loadData();
    }
  };

  const removeProduct = async (id: string) => {
    if (!confirm("Supprimer ce produit ?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    loadData();
  };

  const updateStock = async (id: string, stock: number) => {
    const safeStock = Math.max(0, stock);
    setProducts((ps) => ps.map((p) => (p.id === id ? { ...p, stock: safeStock } : p)));
    await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: safeStock }),
    });
  };

  const cycleStatus = async (order: Order) => {
    const currentIndex = STATUS_CYCLE.indexOf(order.status);
    const nextStatus = STATUS_CYCLE[(currentIndex + 1) % STATUS_CYCLE.length];
    setOrders((os) => os.map((o) => (o.id === order.id ? { ...o, status: nextStatus } : o)));
    await fetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
  };

  if (loading) {
    return (
      <div className="lq-container" style={{ padding: "40px 24px 90px" }}>
        <div className="lq-glass lq-empty">Chargement du dashboard…</div>
      </div>
    );
  }

  return (
    <div className="lq-container" style={{ padding: "20px 24px 90px" }}>
      <h2 className="lq-display" style={{ marginBottom: 4 }}>Tableau de bord admin</h2>
      <p style={{ color: "var(--text-muted)", fontSize: 13.5, marginBottom: 22 }}>
        Gère les produits, le stock et les commandes de la boutique.
      </p>

      <div className="lq-tab-row">
        {[
          { id: "overview" as const, label: "Vue d'ensemble", icon: LayoutDashboard },
          { id: "products" as const, label: "Produits", icon: Package },
          { id: "orders" as const, label: "Commandes", icon: ShoppingCart },
        ].map((t) => (
          <button key={t.id} className={`lq-tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
            <t.icon size={13} style={{ marginRight: 6, verticalAlign: -2 }} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
            <div className="lq-glass lq-stat-card">
              <span className="label"><TrendingUp size={14} /> Revenu total</span>
              <span className="value">{fmt(revenue)}</span>
            </div>
            <div className="lq-glass lq-stat-card">
              <span className="label"><ShoppingCart size={14} /> Commandes</span>
              <span className="value">{orders.length}</span>
            </div>
            <div className="lq-glass lq-stat-card">
              <span className="label"><Package size={14} /> Produits actifs</span>
              <span className="value">{products.length}</span>
            </div>
            <div className="lq-glass lq-stat-card">
              <span className="label"><Users size={14} /> Clients</span>
              <span className="value">{new Set(orders.map((o) => o.user.email)).size || 0}</span>
            </div>
          </div>
          <div className="lq-glass" style={{ padding: 22, height: 300 }}>
            <div className="lq-display" style={{ fontSize: 15, marginBottom: 14 }}>Articles vendus par catégorie</div>
            {chartData.length === 0 ? (
              <div style={{ color: "var(--text-faint)", fontSize: 13.5, paddingTop: 40, textAlign: "center" }}>
                Passe une commande côté boutique pour voir apparaître des données ici.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="name" stroke="#8992a9" fontSize={12} />
                  <YAxis stroke="#8992a9" fontSize={12} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "#0b1020", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 10, fontSize: 12.5 }} />
                  <Bar dataKey="ventes" fill="#52d6f2" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </>
      )}

      {tab === "products" && (
        <>
          <div className="lq-glass" style={{ padding: 20, marginBottom: 22 }}>
            <div className="lq-display" style={{ fontSize: 15, marginBottom: 12 }}>Ajouter un produit</div>
            <div className="lq-form-grid" style={{ gridTemplateColumns: "2fr 1.4fr 1fr 1fr", marginBottom: 14 }}>
              <input
                className="lq-input"
                placeholder="Nom du produit"
                value={newP.name}
                onChange={(e) => setNewP({ ...newP, name: e.target.value })}
              />
              <select
                className="lq-select"
                value={newP.category}
                onChange={(e) => setNewP({ ...newP, category: e.target.value })}
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <input
                className="lq-input"
                placeholder="Prix €"
                type="number"
                value={newP.price}
                onChange={(e) => setNewP({ ...newP, price: e.target.value })}
              />
              <input
                className="lq-input"
                placeholder="Stock"
                type="number"
                value={newP.stock}
                onChange={(e) => setNewP({ ...newP, stock: e.target.value })}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: "none" }}
                id="product-image-input"
              />
              <label
                htmlFor="product-image-input"
                className="lq-btn lq-btn-ghost"
                style={{ cursor: "pointer" }}
              >
                <Upload size={15} /> {uploading ? "Envoi en cours…" : "Choisir une image"}
              </label>
              {newP.imageUrl && (
                <img
                  src={newP.imageUrl}
                  alt="Aperçu"
                  style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 8, border: "1px solid rgba(255,255,255,0.14)" }}
                />
              )}
            </div>

            <button className="lq-btn lq-btn-primary" onClick={addProduct} disabled={uploading}>
              <Plus size={15} /> Ajouter le produit
            </button>
          </div>
          <div className="lq-glass lq-table-wrap" style={{ padding: 8 }}>
            <table className="lq-admin-table">
              <thead>
                <tr><th>Produit</th><th>Catégorie</th><th>Prix</th><th>Stock</th><th></th></tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {p.images && p.images.length > 0 ? (
                        <img src={p.images[0]} alt={p.name} style={{ width: 28, height: 28, objectFit: "cover", borderRadius: 6 }} />
                      ) : (
                        <Icon name={p.icon} size={18} />
                      )}
                      {p.name}
                    </td>
                    <td>{p.category}</td>
                    <td>{fmt(p.price)}</td>
                    <td>
                      <input
                        className="lq-input lq-mono"
                        type="number"
                        value={p.stock}
                        style={{ width: 70, padding: "6px 10px" }}
                        onChange={(e) => updateStock(p.id, Number(e.target.value))}
                      />
                    </td>
                    <td>
                      <button className="lq-icon-btn" onClick={() => removeProduct(p.id)}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "orders" && (
        <div className="lq-glass lq-table-wrap" style={{ padding: 8 }}>
          <table className="lq-admin-table">
            <thead>
              <tr><th>Commande</th><th>Client</th><th>Date</th><th>Articles</th><th>Total</th><th>Statut</th></tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 30, color: "var(--text-faint)" }}>
                    Aucune commande enregistrée.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id}>
                    <td className="lq-mono">#{o.id.slice(0, 8).toUpperCase()}</td>
                    <td>{o.user.name || o.user.email}</td>
                    <td>{new Date(o.createdAt).toLocaleDateString("fr-FR")}</td>
                    <td>{o.items.reduce((s, i) => s + i.quantity, 0)}</td>
                    <td>{fmt(o.total)}</td>
                    <td>
                      <button
                        className={`lq-status-pill ${STATUS_CLASS[o.status]}`}
                        style={{ border: "none", cursor: "pointer" }}
                        onClick={() => cycleStatus(o)}
                      >
                        {STATUS_LABELS[o.status]}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}