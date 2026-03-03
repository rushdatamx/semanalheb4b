"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const ventaProd = [
  { nombre: "Chicharron Natural", p04: 48917, p03: 47500, pct: 19.6 },
  { nombre: "Rodajitas Spicy Limon", p04: 38200, p03: 37800, pct: 15.3 },
  { nombre: "Classic White 125g", p04: 36500, p03: 35200, pct: 14.6 },
  { nombre: "Street Elote 125g", p04: 31400, p03: 30900, pct: 12.6 },
  { nombre: "Street Elote 25g", p04: 24100, p03: 25300, pct: 9.7 },
  { nombre: "Cheddar Jalapeno 125g", p04: 22800, p03: 24100, pct: 9.1 },
  { nombre: "Cheddar Jalapeno 25g", p04: 17900, p03: 18700, pct: 7.2 },
  { nombre: "Classic White 25g", p04: 14500, p03: 15200, pct: 5.8 },
  { nombre: "Chile Piquin", p04: 14962, p03: 15538, pct: 6.0 },
];

export default function Slide5VentaProducto() {
  return (
    <div className="w-full h-full bg-gray-900 p-10 flex flex-col">
      <h2 className="text-2xl font-bold text-white mb-1">Venta por Producto</h2>
      <p className="text-sm text-gray-400 mb-4">
        P04-2026 &middot; $249,279 total &middot; Ranking por monto de venta
      </p>

      <div className="grid grid-cols-2 gap-6 flex-1">
        <div className="flex flex-col">
          <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-medium">
            Venta P04-2026 vs P03-2026 ($)
          </h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ventaProd}
                layout="vertical"
                margin={{ top: 5, right: 30, bottom: 5, left: 120 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis type="number" tick={{ fill: "#9ca3af", fontSize: 10 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
                <YAxis type="category" dataKey="nombre" tick={{ fill: "#d1d5db", fontSize: 11 }} width={120} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
                  labelStyle={{ color: "#fff" }}
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, ""]}
                />
                <Bar dataKey="p03" fill="#4b5563" name="P03-2026" radius={[0, 4, 4, 0]} barSize={10} />
                <Bar dataKey="p04" fill="#3b82f6" name="P04-2026" radius={[0, 4, 4, 0]} barSize={10} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col">
          <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-medium">
            Participacion y variacion
          </h3>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-2 text-gray-400 font-medium">Producto</th>
                  <th className="text-right py-2 text-gray-400 font-medium">P04</th>
                  <th className="text-right py-2 text-gray-400 font-medium">% Part.</th>
                  <th className="text-right py-2 text-gray-400 font-medium">Var.</th>
                </tr>
              </thead>
              <tbody>
                {ventaProd.map((p) => {
                  const varPct = ((p.p04 / p.p03 - 1) * 100).toFixed(1);
                  const isPos = p.p04 >= p.p03;
                  return (
                    <tr key={p.nombre} className="border-b border-gray-800/50">
                      <td className="py-2 text-white text-xs">{p.nombre}</td>
                      <td className="py-2 text-right text-gray-300 text-xs">${(p.p04/1000).toFixed(1)}K</td>
                      <td className="py-2 text-right text-blue-400 text-xs">{p.pct}%</td>
                      <td className={`py-2 text-right text-xs ${isPos ? "text-green-400" : "text-red-400"}`}>
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
              Chicharron Natural es el #1 en ventas (19.6%) seguido de Rodajitas (15.3%) y Classic White 125g (14.6%).
              Las presentaciones de 125g dominan el mix.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
