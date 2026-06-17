"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight,
  TrendingUp, Store, Target, Tag,
} from "lucide-react";

// ===================== DATOS (corte al 16 Jun 2026, YTD Ene–Jun*16) =====================
const CORTE = "Al 16 Jun 2026 · YTD Ene–Jun (jun = mismos 16 días ambos años)";

const YTD = {
  monto25: 1586318, monto26: 1491513, varMonto: -6.0,
  uds25: 64127, uds26: 58552, varUds: -8.7,
  tiendas: 64,
  ticket25: 24.74, ticket26: 25.47, varTicket: 3.0,
};

const VENTAS_MES = [
  { mes: "Ene", y2025: 282960, y2026: 278968, u2025: 11158, u2026: 10516, varM: -1.4, varU: -5.8 },
  { mes: "Feb", y2025: 269925, y2026: 254380, u2025: 10993, u2026: 9938, varM: -5.8, varU: -9.6 },
  { mes: "Mar", y2025: 330215, y2026: 276116, u2025: 13380, u2026: 11340, varM: -16.4, varU: -15.2 },
  { mes: "Abr", y2025: 275427, y2026: 266481, u2025: 10841, u2026: 10380, varM: -3.2, varU: -4.3 },
  { mes: "May", y2025: 283242, y2026: 280316, u2025: 11794, u2026: 11283, varM: -1.0, varU: -4.3 },
  { mes: "Jun*", y2025: 144550, y2026: 135253, u2025: 5961, u2026: 5095, varM: -6.4, varU: -14.5 },
];

const YTD_ROW = {
  mes: "YTD", y2025: 1586318, y2026: 1491513, u2025: 64127, u2026: 58552, varM: -6.0, varU: -8.7,
};

const PRODUCTOS = [
  { corto: "Chicharrón Natural", m25: 302897, m26: 361346, var: 19.3, u26: 7255, part: 24.2, tend: "Crece" },
  { corto: "Rodajitas Spicy Limón", m25: 201780, m26: 198027, var: -1.9, u26: 10167, part: 13.3, tend: "Estable" },
  { corto: "Street Elote 125g", m25: 234450, m26: 194687, var: -17.0, u26: 6307, part: 13.1, tend: "Cae" },
  { corto: "Classic White 25g", m25: 193279, m26: 157326, var: -18.6, u26: 9060, part: 10.5, tend: "Cae" },
  { corto: "Classic White 125g", m25: 149613, m26: 144567, var: -3.4, u26: 4097, part: 9.7, tend: "Estable" },
  { corto: "Cheddar Jalapeño 125g", m25: 140929, m26: 140430, var: -0.4, u26: 4571, part: 9.4, tend: "Estable" },
  { corto: "Street Elote 25g", m25: 172924, m26: 137506, var: -20.5, u26: 7975, part: 9.2, tend: "Cae" },
  { corto: "Cheddar Jalapeño 25g", m25: 106477, m26: 92018, var: -13.6, u26: 5386, part: 6.2, tend: "Cae" },
  { corto: "Chile Piquín 25g", m25: 83968, m26: 65607, var: -21.9, u26: 3734, part: 4.4, tend: "Cae" },
];

const PIE_DATA = PRODUCTOS.map((p) => ({ name: p.corto, value: p.m26 }));
const PIE_COLORS = ["#ea580c", "#f97316", "#fb923c", "#fdba74", "#fed7aa", "#c2410c", "#9a3412", "#7c2d12", "#431407"];

