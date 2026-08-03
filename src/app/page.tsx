"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight,
  TrendingUp, Store, Package, Target, Tag,
} from "lucide-react";

// ============================================================
//  DATOS (hardcoded) — Reporte Sell-Out HEB · YTD Ene–Jul 2026 vs 2025
//  Corte: 31 jul 2026 (julio completo). Excluye agosto (parcial), CEDIS y SKUs discontinuados.
// ============================================================

const CORTE = "Al 31 Jul 2026";

const YTD = {
  monto25: 1960931, monto26: 1828506, varMonto: -6.8,
  uds25: 78257, uds26: 70581, varUds: -9.8,
  tiendas: 65,
  ticket25: 25.06, ticket26: 25.91, varTicket: 3.4,
};

const VENTAS_MES = [
  { mes: "Ene", y2025: 282960, y2026: 278968, u2025: 11158, u2026: 10516, varM: -1.4, varU: -5.8 },
  { mes: "Feb", y2025: 269925, y2026: 254380, u2025: 10993, u2026: 9938, varM: -5.8, varU: -9.6 },
  { mes: "Mar", y2025: 330215, y2026: 276116, u2025: 13380, u2026: 11340, varM: -16.4, varU: -15.2 },
  { mes: "Abr", y2025: 275427, y2026: 266481, u2025: 10841, u2026: 10380, varM: -3.2, varU: -4.3 },
  { mes: "May", y2025: 283242, y2026: 280316, u2025: 11794, u2026: 11283, varM: -1.0, varU: -4.3 },
  { mes: "Jun", y2025: 265012, y2026: 245309, u2025: 10535, u2026: 9150, varM: -7.4, varU: -13.1 },
  { mes: "Jul", y2025: 254151, y2026: 226937, u2025: 9556, u2026: 7974, varM: -10.7, varU: -16.6 },
];

const PRODUCTOS = [
  { nombre: "Chicharrón de Cerdo Natural 75g", corto: "Chicharrón Natural 75g", m25: 395014, m26: 461868, var: 16.9, u26: 9269, part: 25.3, tend: "Crece" },
  { nombre: "Palomitas Street Elote 125g", corto: "Street Elote 125g", m25: 284312, m26: 242780, var: -14.6, u26: 7868, part: 13.3, tend: "Cae" },
  { nombre: "Rodajitas de Papa Spicy Limón 30g", corto: "Rodajitas Spicy Limón 30g", m25: 248072, m26: 238517, var: -3.9, u26: 12112, part: 13.0, tend: "Estable" },
  { nombre: "Palomitas Classic White 25g", corto: "Classic White 25g", m25: 233138, m26: 183939, var: -21.1, u26: 10583, part: 10.1, tend: "Cae" },
  { nombre: "Palomitas Classic White 125g", corto: "Classic White 125g", m25: 183545, m26: 181898, var: -0.9, u26: 5136, part: 9.9, tend: "Estable" },
  { nombre: "Palomitas Cheddar Jalapeño 125g", corto: "Cheddar Jalapeño 125g", m25: 175944, m26: 174794, var: -0.7, u26: 5686, part: 9.6, tend: "Estable" },
  { nombre: "Palomitas Street Elote 25g", corto: "Street Elote 25g", m25: 207178, m26: 157190, var: -24.1, u26: 9127, part: 8.6, tend: "Cae" },
  { nombre: "Palomitas Cheddar Jalapeño 25g", corto: "Cheddar Jalapeño 25g", m25: 130708, m26: 108360, var: -17.1, u26: 6324, part: 5.9, tend: "Cae" },
  { nombre: "Palomitas Chile Piquín 25g", corto: "Chile Piquín 25g", m25: 103020, m26: 79160, var: -23.2, u26: 4476, part: 4.3, tend: "Cae" },
];

const PIE_DATA = PRODUCTOS.map((p) => ({ name: p.corto, value: p.m26 }));
const PIE_COLORS = ["#ea580c", "#f97316", "#fb923c", "#fdba74", "#fed7aa", "#c2410c", "#9a3412", "#7c2d12", "#431407"];

