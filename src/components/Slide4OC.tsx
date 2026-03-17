"use client";

import Image from "next/image";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const ocTrend = [
  { semana: "OC 11Feb", total: 3210 },
  { semana: "OC 18Feb", total: 2934 },
  { semana: "OC 25Feb", total: 934 },
  { semana: "OC 4Mar", total: 5008 },
  { semana: "OC 11Mar", total: 2874 },
];

const ocPorSKU = [
  { sku: "Rodajitas Spicy Limon", oc11f: 640, oc18f: 448, oc25f: 256, oc4m: 896, oc11m: 576, vtaSem: 511 },
  { sku: "Classic White 125g", oc11f: 640, oc18f: 448, oc25f: 224, oc4m: 832, oc11m: 416, vtaSem: 431 },
  { sku: "Street Elote 125g", oc11f: 320, oc18f: 448, oc25f: 192, oc4m: 736, oc11m: 448, vtaSem: 416 },
  { sku: "Chicharron Natural", oc11f: 300, oc18f: 310, oc25f: 50, oc4m: 550, oc11m: 270, vtaSem: 296 },
  { sku: "Street Elote 25g", oc11f: 290, oc18f: 310, oc25f: 110, oc4m: 430, oc11m: 200, vtaSem: 273 },
  { sku: "Cheddar Jalapeno 125g", oc11f: 416, oc18f: 416, oc25f: 32, oc4m: 512, oc11m: 320, vtaSem: 267 },
  { sku: "Cheddar Jalapeno 25g", oc11f: 250, oc18f: 170, oc25f: 10, oc4m: 390, oc11m: 210, vtaSem: 193 },
  { sku: "Classic White 25g", oc11f: 130, oc18f: 160, oc25f: 60, oc4m: 310, oc11m: 210, vtaSem: 174 },
  { sku: "Chile Piquin", oc11f: 224, oc18f: 224, oc25f: 0, oc4m: 352, oc11m: 224, vtaSem: 162 },
];

export default function Slide4OC() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-orange-50 to-orange-100 p-8 flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <Image src="/4buddies-logo.jpeg" alt="4B" width={36} height={36} className="rounded-lg" />
        <div>
          <h2 className="text-xl font-bold text-orange-900">Ordenes de Compra</h2>
          <p className="text-xs text-orange-600">5 OC (Feb-Mar) &middot; Total acumulado: 14,960 uds &middot; OC 4Mar fue la mas grande (5,008 uds)</p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 flex-1">
        <div className="col-span-2 bg-white rounded-xl shadow-sm border border-orange-200 p-4 flex flex-col">
          <h3 className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-2">Tendencia semanal</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ocTrend} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
                <XAxis dataKey="semana" tick={{ fill: "#9a3412", fontSize: 9 }} />
                <YAxis tick={{ fill: "#9a3412", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff7ed", border: "1px solid #fb923c", borderRadius: "8px" }}
                  labelStyle={{ color: "#9a3412", fontWeight: "bold" }}
                />
                <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                  {ocTrend.map((entry, i) => (
                    <Cell key={i} fill={entry.total < 1000 ? "#f59e0b" : "#ea580c"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-[10px] text-orange-700">
              OC 25Feb fue complementaria (934 uds). OC 4Mar retomo volumen fuerte con 5,008 uds. OC 11Mar regular con 2,874 uds.
            </p>
          </div>
        </div>

        <div className="col-span-3 bg-white rounded-xl shadow-sm border border-orange-200 p-4 flex flex-col">
          <h3 className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-2">Detalle por SKU</h3>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b-2 border-orange-200">
                  <th className="text-left py-1.5 text-orange-800 font-semibold">SKU</th>
                  <th className="text-right py-1.5 text-orange-800 font-semibold">11Feb</th>
                  <th className="text-right py-1.5 text-orange-800 font-semibold">18Feb</th>
                  <th className="text-right py-1.5 text-orange-800 font-semibold">25Feb</th>
                  <th className="text-right py-1.5 text-orange-800 font-semibold">4Mar</th>
                  <th className="text-right py-1.5 text-orange-800 font-semibold">11Mar</th>
                  <th className="text-right py-1.5 text-orange-800 font-semibold">Acum.</th>
                  <th className="text-right py-1.5 text-orange-800 font-semibold">Vta/Sem</th>
                </tr>
              </thead>
              <tbody>
                {ocPorSKU.map((r) => {
                  const acum = r.oc11f + r.oc18f + r.oc25f + r.oc4m + r.oc11m;
                  return (
                    <tr key={r.sku} className="border-b border-orange-100">
                      <td className="py-1.5 text-orange-900 font-medium">{r.sku}</td>
                      <td className="py-1.5 text-right text-orange-700">{r.oc11f}</td>
                      <td className="py-1.5 text-right text-orange-700">{r.oc18f}</td>
                      <td className="py-1.5 text-right">
                        <span className={r.oc25f === 0 ? "text-red-600 font-bold" : r.oc25f < 100 ? "text-amber-600 font-medium" : "text-orange-700"}>
                          {r.oc25f}
                        </span>
                      </td>
                      <td className="py-1.5 text-right text-green-700 font-semibold">{r.oc4m}</td>
                      <td className="py-1.5 text-right text-blue-700 font-semibold">{r.oc11m}</td>
                      <td className="py-1.5 text-right text-orange-900 font-bold">{acum.toLocaleString()}</td>
                      <td className="py-1.5 text-right text-orange-500">{r.vtaSem}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-orange-300">
                  <td className="py-1.5 text-orange-900 font-bold">TOTAL</td>
                  <td className="py-1.5 text-right text-orange-900 font-bold">3,210</td>
                  <td className="py-1.5 text-right text-orange-900 font-bold">2,934</td>
                  <td className="py-1.5 text-right text-amber-600 font-bold">934</td>
                  <td className="py-1.5 text-right text-green-700 font-bold">5,008</td>
                  <td className="py-1.5 text-right text-blue-700 font-bold">2,874</td>
                  <td className="py-1.5 text-right text-orange-900 font-extrabold">14,960</td>
                  <td className="py-1.5 text-right text-orange-500">2,723</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