const TOP_TIENDAS = [
  { tienda: "MTY Valle Oriente", ciudad: "Monterrey", cluster: "AA", monto: 72627, uds: 2757 },
  { tienda: "MTY Chipinque", ciudad: "Monterrey", cluster: "AA", monto: 71622, uds: 2930 },
  { tienda: "MTY San Pedro", ciudad: "Monterrey", cluster: "AA", monto: 68827, uds: 3010 },
  { tienda: "MTY Contry", ciudad: "Monterrey", cluster: "A", monto: 59248, uds: 2475 },
  { tienda: "MTY Valle Alto", ciudad: "Monterrey", cluster: "AA Light", monto: 58188, uds: 2385 },
  { tienda: "MTY Tec", ciudad: "Monterrey", cluster: "A", monto: 52970, uds: 2105 },
  { tienda: "MTY San Nicolás", ciudad: "Monterrey", cluster: "A", monto: 45309, uds: 1703 },
  { tienda: "León Cerro Gordo", ciudad: "León", cluster: "AA Light", monto: 44567, uds: 2037 },
  { tienda: "MTY El Uro", ciudad: "Monterrey", cluster: "AA Light", monto: 44488, uds: 1981 },
  { tienda: "MTY Cumbres", ciudad: "Monterrey", cluster: "AA Light", monto: 39433, uds: 1567 },
  { tienda: "MTY Puerta de Hierro", ciudad: "Monterrey", cluster: "A", monto: 35696, uds: 1378 },
  { tienda: "MTY Bosques de las Lomas", ciudad: "Monterrey", cluster: "A", monto: 35530, uds: 1418 },
  { tienda: "MTY Concordia", ciudad: "Monterrey", cluster: "B", monto: 32097, uds: 1264 },
  { tienda: "MTY Santa Catarina", ciudad: "Monterrey", cluster: "B", monto: 31840, uds: 1218 },
  { tienda: "MTY Los Morales", ciudad: "Monterrey", cluster: "B", monto: 30838, uds: 1188 },
];

const CLUSTERS = [
  { cluster: "B", tiendas: 15, monto: 314025, uds: 12177, part: 21.2 },
  { cluster: "A", tiendas: 10, monto: 312797, uds: 11950, part: 21.1 },
  { cluster: "AA Light", tiendas: 8, monto: 278987, uds: 11293, part: 18.9 },
  { cluster: "AA", tiendas: 3, monto: 213076, uds: 8697, part: 14.4 },
  { cluster: "C", tiendas: 10, monto: 181712, uds: 6856, part: 12.3 },
  { cluster: "B Bajío", tiendas: 5, monto: 64379, uds: 2415, part: 4.4 },
  { cluster: "B Frontera", tiendas: 6, monto: 58164, uds: 2326, part: 3.9 },
  { cluster: "C Bajío", tiendas: 4, monto: 42952, uds: 1709, part: 2.9 },
  { cluster: "EAA", tiendas: 1, monto: 13557, uds: 684, part: 0.9 },
];

// --- Impacto promoción Mayo 2026 (vigencia 08/05 – 04/06) ---
const PROMO = [
  {
    producto: "Classic White 125g", corto: "Classic White 125g", mecanica: "Rebajado a $35", tipo: "Monto x venta",
    udsAbr: 722, udsMay: 852, dUds: 18.0, precioAbr: 35.98, precioMay: 33.21, dPrecio: -7.7,
    dVs25: 22.1, veredicto: "Sí fuerte",
  },
  {
    producto: "Classic White 25g", corto: "Classic White 25g", mecanica: "2x$34", tipo: "Ahorra Más",
    udsAbr: 1528, udsMay: 1642, dUds: 7.5, precioAbr: 17.31, precioMay: 16.93, dPrecio: -2.2,
    dVs25: -18.7, veredicto: "Sin efecto claro",
  },
  {
    producto: "Rodajitas Spicy Limón 30g", corto: "Rodajitas 30g", mecanica: "Rebajado a $19.90", tipo: "Monto x venta",
    udsAbr: 1874, udsMay: 2006, dUds: 7.0, precioAbr: 19.32, precioMay: 18.78, dPrecio: -2.8,
    dVs25: 1.3, veredicto: "Sí moderado",
  },
];

const PROMO_BAR = PROMO.map((p) => ({ name: p.corto, Abril: p.udsAbr, Mayo: p.udsMay }));