const TOP_TIENDAS = [
  { tienda: "Mty Valle Oriente", ciudad: "Monterrey", cluster: "AA", monto: 86930, uds: 3240, var: -17.0 },
  { tienda: "Mty Chipinque", ciudad: "Monterrey", cluster: "AA", monto: 83244, uds: 3392, var: -18.5 },
  { tienda: "Mty San Pedro", ciudad: "Monterrey", cluster: "AA", monto: 80104, uds: 3449, var: -37.4 },
  { tienda: "Mty Valle Alto", ciudad: "Monterrey", cluster: "AA Light", monto: 72074, uds: 2871, var: -7.4 },
  { tienda: "Mty Contry", ciudad: "Monterrey", cluster: "A", monto: 71547, uds: 2940, var: -4.1 },
  { tienda: "Mty Tec", ciudad: "Monterrey", cluster: "A", monto: 65447, uds: 2541, var: -6.1 },
  { tienda: "Mty San Nicolás", ciudad: "Monterrey", cluster: "A", monto: 55491, uds: 2061, var: -4.6 },
  { tienda: "Mty El Uro", ciudad: "Monterrey", cluster: "AA Light", monto: 54402, uds: 2371, var: -14.6 },
  { tienda: "León Cerro Gordo", ciudad: "León", cluster: "AA Light", monto: 53146, uds: 2369, var: 23.8 },
  { tienda: "Mty Cumbres", ciudad: "Monterrey", cluster: "AA Light", monto: 46558, uds: 1816, var: -13.2 },
  { tienda: "Mty Bosques de las Lomas", ciudad: "Monterrey", cluster: "A", monto: 44757, uds: 1751, var: -5.2 },
  { tienda: "Mty Puerta de Hierro", ciudad: "Monterrey", cluster: "A", monto: 42396, uds: 1593, var: -6.9 },
  { tienda: "Mty Santa Catarina", ciudad: "Monterrey", cluster: "B", monto: 39474, uds: 1476, var: 14.6 },
  { tienda: "Mty Concordia", ciudad: "Monterrey", cluster: "B", monto: 38763, uds: 1494, var: 17.8 },
  { tienda: "Mty Los Morales", ciudad: "Monterrey", cluster: "B", monto: 36890, uds: 1397, var: -5.8 },
];

const CLUSTERS = [
  { cluster: "B", tiendas: 15, monto: 387100, uds: 14748, part: 21.2 },
  { cluster: "A", tiendas: 10, monto: 385774, uds: 14514, part: 21.1 },
  { cluster: "AA Light", tiendas: 8, monto: 339983, uds: 13506, part: 18.6 },
  { cluster: "AA", tiendas: 3, monto: 250278, uds: 10081, part: 13.7 },
  { cluster: "C", tiendas: 10, monto: 221414, uds: 8255, part: 12.1 },
  { cluster: "B Bajío", tiendas: 5, monto: 83705, uds: 3093, part: 4.6 },
  { cluster: "B Frontera", tiendas: 6, monto: 73644, uds: 2884, part: 4.0 },
  { cluster: "C Bajío", tiendas: 4, monto: 53818, uds: 2083, part: 2.9 },
  { cluster: "EAA", tiendas: 1, monto: 16371, uds: 815, part: 0.9 },
];

// --- Impacto promoción Mayo 2026 (vigencia 08/05 – 04/06) + efecto post-promo jun/jul ---
const PROMO = [
  {
    producto: "Classic White 125g", corto: "CW 125g", mecanica: "Rebajado a $35", tipo: "Monto x venta",
    udsAbr: 722, udsMay: 852, udsJun: 729, udsJul: 708, dUds: 18.0,
    precioAbr: 35.98, precioMay: 33.21, precioJul: 35.91, dPrecio: -7.7,
    dVs25: 22.1, dPost: -16.9, veredicto: "Sí fuerte",
  },
  {
    producto: "Rodajitas Spicy Limón 30g", corto: "Rodajitas 30g", mecanica: "Rebajado a $19.90", tipo: "Monto x venta",
    udsAbr: 1874, udsMay: 2006, udsJun: 1458, udsJul: 1336, dUds: 7.0,
    precioAbr: 19.32, precioMay: 18.78, precioJul: 20.84, dPrecio: -2.8,
    dVs25: 1.3, dPost: -33.4, veredicto: "Sí moderado",
  },
  {
    producto: "Classic White 25g", corto: "CW 25g", mecanica: "2x$34", tipo: "Ahorra Más",
    udsAbr: 1528, udsMay: 1642, udsJun: 1258, udsJul: 982, dUds: 7.5,
    precioAbr: 17.31, precioMay: 16.93, precioJul: 18.29, dPrecio: -2.2,
    dVs25: -18.7, dPost: -40.2, veredicto: "Sin efecto claro",
  },
];

const PROMO_CHART = PROMO.map((p) => ({
  name: p.corto, Abril: p.udsAbr, Mayo: p.udsMay, Junio: p.udsJun, Julio: p.udsJul,
}));

const HALLAZGOS = [
  "La venta YTD Ene–Jul cierra en $1.83M, −6.8% vs 2025 ($1.96M). En unidades la caída es mayor: −9.8% (70,581 vs 78,257 pzas). Se venden menos piezas y el ingreso se sostiene por precio (+3.4% de precio promedio), no por volumen.",
  "El segundo semestre arrancó a la baja: junio −7.4% y julio −10.7% en monto (−13.1% y −16.6% en unidades). Julio es el mes más bajo del año y el peor dato desde enero 2025.",
  "El Chicharrón Natural 75g es el motor del negocio: $462K y +16.9% vs 2025, ya representa 25.3% de la venta total. Es el único SKU que crece de forma sostenida y también crece en jun–jul (+14.9%).",
  "El formato 25g es el problema estructural: Classic White 25g (−21.1%), Street Elote 25g (−24.1%), Cheddar Jalapeño 25g (−17.1%) y Chile Piquín 25g (−23.2%). Los 4 SKUs de 25g suman −21% y arrastran todo el portafolio.",
  "La promoción de mayo funcionó mientras estuvo vigente (+18% en Classic White 125g), pero al terminar el volumen cayó por debajo del nivel pre-promo: los 3 SKUs en promo bajan entre −17% y −40% de mayo a julio. Hubo adelanto de compra, no crecimiento de base.",
  "Monterrey concentra $1.17M (64% de la venta) en 29 tiendas y casi todo el top 15 viene a la baja. León Cerro Gordo (+23.8%), Mty Concordia (+17.8%) y Mty Santa Catarina (+14.6%) son las únicas de alto volumen creciendo — modelo a replicar.",
];

