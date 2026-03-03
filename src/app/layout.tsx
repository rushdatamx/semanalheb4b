import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reporte Semanal — 4BUDDIES en HEB",
  description: "Presentación semanal de sell-out, inventario y órdenes de compra",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-950 text-white antialiased">{children}</body>
    </html>
  );
}
