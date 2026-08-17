"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import {
  ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight,
  TrendingUp, Store, Package, Target,
} from "lucide-react";

/* ══════════════════════════════════════════════════════════════
   DATOS — Sell-Out HEB · corte quincenal al 15-ago-2026
   Rango YTD: 1 ene – 15 ago (mismo rango ambos años)
   Excluye CEDIS (2160) y SKUs discontinuados
   ══════════════════════════════════════════════════════════════ */

const CORTE = "Al 15 Ago 2026";

const YTD = {
  monto25: 2085306, monto26: 1944006, varMonto: -6.8,
  uds25: 82881, uds26: 74747, varUds: -9.8,
  tiendas: 65,
  ticket25: 25.16, ticket26: 26.01, varTicket: 3.4,
};

const VENTAS_MES = [
  { mes: "Ene",  y2025: 282960, y2026: 278968, u2025: 11158, u2026: 10516, varM: -1.4,  varU: -5.8 },
  { mes: "Feb",  y2025: 269925, y2026: 254380, u2025: 10993, u2026: 9938,  varM: -5.8,  varU: -9.6 },
  { mes: "Mar",  y2025: 330215, y2026: 276116, u2025: 13380, u2026: 11340, varM: -16.4, varU: -15.2 },
  { mes: "Abr",  y2025: 275427, y2026: 266481, u2025: 10841, u2026: 10380, varM: -3.2,  varU: -4.3 },
  { mes: "May",  y2025: 283242, y2026: 280316, u2025: 11794, u2026: 11283, varM: -1.0,  varU: -4.3 },
  { mes: "Jun",  y2025: 265012, y2026: 245309, u2025: 10535, u2026: 9150,  varM: -7.4,  varU: -13.1 },
  { mes: "Jul",  y2025: 254151, y2026: 226937, u2025: 9556,  u2026: 7974,  varM: -10.7, varU: -16.6 },
  { mes: "Ago*", y2025: 124375, y2026: 115499, u2025: 4624,  u2026: 4166,  varM: -7.1,  varU: -9.9 },
];

const PRODUCTOS = [
  { corto: "Chicharrón Natural",    m25: 426690, m26: 492231, var: 15.4,  u26: 9877,  part: 25.3, tend: "Crece"   },
  { corto: "Street Elote 125g",     m25: 301095, m26: 259283, var: -13.9, u26: 8397,  part: 13.3, tend: "Cae"     },
  { corto: "Rodajitas Spicy Limón", m25: 262038, m26: 253222, var: -3.4,  u26: 12819, part: 13.0, tend: "Estable" },
  { corto: "Classic White 125g",    m25: 194693, m26: 194877, var: 0.1,   u26: 5497,  part: 10.0, tend: "Estable" },
  { corto: "Classic White 25g",     m25: 246908, m26: 193931, var: -21.5, u26: 11125, part: 10.0, tend: "Cae"     },
  { corto: "Cheddar Jalapeño 125g", m25: 188509, m26: 187091, var: -0.8,  u26: 6085,  part: 9.6,  tend: "Estable" },
  { corto: "Street Elote 25g",      m25: 217469, m26: 165093, var: -24.1, u26: 9555,  part: 8.5,  tend: "Cae"     },
  { corto: "Cheddar Jalapeño 25g",  m25: 139566, m26: 114121, var: -18.2, u26: 6645,  part: 5.9,  tend: "Cae"     },
  { corto: "Chile Piquín 25g",      m25: 108339, m26: 84157,  var: -22.3, u26: 4747,  part: 4.3,  tend: "Cae"     },
];

const PIE_DATA = PRODUCTOS.map((p) => ({ name: p.corto, value: p.m26 }));
const PIE_COLORS = ["#ea580c", "#f97316", "#fb923c", "#fdba74", "#fed7aa", "#c2410c", "#9a3412", "#7c2d12", "#431407"];

// Formato 125g vs 25g — la historia real del año
const FORMATOS = [
  { formato: "Familiar 125g + Chicharrón", m25: 1110986, m26: 1133482, var: 2.0,   u25: 29638, u26: 29856, varU: 0.7 },
  { formato: "Individual 25g / 30g",       m25: 974320,  m26: 810524,  var: -16.8, u25: 53243, u26: 44891, varU: -15.7 },
];

