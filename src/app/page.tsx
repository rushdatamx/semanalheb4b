"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight,
  TrendingUp, Store, Target, Tag,
} from "lucide-react";

// ============================================================
//  DATOS (hardcoded) — Reporte Sell-Out HEB · YTD Ene–Jun 2026 vs 2025
//  Corte: 30 jun 2026 (junio completo). Excluye julio (parcial), CEDIS y SKUs discontinuados.
// ============================================================

const CORTE = "Al 30 Jun 2026";

const YTD = {
  monto25: 1706780, monto26: 1601569, varMonto: -6.2,
  uds25: 68701, uds26: 62607, varUds: -8.9,
  tiendas: 64,
  ticket25: 24.84, ticket26: 25.58, varTicket: 3.0,
};

const VENTAS_MES = [
  { mes: "Ene", y2025: 282960, y2026: 278968, u2025: 11158, u2026: 10516, varM: -1.4, varU: -5.8 },
  { mes: "Feb", y2025: 269925, y2026: 254380, u2025: 10993, u2026: 9938, varM: -5.8, varU: -9.6 },
  { mes: "Mar", y2025: 330215, y2026: 276116, u2025: 13380, u2026: 11340, varM: -16.4, varU: -15.2 },
  { mes: "Abr", y2025: 275427, y2026: 266481, u2025: 10841, u2026: 10380, varM: -3.2, varU: -4.3 },
  { mes: "May", y2025: 283242, y2026: 280316, u2025: 11794, u2026: 11283, varM: -1.0, varU: -4.3 },
  { mes: "Jun", y2025: 265012, y2026: 245309, u2025: 10535, u2026: 9150, varM: -7.4, varU: -13.1 },
];

const PRODUCTOS = [
  { corto: "Chicharrón Natural", m25: 330821, m26: 394690, var: 19.3, u26: 7923, part: 24.6, tend: "Crece" },
  { corto: "Rodajitas Spicy Limón 30g", m25: 217151, m26: 210670, var: -3.0, u26: 10776, part: 13.2, tend: "Estable" },
  { corto: "Street Elote 125g", m25: 251732, m26: 210159, var: -16.5, u26: 6809, part: 13.1, tend: "Cae" },
  { corto: "Classic White 25g", m25: 205059, m26: 165977, var: -19.1, u26: 9601, part: 10.4, tend: "Cae" },
  { corto: "Classic White 125g", m25: 160200, m26: 156474, var: -2.3, u26: 4428, part: 9.8, tend: "Estable" },
  { corto: "Cheddar Jalapeño 125g", m25: 152599, m26: 151283, var: -0.9, u26: 4924, part: 9.4, tend: "Estable" },
  { corto: "Street Elote 25g", m25: 184536, m26: 144726, var: -21.6, u26: 8434, part: 9.0, tend: "Cae" },
  { corto: "Cheddar Jalapeño 25g", m25: 114350, m26: 97601, var: -14.6, u26: 5740, part: 6.1, tend: "Cae" },
  { corto: "Chile Piquín 25g", m25: 90332, m26: 69990, var: -22.5, u26: 3972, part: 4.4, tend: "Cae" },
];

const PIE_COLORS = ["#ea580c", "#f97316", "#fb923c", "#fdba74", "#fed7aa", "#c2410c", "#9a3412", "#7c2d12", "#431407"];
const PIE_DATA = PRODUCTOS.map((p) => ({ name: p.corto, value: p.m26 }));

