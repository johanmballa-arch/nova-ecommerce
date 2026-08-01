import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "NOVA — Boutique électronique",
  description: "La tech, sculptée dans le verre liquide.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          <div className="lq-app">
            <div className="lq-bg" />
            <div className="lq-blob b1" />
            <div className="lq-blob b2" />
            <div className="lq-blob b3" />
            <Header />
            {children}
            <div className="lq-footer">
              NOVA — identité "liquid glass" · boutique en ligne.
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}