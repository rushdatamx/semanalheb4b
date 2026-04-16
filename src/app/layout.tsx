import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Salud del Negocio — 4BUDDIES x HEB",
  description: "Vista estrategica YTD 2026 vs 2025",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-orange-950 text-white antialiased">{children}</body>
    </html>
  );
}
