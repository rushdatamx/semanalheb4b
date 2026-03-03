"use client";

import Image from "next/image";
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
    <div className="w-full h-full bg-gradient-to-br from-orange-50 to-orange-100 p-8 flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <Image src="/4buddies-logo.jpeg" alt="4B" width={36} height={36} className="rounded-lg" />
        <div>
          <h2 className="text-xl font-bold text-orange-900">Ordenes de Compra</h2>
          <p className="text-xs text-orange-600">3 OC en febrero &middot; Total acumulado: 7,078 uds &middot; OC 25Feb fue complementaria</p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 flex-1">
        <div className="col-span-2 bg-white rounded-xl shadow-sm border border-orange-200 p-4 flex flex-col">
          <h3 className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-2">Tendencia semanal</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ocTrend} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
                <XAxis dataKey="semana" tick={{ fill: "#9a3412", fontSize: 11 }} />
                <YAxis tick={{ fill: "#9a3412", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff7ed", border: "1px solid #fb923c", borderRadius: "8px" }}
                  labelStyle={{ color: "#9a3412", fontWeight: "bold" }}
                />
                <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                  {ocTrend.map((_, i) => (
                    <Cell key={i} fill={i === 2 ? "#f59e0b" : "#ea580c"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-[10px] text-orange-700">
              La OC del 25Feb (934 uds) fue un complemento. Los inventarios se mantienen estables gracias al resurtido acumulado de las 3 OC.
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
                  <th className="text-right py-1.5 text-orange-800 font-semibold">Acum.</th>
                  <th className="text-right py-1.5 text-orange-800 font-semibold">Vta/Sem</th>
                </tr>
              </thead>
              <tbody>
                {ocPorSKU.map((r) => {
                  const acum = r.oc11 + r.oc18 + r.oc25;
                  return (
                    <tr key={r.sku} className="border-b border-orange-100">
                      <td className="py-1.5 text-orange-900 font-medium">{r.sku}</td>
                      <td className="py-1.5 text-right text-orange-700">{r.oc11}</td>
                      <td className="py-1.5 text-right text-orange-700">{r.oc18}</td>
                      <td className="py-1.5 text-right">
                        <span className={r.oc25 === 0 ? "text-red-600 font-bold" : r.oc25 < 100 ? "text-amber-600 font-medium" : "text-orange-700"}>
                          {r.oc25}
                        </span>
                      </td>
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
                  <td className="py-1.5 text-right text-orange-900 font-extrabold">7,078</td>
                  <td className="py-1.5 text-right text-orange-500">2,373</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