const ACCIONES = [
  {
    n: 1,
    titulo: "Rescatar el formato 25g",
    texto: "Los 4 SKUs de 25g caen −21% y valen 29% de la venta. Revisar precio de anaquel y exhibición en zona de impulso: es el formato de compra rápida y hoy está perdiendo espacio. Priorizar Classic White 25g (−21%) y Street Elote 25g (−24%).",
  },
  {
    n: 2,
    titulo: "Capitalizar el Chicharrón",
    texto: "Único SKU creciendo (+16.9%, 25% de la venta). Empujar segunda exhibición y ampliar distribución al total de tiendas. Evaluar una segunda presentación para no depender de un solo SKU.",
  },
  {
    n: 3,
    titulo: "Rediseñar la mecánica promocional",
    texto: "La rebaja directa movió volumen (Classic White 125g +18%) pero sin efecto residual. Proponer promo escalonada en el 2do semestre con foco en 25g y medir venta 4 semanas post-promo, no solo durante.",
  },
];

// ============================================================
//  HELPERS
// ============================================================

const fmt = (n: number) => "$" + n.toLocaleString("es-MX", { maximumFractionDigits: 0 });
const fmt2 = (n: number) => "$" + n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtK = (n: number) => "$" + (n / 1000).toFixed(0) + "K";
const fmtU = (n: number) => n.toLocaleString("es-MX", { maximumFractionDigits: 0 });

