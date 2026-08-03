"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"request" | "reset">("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");

  const requestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);

    if (res.ok) {
      setInfo("Si un compte existe avec cet e-mail, un code vient d'être envoyé.");
      setStep("reset");
    } else {
      setError("Une erreur est survenue. Réessaie.");
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, newPassword }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Erreur lors de la réinitialisation");
      return;
    }

    router.push("/login?reset=true");
  };

  return (
    <div className="lq-container" style={{ padding: "60px 24px 100px", display: "flex", justifyContent: "center" }}>
      <div className="lq-glass" style={{ padding: 32, maxWidth: 420, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div
            style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px",
            }}
          >
            <KeyRound size={26} color="#060812" />
          </div>
          <h2 className="lq-display">Mot de passe oublié</h2>
          <p style={{ color: "var(--text-muted)", fontSize: 13.5, marginTop: 8 }}>
            {step === "request"
              ? "Entre ton e-mail pour recevoir un code de réinitialisation."
              : "Entre le code reçu par e-mail et choisis un nouveau mot de passe."}
          </p>
        </div>

        {error && (
          <div style={{ background: "rgba(255,80,80,0.12)", color: "#ff8080", padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
            {error}
          </div>
        )}
        {info && step === "reset" && (
          <div style={{ background: "rgba(126,224,160,0.12)", color: "#7ee0a0", padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
            {info}
          </div>
        )}

        {step === "request" ? (
          <form onSubmit={requestCode}>
            <div className="lq-field" style={{ marginBottom: 20 }}>
              <label>E-mail</label>
              <input
                className="lq-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="awa@mail.com"
                required
              />
            </div>
            <button className="lq-btn lq-btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
              {loading ? "Envoi…" : "Recevoir le code"}
            </button>
          </form>
        ) : (
          <form onSubmit={resetPassword}>
            <div className="lq-field" style={{ marginBottom: 14 }}>
              <label>Code reçu par e-mail</label>
              <input
                className="lq-input"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                maxLength={6}
                style={{ textAlign: "center", fontSize: 20, letterSpacing: 6, fontFamily: "monospace" }}
                required
              />
            </div>
            <div className="lq-field" style={{ marginBottom: 20 }}>
              <label>Nouveau mot de passe</label>
              <input
                className="lq-input"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Au moins 6 caractères"
                required
              />
            </div>
            <button className="lq-btn lq-btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
              {loading ? "Réinitialisation…" : "Réinitialiser mon mot de passe"}
            </button>
            <button
              type="button"
              onClick={() => setStep("request")}
              style={{ background: "none", border: "none", color: "var(--accent-cyan)", fontSize: 13, marginTop: 14, width: "100%", cursor: "pointer" }}
            >
              Renvoyer le code
            </button>
          </form>
        )}

        <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)", marginTop: 18 }}>
          <a href="/login" style={{ color: "var(--accent-cyan)" }}>Retour à la connexion</a>
        </p>
      </div>
    </div>
  );
}