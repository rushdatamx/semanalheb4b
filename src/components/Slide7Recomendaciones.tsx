"use client";

import { AlertTriangle, Package, Eye, HelpCircle } from "lucide-react";

const acciones = [
  {
    tipo: "Vigilar",
    icon: Eye,
    color: "yellow",
    items: [
      { producto: "Chicharron Natural", detalle: "3.6 sem de inventario. Vta semanal 308 uds. Incluir en OC ~310 uds." },
      { producto: "Street Elote 25g", detalle: "3.8 sem de inventario. Vta semanal 265 uds. Incluir en OC ~270 uds." },
      { producto: "Cheddar Jalapeno 25g", detalle: "4.2 sem de inventario. OC25Feb solo trajo 10 uds. Incluir ~200 uds." },
      { producto: "Classic White 25g", detalle: "4.7 sem de inventario. Vta semanal 164 uds. Incluir ~170 uds." },
    ],
  },
  {
    tipo: "Preguntar al comprador",
    icon: HelpCircle,
    color: "red",
    items: [
      { producto: "Spicy Chia", detalle: "0% cobertura, sin inventario, sin OC. ¿Dado de baja o se reactiva?" },
      { producto: "Classic Sweet", detalle: "0% cobertura, sin inventario, sin OC. ¿Dado de baja o se reactiva?" },
    ],
  },
  {
    tipo: "Inventario holgado",
    icon: Package,
    color: "green",
    items: [
      { producto: "Presentaciones 125g", detalle: "6-10 semanas de inventario. No requieren OC urgente." },
      { producto: "Chile Piquin", detalle: "10.6 semanas. Salio de OC25Feb por inventario suficiente." },
      { producto: "Rodajitas Spicy Limon", detalle: "5.1 semanas. Nivel adecuado, monitorear siguiente semana." },
    ],
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  yellow: { bg: "bg-yellow-500/5", border: "border-yellow-500/20", text: "text-yellow-300", badge: "bg-yellow-500/20" },
  red: { bg: "bg-red-500/5", border: "border-red-500/20", text: "text-red-300", badge: "bg-red-500/20" },
  green: { bg: "bg-green-500/5", border: "border-green-500/20", text: "text-green-300", badge: "bg-green-500/20" },
};

export default function Slide7Recomendaciones() {
  return (
    <div className="w-full h-full bg-gray-900 p-10 flex flex-col">
      <h2 className="text-2xl font-bold text-white mb-1">Recomendaciones</h2>
      <p className="text-sm text-gray-400 mb-4">
        Acciones para la OC del 4 de marzo 2026 &middot; Inventarios en niveles razonables, sin emergencias
      </p>

      <div className="grid grid-cols-3 gap-4 flex-1">
        {acciones.map((grupo) => {
          const Icon = grupo.icon;
          const c = colorMap[grupo.color];
          return (
            <div key={grupo.tipo} className={`${c.bg} ${c.border} border rounded-xl p-4 flex flex-col`}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-1.5 ${c.badge} rounded-lg`}>
                  <Icon className={`w-4 h-4 ${c.text}`} />
                </div>
                <h3 className={`text-sm font-bold ${c.text}`}>{grupo.tipo}</h3>
              </div>
              <div className="space-y-2.5 flex-1">
                {grupo.items.map((item) => (
                  <div key={item.producto} className="bg-gray-900/50 rounded-lg p-2.5">
                    <div className="text-white text-xs font-medium mb-0.5">{item.producto}</div>
                    <div className="text-gray-400 text-xs leading-relaxed">{item.detalle}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
          <p className="text-xs text-blue-300 leading-relaxed">
            <strong>Contexto OC:</strong> Las 3 OC de febrero sumaron 7,078 uds (la del 25Feb fue complementaria).
            El inventario total se mantiene estable en ~13,700 uds. No hay emergencia, pero los 4 SKUs de 25g
            necesitan incluirse en la OC de manana para no caer por debajo de 3 semanas.
          </p>
        </div>
      </div>
    </div>
  );
}