const TOP_TIENDAS = [
  { tienda: "MTY VALLE ORIENTE",        ciudad: "Monterrey", cluster: "AA",       monto: 92344, uds: 3434 },
  { tienda: "MTY CHIPINQUE",            ciudad: "Monterrey", cluster: "AA",       monto: 87918, uds: 3574 },
  { tienda: "MTY SAN PEDRO",            ciudad: "Monterrey", cluster: "AA",       monto: 85251, uds: 3650 },
  { tienda: "MTY VALLE ALTO",           ciudad: "Monterrey", cluster: "AA Light", monto: 76869, uds: 3040 },
  { tienda: "MTY CONTRY",               ciudad: "Monterrey", cluster: "A",        monto: 75907, uds: 3103 },
  { tienda: "MTY TEC",                  ciudad: "Monterrey", cluster: "A",        monto: 70242, uds: 2712 },
  { tienda: "MTY SAN NICOLAS",          ciudad: "Monterrey", cluster: "A",        monto: 59055, uds: 2191 },
  { tienda: "MTY EL URO",               ciudad: "Monterrey", cluster: "AA Light", monto: 57510, uds: 2496 },
  { tienda: "LEO CERRO GORDO",          ciudad: "León",      cluster: "AA Light", monto: 55542, uds: 2467 },
  { tienda: "MTY CUMBRES",              ciudad: "Monterrey", cluster: "AA Light", monto: 48591, uds: 1890 },
  { tienda: "MTY BOSQUES DE LAS LOMAS", ciudad: "Monterrey", cluster: "A",        monto: 47897, uds: 1871 },
  { tienda: "MTY PUERTA DE HIERRO",     ciudad: "Monterrey", cluster: "A",        monto: 43771, uds: 1639 },
  { tienda: "MTY SANTA CATARINA",       ciudad: "Monterrey", cluster: "B",        monto: 41778, uds: 1557 },
  { tienda: "MTY CONCORDIA",            ciudad: "Monterrey", cluster: "B",        monto: 40778, uds: 1560 },
  { tienda: "SAL SAN PATRICIO",         ciudad: "Saltillo",  cluster: "AA Light", monto: 39003, uds: 1557 },
];

const CLUSTERS = [
  { cluster: "A",          tiendas: 10, monto: 412716, uds: 15458, part: 21.2 },
  { cluster: "B",          tiendas: 15, monto: 408744, uds: 15519, part: 21.0 },
  { cluster: "AA Light",   tiendas: 8,  monto: 360245, uds: 14234, part: 18.5 },
  { cluster: "AA",         tiendas: 3,  monto: 265514, uds: 10658, part: 13.7 },
  { cluster: "C",          tiendas: 10, monto: 236564, uds: 8806,  part: 12.2 },
  { cluster: "B Bajío",    tiendas: 5,  monto: 88199,  uds: 3237,  part: 4.5  },
  { cluster: "B Frontera", tiendas: 6,  monto: 78509,  uds: 3078,  part: 4.0  },
  { cluster: "C Bajío",    tiendas: 4,  monto: 57306,  uds: 2198,  part: 2.9  },
  { cluster: "EAA",        tiendas: 1,  monto: 18123,  uds: 902,   part: 0.9  },
  { cluster: "N/D",        tiendas: 3,  monto: 18085,  uds: 657,   part: 0.9  },
];

const HALLAZGOS = [
  "La venta YTD cae −6.8% en pesos ($1.94M vs $2.09M) y −9.8% en unidades. La caída es de volumen, no de precio: el precio promedio subió +3.4% a $26.01 y amortiguó el golpe.",
  "El problema está concentrado en el formato individual (25g/30g): −16.8% en pesos y −15.7% en unidades. Aislando solo los cuatro SKUs de 25g, la caída es de −21.8% en pesos y −19.8% en unidades: caen entre −18% y −24% cada uno.",
  "El formato familiar 125g + Chicharrón está plano/positivo (+2.0%). Ahí no hay problema de demanda — el consumidor sigue comprando, solo migró de tamaño.",
  "Chicharrón Natural es el único SKU que crece (+15.4%) y ya es el #1 del portafolio con 25.3% de la venta. Solo cargaba 20.5% el año pasado.",
  "La tendencia se deterioró en el segundo semestre: Jun −7.4%, Jul −10.7% en pesos. La quincena de agosto (−7.1%) frena la caída pero no la revierte.",
  "Monterrey concentra 64% de la venta y los top 15 puntos valen 47.5%. Cluster A y B (25 tiendas) aportan 42% — el volumen no está solo en las AA.",
];

