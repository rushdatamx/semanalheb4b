"use client";

import { useState, useCallback, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";
import {
  ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight,
  AlertTriangle, Store, Box,
} from "lucide-react";

/* ================================================================
   DATA CONSTANTS
   ================================================================ */

const YTD = {
  monto25: 1030488, monto26: 939829, varMonto: -8.8,
  uds25: 41341, uds26: 36942, varUds: -10.6,
  abrVar: -11.5,
  alertas: 14,
  tiendas: 63,
};

const VENTAS_MES = [
  { mes: "Ene", y2025: 282960, y2026: 278968, u2025: 11158, u2026: 10516, varM: -1.4, varU: -5.8 },
  { mes: "Feb", y2025: 269925, y2026: 254380, u2025: 10993, u2026: 9938, varM: -5.8, varU: -9.6 },
  { mes: "Mar", y2025: 330215, y2026: 276116, u2025: 13380, u2026: 11340, varM: -16.4, varU: -15.2 },
  { mes: "Abr*", y2025: 147388, y2026: 130365, u2025: 5810, u2026: 5148, varM: -11.5, varU: -11.4 },
];

const PRODUCTOS_YTD = [
  { corto: "Chicharron Natural", m25: 196424, m26: 222865, var: 13.5, inv: 1104, semInv: 3.9, estado: "Vigilar" },
  { corto: "Rodajitas Spicy Limon", m25: 128803, m26: 124054, var: -3.7, inv: 2151, semInv: 5.0, estado: "OK" },
  { corto: "St. Elote 125g", m25: 155725, m26: 122765, var: -21.2, inv: 868, semInv: 3.2, estado: "Vigilar" },
  { corto: "Classic White 25g", m25: 124361, m26: 103024, var: -17.2, inv: 2443, semInv: 7.1, estado: "Holgado" },
  { corto: "Classic White 125g", m25: 98631, m26: 89908, var: -8.8, inv: 832, semInv: 5.0, estado: "OK" },
  { corto: "St. Elote 25g", m25: 113142, m26: 89668, var: -20.7, inv: 2263, semInv: 7.0, estado: "Holgado" },
  { corto: "Cheddar Jal. 25g", m25: 92373, m26: 88032, var: -4.7, inv: 857, semInv: 4.4, estado: "OK" },
  { corto: "Cheddar Jal. 125g", m25: 67594, m26: 59117, var: -12.5, inv: 2102, semInv: 9.3, estado: "Holgado" },
  { corto: "Chile Piquin", m25: 53434, m26: 40395, var: -24.4, inv: 1604, semInv: 11.1, estado: "Holgado" },
];

const PIE_DATA = PRODUCTOS_YTD.map((p) => ({ name: p.corto, value: p.m26 }));
const PIE_COLORS = ["#ea580c", "#f97316", "#fb923c", "#fdba74", "#fed7aa", "#c2410c", "#9a3412", "#7c2d12", "#431407"];

const TOP_TIENDAS = [
  { tienda: "HEB MTY Chipinque", ciudad: "Monterrey", cluster: "AA", monto: 48079, uds: 1975 },
  { tienda: "HEB MTY Valle Oriente", ciudad: "Monterrey", cluster: "AA", monto: 46768, uds: 1768 },
  { tienda: "HEB MTY San Pedro", ciudad: "Monterrey", cluster: "AA", monto: 46488, uds: 2052 },
  { tienda: "HEB MTY Contry", ciudad: "Monterrey", cluster: "A", monto: 37066, uds: 1529 },
  { tienda: "HEB MTY Valle Alto", ciudad: "Monterrey", cluster: "AA Light", monto: 36286, uds: 1511 },
  { tienda: "HEB MTY Tec", ciudad: "Monterrey", cluster: "A", monto: 32449, uds: 1303 },
  { tienda: "HEB MTY San Nicolas", ciudad: "Monterrey", cluster: "A", monto: 28797, uds: 1105 },
  { tienda: "HEB MTY El Uro", ciudad: "Monterrey", cluster: "AA Light", monto: 28033, uds: 1244 },
  { tienda: "HEB LEO Cerro Gordo", ciudad: "Leon", cluster: "AA Light", monto: 27861, uds: 1261 },
  { tienda: "HEB MTY Cumbres", ciudad: "Monterrey", cluster: "AA Light", monto: 25543, uds: 997 },
];

const ALERTAS_RESTOCK = [
  { producto: "St. Elote 125g", tiendas: 7 },
  { producto: "Chicharron Natural", tiendas: 2 },
  { producto: "Classic White 25g", tiendas: 2 },
  { producto: "Cheddar Jal. 25g", tiendas: 1 },
  { producto: "Chile Piquin", tiendas: 1 },
];
const TOTAL_RESTOCK = 14;

const ALERTAS_ANAQUEL = [
  { producto: "St. Elote 125g", tiendas: 7 },
  { producto: "Chile Piquin", tiendas: 6 },
  { producto: "Classic White 25g", tiendas: 6 },
  { producto: "Cheddar Jal. 25g", tiendas: 4 },
  { producto: "Rodajitas Spicy Limon", tiendas: 4 },
  { producto: "Chicharron Natural", tiendas: 1 },
];
const TOTAL_ANAQUEL = 28;

/* ================================================================
   HELPERS
   ================================================================ */

const fmt = (n: number) => "$" + n.toLocaleString("es-MX", { maximumFractionDigits: 0 });
const fmtK = (n: number) => "$" + (n / 1000).toFixed(0) + "K";
const fmtU = (n: number) => n.toLocaleString("es-MX", { maximumFractionDigits: 0 });

const VarBadge = ({ v }: { v: number }) => (
  <span
    className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold ${
      v >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
    }`}
  >
    {v >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
    {v >= 0 ? "+" : ""}
    {v.toFixed(1)}%
  </span>
);

const EstadoBadge = ({ e }: { e: string }) => {
  const colors: Record<string, string> = {
    Vigilar: "bg-red-100 text-red-700 border-red-300",
    OK: "bg-green-100 text-green-700 border-green-300",
    Holgado: "bg-blue-100 text-blue-700 border-blue-300",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${colors[e] || ""}`}>
      {e}
    </span>
  );
};