const VarBadge = ({ v }: { v: number }) => (
  <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${v >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
    {v >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
    {v >= 0 ? "+" : ""}{v.toFixed(1)}%
  </span>
);

const TendBadge = ({ t }: { t: string }) => {
  const colors: Record<string, string> = {
    Crece: "bg-green-100 text-green-700 border-green-300",
    Estable: "bg-blue-100 text-blue-700 border-blue-300",
    Cae: "bg-red-100 text-red-700 border-red-300",
  };
  return <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${colors[t] || ""}`}>{t}</span>;
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

const Logo = ({ h = "h-8" }: { h?: string }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src="/4buddies-logo.jpeg" alt="4BUDDIES" className={`${h} rounded-lg shadow`} />
);

const Lectura = ({ label = "Lectura", children }: { label?: string; children: React.ReactNode }) => (
  <div className="mt-2 bg-white/80 rounded-lg p-2 text-[11px] text-orange-800 border border-orange-200">
    <strong>{label}:</strong> {children}
  </div>
);

const SLIDE_BG = "w-full h-full bg-gradient-to-br from-orange-50 to-orange-100";

// ============================================================
//  SLIDE 1 — Portada + Resumen YTD
// ============================================================

function Slide1() {
  const tot = VENTAS_MES.reduce(
    (a, m) => ({
      y2025: a.y2025 + m.y2025, y2026: a.y2026 + m.y2026,
      u2025: a.u2025 + m.u2025, u2026: a.u2026 + m.u2026,
    }),
    { y2025: 0, y2026: 0, u2025: 0, u2026: 0 }
  );

  const KPIS = [
    { label: "Venta YTD 2026", valor: fmtK(YTD.monto26), badge: <VarBadge v={YTD.varMonto} />, sub: `vs ${fmtK(YTD.monto25)} en 2025` },
    { label: "Unidades YTD 2026", valor: fmtU(YTD.uds26), badge: <VarBadge v={YTD.varUds} />, sub: `vs ${fmtU(YTD.uds25)} en 2025` },
    { label: "Precio Promedio", valor: fmt2(YTD.ticket26), badge: <VarBadge v={YTD.varTicket} />, sub: `vs ${fmt2(YTD.ticket25)} en 2025` },
    { label: "Tiendas Activas", valor: String(YTD.tiendas), badge: <span className="text-[10px] text-orange-600 font-semibold">operativas</span>, sub: "excluye CEDIS" },
  ];

  return (
    <div className={`${SLIDE_BG} flex flex-col p-8`}>
      <div className="flex items-center gap-5 mb-4">
        <Logo h="h-20" />
        <div>
          <h1 className="text-3xl font-bold text-orange-900">Reporte de Sell-Out</h1>
          <h2 className="text-xl text-orange-700">4BUDDIES × HEB</h2>
          <p className="text-orange-600 text-sm">YTD 2026 vs 2025 · Enero – Julio</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-[11px] text-orange-500">Corte</p>
          <p className="text-sm font-semibold text-orange-800">{CORTE}</p>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        {KPIS.map((k) => (
          <div key={k.label} className="bg-white rounded-xl shadow px-5 py-3 text-center border border-orange-200 flex-1">
            <p className="text-[11px] text-orange-600 font-medium">{k.label}</p>
            <p className="text-2xl font-bold text-orange-900 my-1">{k.valor}</p>
            <div>{k.badge}</div>
            <p className="text-[10px] text-orange-400 mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow p-4 border border-orange-200 flex-1">
        <h3 className="text-sm font-semibold text-orange-700 mb-2">Venta por mes — 2025 vs 2026 (Ene–Jul)</h3>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-orange-700 text-white">
              <th className="p-1.5 text-left">Mes</th>
              <th className="p-1.5 text-center border-l border-orange-500" colSpan={3}>MXN ($)</th>
              <th className="p-1.5 text-center border-l border-orange-500" colSpan={3}>Unidades</th>
            </tr>
            <tr className="bg-orange-600 text-white">
              <th className="p-1.5"></th>
              <th className="p-1.5 text-right border-l border-orange-500">2025</th>
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
                <td className="p-1.5 text-right text-gray-600 border-l border-orange-100">{fmtK(m.y2025)}</td>
                <td className="p-1.5 text-right font-semibold text-orange-900">{fmtK(m.y2026)}</td>
                <td className="p-1.5 text-center"><VarBadge v={m.varM} /></td>
                <td className="p-1.5 text-right text-gray-600 border-l border-orange-100">{fmtU(m.u2025)}</td>
                <td className="p-1.5 text-right font-semibold text-orange-900">{fmtU(m.u2026)}</td>
                <td className="p-1.5 text-center"><VarBadge v={m.varU} /></td>
              </tr>
            ))}
            <tr className="bg-orange-100 font-bold border-t-2 border-orange-300">
              <td className="p-1.5 text-orange-900">YTD</td>
              <td className="p-1.5 text-right border-l border-orange-200">{fmtK(tot.y2025)}</td>
              <td className="p-1.5 text-right text-orange-900">{fmtK(tot.y2026)}</td>
              <td className="p-1.5 text-center"><VarBadge v={YTD.varMonto} /></td>
              <td className="p-1.5 text-right border-l border-orange-200">{fmtU(tot.u2025)}</td>
              <td className="p-1.5 text-right text-orange-900">{fmtU(tot.u2026)}</td>
              <td className="p-1.5 text-center"><VarBadge v={YTD.varUds} /></td>
            </tr>
          </tbody>
        </table>
        <p className="text-[10px] text-orange-500 mt-2">
          Excluye agosto (mes en curso), SKUs discontinuados y CEDIS. Comparación directa Ene–Jul en ambos años.
        </p>
      </div>
    </div>
  );
}

// ============================================================
//  SLIDE 2 — Tendencia mensual
// ============================================================

function Slide2() {
  const tot = VENTAS_MES.reduce(
    (a, m) => ({ y2025: a.y2025 + m.y2025, y2026: a.y2026 + m.y2026, u2025: a.u2025 + m.u2025, u2026: a.u2026 + m.u2026 }),
    { y2025: 0, y2026: 0, u2025: 0, u2026: 0 }
  );

  return (
    <div className={`${SLIDE_BG} flex flex-col p-6`}>
      <div className="flex items-center gap-3 mb-3">
        <Logo />
        <h2 className="text-xl font-bold text-orange-900">Venta Mensual — 2025 vs 2026</h2>
        <span className="ml-auto text-[11px] text-orange-500">Ene–Jul, meses completos · agosto excluido</span>
      </div>

      <div className="flex gap-4 flex-1">
        <div className="flex-1 bg-white rounded-xl shadow p-3 border border-orange-200 flex flex-col">
          <h3 className="text-xs font-semibold text-orange-700 mb-1">Ingresos por mes ($)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={VENTAS_MES} barGap={3} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9a3412" }} />
              <YAxis tickFormatter={fmtK} tick={{ fontSize: 10, fill: "#9a3412" }} />
              <Tooltip formatter={(v: number | string | undefined) => fmt(Number(v))} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="y2025" name="2025" fill="#fdba74" radius={[4, 4, 0, 0]} />
              <Bar dataKey="y2026" name="2026" fill="#ea580c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          <h3 className="text-xs font-semibold text-orange-700 mt-2 mb-1">Unidades por mes</h3>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={VENTAS_MES} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9a3412" }} />
              <YAxis tick={{ fontSize: 10, fill: "#9a3412" }} />
              <Tooltip formatter={(v: number | string | undefined) => fmtU(Number(v)) + " pzas"} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="u2025" name="2025" stroke="#fdba74" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="u2026" name="2026" stroke="#ea580c" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="w-[380px] flex flex-col gap-3">
          <div className="bg-white rounded-xl shadow p-3 border border-orange-200">
            <h3 className="text-xs font-semibold text-orange-700 mb-1">Ingresos ($)</h3>
            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr className="bg-orange-600 text-white">
                  <th className="p-1 text-left">Mes</th><th className="p-1 text-right">2025</th>
                  <th className="p-1 text-right">2026</th><th className="p-1 text-center">Var</th>
                </tr>
              </thead>
              <tbody>
                {VENTAS_MES.map((m, i) => (
                  <tr key={m.mes} className={i % 2 ? "bg-orange-50" : ""}>
                    <td className="p-1 text-orange-900">{m.mes}</td>
                    <td className="p-1 text-right text-gray-600">{fmtK(m.y2025)}</td>
                    <td className="p-1 text-right font-semibold text-orange-900">{fmtK(m.y2026)}</td>
                    <td className="p-1 text-center"><VarBadge v={m.varM} /></td>
                  </tr>
                ))}
                <tr className="bg-orange-100 font-bold border-t-2 border-orange-300">
                  <td className="p-1">YTD</td><td className="p-1 text-right">{fmtK(tot.y2025)}</td>
                  <td className="p-1 text-right">{fmtK(tot.y2026)}</td>
                  <td className="p-1 text-center"><VarBadge v={YTD.varMonto} /></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-xl shadow p-3 border border-orange-200">
            <h3 className="text-xs font-semibold text-orange-700 mb-1">Unidades</h3>
            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr className="bg-orange-600 text-white">
                  <th className="p-1 text-left">Mes</th><th className="p-1 text-right">2025</th>
                  <th className="p-1 text-right">2026</th><th className="p-1 text-center">Var</th>
                </tr>
              </thead>
              <tbody>
                {VENTAS_MES.map((m, i) => (
                  <tr key={m.mes} className={i % 2 ? "bg-orange-50" : ""}>
                    <td className="p-1 text-orange-900">{m.mes}</td>
                    <td className="p-1 text-right text-gray-600">{fmtU(m.u2025)}</td>
                    <td className="p-1 text-right font-semibold text-orange-900">{fmtU(m.u2026)}</td>
                    <td className="p-1 text-center"><VarBadge v={m.varU} /></td>
                  </tr>
                ))}
                <tr className="bg-orange-100 font-bold border-t-2 border-orange-300">
                  <td className="p-1">YTD</td><td className="p-1 text-right">{fmtU(tot.u2025)}</td>
                  <td className="p-1 text-right">{fmtU(tot.u2026)}</td>
                  <td className="p-1 text-center"><VarBadge v={YTD.varUds} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Lectura>
        El primer cuatrimestre se mantuvo cerca de 2025 (Ene −1.4%, May −1.0%), pero el segundo semestre se abre a la baja:
        junio −7.4% y julio −10.7%. Julio es el mes más bajo del año en unidades (7,974 pzas, −16.6%) y confirma que la
        caída se acelera justo después de que terminó la promoción de mayo.
      </Lectura>
    </div>
  );
}

// ============================================================
//  SLIDE 3 — Desempeño por producto
// ============================================================

function Slide3() {
  const top3 = PRODUCTOS.slice(0, 3).reduce((a, p) => a + p.part, 0);
  return (
    <div className={`${SLIDE_BG} flex flex-col p-6`}>
      <div className="flex items-center gap-3 mb-3">
        <Logo />
        <h2 className="text-xl font-bold text-orange-900">Desempeño por Producto — YTD 2026 vs 2025</h2>
        <span className="ml-auto text-[11px] text-orange-500">Ene–Jul 2026</span>
      </div>

      <div className="flex gap-4 flex-1">
        <div className="w-[290px] bg-white rounded-xl shadow p-3 border border-orange-200 flex flex-col">
          <h3 className="text-xs font-semibold text-orange-700 flex items-center gap-1"><Package size={13} /> Participación 2026</h3>
          <ResponsiveContainer width="100%" height={210}>
            <PieChart>
              <Pie data={PIE_DATA} dataKey="value" outerRadius={80} labelLine={false}
                label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
                style={{ fontSize: 10 }}>
                {PIE_DATA.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: number | string | undefined) => fmt(Number(v))} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-0.5 text-[9px] mt-1">
            {PRODUCTOS.map((p, i) => (
              <div key={p.corto} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                <span className="text-orange-800 truncate">{p.corto}</span>
                <span className="ml-auto text-orange-500 font-medium">{p.part}%</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-orange-600 mt-1.5 border-t border-orange-100 pt-1.5">
            Top 3 productos = <strong>{top3.toFixed(0)}%</strong> de la venta
          </p>
        </div>

        <div className="flex-1 bg-white rounded-xl shadow p-3 border border-orange-200 flex flex-col">
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className="bg-orange-600 text-white">
                <th className="p-1.5 text-left">Producto</th>
                <th className="p-1.5 text-right">2025</th>
                <th className="p-1.5 text-right">2026</th>
                <th className="p-1.5 text-center">Var</th>
                <th className="p-1.5 text-right">Uds 26</th>
                <th className="p-1.5 text-right">Part %</th>
                <th className="p-1.5 text-center">Tend</th>
              </tr>
            </thead>
            <tbody>
              {PRODUCTOS.map((p, i) => (
                <tr key={p.corto} className={i % 2 ? "bg-orange-50" : ""}>
                  <td className="p-1.5 font-medium text-orange-900">{p.corto}</td>
                  <td className="p-1.5 text-right text-gray-600">{fmtK(p.m25)}</td>
                  <td className="p-1.5 text-right font-semibold text-orange-900">{fmtK(p.m26)}</td>
                  <td className="p-1.5 text-center"><VarBadge v={p.var} /></td>
                  <td className="p-1.5 text-right text-gray-700">{fmtU(p.u26)}</td>
                  <td className="p-1.5 text-right text-orange-700 font-medium">{p.part}%</td>
                  <td className="p-1.5 text-center"><TendBadge t={p.tend} /></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="grid grid-cols-3 gap-2 mt-auto pt-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-2">
              <p className="text-[10px] text-green-700 font-semibold">Producto estrella</p>
              <p className="text-xs font-bold text-green-800">Chicharrón Natural 75g</p>
              <p className="text-[10px] text-green-600">+16.9% · 25.3% de la venta</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
              <p className="text-[10px] text-blue-700 font-semibold">Se sostienen</p>
              <p className="text-xs font-bold text-blue-800">125g + Rodajitas</p>
              <p className="text-[10px] text-blue-600">CW 125g, CJ 125g y Rodajitas ≈ planos</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-2">
              <p className="text-[10px] text-red-700 font-semibold">Mayor riesgo</p>
              <p className="text-xs font-bold text-red-800">Formato 25g</p>
              <p className="text-[10px] text-red-600">4 SKUs, −21% en conjunto</p>
            </div>
          </div>
        </div>
      </div>

      <Lectura>
        El portafolio está partido en dos: el Chicharrón crece +16.9% y ya vale 1 de cada 4 pesos, mientras los cuatro
        SKUs de 25g caen entre −17% y −24%. Los 125g y Rodajitas se mantienen planos. Sin el Chicharrón, la caída YTD
        rondaría el −13%.
      </Lectura>
    </div>
  );
}

// ============================================================
//  SLIDE 4 — Top tiendas y clusters
// ============================================================

function Slide4() {
  const totCl = CLUSTERS.reduce((a, c) => ({ tiendas: a.tiendas + c.tiendas, monto: a.monto + c.monto }), { tiendas: 0, monto: 0 });
  return (
    <div className={`${SLIDE_BG} flex flex-col p-6`}>
      <div className="flex items-center gap-3 mb-3">
        <Logo />
        <h2 className="text-xl font-bold text-orange-900">Top Tiendas y Clusters — YTD 2026</h2>
        <span className="ml-auto text-[11px] text-orange-500">Ene–Jul 2026 · {YTD.tiendas} tiendas activas</span>
      </div>

      <div className="flex gap-4 flex-1">
        <div className="flex-1 bg-white rounded-xl shadow p-3 border border-orange-200">
          <h3 className="text-xs font-semibold text-orange-700 flex items-center gap-1 mb-1"><Store size={13} /> Top 15 Tiendas</h3>
          <table className="w-full text-[10.5px] border-collapse">
            <thead>
              <tr className="bg-orange-600 text-white">
                <th className="p-1 text-left">#</th>
                <th className="p-1 text-left">Tienda</th>
                <th className="p-1 text-left">Ciudad</th>
                <th className="p-1 text-center">Cluster</th>
                <th className="p-1 text-right">Monto</th>
                <th className="p-1 text-right">Uds</th>
                <th className="p-1 text-center">vs 25</th>
              </tr>
            </thead>
            <tbody>
              {TOP_TIENDAS.map((t, i) => (
                <tr key={t.tienda} className={i % 2 ? "bg-orange-50" : ""}>
                  <td className="p-1 text-orange-600 font-bold">{i + 1}</td>
                  <td className="p-1 font-medium text-orange-900">{t.tienda}</td>
                  <td className="p-1 text-gray-600">{t.ciudad}</td>
                  <td className="p-1 text-center"><ClusterBadge c={t.cluster} /></td>
                  <td className="p-1 text-right font-semibold text-orange-900">{fmtK(t.monto)}</td>
                  <td className="p-1 text-right text-gray-700">{fmtU(t.uds)}</td>
                  <td className="p-1 text-center"><VarBadge v={t.var} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[10px] text-orange-500 mt-1.5">Top 15 = 47.6% de la venta total YTD 2026.</p>
        </div>

        <div className="w-[360px] bg-white rounded-xl shadow p-3 border border-orange-200 flex flex-col">
          <h3 className="text-xs font-semibold text-orange-700 flex items-center gap-1 mb-1"><Target size={13} /> Venta por Cluster</h3>
          <ResponsiveContainer width="100%" height={145}>
            <BarChart data={CLUSTERS} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" horizontal={false} />
              <XAxis type="number" tickFormatter={fmtK} tick={{ fontSize: 9, fill: "#9a3412" }} />
              <YAxis type="category" dataKey="cluster" width={68} tick={{ fontSize: 9, fill: "#9a3412" }} />
              <Tooltip formatter={(v: number | string | undefined) => fmt(Number(v))} />
              <Bar dataKey="monto" name="Venta" fill="#ea580c" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>

          <table className="w-full text-[10.5px] border-collapse mt-2">
            <thead>
              <tr className="bg-orange-600 text-white">
                <th className="p-1 text-left">Cluster</th>
                <th className="p-1 text-center">Tdas</th>
                <th className="p-1 text-right">Monto</th>
                <th className="p-1 text-right">Part %</th>
              </tr>
            </thead>
            <tbody>
              {CLUSTERS.map((c, i) => (
                <tr key={c.cluster} className={i % 2 ? "bg-orange-50" : ""}>
                  <td className="p-1"><ClusterBadge c={c.cluster} /></td>
                  <td className="p-1 text-center text-gray-700">{c.tiendas}</td>
                  <td className="p-1 text-right font-semibold text-orange-900">{fmtK(c.monto)}</td>
                  <td className="p-1 text-right text-orange-700">{c.part}%</td>
                </tr>
              ))}
              <tr className="bg-orange-100 font-bold border-t-2 border-orange-300">
                <td className="p-1 text-orange-900">Total</td>
                <td className="p-1 text-center">{totCl.tiendas}</td>
                <td className="p-1 text-right">{fmtK(totCl.monto)}</td>
                <td className="p-1 text-right">100%</td>
              </tr>
            </tbody>
          </table>
          <p className="text-[9.5px] text-orange-500 mt-1.5 leading-snug">
            3 tiendas nuevas (9107, 9109, 9117) aún sin cluster asignado en catálogo: $16K, 0.9% de la venta.
          </p>
        </div>
      </div>

      <Lectura>
        Monterrey concentra $1.17M (64% de la venta) en 29 tiendas y prácticamente todo el top 15 viene a la baja —
        San Pedro es la más golpeada (−37.4%). Las excepciones marcan el camino: León Cerro Gordo (+23.8%),
        Concordia (+17.8%) y Santa Catarina (+14.6%). Los clusters B y A aportan 42% de la venta con 25 tiendas: ahí
        está el volumen medio a defender.
      </Lectura>
    </div>
  );
}

// ============================================================
//  SLIDE 5 — Impacto promoción mayo 2026
// ============================================================

function Slide5() {
  const vered: Record<string, string> = {
    "Sí fuerte": "bg-green-100 text-green-700",
    "Sí moderado": "bg-amber-100 text-amber-700",
    "Sin efecto claro": "bg-gray-100 text-gray-600",
  };
  return (
    <div className={`${SLIDE_BG} flex flex-col p-6`}>
      <div className="flex items-center gap-3 mb-3">
        <Logo />
        <h2 className="text-xl font-bold text-orange-900">Impacto Promoción — Mayo 2026</h2>
        <span className="ml-auto text-[11px] text-orange-500">Vigencia 08/05 – 04/06 · MIRAESTELS FOODS · efecto medido hasta julio</span>
      </div>

      <div className="bg-white rounded-xl shadow p-3 border border-orange-200 mb-3">
        <table className="w-full text-[11px] border-collapse">
          <thead>
            <tr className="bg-orange-600 text-white">
              <th className="p-1.5 text-left">Producto</th>
              <th className="p-1.5 text-center">Mecánica</th>
              <th className="p-1.5 text-right">Uds Abr</th>
              <th className="p-1.5 text-right">Uds May</th>
              <th className="p-1.5 text-center">Δ vs Abr</th>
              <th className="p-1.5 text-center">Δ vs May&apos;25</th>
              <th className="p-1.5 text-right">Precio May</th>
              <th className="p-1.5 text-right">Uds Jul</th>
              <th className="p-1.5 text-center">Δ May→Jul</th>
              <th className="p-1.5 text-center">Veredicto</th>
            </tr>
          </thead>
          <tbody>
            {PROMO.map((p, i) => (
              <tr key={p.producto} className={i % 2 ? "bg-orange-50" : ""}>
                <td className="p-1.5 font-medium text-orange-900">{p.producto}</td>
                <td className="p-1.5 text-center">
                  <span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 text-[10px] font-semibold whitespace-nowrap">{p.mecanica}</span>
                </td>
                <td className="p-1.5 text-right text-gray-600">{fmtU(p.udsAbr)}</td>
                <td className="p-1.5 text-right font-semibold text-orange-900">{fmtU(p.udsMay)}</td>
                <td className="p-1.5 text-center"><VarBadge v={p.dUds} /></td>
                <td className="p-1.5 text-center"><VarBadge v={p.dVs25} /></td>
                <td className="p-1.5 text-right text-gray-700">{fmt2(p.precioMay)}</td>
                <td className="p-1.5 text-right text-gray-700">{fmtU(p.udsJul)}</td>
                <td className="p-1.5 text-center"><VarBadge v={p.dPost} /></td>
                <td className="p-1.5 text-center">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap ${vered[p.veredicto]}`}>{p.veredicto}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4 flex-1">
        <div className="flex-1 bg-white rounded-xl shadow p-3 border border-orange-200">
          <h3 className="text-xs font-semibold text-orange-700 flex items-center gap-1 mb-1">
            <Tag size={13} /> Unidades por mes — antes, durante y después de la promo
          </h3>
          <ResponsiveContainer width="100%" height="88%">
            <BarChart data={PROMO_CHART} barGap={2} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9a3412" }} />
              <YAxis tick={{ fontSize: 10, fill: "#9a3412" }} />
              <Tooltip formatter={(v: number | string | undefined) => fmtU(Number(v)) + " pzas"} />
              <Bar dataKey="Abril" fill="#fed7aa" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Mayo" fill="#ea580c" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Junio" fill="#fb923c" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Julio" fill="#9a3412" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 text-[10px] text-orange-800 mt-1">
            {[
              { l: "Abril (pre-promo)", c: "#fed7aa" },
              { l: "Mayo (promo)", c: "#ea580c" },
              { l: "Junio", c: "#fb923c" },
              { l: "Julio (post-promo)", c: "#9a3412" },
            ].map((x) => (
              <span key={x.l} className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: x.c }} />{x.l}
              </span>
            ))}
          </div>
        </div>

        <div className="w-[380px] bg-white rounded-xl shadow p-3 border border-orange-200">
          <h3 className="text-xs font-semibold text-orange-700 mb-2">Lectura ejecutiva</h3>
          <ul className="space-y-2 text-[11px] text-orange-900">
            <li className="border-l-2 border-green-400 pl-2">
              <strong>Classic White 125g fue el ganador:</strong> +18% uds vs abril y +22% vs mayo&apos;25, con precio en $33.21. La rebaja directa a $35 sí movió volumen.
            </li>
            <li className="border-l-2 border-amber-400 pl-2">
              <strong>Rodajitas 30g, efecto moderado:</strong> +7% vs abril con precio en $18.78, pero apenas +1.3% contra mayo&apos;25.
            </li>
            <li className="border-l-2 border-gray-400 pl-2">
              <strong>Classic White 25g (2x$34) no revirtió la caída:</strong> +7.5% vs abril pero aún −18.7% vs mayo&apos;25. El 2xN no compensa la baja estructural del 25g.
            </li>
            <li className="border-l-2 border-red-400 pl-2">
              <strong>Sin efecto residual:</strong> al terminar la promo, los 3 SKUs caen de mayo a julio entre −17% y −40%, por debajo del nivel pre-promo. Fue adelanto de compra, no consumidor nuevo.
            </li>
          </ul>
        </div>
      </div>

      <Lectura label="Conclusión">
        La rebaja directa (Classic White 125g) funcionó mejor que el 2xN (Classic White 25g), pero ninguna dejó base:
        julio quedó por debajo de abril en los 3 SKUs. Si se repite, conviene rebaja directa sobre 125g y Rodajitas,
        acompañada de exhibición, y medir 4 semanas después para no confundir adelanto de compra con crecimiento real.
      </Lectura>
    </div>
  );
}

