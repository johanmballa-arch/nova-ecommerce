import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendVerificationEmail(email: string, code: string) {
  await transporter.sendMail({
    from: `"NOVA" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Vérifie ton adresse e-mail — NOVA",
    html: `
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
  });
}