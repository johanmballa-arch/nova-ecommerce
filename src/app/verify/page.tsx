"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { MailCheck } from "lucide-react";

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const password = searchParams.get("pw") || ""; // utilisé uniquement pour l'auto-connexion juste après inscription

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Erreur lors de la vérification");
      setLoading(false);
      return;
    }

    // Compte créé avec succès : on tente une connexion automatique si on a le mot de passe
    if (password) {
      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!signInRes?.error) {
        router.push("/");
        router.refresh();
        return;
      }
    }

    // Sinon (mot de passe non disponible), on renvoie vers la connexion classique
    router.push("/login?verified=true");
  };

  const resendCode = async () => {
    setResending(true);
    setError("");
    const res = await fetch("/api/auth/resend-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setResent(true);
      setTimeout(() => setResent(false), 4000);
    }
    setResending(false);
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
            <MailCheck size={26} color="#060812" />
          </div>
          <h2 className="lq-display">Confirme ton inscription</h2>
          <p style={{ color: "var(--text-muted)", fontSize: 13.5, marginTop: 8 }}>
            Un code à 6 chiffres a été envoyé à <strong style={{ color: "var(--text-primary)" }}>{email}</strong>.
            Ton compte sera créé une fois ce code validé.
          </p>
        </div>

        {error && (
          <div style={{ background: "rgba(255,80,80,0.12)", color: "#ff8080", padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
            {error}
          </div>
        )}
        {resent && (
          <div style={{ background: "rgba(126,224,160,0.12)", color: "#7ee0a0", padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
            Nouveau code envoyé !
          </div>
        )}

        <div className="lq-field" style={{ marginBottom: 20 }}>
          <label>Code de vérification</label>
          <input
            className="lq-input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="123456"
            maxLength={6}
            style={{ textAlign: "center", fontSize: 22, letterSpacing: 8, fontFamily: "monospace" }}
            required
          />
        </div>

        <button className="lq-btn lq-btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
          {loading ? "Validation…" : "Valider et créer mon compte"}
        </button>

        <button
          type="button"
          onClick={resendCode}
          disabled={resending}
          style={{ background: "none", border: "none", color: "var(--accent-cyan)", fontSize: 13, marginTop: 16, width: "100%", cursor: "pointer" }}
        >
          {resending ? "Envoi…" : "Renvoyer le code"}
        </button>
      </form>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyForm />
    </Suspense>
  );
}