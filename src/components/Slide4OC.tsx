"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const ocTrend = [
  { semana: "OC 11Feb", total: 3210 },
  { semana: "OC 18Feb", total: 2934 },
  { semana: "OC 25Feb", total: 934 },
];

const ocPorSKU = [
  { sku: "Rodajitas Spicy Limon", oc11: 640, oc18: 448, oc25: 256, vtaSem: 373 },
  { sku: "Classic White 125g", oc11: 640, oc18: 448, oc25: 224, vtaSem: 388 },
  { sku: "Street Elote 125g", oc11: 320, oc18: 448, oc25: 192, vtaSem: 319 },
  { sku: "Cheddar Jalapeno 125g", oc11: 666, oc18: 586, oc25: 42, vtaSem: 212 },
  { sku: "Chicharron Natural", oc11: 300, oc18: 310, oc25: 50, vtaSem: 308 },
  { sku: "Street Elote 25g", oc11: 290, oc18: 310, oc25: 110, vtaSem: 265 },
  { sku: "Classic White 25g", oc11: 130, oc18: 160, oc25: 60, vtaSem: 164 },
  { sku: "Chile Piquin", oc11: 224, oc18: 224, oc25: 0, vtaSem: 144 },
];

export default function Slide4OC() {
  return (
    <div className="w-full h-full bg-gray-900 p-10 flex flex-col">
      <h2 className="text-2xl font-bold text-white mb-1">Ordenes de Compra</h2>
      <p className="text-sm text-gray-400 mb-4">
        3 OC en febrero &middot; Total acumulado: 7,078 uds &middot; OC 25Feb fue complementaria
      </p>

      <div className="grid grid-cols-5 gap-6 flex-1">
        <div className="col-span-2 flex flex-col">
          <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-medium">Tendencia semanal</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ocTrend} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="semana" tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
                  labelStyle={{ color: "#fff" }}
                  itemStyle={{ color: "#60a5fa" }}
                />
                <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                  {ocTrend.map((entry, i) => (
                    <Cell key={i} fill={i === 2 ? "#f59e0b" : "#3b82f6"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-xs text-yellow-300">
              La OC del 25Feb (934 uds) fue un complemento a las OC anteriores.
              Los inventarios actuales se mantienen en niveles razonables gracias al resurtido acumulado.
            </p>
          </div>
        </div>

        <div className="col-span-3 flex flex-col">
          <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-medium">Detalle por SKU</h3>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-1.5 text-gray-400">SKU</th>
                  <th className="text-right py-1.5 text-gray-400">11Feb</th>
                  <th className="text-right py-1.5 text-gray-400">18Feb</th>
                  <th className="text-right py-1.5 text-gray-400">25Feb</th>
                  <th className="text-right py-1.5 text-gray-400">Acum.</th>
                  <th className="text-right py-1.5 text-gray-400">Vta/Sem</th>
                </tr>
              </thead>
              <tbody>
                {ocPorSKU.map((r) => {
                  const acum = r.oc11 + r.oc18 + r.oc25;
                  return (
                    <tr key={r.sku} className="border-b border-gray-800/50">
                      <td className="py-1.5 text-white">{r.sku}</td>
                      <td className="py-1.5 text-right text-gray-300">{r.oc11}</td>
                      <td className="py-1.5 text-right text-gray-300">{r.oc18}</td>
                      <td className="py-1.5 text-right">
                        <span className={r.oc25 === 0 ? "text-red-400" : r.oc25 < 100 ? "text-yellow-400" : "text-gray-300"}>
                          {r.oc25}
                        </span>
                      </td>
                      <td className="py-1.5 text-right text-blue-400 font-medium">{acum.toLocaleString()}</td>
                      <td className="py-1.5 text-right text-gray-400">{r.vtaSem}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t border-gray-700">
                  <td className="py-1.5 text-white font-medium">TOTAL</td>
                  <td className="py-1.5 text-right text-white font-medium">3,210</td>
                  <td className="py-1.5 text-right text-white font-medium">2,934</td>
                  <td className="py-1.5 text-right text-yellow-400 font-medium">934</td>
                  <td className="py-1.5 text-right text-blue-400 font-bold">7,078</td>
                  <td className="py-1.5 text-right text-gray-400">2,373</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
