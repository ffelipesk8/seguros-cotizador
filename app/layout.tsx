import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Seguros Hafe | Cotiza tu seguro en linea",
  description:
    "Comparador de seguros con asesor humano. Recibe tres ofertas reales de aseguradoras vigiladas por la Superintendencia Financiera y elige la que mejor te queda.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={bodyFont.variable}>{children}</body>
    </html>
  );
}