const ACCIONES = [
  { n: 1, titulo: "Auditar anaquel del formato 25g", texto: "La caída de −19.3% en unidades del individual es demasiado pareja entre los 4 SKUs para ser demanda. Apunta a espacio, ubicación o quiebres. Revisar planograma y exhibición en los top 15 puntos antes de tocar precio." },
  { n: 2, titulo: "Empujar Chicharrón Natural", texto: "Es el único que crece (+15.4%) y ya es el #1. Pedir frente adicional y asegurar que no falte en las 65 tiendas: es el motor que hoy sostiene el YTD." },
  { n: 3, titulo: "Activación en Cluster A y B", texto: "25 tiendas que valen 42% de la venta y no reciben foco promocional. Es el pool con más upside para recuperar los ~$141K que faltan contra 2025." },
];

/* ── Helpers ────────────────────────────────────────────────── */
const fmt  = (n: number) => "$" + n.toLocaleString("es-MX", { maximumFractionDigits: 0 });
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
  return <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${colors[t] || ""}`}>{t}</span>;
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

const Slide = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full h-full bg-gradient-to-br from-orange-50 to-orange-100 text-orange-900">{children}</div>
);

/* ── Slide 1 — Portada + Resumen YTD ────────────────────────── */
function Slide1() {
  return (
    <Slide>
      <div className="flex flex-col h-full p-8">
        <div className="flex items-center gap-5 mb-5">
          <Logo h="h-20" />
          <div>
            <h1 className="text-3xl font-bold text-orange-900">Reporte de Sell-Out</h1>
            <h2 className="text-xl text-orange-700">4BUDDIES × HEB</h2>
            <p className="text-orange-600 text-sm">YTD 2026 vs 2025 · Enero – 15 Agosto (corte quincenal)</p>
          </div>
        </div>

        <div className="flex gap-4 mb-5">
          {[
            { l: "Venta YTD 2026", v: fmtK(YTD.monto26), b: <VarBadge v={YTD.varMonto} /> },
            { l: "Unidades YTD 2026", v: fmtU(YTD.uds26), b: <VarBadge v={YTD.varUds} /> },
            { l: "Precio Prom.", v: "$" + YTD.ticket26.toFixed(2), b: <VarBadge v={YTD.varTicket} /> },
            { l: "Tiendas Activas", v: String(YTD.tiendas), b: <span className="text-[10px] text-orange-500">operativas</span> },
          ].map((k) => (
            <div key={k.l} className="bg-white rounded-xl shadow px-5 py-3 text-center border border-orange-200 flex-1">
              <p className="text-[11px] text-orange-600 mb-1">{k.l}</p>
              <p className="text-2xl font-bold text-orange-900 mb-1">{k.v}</p>
              {k.b}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow p-4 border border-orange-200 flex-1">
          <h3 className="text-sm font-semibold text-orange-700 mb-2">Venta por mes — 2025 vs 2026 (Ene – 15 Ago)</h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-orange-700 text-white">
                <th className="p-1.5 text-left rounded-tl">Mes</th>
                <th className="p-1.5 text-center" colSpan={3}>MXN ($)</th>
                <th className="p-1.5 text-center rounded-tr" colSpan={3}>Unidades</th>
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
              {VENTAS_MES.map((m, i) => (
                <tr key={m.mes} className={i % 2 ? "bg-orange-50" : ""}>
                  <td className="p-1.5 font-medium">{m.mes}</td>
                  <td className="p-1.5 text-right">{fmtK(m.y2025)}</td>
                  <td className="p-1.5 text-right font-semibold text-orange-900">{fmtK(m.y2026)}</td>
                  <td className="p-1.5 text-center"><VarBadge v={m.varM} /></td>
                  <td className="p-1.5 text-right">{fmtU(m.u2025)}</td>
                  <td className="p-1.5 text-right font-semibold text-orange-900">{fmtU(m.u2026)}</td>
                  <td className="p-1.5 text-center"><VarBadge v={m.varU} /></td>
                </tr>
              ))}
              <tr className="bg-orange-100 font-bold border-t-2 border-orange-300">
                <td className="p-1.5">YTD</td>
                <td className="p-1.5 text-right">{fmtK(YTD.monto25)}</td>
                <td className="p-1.5 text-right text-orange-900">{fmtK(YTD.monto26)}</td>
                <td className="p-1.5 text-center"><VarBadge v={YTD.varMonto} /></td>
                <td className="p-1.5 text-right">{fmtU(YTD.uds25)}</td>
                <td className="p-1.5 text-right text-orange-900">{fmtU(YTD.uds26)}</td>
                <td className="p-1.5 text-center"><VarBadge v={YTD.varUds} /></td>
              </tr>
            </tbody>
          </table>
          <p className="text-[10px] text-orange-500 mt-3">
            *Ago = 1–15 ago en ambos años (comparación de misma quincena). Excluye SKUs discontinuados y CEDIS.
          </p>
        </div>
      </div>
    </Slide>
  );
}

/* ── Slide 2 — Tendencia Mensual ────────────────────────────── */
function Slide2() {
  return (
    <Slide>
      <div className="flex flex-col h-full p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Logo />
            <h2 className="text-xl font-bold text-orange-900">Venta Mensual — 2025 vs 2026</h2>
          </div>
          <span className="text-[10px] text-orange-500">*Ago 2026 parcial (1–15) vs mismos 15 días de 2025</span>
        </div>

        <div className="flex gap-4 flex-1">
          <div className="flex-1 bg-white rounded-xl shadow p-3 border border-orange-200 flex flex-col">
            <h3 className="text-xs font-semibold text-orange-700 mb-1">Ingresos por mes (MXN)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={VENTAS_MES} barGap={4} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9a3412" }} />
                <YAxis tickFormatter={fmtK} tick={{ fontSize: 10, fill: "#9a3412" }} />
                <Tooltip formatter={(v) => fmt(Number(v))} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="y2025" name="2025" fill="#fdba74" radius={[4, 4, 0, 0]} />
                <Bar dataKey="y2026" name="2026" fill="#ea580c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <h3 className="text-xs font-semibold text-orange-700 mt-2 mb-1">Unidades por mes</h3>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={VENTAS_MES} barGap={4} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
                <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "#9a3412" }} />
                <YAxis tick={{ fontSize: 10, fill: "#9a3412" }} />
                <Tooltip formatter={(v) => fmtU(Number(v))} />
                <Bar dataKey="u2025" name="2025" fill="#fdba74" radius={[4, 4, 0, 0]} />
                <Bar dataKey="u2026" name="2026" fill="#ea580c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="w-[380px] flex flex-col gap-3">
            <div className="bg-white rounded-xl shadow p-3 border border-orange-200">
              <h3 className="text-xs font-semibold text-orange-700 mb-1">Ingresos ($)</h3>
              <table className="w-full text-[11px]">
                <thead><tr className="bg-orange-600 text-white">
                  <th className="p-1 text-left">Mes</th><th className="p-1 text-right">2025</th>
                  <th className="p-1 text-right">2026</th><th className="p-1 text-center">Var</th>
                </tr></thead>
                <tbody>
                  {VENTAS_MES.map((m, i) => (
                    <tr key={m.mes} className={i % 2 ? "bg-orange-50" : ""}>
                      <td className="p-1">{m.mes}</td>
                      <td className="p-1 text-right">{fmtK(m.y2025)}</td>
                      <td className="p-1 text-right font-semibold">{fmtK(m.y2026)}</td>
                      <td className="p-1 text-center"><VarBadge v={m.varM} /></td>
                    </tr>
                  ))}
                  <tr className="bg-orange-100 font-bold border-t-2 border-orange-300">
                    <td className="p-1">YTD</td>
                    <td className="p-1 text-right">{fmtK(YTD.monto25)}</td>
                    <td className="p-1 text-right">{fmtK(YTD.monto26)}</td>
                    <td className="p-1 text-center"><VarBadge v={YTD.varMonto} /></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bg-white rounded-xl shadow p-3 border border-orange-200">
              <h3 className="text-xs font-semibold text-orange-700 mb-1">Unidades</h3>
              <table className="w-full text-[11px]">
                <thead><tr className="bg-orange-600 text-white">
                  <th className="p-1 text-left">Mes</th><th className="p-1 text-right">2025</th>
                  <th className="p-1 text-right">2026</th><th className="p-1 text-center">Var</th>
                </tr></thead>
                <tbody>
                  {VENTAS_MES.map((m, i) => (
                    <tr key={m.mes} className={i % 2 ? "bg-orange-50" : ""}>
                      <td className="p-1">{m.mes}</td>
                      <td className="p-1 text-right">{fmtU(m.u2025)}</td>
                      <td className="p-1 text-right font-semibold">{fmtU(m.u2026)}</td>
                      <td className="p-1 text-center"><VarBadge v={m.varU} /></td>
                    </tr>
                  ))}
                  <tr className="bg-orange-100 font-bold border-t-2 border-orange-300">
                    <td className="p-1">YTD</td>
                    <td className="p-1 text-right">{fmtU(YTD.uds25)}</td>
                    <td className="p-1 text-right">{fmtU(YTD.uds26)}</td>
                    <td className="p-1 text-center"><VarBadge v={YTD.varUds} /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-3 bg-white/80 rounded-lg p-2 text-[11px] text-orange-800 border border-orange-200">
          <strong>Lectura:</strong> El año arrancó parejo (Ene −1.4%) pero se deterioró en el segundo semestre: Jun −7.4% y Jul −10.7%, el peor mes.
          La quincena de agosto (−7.1%) modera la caída sin revertirla. En todos los meses la caída en unidades es mayor que en pesos —
          el precio promedio (+3.4%) está tapando parte del hueco de volumen.
        </div>
      </div>
    </Slide>
  );
}

/* ── Slide 3 — Desempeño por Producto ───────────────────────── */
function Slide3() {
  return (
    <Slide>
      <div className="flex flex-col h-full p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Logo />
            <h2 className="text-xl font-bold text-orange-900">Desempeño por Producto — YTD 2026 vs 2025</h2>
          </div>
          <span className="text-[10px] text-orange-500">Ene – 15 Ago 2026</span>
        </div>

        <div className="flex gap-4 flex-1">
          <div className="w-[300px] bg-white rounded-xl shadow p-3 border border-orange-200 flex flex-col">
            <h3 className="text-xs font-semibold text-orange-700 mb-1 flex items-center gap-1">
              <Package size={13} /> Participación YTD 2026
            </h3>
            <ResponsiveContainer width="100%" height={215}>
              <PieChart>
                <Pie data={PIE_DATA} dataKey="value" outerRadius={82} labelLine={false}
                  label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
                  style={{ fontSize: 10 }}>
                  {PIE_DATA.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => fmt(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-[9px] space-y-0.5 mt-1">
              {PRODUCTOS.map((p, i) => (
                <div key={p.corto} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-orange-800 truncate">{p.corto}</span>
                  <span className="ml-auto font-semibold text-orange-900">{p.part}%</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-orange-600 mt-2 pt-2 border-t border-orange-100">
              Top 3 productos = <strong>51.7%</strong> de la venta
            </p>
          </div>

          <div className="flex-1 flex flex-col gap-3">
            <div className="bg-white rounded-xl shadow p-3 border border-orange-200">
              <table className="w-full text-[11px]">
                <thead><tr className="bg-orange-600 text-white">
                  <th className="p-1.5 text-left">Producto</th>
                  <th className="p-1.5 text-right">2025</th>
                  <th className="p-1.5 text-right">2026</th>
                  <th className="p-1.5 text-center">Var</th>
                  <th className="p-1.5 text-right">Uds 26</th>
                  <th className="p-1.5 text-right">Part %</th>
                  <th className="p-1.5 text-center">Tend</th>
                </tr></thead>
                <tbody>
                  {PRODUCTOS.map((p, i) => (
                    <tr key={p.corto} className={i % 2 ? "bg-orange-50" : ""}>
                      <td className="p-1.5 font-medium">{p.corto}</td>
                      <td className="p-1.5 text-right">{fmtK(p.m25)}</td>
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

            <div className="bg-white rounded-xl shadow p-3 border border-orange-200 flex-1">
              <h3 className="text-xs font-semibold text-orange-700 mb-2">La historia del año: formato familiar vs individual</h3>
              <table className="w-full text-[11px]">
                <thead><tr className="bg-orange-700 text-white">
                  <th className="p-1.5 text-left">Formato</th>
                  <th className="p-1.5 text-right">MXN 2025</th>
                  <th className="p-1.5 text-right">MXN 2026</th>
                  <th className="p-1.5 text-center">Var $</th>
                  <th className="p-1.5 text-center">Var Uds</th>
                </tr></thead>
                <tbody>
                  {FORMATOS.map((f, i) => (
                    <tr key={f.formato} className={i % 2 ? "bg-orange-50" : ""}>
                      <td className="p-1.5 font-medium">{f.formato}</td>
                      <td className="p-1.5 text-right">{fmtK(f.m25)}</td>
                      <td className="p-1.5 text-right font-semibold text-orange-900">{fmtK(f.m26)}</td>
                      <td className="p-1.5 text-center"><VarBadge v={f.var} /></td>
                      <td className="p-1.5 text-center"><VarBadge v={f.varU} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-[10px] text-orange-600 mt-2">
                Toda la caída del año vive en el formato individual. El familiar está plano/positivo.
                Aislando solo los 25g (sin Rodajitas): −21.8% en pesos, −19.8% en unidades.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 bg-white/80 rounded-lg p-2 text-[11px] text-orange-800 border border-orange-200">
          <strong>Lectura:</strong> <strong>Chicharrón Natural</strong> es el único SKU que crece (+15.4%) y ya es el #1 con 25.3% de participación.
          Los tres 125g están planos (−0.8% a +0.1%). El daño está en los individuales: Street Elote 25g −24.1%, Chile Piquín −22.3%,
          Classic White 25g −21.5% y Cheddar 25g −18.2%. Que los cuatro caigan casi igual apunta a un problema de anaquel, no de demanda.
        </div>
      </div>
    </Slide>
  );
}

/* ── Slide 4 — Top Tiendas y Clusters ───────────────────────── */
function Slide4() {
  const totalCl = CLUSTERS.reduce((a, c) => a + c.monto, 0);
  return (
    <Slide>
      <div className="flex flex-col h-full p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Logo />
            <h2 className="text-xl font-bold text-orange-900">Top Tiendas y Clusters — YTD 2026</h2>
          </div>
          <span className="text-[10px] text-orange-500">Ene – 15 Ago 2026 · 65 tiendas activas</span>
        </div>

        <div className="flex gap-4 flex-1">
          <div className="flex-1 bg-white rounded-xl shadow p-3 border border-orange-200">
            <h3 className="text-xs font-semibold text-orange-700 mb-1 flex items-center gap-1">
              <Store size={13} /> Top 15 Tiendas
            </h3>
            <table className="w-full text-[11px]">
              <thead><tr className="bg-orange-600 text-white">
                <th className="p-1 text-left">#</th>
                <th className="p-1 text-left">Tienda</th>
                <th className="p-1 text-left">Ciudad</th>
                <th className="p-1 text-center">Cluster</th>
                <th className="p-1 text-right">Monto</th>
                <th className="p-1 text-right">Uds</th>
              </tr></thead>
              <tbody>
                {TOP_TIENDAS.map((t, i) => (
                  <tr key={t.tienda} className={i % 2 ? "bg-orange-50" : ""}>
                    <td className="p-1 text-orange-600 font-bold">{i + 1}</td>
                    <td className="p-1 font-medium">{t.tienda}</td>
                    <td className="p-1 text-gray-600">{t.ciudad}</td>
                    <td className="p-1 text-center"><ClusterBadge c={t.cluster} /></td>
                    <td className="p-1 text-right font-semibold text-orange-900">{fmtK(t.monto)}</td>
                    <td className="p-1 text-right">{fmtU(t.uds)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[10px] text-orange-600 mt-2">
              Top 15 = <strong>47.5%</strong> de la venta · Top 10 = 36.5%
            </p>
          </div>

          <div className="w-[360px] bg-white rounded-xl shadow p-3 border border-orange-200 flex flex-col">
            <h3 className="text-xs font-semibold text-orange-700 mb-1 flex items-center gap-1">
              <Target size={13} /> Venta por Cluster
            </h3>
            <ResponsiveContainer width="100%" height={165}>
              <BarChart data={CLUSTERS} layout="vertical" margin={{ top: 0, right: 10, left: 5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
                <XAxis type="number" tickFormatter={fmtK} tick={{ fontSize: 9, fill: "#9a3412" }} />
                <YAxis type="category" dataKey="cluster" width={62} tick={{ fontSize: 9, fill: "#9a3412" }} />
                <Tooltip formatter={(v) => fmt(Number(v))} />
                <Bar dataKey="monto" fill="#ea580c" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <table className="w-full text-[10px] mt-2">
              <thead><tr className="bg-orange-600 text-white">
                <th className="p-1 text-left">Cluster</th>
                <th className="p-1 text-center">Tdas</th>
                <th className="p-1 text-right">Monto</th>
                <th className="p-1 text-right">Part %</th>
              </tr></thead>
              <tbody>
                {CLUSTERS.map((c, i) => (
                  <tr key={c.cluster} className={i % 2 ? "bg-orange-50" : ""}>
                    <td className="p-1"><ClusterBadge c={c.cluster} /></td>
                    <td className="p-1 text-center">{c.tiendas}</td>
                    <td className="p-1 text-right font-semibold">{fmtK(c.monto)}</td>
                    <td className="p-1 text-right">{c.part}%</td>
                  </tr>
                ))}
                <tr className="bg-orange-100 font-bold border-t-2 border-orange-300">
                  <td className="p-1">Total</td>
                  <td className="p-1 text-center">65</td>
                  <td className="p-1 text-right">{fmtK(totalCl)}</td>
                  <td className="p-1 text-right">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-3 bg-white/80 rounded-lg p-2 text-[11px] text-orange-800 border border-orange-200">
          <strong>Lectura:</strong> Monterrey concentra <strong>64%</strong> de la venta nacional y 12 de las top 15 tiendas.
          El volumen no está solo en las AA: los clusters <strong>A y B</strong> suman 25 tiendas y <strong>42%</strong> de la venta,
          más que AA + AA Light juntos (32%). Ahí está el pool con más upside para recuperar terreno.
        </div>
      </div>
    </Slide>
  );
}

/* ── Slide 5 — Hallazgos y Acciones ─────────────────────────── */
function Slide5() {
  return (
    <Slide>
      <div className="flex flex-col h-full p-8">
        <div className="flex items-center gap-3 mb-4">
          <Logo />
          <h2 className="text-2xl font-bold text-orange-900">Hallazgos y Acciones</h2>
        </div>

        <div className="flex gap-4 flex-1">
          <div className="flex-1 flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-orange-700">Hallazgos</h3>
            {HALLAZGOS.map((h, i) => (
              <div key={i} className="bg-white rounded-lg p-2.5 border border-orange-200 flex gap-2 items-start shadow-sm">
                <TrendingUp size={14} className="text-orange-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-snug text-orange-900">{h}</p>
              </div>
            ))}
          </div>

          <div className="w-[380px] flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-orange-700">Acciones recomendadas</h3>
            {ACCIONES.map((a) => (
              <div key={a.n} className="bg-white rounded-xl p-3 border border-orange-200 shadow-sm flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 rounded-full bg-orange-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {a.n}
                  </span>
                  <h4 className="text-xs font-bold text-orange-900">{a.titulo}</h4>
                </div>
                <p className="text-[11px] leading-snug text-orange-800">{a.texto}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[10px] text-orange-500 mt-3">
          Reporte generado con datos de sell-out HEB · 4BUDDIES · {CORTE} · Excluye CEDIS y SKUs discontinuados
        </p>
      </div>
    </Slide>
  );
}

/* ── Carrusel ───────────────────────────────────────────────── */
const SLIDES = [Slide1, Slide2, Slide3, Slide4, Slide5];

export default function Page() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") setCurrent((c) => Math.min(c + 1, SLIDES.length - 1));
      if (e.key === "ArrowLeft") setCurrent((c) => Math.max(c - 1, 0));
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const Cur = SLIDES[current];

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-950 p-4">
      <div className="relative w-[1280px] aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-orange-700">
        <Cur />
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-orange-900/90 backdrop-blur rounded-full px-4 py-1.5 shadow-lg">
          <button onClick={() => setCurrent((c) => Math.max(c - 1, 0))} disabled={current === 0}
            className="text-orange-300 hover:text-white disabled:opacity-30 transition">
            <ChevronLeft size={20} />
          </button>
          <div className="flex gap-1.5">
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition ${i === current ? "bg-orange-400 scale-125" : "bg-orange-700"}`} />
            ))}
          </div>
          <button onClick={() => setCurrent((c) => Math.min(c + 1, SLIDES.length - 1))} disabled={current === SLIDES.length - 1}
            className="text-orange-300 hover:text-white disabled:opacity-30 transition">
            <ChevronRight size={20} />
          </button>
          <span className="text-[11px] text-orange-300 font-medium ml-1">{current + 1}/{SLIDES.length}</span>
        </div>
      </div>
    </div>
  );
}
