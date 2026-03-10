"use client";

import Image from "next/image";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const ventaProd = [
  { nombre: "Chicharron Natural", monto: 31059, pct: 21.8, uds: 625 },
  { nombre: "Rodajitas Spicy Limon", monto: 21859, pct: 15.3, uds: 1191 },
  { nombre: "Street Elote 25g", monto: 17102, pct: 12.0, uds: 553 },
  { nombre: "Classic White 125g", monto: 16006, pct: 11.2, uds: 973 },
  { nombre: "Street Elote 125g", monto: 14506, pct: 10.2, uds: 897 },
  { nombre: "Classic White 25g", monto: 13626, pct: 9.6, uds: 379 },
  { nombre: "Cheddar Jalapeno 125g", monto: 12445, pct: 8.7, uds: 404 },
  { nombre: "Cheddar Jalapeno 25g", monto: 9512, pct: 6.7, uds: 586 },
  { nombre: "Chile Piquin", monto: 6509, pct: 4.6, uds: 354 },
];

const COLORS = ["#ea580c", "#f97316", "#fb923c", "#fdba74", "#fed7aa", "#ffedd5", "#fff7ed", "#c2410c", "#9a3412"];

export default function Slide5VentaProducto() {
  const totalMonto = ventaProd.reduce((s, p) => s + p.monto, 0);
  const totalUds = ventaProd.reduce((s, p) => s + p.uds, 0);

  return (
    <div className="w-full h-full bg-gradient-to-br from-orange-50 to-orange-100 p-8 flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <Image src="/4buddies-logo.jpeg" alt="4B" width={36} height={36} className="rounded-lg" />
        <div>
          <h2 className="text-xl font-bold text-orange-900">Venta por Producto</h2>
          <p className="text-xs text-orange-600">
            P05-2026 (23 Feb &ndash; 9 Mar 2026, parcial) &middot; ${(totalMonto / 1000).toFixed(0)}K total &middot; 9 SKUs activos
          </p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4">
        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-4 flex flex-col items-center justify-center">
          <h3 className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-2 self-start">
            Participacion por producto ($)
          </h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ventaProd}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  innerRadius={50}
                  dataKey="monto"
                  nameKey="nombre"
                  label={(props) => `${String(props.name ?? "").split(" ")[0]} ${((props.percent ?? 0) * 100).toFixed(0)}%`}
                  labelLine={true}
                  fontSize={10}
                >
                  {ventaProd.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} stroke="#fff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff7ed", border: "1px solid #fb923c", borderRadius: "8px" }}
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, "Venta"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabla detalle */}
        <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-4 flex flex-col">
          <h3 className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-2">
            Detalle por producto
          </h3>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-orange-200">
                  <th className="text-left py-1.5 text-orange-800 font-semibold text-xs"></th>
                  <th className="text-left py-1.5 text-orange-800 font-semibold text-xs">Producto</th>
                  <th className="text-right py-1.5 text-orange-800 font-semibold text-xs">Monto</th>
                  <th className="text-right py-1.5 text-orange-800 font-semibold text-xs">Uds</th>
                  <th className="text-right py-1.5 text-orange-800 font-semibold text-xs">% Part.</th>
                </tr>
              </thead>
              <tbody>
                {ventaProd.map((p, i) => (
                  <tr key={p.nombre} className="border-b border-orange-100">
                    <td className="py-1.5">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[i] }} />
                    </td>
                    <td className="py-1.5 text-orange-900 font-medium text-xs">{p.nombre}</td>
                    <td className="py-1.5 text-right text-orange-800 text-xs">${(p.monto / 1000).toFixed(1)}K</td>
                    <td className="py-1.5 text-right text-orange-600 text-xs">{p.uds.toLocaleString()}</td>
                    <td className="py-1.5 text-right">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
                        {p.pct}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-orange-300">
                  <td></td>
                  <td className="py-1.5 font-bold text-orange-900 text-xs">TOTAL</td>
                  <td className="py-1.5 text-right font-bold text-orange-900 text-xs">${(totalMonto / 1000).toFixed(0)}K</td>
                  <td className="py-1.5 text-right font-bold text-orange-900 text-xs">{totalUds.toLocaleString()}</td>
                  <td className="py-1.5 text-right font-bold text-orange-900 text-xs">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-[10px] text-orange-700">
              Chicharron Natural lidera en ingreso (21.8%). Rodajitas es #1 en unidades (1,191).
              Periodo parcial (15 de 28 dias).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
