import { ShieldCheck, Truck, RotateCcw, Lock } from "lucide-react";

const badges = [
  { icon: Lock, label: "Paiement 100% sécurisé", sub: "Chiffrement Stripe" },
  { icon: Truck, label: "Livraison rapide", sub: "2 à 4 jours ouvrés" },
  { icon: ShieldCheck, label: "Garantie 2 ans", sub: "Sur tous les produits" },
  { icon: RotateCcw, label: "Retours faciles", sub: "14 jours pour changer d'avis" },
];

export function TrustBadges() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 14,
      }}
    >
      {badges.map((b) => (
        <div
          key={b.label}
          className="lq-glass"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 16px",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              flex: "0 0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(82,214,242,0.12)",
              color: "var(--accent-cyan)",
            }}
          >
            <b.icon size={17} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{b.label}</div>
            <div style={{ fontSize: 11.5, color: "var(--text-faint)" }}>{b.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}