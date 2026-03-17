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
  { mes: "Ene", y2025: 282960, y2026: 278968 },
  { mes: "Feb", y2025: 269925, y2026: 254380 },
  { mes: "Mar*", y2025: 164904, y2026: 152952 },
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
          <h2 className="text-xl font-bold text-orange-900">Salud del Negocio — YTD 2026 vs 2025</h2>
          <p className="text-xs text-orange-600">Comparacion justa: mismos dias en ambos anos. *Marzo al 16.</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-5">
        {/* Gráfica de barras */}
        <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-4 flex flex-col">
          <h3 className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-2">Ingresos por mes ($)</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ingresosData} margin={{ top: 5, right: 10, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
                <XAxis dataKey="mes" tick={{ fill: "#9a3412", fontSize: 11 }} />
                <YAxis tick={{ fill: "#9a3412", fontSize: 10 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff7ed", border: "1px solid #fb923c", borderRadius: "8px" }}
                  labelStyle={{ color: "#9a3412", fontWeight: "bold" }}
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, ""]}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="y2025" name="2025" fill="#fb923c" radius={[4, 4, 0, 0]} barSize={28} />
                <Bar dataKey="y2026" name="2026" fill="#9a3412" radius={[4, 4, 0, 0]} barSize={28} />
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
                <tr className="border-b border-orange-100">
                  <td className="py-2 font-medium text-orange-900">Enero</td>
                  <td className="py-2 text-right text-orange-700">{fmtMoney(282960)}</td>
                  <td className="py-2 text-right text-orange-900 font-semibold">{fmtMoney(278968)}</td>
                  <td className="py-2 text-right font-semibold text-red-600">-1.4%</td>
                </tr>
                <tr className="border-b border-orange-100">
                  <td className="py-2 font-medium text-orange-900">Febrero</td>
                  <td className="py-2 text-right text-orange-700">{fmtMoney(269925)}</td>
                  <td className="py-2 text-right text-orange-900 font-semibold">{fmtMoney(254380)}</td>
                  <td className="py-2 text-right font-semibold text-red-600">-5.8%</td>
                </tr>
                <tr className="border-b border-orange-100">
                  <td className="py-2 font-medium text-orange-900">Marzo*</td>
                  <td className="py-2 text-right text-orange-700">{fmtMoney(164904)}</td>
                  <td className="py-2 text-right text-orange-900 font-semibold">{fmtMoney(152952)}</td>
                  <td className="py-2 text-right font-semibold text-red-600">-7.2%</td>
                </tr>
                <tr className="border-t-2 border-orange-300">
                  <td className="py-2 font-bold text-orange-900">YTD</td>
                  <td className="py-2 text-right font-bold text-orange-700">$718K</td>
                  <td className="py-2 text-right font-bold text-orange-900">$686K</td>
                  <td className="py-2 text-right font-bold text-red-600">-4.4%</td>
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
                <tr className="border-b border-orange-100">
                  <td className="py-2 font-medium text-orange-900">Enero</td>
                  <td className="py-2 text-right text-orange-700">{fmtNum(11158)}</td>
                  <td className="py-2 text-right text-orange-900 font-semibold">{fmtNum(10516)}</td>
                  <td className="py-2 text-right font-semibold text-red-600">-5.8%</td>
                </tr>
                <tr className="border-b border-orange-100">
                  <td className="py-2 font-medium text-orange-900">Febrero</td>
                  <td className="py-2 text-right text-orange-700">{fmtNum(10993)}</td>
                  <td className="py-2 text-right text-orange-900 font-semibold">{fmtNum(9938)}</td>
                  <td className="py-2 text-right font-semibold text-red-600">-9.6%</td>
                </tr>
                <tr className="border-b border-orange-100">
                  <td className="py-2 font-medium text-orange-900">Marzo*</td>
                  <td className="py-2 text-right text-orange-700">{fmtNum(6882)}</td>
                  <td className="py-2 text-right text-orange-900 font-semibold">{fmtNum(6357)}</td>
                  <td className="py-2 text-right font-semibold text-red-600">-7.6%</td>
                </tr>
                <tr className="border-t-2 border-orange-300">
                  <td className="py-2 font-bold text-orange-900">YTD</td>
                  <td className="py-2 text-right font-bold text-orange-700">29,033</td>
                  <td className="py-2 text-right font-bold text-orange-900">26,811</td>
                  <td className="py-2 text-right font-bold text-red-600">-7.7%</td>
                </tr>
              </tbody>
            </table>
            <p className="text-[10px] text-orange-500 mt-2">*Marzo comparado al mismo dia 16 en ambos anos.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