const TOP_TIENDAS = [
  { tienda: "MTY VALLE ORIENTE", ciudad: "Monterrey", cluster: "AA", monto: 77794, uds: 2934 },
  { tienda: "MTY CHIPINQUE", ciudad: "Monterrey", cluster: "AA", monto: 75004, uds: 3069 },
  { tienda: "MTY SAN PEDRO", ciudad: "Monterrey", cluster: "AA", monto: 72420, uds: 3150 },
  { tienda: "MTY CONTRY", ciudad: "Monterrey", cluster: "A", monto: 62670, uds: 2609 },
  { tienda: "MTY VALLE ALTO", ciudad: "Monterrey", cluster: "AA Light", monto: 62256, uds: 2528 },
  { tienda: "MTY TEC", ciudad: "Monterrey", cluster: "A", monto: 57606, uds: 2261 },
  { tienda: "MTY SAN NICOLAS", ciudad: "Monterrey", cluster: "A", monto: 48794, uds: 1829 },
  { tienda: "LEO CERRO GORDO", ciudad: "León", cluster: "AA Light", monto: 47711, uds: 2148 },
  { tienda: "MTY EL URO", ciudad: "Monterrey", cluster: "AA Light", monto: 47628, uds: 2094 },
  { tienda: "MTY CUMBRES", ciudad: "Monterrey", cluster: "AA Light", monto: 42070, uds: 1661 },
  { tienda: "MTY BOSQUES DE LAS LOMAS", ciudad: "Monterrey", cluster: "A", monto: 38842, uds: 1535 },
  { tienda: "MTY PUERTA DE HIERRO", ciudad: "Monterrey", cluster: "A", monto: 37653, uds: 1441 },
  { tienda: "MTY CONCORDIA", ciudad: "Monterrey", cluster: "B", monto: 34799, uds: 1371 },
  { tienda: "MTY SANTA CATARINA", ciudad: "Monterrey", cluster: "B", monto: 33917, uds: 1283 },
  { tienda: "MTY LOS MORALES", ciudad: "Monterrey", cluster: "B", monto: 32796, uds: 1256 },
];

const CLUSTERS = [
  { cluster: "A", tiendas: 10, monto: 337783, uds: 12873, part: 21.1 },
  { cluster: "B", tiendas: 15, monto: 337254, uds: 13005, part: 21.1 },
  { cluster: "AA Light", tiendas: 8, monto: 299946, uds: 12071, part: 18.7 },
  { cluster: "AA", tiendas: 3, monto: 225219, uds: 9153, part: 14.1 },
  { cluster: "C", tiendas: 10, monto: 194801, uds: 7317, part: 12.2 },
  { cluster: "B Bajío", tiendas: 5, monto: 70633, uds: 2698, part: 4.4 },
  { cluster: "B Frontera", tiendas: 6, monto: 63363, uds: 2504, part: 4.0 },
  { cluster: "C Bajío", tiendas: 4, monto: 45920, uds: 1812, part: 2.9 },
  { cluster: "EAA", tiendas: 1, monto: 13707, uds: 691, part: 0.9 },
];

// --- Impacto promoción Mayo 2026 (vigencia 08/05 – 04/06) — ordenado por impacto ---
const PROMO = [
  { producto: "Classic White 125g", mecanica: "Rebajado a $35", udsAbr: 722, udsMay: 852, dUds: 18.0, precioAbr: 35.98, precioMay: 33.21, dPrecio: -7.7, dVs25: 22.1, veredicto: "Sí fuerte" },
  { producto: "Classic White 25g", mecanica: "2x$34", udsAbr: 1528, udsMay: 1642, dUds: 7.5, precioAbr: 17.31, precioMay: 16.93, dPrecio: -2.2, dVs25: -18.7, veredicto: "Sin efecto claro" },
  { producto: "Rodajitas Spicy Limón 30g", mecanica: "Rebajado a $19.90", udsAbr: 1874, udsMay: 2006, dUds: 7.0, precioAbr: 19.32, precioMay: 18.78, dPrecio: -2.8, dVs25: 1.3, veredicto: "Sí moderado" },
];
const PROMO_CHART = PROMO.map((p) => ({
  name: p.producto.replace("Classic White ", "CW ").replace("Rodajitas Spicy Limón 30g", "Rodajitas"),
  Abr: p.udsAbr, May: p.udsMay,
}));

