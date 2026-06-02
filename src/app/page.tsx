"use client";
import { useState, useEffect, useCallback } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight,
  Store, Package, Target, Tag, TrendingUp,
} from "lucide-react";

/* ───────── helpers ───────── */
const fmt = (n: number) => "$" + n.toLocaleString("es-MX", { maximumFractionDigits: 0 });
const fmtK = (n: number) => "$" + (n / 1000).toFixed(0) + "K";
const fmtU = (n: number) => n.toLocaleString("es-MX", { maximumFractionDigits: 0 });
const fmtPct = (n: number) => (n >= 0 ? "+" : "") + n.toFixed(1) + "%";

const VarBadge = ({ v }: { v: number }) => (
  <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[11px] font-bold ${v >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
    {v >= 0 ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
    {fmtPct(v)}
  </span>
);

const TendBadge = ({ t }: { t: string }) => {
  const colors: Record<string, string> = {
    Crece: "bg-green-100 text-green-700 border-green-300",
    Estable: "bg-blue-100 text-blue-700 border-blue-300",
    Cae: "bg-red-100 text-red-700 border-red-300",
  };
  return <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${colors[t] || ""}`}>{t}</span>;
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

const VerdBadge = ({ v }: { v: string }) => {
  const map: Record<string, string> = {
    "Sí fuerte": "bg-green-100 text-green-700",
    "Sí moderado": "bg-amber-100 text-amber-700",
    "Sin efecto claro": "bg-gray-100 text-gray-600",
  };
  return <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${map[v] || ""}`}>{v}</span>;
};

/* ───────── datos (YTD Ene–May, sell-out HEB, excluye discontinuados y CEDIS) ───────── */
const CORTE = "Enero – Mayo 2026";

const YTD = {
  monto25: 1441768, monto26: 1356260, varMonto: -5.9,
  uds25: 58166, uds26: 53457, varUds: -8.1,
  ticket25: 24.79, ticket26: 25.37, varTicket: 2.4,
  tiendas: 64,
};

const VENTAS_MES = [
  { mes: "Ene", y2025: 282960, y2026: 278968, u2025: 11158, u2026: 10516, varM: -1.4, varU: -5.8 },
  { mes: "Feb", y2025: 269925, y2026: 254380, u2025: 10993, u2026: 9938, varM: -5.8, varU: -9.6 },
  { mes: "Mar", y2025: 330215, y2026: 276116, u2025: 13380, u2026: 11340, varM: -16.4, varU: -15.2 },
  { mes: "Abr", y2025: 275427, y2026: 266481, u2025: 10841, u2026: 10380, varM: -3.2, varU: -4.3 },
  { mes: "May", y2025: 283242, y2026: 280316, u2025: 11794, u2026: 11283, varM: -1.0, varU: -4.3 },
];
const TOT = {
  y2025: YTD.monto25, y2026: YTD.monto26, varM: YTD.varMonto,
  u2025: YTD.uds25, u2026: YTD.uds26, varU: YTD.varUds,
};

const PRODUCTOS = [
  { corto: "Chicharrón Natural 75g", m25: 275610, m26: 324680, var: 17.8, u26: 6521, part: 23.9, tend: "Crece" },
  { corto: "Rodajitas Spicy Limón 30g", m25: 181148, m26: 180966, var: -0.1, u26: 9318, part: 13.3, tend: "Estable" },
  { corto: "Street Elote 125g", m25: 215408, m26: 176286, var: -18.2, u26: 5712, part: 13.0, tend: "Cae" },
  { corto: "Classic White 25g", m25: 175266, m26: 145304, var: -17.1, u26: 8343, part: 10.7, tend: "Cae" },
  { corto: "Classic White 125g", m25: 135887, m26: 130614, var: -3.9, u26: 3699, part: 9.6, tend: "Estable" },
  { corto: "Street Elote 25g", m25: 156936, m26: 127673, var: -18.6, u26: 7391, part: 9.4, tend: "Cae" },
  { corto: "Cheddar Jalapeño 125g", m25: 129120, m26: 126281, var: -2.2, u26: 4113, part: 9.3, tend: "Estable" },
  { corto: "Cheddar Jalapeño 25g", m25: 96468, m26: 84499, var: -12.4, u26: 4943, part: 6.2, tend: "Cae" },
  { corto: "Chile Piquín 25g", m25: 75925, m26: 59957, var: -21.0, u26: 3417, part: 4.4, tend: "Cae" },
];

const PIE_DATA = PRODUCTOS.map((p) => ({ name: p.corto, value: p.m26 }));
const PIE_COLORS = ["#ea580c", "#f97316", "#fb923c", "#fdba74", "#fed7aa", "#c2410c", "#9a3412", "#7c2d12", "#431407"];

const TOP_TIENDAS = [
  { tienda: "MTY CHIPINQUE", ciudad: "Monterrey", cluster: "AA", monto: 66464, uds: 2736 },
  { tienda: "MTY VALLE ORIENTE", ciudad: "Monterrey", cluster: "AA", monto: 66226, uds: 2530 },
  { tienda: "MTY SAN PEDRO", ciudad: "Monterrey", cluster: "AA", monto: 63687, uds: 2796 },
  { tienda: "MTY CONTRY", ciudad: "Monterrey", cluster: "A", monto: 54478, uds: 2287 },
  { tienda: "MTY VALLE ALTO", ciudad: "Monterrey", cluster: "AA Light", monto: 52938, uds: 2183 },
  { tienda: "MTY TEC", ciudad: "Monterrey", cluster: "A", monto: 48332, uds: 1931 },
  { tienda: "MTY EL URO", ciudad: "Monterrey", cluster: "AA Light", monto: 41764, uds: 1875 },
  { tienda: "MTY SAN NICOLAS", ciudad: "Monterrey", cluster: "A", monto: 41325, uds: 1560 },
  { tienda: "LEO CERRO GORDO", ciudad: "León", cluster: "AA Light", monto: 39836, uds: 1825 },
  { tienda: "MTY CUMBRES", ciudad: "Monterrey", cluster: "AA Light", monto: 36666, uds: 1430 },
  { tienda: "MTY PUERTA DE HIERRO", ciudad: "Monterrey", cluster: "A", monto: 32866, uds: 1283 },
  { tienda: "MTY BOSQUES DE LAS LOMAS", ciudad: "Monterrey", cluster: "A", monto: 31657, uds: 1264 },
  { tienda: "MTY CONCORDIA", ciudad: "Monterrey", cluster: "B", monto: 29471, uds: 1172 },
  { tienda: "MTY SANTA CATARINA", ciudad: "Monterrey", cluster: "B", monto: 29460, uds: 1128 },
  { tienda: "MTY LOS MORALES", ciudad: "Monterrey", cluster: "B", monto: 28279, uds: 1095 },
];

const CLUSTERS = [
  { cluster: "B", tiendas: 15, monto: 285994, uds: 11113, part: 21.1 },
  { cluster: "A", tiendas: 10, monto: 283792, uds: 10848, part: 20.9 },
  { cluster: "AA Light", tiendas: 8, monto: 255055, uds: 10342, part: 18.8 },
  { cluster: "AA", tiendas: 3, monto: 196377, uds: 8062, part: 14.5 },
  { cluster: "C", tiendas: 10, monto: 164194, uds: 6234, part: 12.1 },
  { cluster: "B Bajío", tiendas: 5, monto: 57423, uds: 2191, part: 4.2 },
  { cluster: "B Frontera", tiendas: 6, monto: 51905, uds: 2090, part: 3.8 },
  { cluster: "C Bajío", tiendas: 4, monto: 38552, uds: 1537, part: 2.8 },
  { cluster: "EAA", tiendas: 1, monto: 12941, uds: 657, part: 1.0 },
];

const PROMO = [
  { producto: "Classic White 125g", mecanica: "Rebajado a $35", tipo: "Monto x venta", udsAbr: 722, udsMay: 852, dUds: 18.0, precioMay: 33.21, dVs25: 22.1, veredicto: "Sí fuerte" },
  { producto: "Rodajitas 30g", mecanica: "Rebajado a $19.90", tipo: "Monto x venta", udsAbr: 1874, udsMay: 2006, dUds: 7.0, precioMay: 18.78, dVs25: 1.3, veredicto: "Sí moderado" },
  { producto: "Classic White 25g", mecanica: "2x$34", tipo: "Ahorra Más", udsAbr: 1528, udsMay: 1642, dUds: 7.5, precioMay: 16.93, dVs25: -18.7, veredicto: "Sí moderado" },
];

const PROMO_CHART = PROMO.map((p) => ({ name: p.producto, Abril: p.udsAbr, Mayo: p.udsMay }));

const HALLAZGOS = [
  "La venta YTD cae -5.9% en pesos y -8.1% en unidades vs 2025. El precio promedio sube +2.4%, lo que amortigua la caída en valor.",
  "Marzo es el mes más débil (-16.4%); el resto se mantiene cerca del año anterior. Mayo casi empata 2025 (-1.0%), señal de estabilización.",
  "Chicharrón Natural es el motor: +17.8% y ya pesa 24% de la venta. Es el único producto que crece de forma clara.",
  "Las palomitas Street Elote (25g y 125g) y Classic White 25g son las que más caen (-17% a -19%) y explican el grueso del retroceso.",
  "La venta está muy concentrada en Monterrey: 14 de las top 15 tiendas son MTY. Clusters A + B + AA Light = 61% de la venta.",
];

const ACCIONES = [
  { t: "Empujar Chicharrón", d: "Es el único producto que crece (+17.8%). Asegurar abasto y exhibición ampliada; evaluar subir su peso en el surtido." },
  { t: "Recuperar palomitas", d: "Street Elote y Classic White 25g cargan la caída. La promo de mayo ayudó: repetir la rebaja directa que sí movió volumen." },
  { t: "Atacar fuera de MTY", d: "El negocio depende casi 100% de Monterrey. Activar plan de crecimiento en León/Bajío y clusters C para diversificar." },
];

/* ───────── slides ───────── */
function Slide1() {
  return (
    <div className="flex flex-col h-full p-8 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="flex items-center gap-5 mb-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/4buddies-logo.jpeg" alt="4BUDDIES" className="h-20 rounded-xl shadow-lg" />
        <div>
          <h1 className="text-3xl font-bold text-orange-900">Reporte de Sell-Out</h1>
          <h2 className="text-xl text-orange-700">4BUDDIES × HEB</h2>
          <p className="text-orange-600">YTD 2026 vs 2025 · {CORTE}</p>
        </div>
      </div>

      <div className="flex gap-4 mb-5">
        {[
          { l: "Venta YTD 2026", v: fmtK(YTD.monto26), b: <VarBadge v={YTD.varMonto} /> },
          { l: "Unidades YTD 2026", v: fmtU(YTD.uds26), b: <VarBadge v={YTD.varUds} /> },
          { l: "Precio Prom.", v: fmt(YTD.ticket26), b: <VarBadge v={YTD.varTicket} /> },
          { l: "Tiendas Activas", v: String(YTD.tiendas), b: <span className="text-xs text-gray-500">operativas</span> },
        ].map((k) => (
          <div key={k.l} className="bg-white rounded-xl shadow px-5 py-3 text-center border border-orange-200 flex-1">
            <div className="text-sm text-orange-600 font-medium">{k.l}</div>
            <div className="text-2xl font-bold text-orange-900 my-1">{k.v}</div>
            {k.b}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow p-4 border border-orange-200 flex-1">
        <h3 className="text-sm font-semibold text-orange-700 mb-2">Venta por mes — 2025 vs 2026 (Ene–May)</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-orange-700 text-white">
              <th rowSpan={2} className="p-1.5 text-left rounded-tl-lg">Mes</th>
              <th colSpan={3} className="p-1.5 text-center border-l border-orange-500">MXN ($)</th>
              <th colSpan={3} className="p-1.5 text-center border-l border-orange-500 rounded-tr-lg">Unidades</th>
            </tr>
            <tr className="bg-orange-600 text-white">
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
              <td className="p-1.5 text-right text-gray-700 border-l border-orange-200">{fmtK(TOT.y2025)}</td>
              <td className="p-1.5 text-right text-orange-900">{fmtK(TOT.y2026)}</td>
              <td className="p-1.5 text-center"><VarBadge v={TOT.varM} /></td>
              <td className="p-1.5 text-right text-gray-700 border-l border-orange-200">{fmtU(TOT.u2025)}</td>
              <td className="p-1.5 text-right text-orange-900">{fmtU(TOT.u2026)}</td>
              <td className="p-1.5 text-center"><VarBadge v={TOT.varU} /></td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs text-orange-500 mt-3">Excluye junio (mes en curso), SKUs discontinuados y CEDIS. Comparación directa Ene–May en ambos años.</p>
      </div>
    </div>
  );
}

function Slide2() {
  return (
    <div className="flex flex-col h-full p-6 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="flex items-center gap-3 mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/4buddies-logo.jpeg" alt="" className="h-8 rounded-lg" />
        <h2 className="text-xl font-bold text-orange-900">Venta Mensual — 2025 vs 2026</h2>
        <span className="text-xs text-orange-500 ml-auto">Ene–May · pesos sell-out</span>
      </div>

      <div className="flex gap-4 flex-1">
        <div className="bg-white rounded-xl shadow p-4 flex-1 border border-orange-200">
          <h3 className="text-sm font-semibold text-orange-700 mb-2">Ingresos por Mes ($)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={VENTAS_MES} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
              <XAxis dataKey="mes" tick={{ fill: "#9a3412", fontSize: 12 }} />
              <YAxis tickFormatter={fmtK} tick={{ fill: "#9a3412", fontSize: 11 }} />
              <Tooltip formatter={(v) => fmt(Number(v))} />
              <Legend />
              <Bar dataKey="y2025" name="2025" fill="#fdba74" radius={[4, 4, 0, 0]} />
              <Bar dataKey="y2026" name="2026" fill="#ea580c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 bg-orange-50 rounded-lg p-2 text-xs text-orange-800 border border-orange-200">
            <strong>Lectura:</strong> La venta 2026 corre por debajo de 2025 (-5.9% YTD), con marzo como el mes más golpeado (-16.4%). Abril y mayo casi empatan al año anterior — la caída se está estabilizando.
          </div>
        </div>

        <div className="w-[380px] flex flex-col gap-3">
          <div className="bg-white rounded-xl shadow p-3 border border-orange-200">
            <h3 className="text-xs font-semibold text-orange-700 mb-1">Ingresos ($)</h3>
            <table className="w-full text-xs">
              <thead><tr className="bg-orange-600 text-white">
                <th className="p-1 text-left">Mes</th><th className="p-1 text-right">2025</th><th className="p-1 text-right">2026</th><th className="p-1 text-center">Var</th>
              </tr></thead>
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
                  <td className="p-1">YTD</td><td className="p-1 text-right">{fmtK(TOT.y2025)}</td>
                  <td className="p-1 text-right">{fmtK(TOT.y2026)}</td><td className="p-1 text-center"><VarBadge v={TOT.varM} /></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-white rounded-xl shadow p-3 border border-orange-200">
            <h3 className="text-xs font-semibold text-orange-700 mb-1">Unidades</h3>
            <table className="w-full text-xs">
              <thead><tr className="bg-orange-600 text-white">
                <th className="p-1 text-left">Mes</th><th className="p-1 text-right">2025</th><th className="p-1 text-right">2026</th><th className="p-1 text-center">Var</th>
              </tr></thead>
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
                  <td className="p-1">YTD</td><td className="p-1 text-right">{fmtU(TOT.u2025)}</td>
                  <td className="p-1 text-right">{fmtU(TOT.u2026)}</td><td className="p-1 text-center"><VarBadge v={TOT.varU} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Slide3() {
  return (
    <div className="flex flex-col h-full p-6 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="flex items-center gap-3 mb-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/4buddies-logo.jpeg" alt="" className="h-8 rounded-lg" />
        <h2 className="text-xl font-bold text-orange-900">Desempeño por Producto — YTD 2026 vs 2025</h2>
        <span className="text-xs text-orange-500 ml-auto">Ene–May 2026</span>
      </div>

      <div className="flex gap-4 flex-1">
        <div className="bg-white rounded-xl shadow p-3 border border-orange-200 w-[300px] flex flex-col items-center">
          <h3 className="text-sm font-semibold text-orange-700 mb-1">Participación YTD 2026</h3>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={PIE_DATA} cx="50%" cy="50%" outerRadius={88} dataKey="value"
                label={({ name, percent }) => `${(name as string).split(" ")[0]} ${((percent ?? 0) * 100).toFixed(0)}%`}
                labelLine={false} fontSize={9}>
                {PIE_DATA.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => fmt(Number(v))} />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-xs text-orange-700 mt-1 text-center">
            <strong>Chicharrón, Rodajitas y Street Elote 125g</strong> = 50% de la venta.
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-3 border border-orange-200 flex-1 flex flex-col">
          <table className="w-full text-xs">
            <thead><tr className="bg-orange-600 text-white">
              <th className="p-1.5 text-left">Producto</th><th className="p-1.5 text-right">2025</th>
              <th className="p-1.5 text-right">2026</th><th className="p-1.5 text-center">Var</th>
              <th className="p-1.5 text-right">Uds 26</th><th className="p-1.5 text-right">Part</th><th className="p-1.5 text-center">Tend.</th>
            </tr></thead>
            <tbody>
              {PRODUCTOS.map((p, i) => (
                <tr key={p.corto} className={i % 2 ? "bg-orange-50" : ""}>
                  <td className="p-1.5 font-medium text-orange-900">{p.corto}</td>
                  <td className="p-1.5 text-right text-gray-600">{fmtK(p.m25)}</td>
                  <td className="p-1.5 text-right font-semibold text-orange-900">{fmtK(p.m26)}</td>
                  <td className="p-1.5 text-center"><VarBadge v={p.var} /></td>
                  <td className="p-1.5 text-right text-gray-700">{fmtU(p.u26)}</td>
                  <td className="p-1.5 text-right text-gray-700">{p.part}%</td>
                  <td className="p-1.5 text-center"><TendBadge t={p.tend} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-auto pt-3">
            <div className="bg-orange-50 rounded-lg p-2 text-xs text-orange-800 border border-orange-200">
              <strong>Lectura:</strong> <strong>Chicharrón</strong> es el #1 y único en franco crecimiento (+17.8%). Las palomitas <strong>Street Elote</strong> y <strong>Classic White 25g</strong> caen -17% a -19% y explican el grueso del retroceso. Rodajitas y Cheddar 125g se mantienen estables.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Slide4() {
  return (
    <div className="flex flex-col h-full p-6 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="flex items-center gap-3 mb-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/4buddies-logo.jpeg" alt="" className="h-8 rounded-lg" />
        <h2 className="text-xl font-bold text-orange-900">Top Tiendas y Clusters — YTD 2026</h2>
        <span className="text-xs text-orange-500 ml-auto">Ene–May 2026</span>
      </div>

      <div className="flex gap-4 flex-1">
        <div className="bg-white rounded-xl shadow p-3 border border-orange-200 flex-1">
          <h3 className="text-sm font-semibold text-orange-700 mb-2 flex items-center gap-1"><Store size={14} /> Top 15 Tiendas</h3>
          <table className="w-full text-xs">
            <thead><tr className="bg-orange-600 text-white">
              <th className="p-1 text-left">#</th><th className="p-1 text-left">Tienda</th><th className="p-1 text-left">Ciudad</th>
              <th className="p-1 text-center">Cluster</th><th className="p-1 text-right">Monto</th><th className="p-1 text-right">Uds</th>
            </tr></thead>
            <tbody>
              {TOP_TIENDAS.map((t, i) => (
                <tr key={t.tienda} className={i % 2 ? "bg-orange-50" : ""}>
                  <td className="p-1 text-orange-600 font-bold">{i + 1}</td>
                  <td className="p-1 font-medium text-orange-900">{t.tienda}</td>
                  <td className="p-1 text-gray-600">{t.ciudad}</td>
                  <td className="p-1 text-center"><ClusterBadge c={t.cluster} /></td>
                  <td className="p-1 text-right font-semibold text-orange-900">{fmtK(t.monto)}</td>
                  <td className="p-1 text-right text-gray-700">{fmtU(t.uds)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="w-[360px] flex flex-col gap-3">
          <div className="bg-white rounded-xl shadow p-3 border border-orange-200 flex-1">
            <h3 className="text-sm font-semibold text-orange-700 mb-2 flex items-center gap-1"><Target size={14} /> Venta por Cluster</h3>
            <table className="w-full text-xs">
              <thead><tr className="bg-orange-600 text-white">
                <th className="p-1 text-left">Cluster</th><th className="p-1 text-center">Tdas.</th>
                <th className="p-1 text-right">Monto</th><th className="p-1 text-right">Part</th>
              </tr></thead>
              <tbody>
                {CLUSTERS.map((c, i) => (
                  <tr key={c.cluster} className={i % 2 ? "bg-orange-50" : ""}>
                    <td className="p-1"><ClusterBadge c={c.cluster} /></td>
                    <td className="p-1 text-center text-gray-700">{c.tiendas}</td>
                    <td className="p-1 text-right font-semibold text-orange-900">{fmtK(c.monto)}</td>
                    <td className="p-1 text-right text-gray-700">{c.part}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-2 bg-orange-50 rounded-lg p-2 text-[11px] text-orange-800 border border-orange-200">
              <strong>Lectura:</strong> A + B + AA Light concentran el 61% de la venta. El negocio depende casi por completo de <strong>Monterrey</strong> (14 de top 15).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Slide5() {
  return (
    <div className="flex flex-col h-full p-6 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="flex items-center gap-3 mb-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/4buddies-logo.jpeg" alt="" className="h-8 rounded-lg" />
        <h2 className="text-xl font-bold text-orange-900 flex items-center gap-2"><Tag size={18} /> Impacto Promoción — Mayo 2026</h2>
        <span className="text-xs text-orange-500 ml-auto">Vigencia 08/05 – 04/06 · MIRAESTELS FOODS · mayo capta ~3.5 sem</span>
      </div>

      <div className="bg-white rounded-xl shadow p-3 border border-orange-200 mb-3">
        <table className="w-full text-xs">
          <thead><tr className="bg-orange-600 text-white">
            <th className="p-1.5 text-left">Producto</th><th className="p-1.5 text-left">Mecánica</th>
            <th className="p-1.5 text-right">Uds Abr</th><th className="p-1.5 text-right">Uds May</th>
            <th className="p-1.5 text-center">Δ vs Abr</th><th className="p-1.5 text-center">Δ vs May&apos;25</th>
            <th className="p-1.5 text-right">Precio May</th><th className="p-1.5 text-center">Veredicto</th>
          </tr></thead>
          <tbody>
            {PROMO.map((p, i) => (
              <tr key={p.producto} className={i % 2 ? "bg-orange-50" : ""}>
                <td className="p-1.5 font-medium text-orange-900">{p.producto}</td>
                <td className="p-1.5"><span className="bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded text-[10px] font-semibold">{p.mecanica}</span></td>
                <td className="p-1.5 text-right text-gray-600">{fmtU(p.udsAbr)}</td>
                <td className="p-1.5 text-right font-semibold text-orange-900">{fmtU(p.udsMay)}</td>
                <td className="p-1.5 text-center"><VarBadge v={p.dUds} /></td>
                <td className="p-1.5 text-center"><VarBadge v={p.dVs25} /></td>
                <td className="p-1.5 text-right text-gray-700">{fmt(p.precioMay)}</td>
                <td className="p-1.5 text-center"><VerdBadge v={p.veredicto} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4 flex-1">
        <div className="bg-white rounded-xl shadow p-3 border border-orange-200 flex-1">
          <h3 className="text-sm font-semibold text-orange-700 mb-2">Unidades Abril vs Mayo (productos en promo)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={PROMO_CHART} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
              <XAxis dataKey="name" tick={{ fill: "#9a3412", fontSize: 11 }} />
              <YAxis tick={{ fill: "#9a3412", fontSize: 11 }} />
              <Tooltip formatter={(v) => fmtU(Number(v)) + " uds"} />
              <Legend />
              <Bar dataKey="Abril" fill="#fdba74" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Mayo" fill="#ea580c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="w-[360px] bg-white rounded-xl shadow p-3 border border-orange-200 flex flex-col">
          <h3 className="text-sm font-semibold text-orange-700 mb-2">Lectura ejecutiva</h3>
          <ul className="text-xs text-orange-900 space-y-2 flex-1">
            <li className="flex gap-2"><span className="text-green-600 font-bold">▲</span><span><strong>Classic White 125g</strong> ($35) es el gran ganador: +18% vs abril y +22% vs mayo&apos;25. La rebaja directa sí movió volumen.</span></li>
            <li className="flex gap-2"><span className="text-amber-600 font-bold">▲</span><span><strong>Rodajitas 30g</strong> ($19.90): +7% vs abril, efecto positivo moderado.</span></li>
            <li className="flex gap-2"><span className="text-gray-500 font-bold">≈</span><span><strong>Classic White 25g</strong> (2x$34): +7.5% vs abril, pero aún -19% vs mayo&apos;25. La promo frenó la caída, no la revirtió.</span></li>
          </ul>
          <div className="mt-2 bg-orange-50 rounded-lg p-2 text-[11px] text-orange-800 border border-orange-200">
            <strong>Conclusión:</strong> La <strong>rebaja directa</strong> funcionó mejor que el 2xN. Conviene repetir el formato de descuento directo, sobre todo en Classic White 125g.
          </div>
        </div>
      </div>
    </div>
  );
}

function Slide6() {
  return (
    <div className="flex flex-col h-full p-8 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="flex items-center gap-3 mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/4buddies-logo.jpeg" alt="" className="h-8 rounded-lg" />
        <h2 className="text-2xl font-bold text-orange-900">Hallazgos y Acciones</h2>
        <span className="text-xs text-orange-500 ml-auto">{CORTE}</span>
      </div>

      <div className="flex gap-4 flex-1">
        <div className="flex-1 flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-orange-700 flex items-center gap-1"><TrendingUp size={14} /> Hallazgos</h3>
          {HALLAZGOS.map((h, i) => (
            <div key={i} className="bg-white rounded-lg p-3 border border-orange-200 text-xs text-orange-900 flex gap-2">
              <span className="text-orange-500 font-bold">{i + 1}.</span><span>{h}</span>
            </div>
          ))}
        </div>

        <div className="w-[380px] flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-orange-700 flex items-center gap-1"><Package size={14} /> Acciones recomendadas</h3>
          {ACCIONES.map((a, i) => (
            <div key={i} className="bg-white rounded-lg p-3 border border-orange-200 flex gap-3 flex-1">
              <div className="w-7 h-7 rounded-full bg-orange-600 text-white font-bold flex items-center justify-center shrink-0">{i + 1}</div>
              <div>
                <div className="font-semibold text-orange-900 text-sm">{a.t}</div>
                <div className="text-xs text-gray-600">{a.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-orange-500 mt-4 text-center">Reporte generado con datos de sell-out HEB · 4BUDDIES · {CORTE}</p>
    </div>
  );
}

const SLIDES = [Slide1, Slide2, Slide3, Slide4, Slide5, Slide6];

export default function Page() {
  const [current, setCurrent] = useState(0);
  const next = useCallback(() => setCurrent((c) => Math.min(c + 1, SLIDES.length - 1)), []);
  const prev = useCallback(() => setCurrent((c) => Math.max(c - 1, 0)), []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [next, prev]);

  const Slide = SLIDES[current];

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-950 p-4">
      <div className="relative w-[1280px] aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-orange-700">
        <Slide />
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-orange-900/90 backdrop-blur rounded-full px-4 py-1.5 shadow-lg">
          <button onClick={prev} disabled={current === 0} className="text-orange-300 hover:text-white disabled:opacity-30">
            <ChevronLeft size={20} />
          </button>
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-orange-400 scale-125" : "bg-orange-700 hover:bg-orange-500"}`} />
          ))}
          <button onClick={next} disabled={current === SLIDES.length - 1} className="text-orange-300 hover:text-white disabled:opacity-30">
            <ChevronRight size={20} />
          </button>
          <span className="text-orange-400 text-xs ml-2">{current + 1}/{SLIDES.length}</span>
        </div>
      </div>
    </div>
  );
}
