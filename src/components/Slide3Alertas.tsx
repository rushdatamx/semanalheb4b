"use client";

import Image from "next/image";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const ventaProd = [
  { nombre: "Chicharron Natural", monto: 163353, pct: 23.8, uds: 3283 },
  { nombre: "Rodajitas Spicy Limon", monto: 90356, pct: 13.2, uds: 4532 },
  { nombre: "Street Elote 125g", monto: 88248, pct: 12.9, uds: 2855 },
  { nombre: "Classic White 25g", monto: 78280, pct: 11.4, uds: 4402 },
  { nombre: "Street Elote 25g", monto: 66458, pct: 9.7, uds: 3778 },
  { nombre: "Classic White 125g", monto: 63964, pct: 9.3, uds: 1781 },
  { nombre: "Cheddar Jalapeno 125g", monto: 63265, pct: 9.2, uds: 2050 },
  { nombre: "Cheddar Jalapeno 25g", monto: 43277, pct: 6.3, uds: 2504 },
  { nombre: "Chile Piquin", monto: 29099, pct: 4.2, uds: 1626 },
];

const COLORS = ["#ea580c", "#f97316", "#fb923c", "#fdba74", "#fed7aa", "#ffedd5", "#c2410c", "#9a3412", "#7c2d12"];

const topTiendas = [
  { pos: 1, tienda: "HEB Chipinque", cluster: "AA", ciudad: "Monterrey", monto: 36057 },
  { pos: 2, tienda: "HEB San Pedro", cluster: "AA", ciudad: "Monterrey", monto: 35188 },
  { pos: 3, tienda: "HEB Valle Oriente", cluster: "AA", ciudad: "Monterrey", monto: 34552 },
  { pos: 4, tienda: "HEB Contry", cluster: "A", ciudad: "Monterrey", monto: 27628 },
  { pos: 5, tienda: "HEB Valle Alto", cluster: "AA Light", ciudad: "Monterrey", monto: 26781 },
  { pos: 6, tienda: "HEB Tec", cluster: "A", ciudad: "Monterrey", monto: 23611 },
  { pos: 7, tienda: "HEB El Uro", cluster: "AA Light", ciudad: "Monterrey", monto: 20948 },
  { pos: 8, tienda: "HEB San Nicolas", cluster: "A", ciudad: "Monterrey", monto: 19894 },
  { pos: 9, tienda: "HEB Cerro Gordo", cluster: "AA Light", ciudad: "Leon", monto: 19609 },
  { pos: 10, tienda: "HEB Cumbres", cluster: "AA Light", ciudad: "Monterrey", monto: 18618 },
];

const maxMonto = topTiendas[0].monto;

function clusterBadge(cluster: string) {
  const colors: Record<string, string> = {
    "AA": "bg-orange-600 text-white",
    "AA Light": "bg-orange-400 text-white",
    "A": "bg-orange-200 text-orange-800",
    "B": "bg-amber-100 text-amber-800",
  };
  return (
    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${colors[cluster] || "bg-gray-100 text-gray-600"}`}>
      {cluster}
    </span>
  );
}

export default function Slide3Alertas() {
  const totalMonto = ventaProd.reduce((s, p) => s + p.monto, 0);

  return (
    <div className="w-full h-full bg-gradient-to-br from-orange-50 to-orange-100 p-8 flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <Image src="/4buddies-logo.jpeg" alt="4B" width={36} height={36} className="rounded-lg" />
        <div>
          <h2 className="text-xl font-bold text-orange-900">Desempeno por Producto y Tienda — YTD 2026</h2>
          <p className="text-xs text-orange-600">$686K vendidos en 62 tiendas &middot; 9 SKUs activos &middot; Ene-Mar 2026</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4">
        {/* Pie + tabla producto */}
        <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-4 flex flex-col">
          <h3 className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-2">Participacion por producto ($)</h3>
          <div className="grid grid-cols-2 gap-2 flex-1">
            <div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ventaProd}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={35}
                    dataKey="monto"
                    nameKey="nombre"
                    fontSize={9}
                  >
                    {ventaProd.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} stroke="#fff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#fff7ed", border: "1px solid #fb923c", borderRadius: "8px", fontSize: 11 }}
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, "Venta"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="overflow-auto">
              <table className="w-full text-[11px]">
                <tbody>
                  {ventaProd.map((p, i) => (
                    <tr key={p.nombre} className="border-b border-orange-50">
                      <td className="py-1">
                        <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS[i] }} />
                      </td>
                      <td className="py-1 text-orange-900 font-medium">{p.nombre}</td>
                      <td className="py-1 text-right text-orange-700">{p.pct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-2 p-1.5 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-[10px] text-orange-700">
              Chicharron lidera en ingreso (23.8%). Rodajitas y Classic White 25g lideran en unidades.
            </p>
          </div>
        </div>

        {/* Top 10 tiendas */}
        <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-4 flex flex-col">
          <h3 className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-2">Top 10 tiendas YTD 2026</h3>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b-2 border-orange-200">
                  <th className="text-center py-1 text-orange-800 font-semibold w-6">#</th>
                  <th className="text-left py-1 text-orange-800 font-semibold">Tienda</th>
                  <th className="text-center py-1 text-orange-800 font-semibold">Cluster</th>
                  <th className="text-right py-1 text-orange-800 font-semibold">Monto</th>
                  <th className="text-left py-1 text-orange-800 font-semibold pl-2 w-20"></th>
                </tr>
              </thead>
              <tbody>
                {topTiendas.map((t) => {
                  const barW = (t.monto / maxMonto) * 100;
                  return (
                    <tr key={t.pos} className={`border-b border-orange-50 ${t.pos <= 3 ? "bg-orange-50/50" : ""}`}>
                      <td className="py-1.5 text-center">
                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                          t.pos <= 3 ? "bg-orange-600 text-white" : "text-orange-600"
                        }`}>
                          {t.pos}
                        </span>
                      </td>
                      <td className="py-1.5 text-orange-900 font-medium">{t.tienda}</td>
                      <td className="py-1.5 text-center">{clusterBadge(t.cluster)}</td>
                      <td className="py-1.5 text-right text-orange-900 font-semibold">${(t.monto / 1000).toFixed(1)}K</td>
                      <td className="py-1.5 pl-2">
                        <div className="w-full h-2 bg-orange-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full" style={{ width: `${barW}%` }} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-2 p-1.5 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-[10px] text-orange-700">
              Monterrey concentra 9 de las top 10. Leon (Cerro Gordo) es la unica fuera del area metropolitana.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