const HALLAZGOS = [
  "La venta YTD (Ene–Jun 16) cae −6.0% en monto y −8.7% en unidades vs 2025. El ticket promedio sube +3.0% ($25.47), lo que amortigua parte de la caída en valor.",
  "Marzo fue el peor mes (−16.4% monto, −15.2% uds) y arrastra todo el YTD; Ene, Abr y May ya están casi planos (−1% a −3%), señal de estabilización.",
  "Junio (mismos 16 días vs 2025) viene en −6.4% monto y −14.5% uds. Hay que vigilarlo: la caída en unidades se acentúa, aunque el mes aún no cierra.",
  "Chicharrón Natural es el motor del negocio: +19.3% y 24.2% del monto. Compensa casi por completo las caídas del resto del portafolio.",
  "Tres SKUs concentran el riesgo: Street Elote 25g (−20.5%), Chile Piquín 25g (−21.9%) y Street Elote 125g (−17.0%). Entre los tres explican la mayor parte de la baja.",
  "El negocio es 100% regiomontano: 14 de las 15 top tiendas están en Monterrey y los clusters A/AA/AA Light concentran ~54% del monto.",
];

// ===================== HELPERS =====================
const fmt = (n: number) => "$" + n.toLocaleString("es-MX", { maximumFractionDigits: 0 });
const fmtK = (n: number) => "$" + (n / 1000).toFixed(0) + "K";
const fmtU = (n: number) => n.toLocaleString("es-MX", { maximumFractionDigits: 0 });

