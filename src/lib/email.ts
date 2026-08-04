export async function sendVerificationEmail(email: string, code: string) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY!,
    },
    body: JSON.stringify({
      sender: {
        name: "NOVA",
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: [{ email }],
      subject: "Vérifie ton adresse e-mail — NOVA",
      htmlContent: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #1a1a1a;">Bienvenue sur NOVA 👋</h2>
          <p style="color: #444; font-size: 15px; line-height: 1.6;">
            Utilise le code ci-dessous pour vérifier ton adresse e-mail :
          </p>
          <div style="background: #f4f4f5; border-radius: 10px; padding: 20px; text-align: center; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #1a1a1a;">${code}</span>
          </div>
          <p style="color: #888; font-size: 13px;">
            Ce code expire dans 15 minutes. Si tu n'es pas à l'origine de cette demande, ignore cet e-mail.
          </p>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error("Erreur Brevo:", res.status, errorBody);
    throw new Error("Échec de l'envoi de l'e-mail de vérification");
  }
}