// ============================================================
//  SLIDE 6 — Hallazgos y acciones
// ============================================================

function Slide6() {
  return (
    <div className={`${SLIDE_BG} flex flex-col p-7`}>
      <div className="flex items-center gap-3 mb-3">
        <Logo />
        <h2 className="text-2xl font-bold text-orange-900">Hallazgos y Acciones</h2>
        <span className="ml-auto text-[11px] text-orange-500">YTD Ene–Jul 2026</span>
      </div>

      <div className="flex gap-4 flex-1">
        <div className="flex-1 flex flex-col gap-1.5">
          <h3 className="text-xs font-semibold text-orange-700 flex items-center gap-1"><TrendingUp size={13} /> Hallazgos</h3>
          {HALLAZGOS.map((h, i) => (
            <div key={i} className="bg-white rounded-lg p-2 border border-orange-200 flex gap-2 items-start">
              <span className="w-4 h-4 rounded-full bg-orange-600 text-white text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
              <p className="text-[10.5px] text-orange-900 leading-snug">{h}</p>
            </div>
          ))}
        </div>

        <div className="w-[380px] flex flex-col gap-2">
          <h3 className="text-xs font-semibold text-orange-700 flex items-center gap-1"><Target size={13} /> Acciones recomendadas</h3>
          {ACCIONES.map((a) => (
            <div key={a.n} className="bg-white rounded-lg p-3 border border-orange-200 shadow-sm flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-6 rounded-full bg-orange-600 text-white text-xs font-bold flex items-center justify-center shrink-0">{a.n}</span>
                <p className="text-xs font-bold text-orange-900">{a.titulo}</p>
              </div>
              <p className="text-[10.5px] text-orange-800 leading-snug">{a.texto}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[10px] text-orange-500 mt-2 text-center">
        Reporte generado con datos de sell-out HEB · 4BUDDIES · {CORTE} · Excluye CEDIS y SKUs discontinuados
      </p>
    </div>
  );
}

// ============================================================
//  CARRUSEL
// ============================================================

const SLIDES = [Slide1, Slide2, Slide3, Slide4, Slide5, Slide6];

export default function Home() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); setCurrent((c) => Math.min(c + 1, SLIDES.length - 1)); }
      if (e.key === "ArrowLeft") { e.preventDefault(); setCurrent((c) => Math.max(c - 1, 0)); }
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
            className="text-orange-300 hover:text-white disabled:opacity-30 transition">
            <ChevronLeft size={20} />
          </button>
          <div className="flex gap-1.5">
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} aria-label={`Slide ${i + 1}`}
                className={`w-2 h-2 rounded-full transition ${i === current ? "bg-orange-400 scale-125" : "bg-orange-700"}`} />
            ))}
          </div>
          <button onClick={() => setCurrent((c) => Math.min(c + 1, SLIDES.length - 1))} disabled={current === SLIDES.length - 1}
            className="text-orange-300 hover:text-white disabled:opacity-30 transition">
            <ChevronRight size={20} />
          </button>
          <span className="text-orange-300 text-xs font-medium ml-1">{current + 1}/{SLIDES.length}</span>
        </div>
      </div>
    </div>
  );
}
