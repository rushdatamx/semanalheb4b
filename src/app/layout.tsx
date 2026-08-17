import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reporte Sell-Out — 4BUDDIES x HEB",
  description: "Reporte quincenal de venta sell-out YTD 2026 vs 2025 · corte 15 ago 2026",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className="bg-orange-950 text-white antialiased">{children}</body>
    </html>
  );
}