const HALLAZGOS = [
  "La venta YTD Ene–Jun 2026 cae −6.2% en pesos ($1.60M vs $1.71M) y −8.9% en unidades vs 2025. El precio promedio sube +3.0%, lo que amortigua parte de la caída en volumen.",
  "Chicharrón Natural es el motor del negocio: +19.3% y ya es el #1 con 24.6% de la venta. Compensa buena parte de la caída de las palomitas.",
  "Las palomitas 25g son el foco de riesgo: Classic White −19%, Street Elote 25g −22%, Chile Piquín −22% y Cheddar 25g −15%. Es un problema transversal de la presentación chica.",
  "Marzo fue el peor mes (−16.4%) y junio cierra débil (−7.4% monto, −13.1% uds). Mayo fue el mes más parejo (−1.0%), apoyado por la promoción.",
  "La promo de mayo funcionó donde hubo rebaja directa: Classic White 125g (+18% uds, +22% vs may'25) fue el gran ganador; el 2x$34 solo frenó la caída del 25g.",
  "La venta está muy concentrada en Monterrey: 14 de las top 15 tiendas son de MTY. Los clusters A, B y AA Light concentran ~61% del negocio.",
];

// ============================================================
//  HELPERS
// ============================================================
const fmt = (n: number) => "$" + n.toLocaleString("es-MX", { maximumFractionDigits: 0 });
const fmtK = (n: number) => "$" + (n / 1000).toFixed(0) + "K";
const fmtU = (n: number) => n.toLocaleString("es-MX", { maximumFractionDigits: 0 });