const clusterColor = (c: string) => {
  if (c === "AA") return "bg-orange-600 text-white";
  if (c === "A") return "bg-orange-200 text-orange-800";
  return "bg-orange-100 text-orange-700";
};

/* ================================================================
   SLIDE 1 — PORTADA
   ================================================================ */

function Slide1() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-orange-50 to-orange-100 p-8">
      <img src="/4buddies-logo.jpeg" alt="4BUDDIES" className="h-24 mb-6 rounded-xl shadow-lg" />
      <h1 className="text-4xl font-bold text-orange-900 mb-2">Salud del Negocio</h1>
      <h2 className="text-2xl text-orange-700 mb-1">4BUDDIES x HEB</h2>
      <p className="text-orange-600 text-lg mb-8">YTD 2026 vs 2025 | Al 15 Abr 2026</p>

      <div className="flex gap-4">
        {/* YTD Monto */}
        <div className="bg-white rounded-xl shadow px-6 py-3 text-center border border-orange-200">
          <p className="text-sm text-orange-600 font-medium">YTD Monto</p>
          <p className="text-2xl font-bold text-orange-900">{fmtK(YTD.monto26)}</p>
          <VarBadge v={YTD.varMonto} />
        </div>
        {/* YTD Unidades */}
        <div className="bg-white rounded-xl shadow px-6 py-3 text-center border border-orange-200">
          <p className="text-sm text-orange-600 font-medium">YTD Unidades</p>
          <p className="text-2xl font-bold text-orange-900">{fmtU(YTD.uds26)}</p>
          <VarBadge v={YTD.varUds} />
        </div>
        {/* Alertas */}
        <div className="bg-white rounded-xl shadow px-6 py-3 text-center border border-orange-200">
          <p className="text-sm text-orange-600 font-medium">Alertas Inventario</p>
          <p className="text-2xl font-bold text-red-600">{YTD.alertas}</p>
          <span className="text-xs text-gray-500">restock bajo</span>
        </div>
        {/* Tiendas */}
        <div className="bg-white rounded-xl shadow px-6 py-3 text-center border border-orange-200">
          <p className="text-sm text-orange-600 font-medium">Tiendas</p>
          <p className="text-2xl font-bold text-orange-900">{YTD.tiendas}</p>
          <span className="text-xs text-gray-500">operativas</span>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   SLIDE 2 — VENTA MENSUAL
   ================================================================ */

