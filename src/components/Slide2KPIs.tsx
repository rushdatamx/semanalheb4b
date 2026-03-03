"use client";

import { DollarSign, Package, ShoppingCart, Store, TrendingDown, AlertTriangle } from "lucide-react";

const kpis = [
  {
    label: "Venta P04-2026",
    value: "$249,279",
    change: "-0.4%",
    vs: "vs P03-2026",
    positive: false,
    icon: DollarSign,
    color: "blue",
  },
  {
    label: "Unidades P04-2026",
    value: "9,567",
    change: "-9.2%",
    vs: "vs P04-2025",
    positive: false,
    icon: Package,
    color: "cyan",
  },
  {
    label: "P05-2026 (parcial)",
    value: "$78,097",
    change: "en curso",
    vs: "Periodo abierto",
    positive: true,
    icon: TrendingDown,
    color: "purple",
  },
  {
    label: "Inventario Total",
    value: "13,696",
    change: "uds",
    vs: "Al 2 de marzo",
    positive: true,
    icon: ShoppingCart,
    color: "green",
  },
  {
    label: "Cobertura Promedio",
    value: "92%",
    change: "7 de 9 SKUs activos",
    vs: "62 tiendas",
    positive: true,
    icon: Store,
    color: "emerald",
  },
  {
    label: "DDI Promedio",
    value: "84 dias",
    change: "62 tienda-SKU < 15d",
    vs: "5 quiebres",
    positive: false,
    icon: AlertTriangle,
    color: "yellow",
  },
];

const colorMap: Record<string, string> = {
  blue: "from-blue-500/20 to-blue-500/5 border-blue-500/20 text-blue-400",
  cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 text-cyan-400",
  purple: "from-purple-500/20 to-purple-500/5 border-purple-500/20 text-purple-400",
  green: "from-green-500/20 to-green-500/5 border-green-500/20 text-green-400",
  emerald: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400",
  yellow: "from-yellow-500/20 to-yellow-500/5 border-yellow-500/20 text-yellow-400",
};

export default function Slide2KPIs() {
  return (
    <div className="w-full h-full bg-gray-900 p-10 flex flex-col">
      <h2 className="text-2xl font-bold text-white mb-1">Resumen KPIs</h2>
      <p className="text-sm text-gray-400 mb-6">
        Periodo fiscal P04-2026 (completo) &middot; Inventario al 2 de marzo 2026
      </p>

      <div className="grid grid-cols-3 gap-4 flex-1">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          const colors = colorMap[kpi.color];
          return (
            <div
              key={kpi.label}
              className={`rounded-xl bg-gradient-to-br ${colors} border p-5 flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                  {kpi.label}
                </span>
                <Icon className="w-4 h-4 opacity-60" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{kpi.value}</div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-medium ${
                    kpi.positive ? "text-green-400" : "text-yellow-400"
                  }`}
                >
                  {kpi.change}
                </span>
                <span className="text-xs text-gray-500">{kpi.vs}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