const VarBadge = ({ v }: { v: number }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${v >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
    {v >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
    {v >= 0 ? "+" : ""}{v.toFixed(1)}%
  </span>
);

const TendBadge = ({ t }: { t: string }) => {
  const colors: Record<string, string> = {
    Crece: "bg-green-100 text-green-700 border-green-300",
    Estable: "bg-blue-100 text-blue-700 border-blue-300",
    Cae: "bg-red-100 text-red-700 border-red-300",
  };
  return <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${colors[t] || ""}`}>{t}</span>;
};

const ClusterBadge = ({ c }: { c: string }) => {
  const map: Record<string, string> = {
    AA: "bg-orange-600 text-white",
    EAA: "bg-orange-700 text-white",
    A: "bg-orange-200 text-orange-800",
    "AA Light": "bg-orange-100 text-orange-700",
  };
  return <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${map[c] || "bg-gray-100 text-gray-700"}`}>{c}</span>;
};

const VerBadge = ({ v }: { v: string }) => {
  const map: Record<string, string> = {
    "Sí fuerte": "bg-green-100 text-green-700",
    "Sí moderado": "bg-amber-100 text-amber-700",
    "Sin efecto claro": "bg-gray-100 text-gray-600",
  };
  return <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${map[v] || ""}`}>{v}</span>;
};

// ============================================================
//  SLIDES
// ============================================================

function Slide1() {
  return (
    <div className="flex flex-col h-full p-8 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="flex items-center gap-5 mb-5">
        <img src="/4buddies-logo.jpeg" alt="4BUDDIES" className="h-20 rounded-xl shadow-lg" />
        <div>
          <h1 className="text-3xl font-bold text-orange-900">Reporte de Sell-Out</h1>
          <h2 className="text-xl text-orange-700">4BUDDIES × HEB</h2>
          <p className="text-orange-600">YTD 2026 vs 2025 · Enero – Junio</p>
        </div>
      </div>

      <div className="flex gap-4 mb-5">
        <div className="bg-white rounded-xl shadow px-5 py-3 text-center border border-orange-200 flex-1">
          <p className="text-xs text-orange-600 mb-1">Venta YTD 2026</p>
          <p className="text-2xl font-bold text-orange-900">{fmtK(YTD.monto26)}</p>
          <div className="mt-1"><VarBadge v={YTD.varMonto} /></div>
        </div>
        <div className="bg-white rounded-xl shadow px-5 py-3 text-center border border-orange-200 flex-1">
          <p className="text-xs text-orange-600 mb-1">Unidades YTD 2026</p>
          <p className="text-2xl font-bold text-orange-900">{fmtU(YTD.uds26)}</p>
          <div className="mt-1"><VarBadge v={YTD.varUds} /></div>
        </div>
        <div className="bg-white rounded-xl shadow px-5 py-3 text-center border border-orange-200 flex-1">
          <p className="text-xs text-orange-600 mb-1">Precio Prom.</p>
          <p className="text-2xl font-bold text-orange-900">{fmt(YTD.ticket26)}</p>
          <div className="mt-1"><VarBadge v={YTD.varTicket} /></div>
        </div>
        <div className="bg-white rounded-xl shadow px-5 py-3 text-center border border-orange-200 flex-1">
          <p className="text-xs text-orange-600 mb-1">Tiendas Activas</p>
          <p className="text-2xl font-bold text-orange-900">{YTD.tiendas}</p>
          <p className="text-xs text-orange-500 mt-1">operativas</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4 border border-orange-200 flex-1">
        <h3 className="text-sm font-semibold text-orange-700 mb-2">Venta por mes — 2025 vs 2026 (Ene–Jun)</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-orange-700 text-white">
              <th className="p-1.5 text-left">Mes</th>
              <th className="p-1.5 text-center" colSpan={3}>MXN ($)</th>
              <th className="p-1.5 text-center" colSpan={3}>Unidades</th>
            </tr>
            <tr className="bg-orange-600 text-white">
              <th className="p-1.5"></th>
              <th className="p-1.5 text-right">2025</th>
              <th className="p-1.5 text-right">2026</th>
              <th className="p-1.5 text-center">Var</th>
              <th className="p-1.5 text-right">2025</th>
              <th className="p-1.5 text-right">2026</th>
              <th className="p-1.5 text-center">Var</th>
            </tr>
          </thead>
          <tbody>
            {VENTAS_MES.map((r, i) => (
              <tr key={r.mes} className={i % 2 ? "bg-orange-50" : ""}>
                <td className="p-1.5 font-medium text-orange-900">{r.mes}</td>
                <td className="p-1.5 text-right text-gray-600">{fmtK(r.y2025)}</td>
                <td className="p-1.5 text-right font-semibold text-orange-900">{fmtK(r.y2026)}</td>
                <td className="p-1.5 text-center"><VarBadge v={r.varM} /></td>
                <td className="p-1.5 text-right text-gray-600">{fmtU(r.u2025)}</td>
                <td className="p-1.5 text-right font-semibold text-orange-900">{fmtU(r.u2026)}</td>
                <td className="p-1.5 text-center"><VarBadge v={r.varU} /></td>
              </tr>
            ))}
            <tr className="bg-orange-100 font-bold border-t-2 border-orange-300">
              <td className="p-1.5 text-orange-900">YTD</td>
              <td className="p-1.5 text-right">{fmtK(YTD.monto25)}</td>
              <td className="p-1.5 text-right text-orange-900">{fmtK(YTD.monto26)}</td>
              <td className="p-1.5 text-center"><VarBadge v={YTD.varMonto} /></td>
              <td className="p-1.5 text-right">{fmtU(YTD.uds25)}</td>
              <td className="p-1.5 text-right text-orange-900">{fmtU(YTD.uds26)}</td>
              <td className="p-1.5 text-center"><VarBadge v={YTD.varUds} /></td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs text-orange-500 mt-3">Excluye julio (mes en curso), SKUs discontinuados y CEDIS. Comparación directa Ene–Jun ambos años.</p>
      </div>
    </div>
  );
}

function Slide2() {
  const lastM = VENTAS_MES[VENTAS_MES.length - 1];
  return (
    <div className="flex flex-col h-full p-6 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="flex items-center gap-3 mb-3">
        <img src="/4buddies-logo.jpeg" alt="4BUDDIES" className="h-8 rounded" />
        <h2 className="text-xl font-bold text-orange-900">Venta Mensual — 2025 vs 2026</h2>
        <span className="ml-auto text-xs text-orange-500">Ene–Jun, meses completos ambos años</span>
      </div>

      <div className="flex gap-4 flex-1">
        <div className="flex-1 bg-white rounded-xl shadow p-3 border border-orange-200">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={VENTAS_MES} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={fmtK} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => fmt(Number(v))} />
              <Legend />
              <Bar dataKey="y2025" name="2025" fill="#fdba74" radius={[4, 4, 0, 0]} />
              <Bar dataKey="y2026" name="2026" fill="#ea580c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="w-[380px] flex flex-col gap-2">
          <div className="bg-white rounded-xl shadow border border-orange-200 overflow-hidden">
            <p className="text-xs font-semibold text-orange-700 px-2 pt-1.5">Ingresos ($)</p>
            <table className="w-full text-xs">
              <thead><tr className="bg-orange-600 text-white">
                <th className="p-1 text-left">Mes</th><th className="p-1 text-right">2025</th><th className="p-1 text-right">2026</th><th className="p-1 text-center">Var</th>
              </tr></thead>
              <tbody>
                {VENTAS_MES.map((r, i) => (
                  <tr key={r.mes} className={i % 2 ? "bg-orange-50" : ""}>
                    <td className="p-1 text-orange-900">{r.mes}</td>
                    <td className="p-1 text-right text-gray-600">{fmtK(r.y2025)}</td>
                    <td className="p-1 text-right font-semibold text-orange-900">{fmtK(r.y2026)}</td>
                    <td className="p-1 text-center"><VarBadge v={r.varM} /></td>
                  </tr>
                ))}
                <tr className="bg-orange-100 font-bold border-t-2 border-orange-300">
                  <td className="p-1">YTD</td><td className="p-1 text-right">{fmtK(YTD.monto25)}</td>
                  <td className="p-1 text-right">{fmtK(YTD.monto26)}</td><td className="p-1 text-center"><VarBadge v={YTD.varMonto} /></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-white rounded-xl shadow border border-orange-200 overflow-hidden">
            <p className="text-xs font-semibold text-orange-700 px-2 pt-1.5">Unidades</p>
            <table className="w-full text-xs">
              <thead><tr className="bg-orange-600 text-white">
                <th className="p-1 text-left">Mes</th><th className="p-1 text-right">2025</th><th className="p-1 text-right">2026</th><th className="p-1 text-center">Var</th>
              </tr></thead>
              <tbody>
                {VENTAS_MES.map((r, i) => (
                  <tr key={r.mes} className={i % 2 ? "bg-orange-50" : ""}>
                    <td className="p-1 text-orange-900">{r.mes}</td>
                    <td className="p-1 text-right text-gray-600">{fmtU(r.u2025)}</td>
                    <td className="p-1 text-right font-semibold text-orange-900">{fmtU(r.u2026)}</td>
                    <td className="p-1 text-center"><VarBadge v={r.varU} /></td>
                  </tr>
                ))}
                <tr className="bg-orange-100 font-bold border-t-2 border-orange-300">
                  <td className="p-1">YTD</td><td className="p-1 text-right">{fmtU(YTD.uds25)}</td>
                  <td className="p-1 text-right">{fmtU(YTD.uds26)}</td><td className="p-1 text-center"><VarBadge v={YTD.varUds} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-3 bg-white/80 rounded-lg p-2 text-xs text-orange-800 border border-orange-200">
        <strong>Lectura:</strong> La venta 2026 corre por debajo de 2025 todos los meses. Marzo fue la mayor caída (−16.4%) y junio cierra débil ({lastM.varM}% monto, {lastM.varU}% uds). Mayo (−1.0%) fue el mes más cercano al año anterior, apoyado por la promoción.
      </div>
    </div>
  );
}

function Slide3() {
  const top3 = PRODUCTOS.slice(0, 3).reduce((a, p) => a + p.part, 0).toFixed(0);
  return (
    <div className="flex flex-col h-full p-6 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="flex items-center gap-3 mb-3">
        <img src="/4buddies-logo.jpeg" alt="4BUDDIES" className="h-8 rounded" />
        <h2 className="text-xl font-bold text-orange-900">Desempeño por Producto — YTD 2026 vs 2025</h2>
        <span className="ml-auto text-xs text-orange-500">Ene–Jun 2026</span>
      </div>

      <div className="flex gap-4 flex-1">
        <div className="w-[300px] bg-white rounded-xl shadow p-3 border border-orange-200 flex flex-col">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={PIE_DATA} dataKey="value" outerRadius={90} labelLine={false}
                label={({ percent }) => `${((percent as number) * 100).toFixed(0)}%`}>
                {PIE_DATA.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => fmt(Number(v))} />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-xs text-orange-700 text-center mt-1"><strong>Top 3 productos = {top3}%</strong> de la venta</p>
        </div>

        <div className="flex-1 bg-white rounded-xl shadow border border-orange-200 overflow-hidden">
          <table className="w-full text-xs">
            <thead><tr className="bg-orange-600 text-white">
              <th className="p-1.5 text-left">Producto</th><th className="p-1.5 text-right">2025</th>
              <th className="p-1.5 text-right">2026</th><th className="p-1.5 text-center">Var</th>
              <th className="p-1.5 text-right">Uds 26</th><th className="p-1.5 text-right">Part %</th><th className="p-1.5 text-center">Tend</th>
            </tr></thead>
            <tbody>
              {PRODUCTOS.map((p, i) => (
                <tr key={p.corto} className={i % 2 ? "bg-orange-50" : ""}>
                  <td className="p-1.5 font-medium text-orange-900">{p.corto}</td>
                  <td className="p-1.5 text-right text-gray-600">{fmtK(p.m25)}</td>
                  <td className="p-1.5 text-right font-semibold text-orange-900">{fmtK(p.m26)}</td>
                  <td className="p-1.5 text-center"><VarBadge v={p.var} /></td>
                  <td className="p-1.5 text-right">{fmtU(p.u26)}</td>
                  <td className="p-1.5 text-right">{p.part}%</td>
                  <td className="p-1.5 text-center"><TendBadge t={p.tend} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-3 bg-white/80 rounded-lg p-2 text-xs text-orange-800 border border-orange-200">
        <strong>Lectura:</strong> <strong>Chicharrón Natural</strong> es el motor (+19.3%, ya #1 con 24.6%). Cheddar 125g, Classic White 125g y Rodajitas se sostienen. El riesgo está en las presentaciones 25g: Chile Piquín (−22.5%), Street Elote 25g (−21.6%) y Classic White 25g (−19.1%) son las mayores caídas.
      </div>
    </div>
  );
}

function Slide4() {
  const totCl = CLUSTERS.reduce((a, c) => a + c.monto, 0);
  return (
    <div className="flex flex-col h-full p-6 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="flex items-center gap-3 mb-3">
        <img src="/4buddies-logo.jpeg" alt="4BUDDIES" className="h-8 rounded" />
        <h2 className="text-xl font-bold text-orange-900">Top Tiendas y Clusters — YTD 2026</h2>
      </div>

      <div className="flex gap-4 flex-1">
        <div className="flex-1 bg-white rounded-xl shadow border border-orange-200 overflow-hidden">
          <p className="flex items-center gap-1 text-sm font-semibold text-orange-700 p-2"><Store size={14} /> Top 15 Tiendas</p>
          <table className="w-full text-xs">
            <thead><tr className="bg-orange-600 text-white">
              <th className="p-1 text-center">#</th><th className="p-1 text-left">Tienda</th><th className="p-1 text-left">Ciudad</th>
              <th className="p-1 text-center">Cluster</th><th className="p-1 text-right">Monto</th><th className="p-1 text-right">Uds</th>
            </tr></thead>
            <tbody>
              {TOP_TIENDAS.map((t, i) => (
                <tr key={t.tienda} className={i % 2 ? "bg-orange-50" : ""}>
                  <td className="p-1 text-center text-orange-600 font-bold">{i + 1}</td>
                  <td className="p-1 font-medium text-orange-900">{t.tienda}</td>
                  <td className="p-1 text-gray-600">{t.ciudad}</td>
                  <td className="p-1 text-center"><ClusterBadge c={t.cluster} /></td>
                  <td className="p-1 text-right font-semibold text-orange-900">{fmtK(t.monto)}</td>
                  <td className="p-1 text-right text-gray-600">{fmtU(t.uds)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="w-[360px] bg-white rounded-xl shadow border border-orange-200 overflow-hidden">
          <p className="flex items-center gap-1 text-sm font-semibold text-orange-700 p-2"><Target size={14} /> Venta por Cluster</p>
          <table className="w-full text-xs">
            <thead><tr className="bg-orange-600 text-white">
              <th className="p-1 text-left">Cluster</th><th className="p-1 text-center">Tiendas</th><th className="p-1 text-right">Monto</th><th className="p-1 text-right">Part %</th>
            </tr></thead>
            <tbody>
              {CLUSTERS.map((c, i) => (
                <tr key={c.cluster} className={i % 2 ? "bg-orange-50" : ""}>
                  <td className="p-1"><ClusterBadge c={c.cluster} /></td>
                  <td className="p-1 text-center">{c.tiendas}</td>
                  <td className="p-1 text-right font-semibold text-orange-900">{fmtK(c.monto)}</td>
                  <td className="p-1 text-right">{c.part}%</td>
                </tr>
              ))}
              <tr className="bg-orange-100 font-bold border-t-2 border-orange-300">
                <td className="p-1 text-orange-900">Total</td>
                <td className="p-1 text-center">{CLUSTERS.reduce((a, c) => a + c.tiendas, 0)}</td>
                <td className="p-1 text-right">{fmtK(totCl)}</td>
                <td className="p-1 text-right">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-3 bg-white/80 rounded-lg p-2 text-xs text-orange-800 border border-orange-200">
        <strong>Lectura:</strong> Venta muy concentrada en Monterrey (14 de las top 15 tiendas). Los clusters A, B y AA Light suman ~61% del negocio; los 3 de cluster AA (Valle Oriente, Chipinque, San Pedro) son las tiendas más productivas.
      </div>
    </div>
  );
}

function Slide5() {
  return (
    <div className="flex flex-col h-full p-6 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="flex items-center gap-3 mb-3">
        <img src="/4buddies-logo.jpeg" alt="4BUDDIES" className="h-8 rounded" />
        <h2 className="text-xl font-bold text-orange-900">Impacto Promoción — Mayo 2026</h2>
        <span className="ml-auto text-xs text-orange-500">Vigencia 08/05 – 04/06 · MIRAESTELS FOODS · mayo capta ~3.5 sem</span>
      </div>

      <div className="flex flex-col gap-3 flex-1">
        <div className="bg-white rounded-xl shadow p-3 border border-orange-200">
          <table className="w-full text-xs">
            <thead><tr className="bg-orange-600 text-white">
              <th className="p-1.5 text-left">Producto</th><th className="p-1.5 text-left">Mecánica</th>
              <th className="p-1.5 text-right">Uds Abr</th><th className="p-1.5 text-right">Uds May</th>
              <th className="p-1.5 text-center">Δ vs Abr</th><th className="p-1.5 text-center">Δ vs May'25</th>
              <th className="p-1.5 text-right">Precio May</th><th className="p-1.5 text-center">Veredicto</th>
            </tr></thead>
            <tbody>
              {PROMO.map((p, i) => (
                <tr key={p.producto} className={i % 2 ? "bg-orange-50" : ""}>
                  <td className="p-1.5 font-medium text-orange-900">{p.producto}</td>
                  <td className="p-1.5"><span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 text-[11px] font-semibold">{p.mecanica}</span></td>
                  <td className="p-1.5 text-right text-gray-600">{fmtU(p.udsAbr)}</td>
                  <td className="p-1.5 text-right font-semibold text-orange-900">{fmtU(p.udsMay)}</td>
                  <td className="p-1.5 text-center"><VarBadge v={p.dUds} /></td>
                  <td className="p-1.5 text-center"><VarBadge v={p.dVs25} /></td>
                  <td className="p-1.5 text-right font-semibold text-orange-900">{fmt(p.precioMay)}</td>
                  <td className="p-1.5 text-center"><VerBadge v={p.veredicto} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-4 flex-1">
          <div className="flex-1 bg-white rounded-xl shadow p-3 border border-orange-200">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={PROMO_CHART} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Abr" name="Abril" fill="#fdba74" radius={[4, 4, 0, 0]} />
                <Bar dataKey="May" name="Mayo" fill="#ea580c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="w-[360px] bg-white rounded-xl shadow p-3 border border-orange-200">
            <p className="flex items-center gap-1 text-sm font-semibold text-orange-700 mb-2"><Tag size={14} /> Lectura ejecutiva</p>
            <ul className="text-xs text-orange-800 space-y-2">
              <li>🥇 <strong>Classic White 125g ($35)</strong>: +18% uds vs abril y +22% vs may'25. La rebaja directa movió volumen — <strong>el gran ganador</strong>.</li>
              <li>🟡 <strong>Rodajitas 30g ($19.90)</strong>: +7% vs abril, precio a ~$18.78. Efecto positivo moderado.</li>
              <li>⚪ <strong>Classic White 25g (2x$34)</strong>: +7.5% vs abril, pero aún −18.7% vs may'25. La promo frenó la caída, no la revirtió.</li>
              <li>💡 <strong>Recomendación:</strong> repetir la rebaja directa en Classic White 125g; el 2x$34 no basta para recuperar el 25g.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-3 bg-white/80 rounded-lg p-2 text-xs text-orange-800 border border-orange-200">
        <strong>Conclusión:</strong> La <strong>rebaja directa</strong> (monto x venta) funcionó mejor que el <strong>2x$34</strong>. Los 3 SKUs subieron volumen vs abril, pero solo Classic White 125g y Rodajitas quedaron por encima de su año anterior. Vale la pena repetir la rebaja directa en presentaciones grandes.
      </div>
    </div>
  );
}

function Slide6() {
  const acciones = [
    "Empujar Chicharrón Natural: es el único producto que crece (+19%) y ya carga 1 de cada 4 pesos. Asegurar disponibilidad y exhibición en las top tiendas de MTY.",
    "Plan de rescate para las palomitas 25g (Classic White, Street Elote, Chile Piquín, Cheddar): revisar precio, anaquel y promoción — es una caída transversal de la presentación chica.",
    "Repetir la rebaja directa en Classic White 125g y evaluarla en más SKUs grandes; fue la mecánica promocional que sí generó volumen incremental.",
  ];
  return (
    <div className="flex flex-col h-full p-8 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="flex items-center gap-3 mb-4">
        <img src="/4buddies-logo.jpeg" alt="4BUDDIES" className="h-10 rounded" />
        <h2 className="text-2xl font-bold text-orange-900">Hallazgos y Acciones</h2>
      </div>

      <div className="flex gap-4 flex-1">
        <div className="flex-1 space-y-2">
          <p className="text-sm font-semibold text-orange-700 mb-1">Hallazgos</p>
          {HALLAZGOS.map((h, i) => (
            <div key={i} className="bg-white rounded-lg p-3 border border-orange-200 flex gap-2">
              <TrendingUp size={16} className="text-orange-500 shrink-0 mt-0.5" />
              <p className="text-xs text-orange-900">{h}</p>
            </div>
          ))}
        </div>

        <div className="w-[380px] space-y-3">
          <p className="text-sm font-semibold text-orange-700 mb-1">Acciones recomendadas</p>
          {acciones.map((a, i) => (
            <div key={i} className="bg-white rounded-lg p-3 border border-orange-200 flex gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-sm">{i + 1}</span>
              <p className="text-xs text-orange-900">{a}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-orange-500 mt-4">Reporte generado con datos de sell-out HEB · 4BUDDIES · {CORTE}</p>
    </div>
  );
}

const SLIDES = [Slide1, Slide2, Slide3, Slide4, Slide5, Slide6];

export default function Home() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") setCurrent((c) => Math.min(c + 1, SLIDES.length - 1));
      if (e.key === "ArrowLeft") setCurrent((c) => Math.max(c - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const Slide = SLIDES[current];

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-950 p-4">
      <div className="relative w-[1280px] aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-orange-700">
        <Slide />

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-orange-900/90 backdrop-blur rounded-full px-4 py-1.5 shadow-lg">
          <button onClick={() => setCurrent((c) => Math.max(c - 1, 0))} disabled={current === 0}
            className="text-orange-300 hover:text-white disabled:opacity-30">
            <ChevronLeft size={20} />
          </button>
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-orange-400 scale-125" : "bg-orange-700"}`} />
          ))}
          <button onClick={() => setCurrent((c) => Math.min(c + 1, SLIDES.length - 1))} disabled={current === SLIDES.length - 1}
            className="text-orange-300 hover:text-white disabled:opacity-30">
            <ChevronRight size={20} />
          </button>
          <span className="text-orange-300 text-xs ml-1">{current + 1}/{SLIDES.length}</span>
        </div>
      </div>
    </div>
  );
}