const VarBadge = ({ v }: { v: number }) => (
  <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold ${v >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
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
  return <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${map[v] || ""}`}>{v}</span>;
};

// ===================== SLIDES =====================
function Slide1() {
  return (
    <div className="flex flex-col h-full p-8 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="flex items-center gap-5 mb-5">
        <img src="/4buddies-logo.jpeg" className="h-20 rounded-xl shadow-lg" alt="4BUDDIES" />
        <div>
          <h1 className="text-3xl font-bold text-orange-900">Reporte de Sell-Out</h1>
          <h2 className="text-xl text-orange-700">4BUDDIES × HEB</h2>
          <p className="text-orange-600">YTD 2026 vs 2025 · Enero – Junio (corte día 16)</p>
        </div>
      </div>

      <div className="flex gap-4 mb-5">
        <div className="bg-white rounded-xl shadow px-5 py-3 text-center border border-orange-200 flex-1">
          <p className="text-xs text-orange-600 mb-1">Venta YTD 2026</p>
          <p className="text-2xl font-bold text-orange-900">{fmtK(YTD.monto26)}</p>
          <VarBadge v={YTD.varMonto} />
        </div>
        <div className="bg-white rounded-xl shadow px-5 py-3 text-center border border-orange-200 flex-1">
          <p className="text-xs text-orange-600 mb-1">Unidades YTD 2026</p>
          <p className="text-2xl font-bold text-orange-900">{fmtU(YTD.uds26)}</p>
          <VarBadge v={YTD.varUds} />
        </div>
        <div className="bg-white rounded-xl shadow px-5 py-3 text-center border border-orange-200 flex-1">
          <p className="text-xs text-orange-600 mb-1">Precio Prom.</p>
          <p className="text-2xl font-bold text-orange-900">{fmt(YTD.ticket26)}</p>
          <VarBadge v={YTD.varTicket} />
        </div>
        <div className="bg-white rounded-xl shadow px-5 py-3 text-center border border-orange-200 flex-1">
          <p className="text-xs text-orange-600 mb-1">Tiendas Activas</p>
          <p className="text-2xl font-bold text-orange-900">{YTD.tiendas}</p>
          <p className="text-xs text-orange-500">operativas</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4 border border-orange-200 flex-1">
        <h3 className="text-sm font-semibold text-orange-700 mb-2">Venta por mes — 2025 vs 2026 (Ene–Jun*)</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-orange-700 text-white">
              <th className="p-1.5 text-left" rowSpan={2}>Mes</th>
              <th className="p-1.5 text-center border-l border-orange-500" colSpan={3}>MXN ($)</th>
              <th className="p-1.5 text-center border-l border-orange-500" colSpan={3}>Unidades</th>
            </tr>
            <tr className="bg-orange-600 text-white">
              <th className="p-1.5 text-right">2025</th>
              <th className="p-1.5 text-right">2026</th>
              <th className="p-1.5 text-center">Var</th>
              <th className="p-1.5 text-right border-l border-orange-500">2025</th>
              <th className="p-1.5 text-right">2026</th>
              <th className="p-1.5 text-center">Var</th>
            </tr>
          </thead>
          <tbody>
            {VENTAS_MES.map((m, i) => (
              <tr key={m.mes} className={i % 2 ? "bg-orange-50" : ""}>
                <td className="p-1.5 font-medium text-orange-900">{m.mes}</td>
                <td className="p-1.5 text-right text-gray-600">{fmtK(m.y2025)}</td>
                <td className="p-1.5 text-right font-semibold text-orange-900">{fmtK(m.y2026)}</td>
                <td className="p-1.5 text-center"><VarBadge v={m.varM} /></td>
                <td className="p-1.5 text-right text-gray-600 border-l border-orange-100">{fmtU(m.u2025)}</td>
                <td className="p-1.5 text-right font-semibold text-orange-900">{fmtU(m.u2026)}</td>
                <td className="p-1.5 text-center"><VarBadge v={m.varU} /></td>
              </tr>
            ))}
            <tr className="bg-orange-100 font-bold border-t-2 border-orange-300">
              <td className="p-1.5 text-orange-900">{YTD_ROW.mes}</td>
              <td className="p-1.5 text-right text-gray-700">{fmtK(YTD_ROW.y2025)}</td>
              <td className="p-1.5 text-right text-orange-900">{fmtK(YTD_ROW.y2026)}</td>
              <td className="p-1.5 text-center"><VarBadge v={YTD_ROW.varM} /></td>
              <td className="p-1.5 text-right text-gray-700 border-l border-orange-200">{fmtU(YTD_ROW.u2025)}</td>
              <td className="p-1.5 text-right text-orange-900">{fmtU(YTD_ROW.u2026)}</td>
              <td className="p-1.5 text-center"><VarBadge v={YTD_ROW.varU} /></td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs text-orange-500 mt-3">
          *Jun = mismos 16 días en ambos años (1–16), por eso es comparable. Excluye SKUs discontinuados y CEDIS.
        </p>
      </div>
    </div>
  );
}

function Slide2() {
  return (
    <div className="flex flex-col h-full p-6 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <img src="/4buddies-logo.jpeg" className="h-8 rounded" alt="" />
          <h2 className="text-xl font-bold text-orange-900">Venta Mensual — 2025 vs 2026</h2>
        </div>
        <p className="text-xs text-orange-500 text-right">
          *Jun = mismos 16 días en ambos años<br />(1–16), comparación justa
        </p>
      </div>

      <div className="flex gap-4 flex-1">
        <div className="bg-white rounded-xl shadow p-4 border border-orange-200 flex-1">
          <ResponsiveContainer width="100%" height={220}>
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

        <div className="w-[380px] flex flex-col gap-3">
          <div className="bg-white rounded-xl shadow border border-orange-200 overflow-hidden">
            <table className="w-full text-xs">
              <thead><tr className="bg-orange-600 text-white">
                <th className="p-1.5 text-left">Ingresos ($)</th><th className="p-1.5 text-right">2025</th><th className="p-1.5 text-right">2026</th><th className="p-1.5 text-center">Var</th>
              </tr></thead>
              <tbody>
                {VENTAS_MES.map((m, i) => (
                  <tr key={m.mes} className={i % 2 ? "bg-orange-50" : ""}>
                    <td className="p-1.5 font-medium text-orange-900">{m.mes}</td>
                    <td className="p-1.5 text-right text-gray-600">{fmtK(m.y2025)}</td>
                    <td className="p-1.5 text-right font-semibold text-orange-900">{fmtK(m.y2026)}</td>
                    <td className="p-1.5 text-center"><VarBadge v={m.varM} /></td>
                  </tr>
                ))}
                <tr className="bg-orange-100 font-bold border-t-2 border-orange-300">
                  <td className="p-1.5 text-orange-900">YTD</td>
                  <td className="p-1.5 text-right text-gray-700">{fmtK(YTD_ROW.y2025)}</td>
                  <td className="p-1.5 text-right text-orange-900">{fmtK(YTD_ROW.y2026)}</td>
                  <td className="p-1.5 text-center"><VarBadge v={YTD_ROW.varM} /></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-white rounded-xl shadow border border-orange-200 overflow-hidden">
            <table className="w-full text-xs">
              <thead><tr className="bg-orange-600 text-white">
                <th className="p-1.5 text-left">Unidades</th><th className="p-1.5 text-right">2025</th><th className="p-1.5 text-right">2026</th><th className="p-1.5 text-center">Var</th>
              </tr></thead>
              <tbody>
                {VENTAS_MES.map((m, i) => (
                  <tr key={m.mes} className={i % 2 ? "bg-orange-50" : ""}>
                    <td className="p-1.5 font-medium text-orange-900">{m.mes}</td>
                    <td className="p-1.5 text-right text-gray-600">{fmtU(m.u2025)}</td>
                    <td className="p-1.5 text-right font-semibold text-orange-900">{fmtU(m.u2026)}</td>
                    <td className="p-1.5 text-center"><VarBadge v={m.varU} /></td>
                  </tr>
                ))}
                <tr className="bg-orange-100 font-bold border-t-2 border-orange-300">
                  <td className="p-1.5 text-orange-900">YTD</td>
                  <td className="p-1.5 text-right text-gray-700">{fmtU(YTD_ROW.u2025)}</td>
                  <td className="p-1.5 text-right text-orange-900">{fmtU(YTD_ROW.u2026)}</td>
                  <td className="p-1.5 text-center"><VarBadge v={YTD_ROW.varU} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-3 bg-white/80 rounded-lg p-2 text-xs text-orange-800 border border-orange-200">
        <strong>Lectura:</strong> La caída se concentra en marzo (−16.4%). Ene, Abr y May ya están casi planos (−1% a −3%) → el negocio se estabilizó tras el bache de Q1. Junio (mismos 16 días, comparación justa) vuelve a abrir en −6.4% monto y −14.5% uds: hay que vigilar el cierre del mes.
      </div>
    </div>
  );
}

function Slide3() {
  return (
    <div className="flex flex-col h-full p-6 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="flex items-center gap-3 mb-3">
        <img src="/4buddies-logo.jpeg" className="h-8 rounded" alt="" />
        <h2 className="text-xl font-bold text-orange-900">Desempeño por Producto — YTD 2026 vs 2025</h2>
        <span className="text-xs text-orange-500">Ene–Jun 16 · 2026</span>
      </div>

      <div className="flex gap-4 flex-1">
        <div className="w-[300px] bg-white rounded-xl shadow p-3 border border-orange-200 flex flex-col">
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={PIE_DATA} outerRadius={90} dataKey="value" labelLine={false}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                {PIE_DATA.map((e, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => fmt(Number(v))} />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-xs text-orange-700 text-center mt-1">
            <strong>Top 3 productos = 50.6%</strong> del monto YTD 2026 (Chicharrón, Rodajitas, Street Elote 125g)
          </p>
        </div>

        <div className="flex-1 bg-white rounded-xl shadow border border-orange-200 overflow-hidden">
          <table className="w-full text-xs">
            <thead><tr className="bg-orange-600 text-white">
              <th className="p-1.5 text-left">Producto</th><th className="p-1.5 text-right">2025</th><th className="p-1.5 text-right">2026</th>
              <th className="p-1.5 text-center">Var</th><th className="p-1.5 text-right">Uds 26</th><th className="p-1.5 text-right">Part %</th><th className="p-1.5 text-center">Tend</th>
            </tr></thead>
            <tbody>
              {PRODUCTOS.map((p, i) => (
                <tr key={p.corto} className={i % 2 ? "bg-orange-50" : ""}>
                  <td className="p-1.5 font-medium text-orange-900">{p.corto}</td>
                  <td className="p-1.5 text-right text-gray-600">{fmtK(p.m25)}</td>
                  <td className="p-1.5 text-right font-semibold text-orange-900">{fmtK(p.m26)}</td>
                  <td className="p-1.5 text-center"><VarBadge v={p.var} /></td>
                  <td className="p-1.5 text-right text-gray-700">{fmtU(p.u26)}</td>
                  <td className="p-1.5 text-right text-orange-700">{p.part.toFixed(1)}%</td>
                  <td className="p-1.5 text-center"><TendBadge t={p.tend} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-3 bg-white/80 rounded-lg p-2 text-xs text-orange-800 border border-orange-200">
        <strong>Lectura:</strong> Chicharrón Natural es la estrella (+19.3%, 24% del monto) y sostiene el portafolio casi solo. Los que más caen: Chile Piquín (−21.9%), Street Elote 25g (−20.5%) y 125g (−17.0%). Rodajitas y los Cheddar aguantan estables.
      </div>
    </div>
  );
}

function Slide4() {
  return (
    <div className="flex flex-col h-full p-6 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="flex items-center gap-3 mb-3">
        <img src="/4buddies-logo.jpeg" className="h-8 rounded" alt="" />
        <h2 className="text-xl font-bold text-orange-900">Top Tiendas y Clusters — YTD 2026</h2>
      </div>

      <div className="flex gap-4 flex-1">
        <div className="flex-1 bg-white rounded-xl shadow border border-orange-200 overflow-hidden">
          <div className="bg-orange-600 text-white px-3 py-1.5 flex items-center gap-2 text-sm font-semibold">
            <Store size={14} /> Top 15 Tiendas
          </div>
          <table className="w-full text-xs">
            <thead><tr className="bg-orange-500 text-white">
              <th className="p-1 text-center">#</th><th className="p-1 text-left">Tienda</th><th className="p-1 text-left">Ciudad</th>
              <th className="p-1 text-center">Cluster</th><th className="p-1 text-right">Monto</th><th className="p-1 text-right">Uds</th>
            </tr></thead>
            <tbody>
              {TOP_TIENDAS.map((s, i) => (
                <tr key={s.tienda} className={i % 2 ? "bg-orange-50" : ""}>
                  <td className="p-1 text-center text-orange-600 font-bold">{i + 1}</td>
                  <td className="p-1 font-medium text-orange-900">{s.tienda}</td>
                  <td className="p-1 text-gray-600">{s.ciudad}</td>
                  <td className="p-1 text-center"><ClusterBadge c={s.cluster} /></td>
                  <td className="p-1 text-right font-semibold text-orange-900">{fmtK(s.monto)}</td>
                  <td className="p-1 text-right text-gray-700">{fmtU(s.uds)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="w-[360px] bg-white rounded-xl shadow border border-orange-200 overflow-hidden">
          <div className="bg-orange-600 text-white px-3 py-1.5 flex items-center gap-2 text-sm font-semibold">
            <Target size={14} /> Venta por Cluster
          </div>
          <table className="w-full text-xs">
            <thead><tr className="bg-orange-500 text-white">
              <th className="p-1.5 text-left">Cluster</th><th className="p-1.5 text-center">Tiendas</th><th className="p-1.5 text-right">Monto</th><th className="p-1.5 text-right">Part %</th>
            </tr></thead>
            <tbody>
              {CLUSTERS.map((c, i) => (
                <tr key={c.cluster} className={i % 2 ? "bg-orange-50" : ""}>
                  <td className="p-1.5"><ClusterBadge c={c.cluster} /></td>
                  <td className="p-1.5 text-center text-gray-700">{c.tiendas}</td>
                  <td className="p-1.5 text-right font-semibold text-orange-900">{fmtK(c.monto)}</td>
                  <td className="p-1.5 text-right text-orange-700">{c.part.toFixed(1)}%</td>
                </tr>
              ))}
              <tr className="bg-orange-100 font-bold border-t-2 border-orange-300">
                <td className="p-1.5 text-orange-900">Total</td>
                <td className="p-1.5 text-center">{CLUSTERS.reduce((a, c) => a + c.tiendas, 0)}</td>
                <td className="p-1.5 text-right text-orange-900">{fmtK(CLUSTERS.reduce((a, c) => a + c.monto, 0))}</td>
                <td className="p-1.5 text-right">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-3 bg-white/80 rounded-lg p-2 text-xs text-orange-800 border border-orange-200">
        <strong>Lectura:</strong> El negocio es regiomontano: 14 de las 15 top tiendas están en Monterrey. Por cluster, A + AA + AA Light concentran ~54% del monto. Los clusters B y C aportan volumen amplio en tiendas pero ticket menor.
      </div>
    </div>
  );
}

function Slide5() {
  return (
    <div className="flex flex-col h-full p-6 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <img src="/4buddies-logo.jpeg" className="h-8 rounded" alt="" />
          <h2 className="text-xl font-bold text-orange-900">Impacto Promoción — Mayo 2026</h2>
        </div>
        <p className="text-xs text-orange-500 text-right">Vigencia 08/05 – 04/06 · MIRAESTELS FOODS<br />Mayo capta ~3.5 semanas</p>
      </div>

      <div className="bg-white rounded-xl shadow p-3 border border-orange-200 mb-3">
        <table className="w-full text-xs">
          <thead><tr className="bg-orange-600 text-white">
            <th className="p-1.5 text-left">Producto</th><th className="p-1.5 text-center">Mecánica</th><th className="p-1.5 text-right">Uds Abr</th>
            <th className="p-1.5 text-right">Uds May</th><th className="p-1.5 text-center">Δ vs Abr</th><th className="p-1.5 text-center">Δ vs May&apos;25</th>
            <th className="p-1.5 text-right">Precio May</th><th className="p-1.5 text-center">Veredicto</th>
          </tr></thead>
          <tbody>
            {PROMO.map((p, i) => (
              <tr key={p.producto} className={i % 2 ? "bg-orange-50" : ""}>
                <td className="p-1.5 font-medium text-orange-900">{p.producto}</td>
                <td className="p-1.5 text-center"><span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[10px] font-semibold">{p.mecanica}</span></td>
                <td className="p-1.5 text-right text-gray-600">{fmtU(p.udsAbr)}</td>
                <td className="p-1.5 text-right font-semibold text-orange-900">{fmtU(p.udsMay)}</td>
                <td className="p-1.5 text-center"><VarBadge v={p.dUds} /></td>
                <td className="p-1.5 text-center"><VarBadge v={p.dVs25} /></td>
                <td className="p-1.5 text-right text-orange-700">{fmt(p.precioMay)}</td>
                <td className="p-1.5 text-center"><VerBadge v={p.veredicto} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4 flex-1">
        <div className="flex-1 bg-white rounded-xl shadow p-3 border border-orange-200">
          <p className="text-xs font-semibold text-orange-700 mb-1">Unidades Abril vs Mayo (SKUs en promo)</p>
          <ResponsiveContainer width="100%" height={185}>
            <BarChart data={PROMO_BAR} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Abril" fill="#fdba74" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Mayo" fill="#ea580c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="w-[360px] bg-white rounded-xl shadow p-3 border border-orange-200">
          <p className="text-sm font-semibold text-orange-700 mb-2 flex items-center gap-1"><Tag size={14} /> Lectura ejecutiva</p>
          <ul className="text-xs text-orange-800 space-y-2">
            <li>🏆 <strong>Classic White 125g ($35)</strong>: +18% vs abril y +22% vs may&apos;25. La rebaja directa sí jaló volumen — el gran ganador.</li>
            <li>👍 <strong>Rodajitas ($19.90)</strong>: +7% vs abril, vuelve a terreno positivo vs año pasado. Impacto moderado.</li>
            <li>⚠️ <strong>Classic White 25g (2x$34)</strong>: +7.5% vs abril pero aún −18.7% vs may&apos;25 → la promo frenó la caída, no la revirtió.</li>
            <li>💡 La rebaja de monto directo movió más volumen que el 2xN. Conviene repetir en formato 125g.</li>
          </ul>
        </div>
      </div>

      <div className="mt-3 bg-white/80 rounded-lg p-2 text-xs text-orange-800 border border-orange-200">
        <strong>Conclusión:</strong> La promo funcionó donde la rebaja fue directa (Classic White 125g, Rodajitas). El 2x$34 erosionó precio sin recuperar el nivel de 2025. Recomendado: priorizar rebaja directa de monto sobre 2xN en próximas activaciones.
      </div>
    </div>
  );
}

function Slide6() {
  const acciones = [
    { n: 1, t: "Proteger al motor", d: "Asegurar abasto y exhibición de Chicharrón Natural — sostiene 24% del monto y es el único en alza clara." },
    { n: 2, t: "Rescatar Street Elote y Chile Piquín", d: "Los 3 SKUs que más caen (−17% a −22%). Revisar precio, anaquel y rotación tienda por tienda en clusters A/AA." },
    { n: 3, t: "Repetir rebaja directa", d: "El formato 'rebajado a $X' (Classic White 125g, Rodajitas) movió volumen; el 2xN no. Aplicarlo en los SKUs a la baja." },
  ];
  return (
    <div className="flex flex-col h-full p-8 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="flex items-center gap-3 mb-4">
        <img src="/4buddies-logo.jpeg" className="h-10 rounded" alt="" />
        <h2 className="text-2xl font-bold text-orange-900">Hallazgos y Acciones</h2>
      </div>

      <div className="flex gap-5 flex-1">
        <div className="flex-1 flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-orange-700">Hallazgos</h3>
          {HALLAZGOS.map((h, i) => (
            <div key={i} className="bg-white rounded-lg p-3 border border-orange-200 flex gap-2 items-start">
              <TrendingUp size={16} className="text-orange-600 mt-0.5 shrink-0" />
              <p className="text-xs text-orange-900">{h}</p>
            </div>
          ))}
        </div>

        <div className="w-[380px] flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-orange-700">Acciones recomendadas</h3>
          {acciones.map((a) => (
            <div key={a.n} className="bg-white rounded-lg p-3 border border-orange-200 flex gap-3 items-start">
              <div className="w-7 h-7 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-sm shrink-0">{a.n}</div>
              <div>
                <p className="text-sm font-semibold text-orange-900">{a.t}</p>
                <p className="text-xs text-orange-700">{a.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-orange-500 mt-3">Reporte generado con datos de sell-out HEB · 4BUDDIES · {CORTE}</p>
    </div>
  );
}

const SLIDES = [Slide1, Slide2, Slide3, Slide4, Slide5, Slide6];

export default function Page() {
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
            className="text-orange-300 hover:text-white disabled:opacity-30"><ChevronLeft size={20} /></button>
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-orange-400 scale-125" : "bg-orange-700"}`} />
          ))}
          <button onClick={() => setCurrent((c) => Math.min(c + 1, SLIDES.length - 1))} disabled={current === SLIDES.length - 1}
            className="text-orange-300 hover:text-white disabled:opacity-30"><ChevronRight size={20} /></button>
          <span className="text-orange-300 text-xs ml-1">{current + 1}/{SLIDES.length}</span>
        </div>
      </div>
    </div>
  );
}
