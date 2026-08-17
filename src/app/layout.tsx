import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Degustación HEB — 4BUDDIES",
  description: "Resultados de la degustación en HEB, 27 jul – 9 ago 2026",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-[#FAF7F2] text-stone-900 antialiased">{children}</body>
    </html>
  );
}
