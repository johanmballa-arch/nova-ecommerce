"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import { fmt } from "@/lib/utils";

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  product: { name: string };
};

type Order = {
  id: string;
  total: number;
  status: string;
  createdAt: string;
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

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }

    fetch(`/api/orders/by-email?email=${encodeURIComponent(session.user!.email!)}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      });
  }, [session, status, router]);

  if (status === "loading" || !session) {
    return (
      <div className="lq-container" style={{ padding: "40px 24px 90px" }}>
        <div className="lq-glass lq-empty">Chargement…</div>
      </div>
    );
  }

  return (
    <div className="lq-container" style={{ padding: "20px 24px 90px" }}>
      <h2 className="lq-display" style={{ marginBottom: 22 }}>Mon compte</h2>
      <div className="lq-detail-grid" style={{ gridTemplateColumns: "0.8fr 1.2fr", alignItems: "start" }}>
        <div className="lq-glass" style={{ padding: 24, textAlign: "center" }}>
          <div
            style={{
              width: 70, height: 70, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px",
            }}
          >
            <User size={30} color="#060812" />
          </div>
          <div style={{ fontWeight: 700, fontSize: 17 }}>{session.user?.name}</div>
          <div style={{ color: "var(--text-muted)", fontSize: 13.5, marginBottom: 16 }}>{session.user?.email}</div>
          <button className="lq-btn lq-btn-ghost" style={{ width: "100%", justifyContent: "center" }} onClick={() => router.push("/catalog")}>
            Continuer mes achats
          </button>
        </div>
        <div>
          <div className="lq-display" style={{ fontSize: 16, marginBottom: 12 }}>Historique des commandes</div>
          {loading ? (
            <div className="lq-glass lq-empty">Chargement des commandes…</div>
          ) : orders.length === 0 ? (
            <div className="lq-glass lq-empty">Aucune commande pour l'instant.</div>
          ) : (
            orders.map((o) => (
              <div key={o.id} className="lq-glass" style={{ padding: 18, marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span className="lq-mono" style={{ fontSize: 13 }}>#{o.id.slice(0, 8).toUpperCase()}</span>
                  <span className={`lq-status-pill ${STATUS_CLASS[o.status]}`}>{STATUS_LABELS[o.status]}</span>
                </div>
                <div style={{ fontSize: 12.5, color: "var(--text-faint)", marginBottom: 8 }}>
                  {new Date(o.createdAt).toLocaleDateString("fr-FR")} · {o.items.length} article{o.items.length > 1 ? "s" : ""}
                </div>
                <div style={{ fontWeight: 700 }}>{fmt(o.total)}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}