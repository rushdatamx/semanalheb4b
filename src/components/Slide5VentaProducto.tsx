"use client";

import Image from "next/image";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const ventaProd = [
  { nombre: "Chicharron Natural", monto: 58187, pct: 23.3, uds: 1173 },
  { nombre: "Classic White 125g", monto: 51486, pct: 20.7, uds: 2211 },
  { nombre: "Cheddar Jalapeno 125g", monto: 40281, pct: 16.2, uds: 1696 },
  { nombre: "Street Elote 25g", monto: 32524, pct: 13.0, uds: 1048 },
  { nombre: "Rodajitas Spicy Limon", monto: 31549, pct: 12.7, uds: 1515 },
  { nombre: "Street Elote 125g", monto: 24732, pct: 9.9, uds: 1341 },
  { nombre: "Chile Piquin", monto: 10522, pct: 4.2, uds: 583 },
];

const COLORS = ["#ea580c", "#f97316", "#fb923c", "#fdba74", "#fed7aa", "#ffedd5", "#fff7ed"];

export default function Slide5VentaProducto() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-orange-50 to-orange-100 p-8 flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <Image src="/4buddies-logo.jpeg" alt="4B" width={36} height={36} className="rounded-lg" />
        <div>
          <h2 className="text-xl font-bold text-orange-900">Venta por Producto</h2>
          <p className="text-xs text-orange-600">
            P04-2026 (26 Ene &ndash; 22 Feb 2026) &middot; $249,279 total &middot; 7 SKUs activos
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
                    <td className="py-2">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[i] }} />
                    </td>
                    <td className="py-2 text-orange-900 font-medium text-xs">{p.nombre}</td>
                    <td className="py-2 text-right text-orange-800 text-xs">${(p.monto / 1000).toFixed(1)}K</td>
                    <td className="py-2 text-right text-orange-600 text-xs">{p.uds.toLocaleString()}</td>
                    <td className="py-2 text-right">
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
                  <td className="py-2 font-bold text-orange-900 text-xs">TOTAL</td>
                  <td className="py-2 text-right font-bold text-orange-900 text-xs">$249K</td>
                  <td className="py-2 text-right font-bold text-orange-900 text-xs">9,567</td>
                  <td className="py-2 text-right font-bold text-orange-900 text-xs">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-[10px] text-orange-700">
              Chicharron Natural lidera en ingreso (23.3%). Classic White 125g es #1 en unidades (2,211).
              Las presentaciones de 125g representan ~47% del ingreso total.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
