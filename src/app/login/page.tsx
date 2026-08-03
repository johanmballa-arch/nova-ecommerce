"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { LogIn } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";
  const justVerified = searchParams.get("verified") === "true";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (res?.error) {
      if (res.error.includes("EMAIL_NOT_VERIFIED")) {
        router.push(`/verify?email=${encodeURIComponent(form.email)}`);
        return;
      }
      setError("E-mail ou mot de passe incorrect");
      setLoading(false);
      return;
    }

    router.push("/account");
    router.refresh();
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
            <LogIn size={26} color="#060812" />
          </div>
          <h2 className="lq-display">Connexion</h2>
        </div>

        {justRegistered && (
          <div style={{ background: "rgba(126,224,160,0.12)", color: "#7ee0a0", padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
            Compte créé avec succès ! Connecte-toi.
          </div>
        )}
        {justVerified && (
          <div style={{ background: "rgba(126,224,160,0.12)", color: "#7ee0a0", padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
            E-mail vérifié avec succès ! Connecte-toi.
          </div>
        )}

        {error && (
          <div style={{ background: "rgba(255,80,80,0.12)", color: "#ff8080", padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <div className="lq-field" style={{ marginBottom: 14 }}>
          <label>E-mail</label>
          <input className="lq-input" type="email" value={form.email} onChange={set("email")} placeholder="awa@mail.com" required />
        </div>
        <div className="lq-field" style={{ marginBottom: 20 }}>
          <label>Mot de passe</label>
          <input className="lq-input" type="password" value={form.password} onChange={set("password")} placeholder="••••••••" required />
        </div>

        <button className="lq-btn lq-btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
          {loading ? "Connexion…" : "Se connecter"}
        </button>

        <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)", marginTop: 16 }}>
          Pas encore de compte ?{" "}
          <a href="/signup" style={{ color: "var(--accent-cyan)" }}>Créer un compte</a>
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}