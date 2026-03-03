"use client";

import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const ingresosData = [
  { mes: "Ene", y2025: 288186, y2026: 278968 },
  { mes: "Feb", y2025: 273691, y2026: 254380 },
  { mes: "Mar", y2025: 332287, y2026: 24240 },
  { mes: "Abr", y2025: 275895, y2026: 0 },
  { mes: "May", y2025: 283374, y2026: 0 },
  { mes: "Jun", y2025: 265082, y2026: 0 },
  { mes: "Jul", y2025: 254187, y2026: 0 },
  { mes: "Ago", y2025: 275189, y2026: 0 },
  { mes: "Sep", y2025: 278113, y2026: 0 },
  { mes: "Oct", y2025: 267868, y2026: 0 },
  { mes: "Nov", y2025: 241504, y2026: 0 },
  { mes: "Dic", y2025: 206822, y2026: 0 },
];

const ingresoRows = [
  { mes: "Ene", y2025: 288186, y2026: 278968, var: -3.2 },
  { mes: "Feb", y2025: 273691, y2026: 254380, var: -7.1 },
  { mes: "Mar", y2025: 332287, y2026: 24240, var: null },
];

const unidadesRows = [
  { mes: "Ene", y2025: 11459, y2026: 10516, var: -8.2 },
  { mes: "Feb", y2025: 11223, y2026: 9938, var: -11.4 },
  { mes: "Mar", y2025: 13553, y2026: 1000, var: null },
];

function fmtMoney(v: number) {
  if (v === 0) return "-";
  return `$${(v / 1000).toFixed(0)}K`;
}

function fmtNum(v: number) {
  if (v === 0) return "-";
  return v.toLocaleString();
}

export default function Slide2KPIs() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-orange-50 to-orange-100 p-8 flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <Image src="/4buddies-logo.jpeg" alt="4B" width={36} height={36} className="rounded-lg" />
        <div>
          <h2 className="text-xl font-bold text-orange-900">Sell-Out Mensual — 2025 vs 2026</h2>
          <p className="text-xs text-orange-600">Ingresos y unidades por mes calendario. Marzo 2026 en curso (parcial).</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-5">
        {/* Gráfica de barras */}
        <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-4 flex flex-col">
          <h3 className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-2">Ingresos mensuales ($)</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ingresosData} margin={{ top: 5, right: 10, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
                <XAxis dataKey="mes" tick={{ fill: "#9a3412", fontSize: 10 }} />
                <YAxis tick={{ fill: "#9a3412", fontSize: 10 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff7ed", border: "1px solid #fb923c", borderRadius: "8px" }}
                  labelStyle={{ color: "#9a3412", fontWeight: "bold" }}
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, ""]}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="y2025" name="2025" fill="#fb923c" radius={[4, 4, 0, 0]} barSize={14} />
                <Bar dataKey="y2026" name="2026" fill="#9a3412" radius={[4, 4, 0, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tablas */}
        <div className="flex flex-col gap-4">
          {/* Tabla Ingresos */}
          <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-4 flex-1">
            <h3 className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-2">Ingresos ($)</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-orange-200">
                  <th className="text-left py-1 text-orange-800 font-semibold text-xs">Mes</th>
                  <th className="text-right py-1 text-orange-800 font-semibold text-xs">2025</th>
                  <th className="text-right py-1 text-orange-800 font-semibold text-xs">2026</th>
                  <th className="text-right py-1 text-orange-800 font-semibold text-xs">Var %</th>
                </tr>
              </thead>
              <tbody>
                {ingresoRows.map((r) => (
                  <tr key={r.mes} className="border-b border-orange-100">
                    <td className="py-1.5 font-medium text-orange-900 text-xs">{r.mes}</td>
                    <td className="py-1.5 text-right text-orange-700 text-xs">{fmtMoney(r.y2025)}</td>
                    <td className="py-1.5 text-right text-orange-900 font-semibold text-xs">{fmtMoney(r.y2026)}</td>
                    <td className={`py-1.5 text-right font-semibold text-xs ${r.var !== null ? (r.var >= 0 ? "text-green-600" : "text-red-600") : "text-orange-400"}`}>
                      {r.var !== null ? `${r.var > 0 ? "+" : ""}${r.var}%` : "parcial"}
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-orange-300">
                  <td className="py-1.5 font-bold text-orange-900 text-xs">YTD</td>
                  <td className="py-1.5 text-right font-bold text-orange-700 text-xs">$894K</td>
                  <td className="py-1.5 text-right font-bold text-orange-900 text-xs">$558K</td>
                  <td className="py-1.5 text-right font-bold text-red-600 text-xs">-37.6%</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tabla Unidades */}
          <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-4 flex-1">
            <h3 className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-2">Unidades</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-orange-200">
                  <th className="text-left py-1 text-orange-800 font-semibold text-xs">Mes</th>
                  <th className="text-right py-1 text-orange-800 font-semibold text-xs">2025</th>
                  <th className="text-right py-1 text-orange-800 font-semibold text-xs">2026</th>
                  <th className="text-right py-1 text-orange-800 font-semibold text-xs">Var %</th>
                </tr>
              </thead>
              <tbody>
                {unidadesRows.map((r) => (
                  <tr key={r.mes} className="border-b border-orange-100">
                    <td className="py-1.5 font-medium text-orange-900 text-xs">{r.mes}</td>
                    <td className="py-1.5 text-right text-orange-700 text-xs">{fmtNum(r.y2025)}</td>
                    <td className="py-1.5 text-right text-orange-900 font-semibold text-xs">{fmtNum(r.y2026)}</td>
                    <td className={`py-1.5 text-right font-semibold text-xs ${r.var !== null ? (r.var >= 0 ? "text-green-600" : "text-red-600") : "text-orange-400"}`}>
                      {r.var !== null ? `${r.var > 0 ? "+" : ""}${r.var}%` : "parcial"}
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-orange-300">
                  <td className="py-1.5 font-bold text-orange-900 text-xs">YTD</td>
                  <td className="py-1.5 text-right font-bold text-orange-700 text-xs">36,235</td>
                  <td className="py-1.5 text-right font-bold text-orange-900 text-xs">21,454</td>
                  <td className="py-1.5 text-right font-bold text-red-600 text-xs">-40.8%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