function Slide2() {
  const ytdRow = {
    mes: "YTD",
    y2025: VENTAS_MES.reduce((s, m) => s + m.y2025, 0),
    y2026: VENTAS_MES.reduce((s, m) => s + m.y2026, 0),
    u2025: VENTAS_MES.reduce((s, m) => s + m.u2025, 0),
    u2026: VENTAS_MES.reduce((s, m) => s + m.u2026, 0),
    varM: YTD.varMonto,
    varU: YTD.varUds,
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-orange-50 to-orange-100 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <img src="/4buddies-logo.jpeg" alt="" className="h-8 rounded-lg" />
        <h2 className="text-xl font-bold text-orange-900">Venta Mensual &mdash; 2025 vs 2026</h2>
        <span className="text-xs text-orange-500 ml-auto">*Abr 2026 parcial (15 dias), comparado vs mismos 15 dias de 2025</span>
      </div>

      {/* Body */}
      <div className="flex gap-4 flex-1">
        {/* Chart */}
        <div className="bg-white rounded-xl shadow p-4 flex-1 border border-orange-200">
          <h3 className="text-sm font-semibold text-orange-700 mb-2">Ingresos por Mes ($)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={VENTAS_MES} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
              <XAxis dataKey="mes" tick={{ fill: "#9a3412", fontSize: 12 }} />
              <YAxis tickFormatter={(v) => fmtK(v)} tick={{ fill: "#9a3412", fontSize: 11 }} />
              <Tooltip formatter={(v) => fmt(Number(v))} />
              <Legend />
              <Bar dataKey="y2025" name="2025" fill="#fdba74" radius={[4, 4, 0, 0]} />
              <Bar dataKey="y2026" name="2026" fill="#ea580c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tables */}
        <div className="w-[380px] flex flex-col gap-3">
          {/* Ingresos */}
          <div className="bg-white rounded-xl shadow p-3 border border-orange-200">
            <h3 className="text-sm font-semibold text-orange-700 mb-2">Ingresos ($)</h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-orange-600 text-white">
                  <th className="p-1.5 text-left rounded-tl">Mes</th>
                  <th className="p-1.5 text-right">2025</th>
                  <th className="p-1.5 text-right">2026</th>
                  <th className="p-1.5 text-right rounded-tr">Var</th>
                </tr>
              </thead>
              <tbody>
                {VENTAS_MES.map((m, i) => (
                  <tr key={m.mes} className={i % 2 === 0 ? "bg-orange-50" : ""}>
                    <td className="p-1.5 text-left">{m.mes}</td>
                    <td className="p-1.5 text-right text-gray-700">{fmtK(m.y2025)}</td>
                    <td className="p-1.5 text-right font-semibold text-orange-900">{fmtK(m.y2026)}</td>
                    <td className="p-1.5 text-right"><VarBadge v={m.varM} /></td>
                  </tr>
                ))}
                <tr className="bg-orange-100 font-bold border-t-2 border-orange-300">
                  <td className="p-1.5 text-left">{ytdRow.mes}</td>
                  <td className="p-1.5 text-right text-gray-700">{fmtK(ytdRow.y2025)}</td>
                  <td className="p-1.5 text-right text-orange-900">{fmtK(ytdRow.y2026)}</td>
                  <td className="p-1.5 text-right"><VarBadge v={ytdRow.varM} /></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Unidades */}
          <div className="bg-white rounded-xl shadow p-3 border border-orange-200">
            <h3 className="text-sm font-semibold text-orange-700 mb-2">Unidades</h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-orange-600 text-white">
                  <th className="p-1.5 text-left rounded-tl">Mes</th>
                  <th className="p-1.5 text-right">2025</th>
                  <th className="p-1.5 text-right">2026</th>
                  <th className="p-1.5 text-right rounded-tr">Var</th>
                </tr>
              </thead>
              <tbody>
                {VENTAS_MES.map((m, i) => (
                  <tr key={m.mes} className={i % 2 === 0 ? "bg-orange-50" : ""}>
                    <td className="p-1.5 text-left">{m.mes}</td>
                    <td className="p-1.5 text-right text-gray-700">{fmtU(m.u2025)}</td>
                    <td className="p-1.5 text-right font-semibold text-orange-900">{fmtU(m.u2026)}</td>
                    <td className="p-1.5 text-right"><VarBadge v={m.varU} /></td>
                  </tr>
                ))}
                <tr className="bg-orange-100 font-bold border-t-2 border-orange-300">
                  <td className="p-1.5 text-left">{ytdRow.mes}</td>
                  <td className="p-1.5 text-right text-gray-700">{fmtU(ytdRow.u2025)}</td>
                  <td className="p-1.5 text-right text-orange-900">{fmtU(ytdRow.u2026)}</td>
                  <td className="p-1.5 text-right"><VarBadge v={ytdRow.varU} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Insight */}
      <div className="mt-3 bg-white/80 rounded-lg p-2 text-xs text-orange-800 border border-orange-200">
        <strong>Lectura:</strong> YTD (Ene-Mar completos + Abr parcial) baja -8.8% en monto y -10.6% en unidades vs 2025. Marzo fue el mes con mayor caida (-16.4%). Abril parcial (15 dias) cae -11.5% vs mismos 15 dias de 2025. La tendencia es de baja sostenida y se esta acelerando.
      </div>
    </div>
  );
}

