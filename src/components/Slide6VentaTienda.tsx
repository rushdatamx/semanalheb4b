"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const topTiendas = [
  { tienda: "HEB Valle Oriente", cluster: "AA", p04: 19800, p03: 18500 },
  { tienda: "HEB San Pedro", cluster: "AA", p04: 16200, p03: 15800 },
  { tienda: "HEB Contry", cluster: "A", p04: 14900, p03: 14200 },
  { tienda: "HEB Chipinque", cluster: "AA", p04: 14100, p03: 13700 },
  { tienda: "HEB El Uro", cluster: "AA Light", p04: 10800, p03: 10200 },
  { tienda: "HEB Cumbres", cluster: "A", p04: 9500, p03: 9800 },
  { tienda: "HEB Gonzalitos", cluster: "A", p04: 8700, p03: 8400 },
  { tienda: "HEB Linda Vista", cluster: "A", p04: 7900, p03: 8100 },
  { tienda: "HEB Leon Torres Landa", cluster: "C Bajio", p04: 7200, p03: 6800 },
  { tienda: "HEB SLP Lomas", cluster: "AA Light", p04: 6800, p03: 7100 },
];

export default function Slide6VentaTienda() {
  return (
    <div className="w-full h-full bg-gray-900 p-10 flex flex-col">
      <h2 className="text-2xl font-bold text-white mb-1">Venta por Tienda</h2>
      <p className="text-sm text-gray-400 mb-4">
        Top 10 tiendas &middot; P04-2026 vs P03-2026 &middot; Cluster AA y A dominan
      </p>

      <div className="grid grid-cols-2 gap-6 flex-1">
        <div className="flex flex-col">
          <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-medium">
            Top 10 tiendas — P04-2026
          </h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topTiendas}
                layout="vertical"
                margin={{ top: 5, right: 30, bottom: 5, left: 130 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis type="number" tick={{ fill: "#9ca3af", fontSize: 10 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
                <YAxis type="category" dataKey="tienda" tick={{ fill: "#d1d5db", fontSize: 10 }} width={130} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
                  labelStyle={{ color: "#fff" }}
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, ""]}
                />
                <Bar dataKey="p04" fill="#3b82f6" name="P04-2026" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col">
          <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-medium">
            Detalle y variacion
          </h3>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-2 text-gray-400 font-medium text-xs">Tienda</th>
                  <th className="text-center py-2 text-gray-400 font-medium text-xs">Cluster</th>
                  <th className="text-right py-2 text-gray-400 font-medium text-xs">P04</th>
                  <th className="text-right py-2 text-gray-400 font-medium text-xs">Var.</th>
                </tr>
              </thead>
              <tbody>
                {topTiendas.map((t) => {
                  const varPct = ((t.p04 / t.p03 - 1) * 100).toFixed(1);
                  const isPos = t.p04 >= t.p03;
                  return (
                    <tr key={t.tienda} className="border-b border-gray-800/50">
                      <td className="py-1.5 text-white text-xs">{t.tienda}</td>
                      <td className="py-1.5 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-xs ${
                          t.cluster === "AA" ? "bg-blue-500/20 text-blue-300" :
                          t.cluster === "A" ? "bg-cyan-500/20 text-cyan-300" :
                          "bg-gray-500/20 text-gray-300"
                        }`}>
                          {t.cluster}
                        </span>
                      </td>
                      <td className="py-1.5 text-right text-gray-300 text-xs">${(t.p04/1000).toFixed(1)}K</td>
                      <td className={`py-1.5 text-right text-xs ${isPos ? "text-green-400" : "text-red-400"}`}>
                        {isPos ? "+" : ""}{varPct}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-xs text-blue-300">
              Las tiendas Cluster AA (Valle Oriente, San Pedro, Chipinque) representan la mayor venta.
              La mayoria de las Top 10 muestra crecimiento vs P03.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
