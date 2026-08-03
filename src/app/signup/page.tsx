"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de l'inscription");
        setLoading(false);
        return;
      }

      router.push(`/verify?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      setError("Une erreur est survenue");
      setLoading(false);
    }
  };

  return (
    <div className="lq-container" style={{ padding: "60px 24px 100px", display: "flex", justifyContent: "center" }}>
      <form onSubmit={submit} className="lq-glass" style={{ padding: 32, maxWidth: 420, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div
            style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px",
            }}
          >
            <UserPlus size={26} color="#060812" />
          </div>
          <h2 className="lq-display">Créer un compte</h2>
        </div>

        {error && (
          <div style={{ background: "rgba(255,80,80,0.12)", color: "#ff8080", padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <div className="lq-field" style={{ marginBottom: 14 }}>
          <label>Nom complet</label>
          <input className="lq-input" value={form.name} onChange={set("name")} placeholder="Awa Ngo" required />
        </div>
        <div className="lq-field" style={{ marginBottom: 14 }}>
          <label>E-mail</label>
          <input className="lq-input" type="email" value={form.email} onChange={set("email")} placeholder="awa@mail.com" required />
        </div>
        <div className="lq-field" style={{ marginBottom: 20 }}>
          <label>Mot de passe</label>
          <input className="lq-input" type="password" value={form.password} onChange={set("password")} placeholder="Au moins 6 caractères" required />
        </div>

        <button className="lq-btn lq-btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
          {loading ? "Création…" : "Créer mon compte"}
        </button>

        <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)", marginTop: 16 }}>
          Déjà un compte ?{" "}
          <a href="/login" style={{ color: "var(--accent-cyan)" }}>Se connecter</a>
        </p>
      </form>
    </div>
  );
}