/* ================================================================
   SLIDE 3 — SALUD POR PRODUCTO
   ================================================================ */

function Slide3() {
  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-orange-50 to-orange-100 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <img src="/4buddies-logo.jpeg" alt="" className="h-8 rounded-lg" />
        <h2 className="text-xl font-bold text-orange-900">Salud por Producto &mdash; YTD 2026 vs 2025</h2>
        <span className="text-xs text-orange-500 ml-auto">Ene-Mar 2026 completos + Abr parcial</span>
      </div>

      {/* Body */}
      <div className="flex gap-4 flex-1">
        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow p-3 border border-orange-200 w-[280px] flex flex-col items-center">
          <h3 className="text-sm font-semibold text-orange-700 mb-1">Participacion YTD 2026</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={PIE_DATA}
                cx="50%"
                cy="50%"
                outerRadius={85}
                dataKey="value"
                label={({ name, percent }) => {
                  const n = name ?? "";
                  return `${n.length > 12 ? n.slice(0, 12) + ".." : n} ${((percent ?? 0) * 100).toFixed(0)}%`;
                }}
                labelLine={false}
                fontSize={9}
              >
                {PIE_DATA.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => fmt(Number(v))} />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-xs text-orange-700 mt-1 text-center">
            <strong>Chicharron Natural</strong> es el unico producto que crece (+13.5%)
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-xl shadow p-3 border border-orange-200 flex-1 overflow-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-orange-600 text-white">
                <th className="p-1.5 text-left rounded-tl">Producto</th>
                <th className="p-1.5 text-right">2025</th>
                <th className="p-1.5 text-right">2026</th>
                <th className="p-1.5 text-right">Var</th>
                <th className="p-1.5 text-right">Inv (uds)</th>
                <th className="p-1.5 text-right">Sem. Inv</th>
                <th className="p-1.5 text-center rounded-tr">Estado</th>
              </tr>
            </thead>
            <tbody>
              {PRODUCTOS_YTD.map((p, i) => (
                <tr key={p.corto} className={i % 2 === 0 ? "bg-orange-50" : ""}>
                  <td className="p-1.5 text-left font-medium text-orange-900">{p.corto}</td>
                  <td className="p-1.5 text-right text-gray-600">{fmtK(p.m25)}</td>
                  <td className="p-1.5 text-right font-semibold text-orange-900">{fmtK(p.m26)}</td>
                  <td className="p-1.5 text-right"><VarBadge v={p.var} /></td>
                  <td className="p-1.5 text-right text-gray-700">{fmtU(p.inv)}</td>
                  <td className="p-1.5 text-right font-medium">{p.semInv.toFixed(1)}</td>
                  <td className="p-1.5 text-center"><EstadoBadge e={p.estado} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insight */}
      <div className="mt-3 bg-white/80 rounded-lg p-2 text-xs text-orange-800 border border-orange-200">
        <strong>Lectura:</strong> Chicharron Natural crece +13.5% y es el #1 en venta, pero tiene solo 3.9 semanas de inventario (Vigilar). St. Elote 125g cae -21.2% y tiene solo 3.2 semanas — riesgo de desabasto. Chile Piquin es el que mas cae (-24.4%) pero tiene inventario holgado (11 semanas).
      </div>
    </div>
  );
}

/* ================================================================
   SLIDE 4 — TOP TIENDAS + ALERTAS
   ================================================================ */

function Slide4() {
  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-orange-50 to-orange-100 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <img src="/4buddies-logo.jpeg" alt="" className="h-8 rounded-lg" />
        <h2 className="text-xl font-bold text-orange-900">Top Tiendas + Alertas</h2>
        <span className="text-xs text-orange-500 ml-auto">YTD 2026</span>
      </div>

      {/* Body */}
      <div className="flex gap-4 flex-1">
        {/* Top 10 Tiendas */}
        <div className="bg-white rounded-xl shadow p-3 border border-orange-200 flex-1">
          <h3 className="text-sm font-semibold text-orange-700 mb-2 flex items-center gap-1">
            <Store size={14} /> Top 10 Tiendas YTD 2026
          </h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-orange-600 text-white">
                <th className="p-1 text-left rounded-tl">#</th>
                <th className="p-1 text-left">Tienda</th>
                <th className="p-1 text-left">Ciudad</th>
                <th className="p-1 text-center">Cluster</th>
                <th className="p-1 text-right">Monto</th>
                <th className="p-1 text-right rounded-tr">Uds</th>
              </tr>
            </thead>
            <tbody>
              {TOP_TIENDAS.map((t, i) => (
                <tr key={t.tienda} className={i % 2 === 0 ? "bg-orange-50" : ""}>
                  <td className="p-1 text-orange-600 font-bold">{i + 1}</td>
                  <td className="p-1 font-medium text-orange-900">{t.tienda}</td>
                  <td className="p-1 text-gray-600">{t.ciudad}</td>
                  <td className="p-1 text-center">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${clusterColor(t.cluster)}`}>
                      {t.cluster}
                    </span>
                  </td>
                  <td className="p-1 text-right font-semibold text-orange-900">{fmtK(t.monto)}</td>
                  <td className="p-1 text-right text-gray-700">{fmtU(t.uds)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Alertas */}
        <div className="w-[340px] flex flex-col gap-3">
          {/* Restock */}
          <div className="bg-white rounded-xl shadow p-3 border border-red-200 flex-1">
            <h3 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-1">
              <AlertTriangle size={14} /> Restock Urgente
              <span className="ml-auto text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                {TOTAL_RESTOCK} combinaciones
              </span>
            </h3>
            <p className="text-[10px] text-gray-500 mb-2">
              Tienda-producto con &lt;15 dias de inventario (ajustado con OC en transito)
            </p>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-red-600 text-white">
                  <th className="p-1.5 text-left rounded-tl">Producto</th>
                  <th className="p-1.5 text-right rounded-tr">Tiendas</th>
                </tr>
              </thead>
              <tbody>
                {ALERTAS_RESTOCK.map((a, i) => (
                  <tr key={a.producto} className={i % 2 === 0 ? "bg-red-50" : ""}>
                    <td className="p-1.5 text-red-900">{a.producto}</td>
                    <td className="p-1.5 text-right font-bold text-red-700">{a.tiendas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Anaquel */}
          <div className="bg-white rounded-xl shadow p-3 border border-amber-200 flex-1">
            <h3 className="text-sm font-semibold text-amber-700 mb-2 flex items-center gap-1">
              <Box size={14} /> Problema de Anaquel
              <span className="ml-auto text-[10px] bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">
                {TOTAL_ANAQUEL} combinaciones
              </span>
            </h3>
            <p className="text-[10px] text-gray-500 mb-2">
              Inventario &gt;0 pero $0 venta en 15 dias (el SKU si vende en otras tiendas)
            </p>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-amber-600 text-white">
                  <th className="p-1.5 text-left rounded-tl">Producto</th>
                  <th className="p-1.5 text-right rounded-tr">Tiendas</th>
                </tr>
              </thead>
              <tbody>
                {ALERTAS_ANAQUEL.map((a, i) => (
                  <tr key={a.producto} className={i % 2 === 0 ? "bg-amber-50" : ""}>
                    <td className="p-1.5 text-amber-900">{a.producto}</td>
                    <td className="p-1.5 text-right font-bold text-amber-700">{a.tiendas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recomendaciones */}
      <div className="mt-3 bg-white/80 rounded-lg p-2 text-xs text-orange-800 border border-orange-200">
        <strong>Recomendaciones:</strong> (1) Solicitar OC para St. Elote 125g y Chicharron Natural — menos de 4 semanas de inventario. (2) Revisar exhibicion de St. Elote 125g, Chile Piquin y Classic White 25g en tiendas con inventario sin venta (28 casos). (3) Ver detalle completo por tienda en el Excel del weekly-heb.
      </div>
    </div>
  );
}

/* ================================================================
   MAIN — CAROUSEL
   ================================================================ */

const SLIDES = [Slide1, Slide2, Slide3, Slide4];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const next = useCallback(() => setCurrent((c) => Math.min(c + 1, SLIDES.length - 1)), []);
  const prev = useCallback(() => setCurrent((c) => Math.max(c - 1, 0)), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  const SlideComponent = SLIDES[current];

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-950 p-4">
      <div className="relative w-[1280px] aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-orange-700">
        <SlideComponent />

        {/* Navigation */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-orange-900/90 backdrop-blur rounded-full px-4 py-1.5 shadow-lg">
          <button onClick={prev} disabled={current === 0} className="text-orange-300 hover:text-white disabled:opacity-30 transition-colors">
            <ChevronLeft size={20} />
          </button>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === current ? "bg-orange-400 scale-125" : "bg-orange-700 hover:bg-orange-500"
              }`}
            />
          ))}
          <button onClick={next} disabled={current === SLIDES.length - 1} className="text-orange-300 hover:text-white disabled:opacity-30 transition-colors">
            <ChevronRight size={20} />
          </button>
          <span className="text-orange-400 text-xs ml-2">
            {current + 1}/{SLIDES.length}
          </span>
        </div>
      </div>
    </div>
  );
}
