"use client";

import Image from "next/image";
import { ShoppingCart, AlertTriangle, TrendingUp } from "lucide-react";

const secciones = [
  {
    icon: ShoppingCart,
    titulo: "Restock Urgente",
    subtitulo: "78 combinaciones tienda-producto",
    color: "red",
    items: [
      "MTY Tec: Classic White 125g (1 dia de inv)",
      "TOR Senderos: Chicharron Natural (1 dia)",
      "MTY San Pedro: Rodajitas (2 dias)",
      "MTY Contry: Cheddar Jalapeno 125g (2 dias)",
      "MTY Puerta de Hierro: Street Elote 125g (2 dias)",
    ],
    nota: "Inventario actual no cubre 15 dias de venta. Priorizar tiendas AA y A con alto sell-out.",
  },
  {
    icon: AlertTriangle,
    titulo: "Problema de Anaquel",
    subtitulo: "25 combinaciones tienda-producto",
    color: "amber",
    items: [
      "NVO Nuevo Laredo: Street Elote 125g (107 uds sin venta)",
      "QRO San Juan del Rio: Rodajitas (45 uds sin venta)",
      "MTY Cumbres: Cheddar Jalapeno 125g (40 uds sin venta)",
      "SAL Republica / La Nogalera: Street Elote 125g",
      "VIC Campestre: Rodajitas + Cheddar Jalapeno",
    ],
    nota: "Tienen inventario pero $0 venta en 15 dias. Producto no exhibido o sin precio visible.",
  },
  {
    icon: TrendingUp,
    titulo: "OC para esta semana",
    subtitulo: "Enfoque en SKUs 25g",
    color: "green",
    items: [
      "Chicharron Natural: 3.6 sem inv, pedir ~310 uds",
      "Street Elote 25g: 3.8 sem inv, pedir ~270 uds",
      "Cheddar Jalapeno 25g: 4.2 sem inv, pedir ~200 uds",
      "Classic White 25g: 4.7 sem inv, pedir ~170 uds",
    ],
    nota: "Las presentaciones 125g y Chile Piquin tienen inventario holgado (6-10+ sem). No requieren OC urgente.",
  },
];

const colorMap: Record<string, { border: string; bg: string; text: string; iconBg: string }> = {
  red: { border: "border-red-200", bg: "bg-red-50", text: "text-red-800", iconBg: "bg-red-100" },
  amber: { border: "border-amber-200", bg: "bg-amber-50", text: "text-amber-800", iconBg: "bg-amber-100" },
  green: { border: "border-green-200", bg: "bg-green-50", text: "text-green-800", iconBg: "bg-green-100" },
};

export default function Slide7Recomendaciones() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-orange-50 to-orange-100 p-8 flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <Image src="/4buddies-logo.jpeg" alt="4B" width={36} height={36} className="rounded-lg" />
        <div>
          <h2 className="text-xl font-bold text-orange-900">Recomendaciones</h2>
          <p className="text-xs text-orange-600">Acciones para la semana del 3 de marzo 2026</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-3">
        {secciones.map((s) => {
          const Icon = s.icon;
          const c = colorMap[s.color];
          return (
            <div key={s.titulo} className={`bg-white rounded-xl shadow-sm ${c.border} border p-3 flex flex-col`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 ${c.iconBg} rounded-lg`}>
                  <Icon className={`w-4 h-4 ${c.text}`} />
                </div>
                <div>
                  <h3 className={`text-sm font-bold ${c.text}`}>{s.titulo}</h3>
                  <p className="text-[10px] text-gray-500">{s.subtitulo}</p>
                </div>
              </div>
              <ul className="space-y-1 flex-1">
                {s.items.map((item, i) => (
                  <li key={i} className="text-[11px] text-gray-700 flex items-start gap-1.5">
                    <span className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${c.iconBg}`} />
                    {item}
                  </li>
                ))}
              </ul>
              <div className={`mt-2 p-1.5 ${c.bg} ${c.border} border rounded-lg`}>
                <p className={`text-[10px] ${c.text}`}>{s.nota}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
