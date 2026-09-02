"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import {
  ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight,
  TrendingUp, Store, Package, Target, Tag,
} from "lucide-react";
import DATA from "./reporte-data.json";

/* Datos calculados desde sellout-heb.xlsx; corte completo al 31-ago-2026. */
const CORTE = "Al 31 Ago 2026";
const YTD = DATA.ytd;
const VENTAS_MES = DATA.ventasMes;
const PRODUCTOS = DATA.productos;

const PIE_DATA = PRODUCTOS.map((p) => ({ name: p.corto, value: p.m26 }));
const PIE_COLORS = ["#ea580c", "#f97316", "#fb923c", "#fdba74", "#fed7aa", "#c2410c", "#9a3412", "#7c2d12", "#431407"];

const FORMATOS = DATA.formatos;
const TOP_TIENDAS = DATA.topTiendas;
const CLUSTERS = DATA.clusters;
const PROMO = DATA.promo;

const HALLAZGOS = [
  "La venta YTD cae −7.0% en pesos ($2.08M vs $2.24M) y −9.4% en unidades. La caída es de volumen: el precio promedio subió +2.6% a $25.84 y amortiguó parte del impacto.",
  "El formato individual (25g/30g) concentra el problema: −17.1% en pesos y −15.0% en unidades. Las presentaciones de 25g caen entre −18% y −24%.",
  "El formato familiar 125g + Chicharrón crece +1.9% y Chicharrón Natural es el único SKU de crecimiento fuerte (+13.5%), con 25.2% de la venta.",
  "La segunda mitad empeora: junio −7.4%, julio −10.7% y agosto −8.6% en pesos. Agosto cerrado confirma que no fue un efecto de corte parcial.",
  "Los clusters A y B aportan 42.1% de la venta; el volumen no está solo en tiendas AA. Son el principal pool para recuperar rotación.",
];

const ACCIONES = [
  { n: 1, titulo: "Auditar el anaquel de 25g", texto: "La caída de las presentaciones individuales es consistente. Revisar planograma, frente y exhibición en las top 15 tiendas antes de profundizar descuentos." },
  { n: 2, titulo: "Escalar Chicharrón Natural", texto: "Es el motor del portafolio (+13.5%) y ya aporta una cuarta parte de la venta. Asegurar disponibilidad y buscar frente adicional en las 65 tiendas." },
  { n: 3, titulo: "Activar clusters A y B", texto: "25 tiendas aportan 42.1% de la venta. Concentrar activación y seguimiento ahí para recuperar los ~$156K que faltan frente a 2025." },
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
            <p className="text-orange-600 text-sm">YTD 2026 vs 2025 · Enero – Agosto (meses completos)</p>
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
          <h3 className="text-sm font-semibold text-orange-700 mb-2">Venta por mes — 2025 vs 2026 (Ene – Ago)</h3>
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
            Agosto cerrado. Excluye CEDIS y SKUs discontinuados/sin presencia.
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
          <span className="text-[10px] text-orange-500">Enero–agosto completos · comparación simétrica</span>
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
          <strong>Lectura:</strong> El año arrancó parejo (Ene −1.4%) pero se deterioró desde junio: Jun −7.4%, Jul −10.7% y Ago −8.6%.
          En todos los meses la caída en unidades es mayor que en pesos: el precio promedio (+2.6%) amortigua parte del hueco de volumen.
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
          <span className="text-[10px] text-orange-500">Ene – Ago 2026</span>
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
              Top 3 productos = <strong>51.5%</strong> de la venta
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
                Las presentaciones de 25g caen entre −18% y −24% en pesos.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 bg-white/80 rounded-lg p-2 text-[11px] text-orange-800 border border-orange-200">
          <strong>Lectura:</strong> <strong>Chicharrón Natural</strong> es el motor (+13.5%) y ya es el #1 con 25.2% de participación.
          El daño está en los individuales: Street Elote 25g −24.4%, Classic White 25g −22.1%, Chile Piquín −20.3% y Cheddar 25g −18.2%.
          Que caigan casi igual apunta a un problema de anaquel/rotación, no de demanda aislada.
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
          <span className="text-[10px] text-orange-500">Ene – Ago 2026 · 65 tiendas activas</span>
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
              Top 15 = <strong>48.0%</strong> de la venta
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
          <strong>Lectura:</strong> El volumen no está solo en las AA: los clusters <strong>A y B</strong> suman 25 tiendas y <strong>42.1%</strong> de la venta.
          Ahí está el pool con más upside para recuperar rotación.
        </div>
      </div>
    </Slide>
  );
}

/* ── Slide 5 — Impacto de promoción ─────────────────────────── */
function Slide5() {
  const verdictClass = (v: string) => v === "Sí fuerte" ? "bg-green-100 text-green-700" : v === "Sí moderado" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-700";
  return (
    <Slide>
      <div className="flex flex-col h-full p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3"><Logo /><h2 className="text-xl font-bold text-orange-900">Impacto de Promoción — Mayo 2026</h2></div>
          <span className="text-[10px] text-orange-500">Vigencia 08 May – 04 Jun · mayo captura ~3.5 semanas</span>
        </div>
        <div className="bg-white rounded-xl shadow p-4 border border-orange-200">
          <div className="flex items-center gap-2 text-sm font-semibold text-orange-700 mb-3"><Tag size={15} /> Desempeño de los SKUs promocionados</div>
          <table className="w-full text-xs">
            <thead><tr className="bg-orange-600 text-white">
              <th className="p-2 text-left">Producto</th><th className="p-2 text-left">Mecánica</th><th className="p-2 text-right">Uds Abr</th><th className="p-2 text-right">Uds May</th><th className="p-2 text-center">Δ vs Abr</th><th className="p-2 text-center">Δ vs May&apos;25</th><th className="p-2 text-right">Precio May</th><th className="p-2 text-center">Veredicto</th>
            </tr></thead>
            <tbody>{PROMO.map((p, i) => <tr key={p.producto} className={i % 2 ? "bg-orange-50" : ""}>
              <td className="p-2 font-semibold text-orange-900">{p.producto}</td><td className="p-2"><span className="rounded bg-orange-100 px-2 py-1 text-orange-800">{p.mecanica}</span></td><td className="p-2 text-right">{fmtU(p.udsAbr)}</td><td className="p-2 text-right font-semibold">{fmtU(p.udsMay)}</td><td className="p-2 text-center"><VarBadge v={p.dUds} /></td><td className="p-2 text-center"><VarBadge v={p.dVs25} /></td><td className="p-2 text-right">{fmt(p.precioMay)}</td><td className="p-2 text-center"><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${verdictClass(p.veredicto)}`}>{p.veredicto}</span></td>
            </tr>)}</tbody>
          </table>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4 flex-1">
          {PROMO.map((p) => <div key={p.producto} className="rounded-xl border border-orange-200 bg-white p-4 shadow">
            <p className="text-xs font-bold text-orange-900">{p.producto}</p><p className="mt-2 text-3xl font-bold text-orange-700">{p.dUds >= 0 ? "+" : ""}{p.dUds}%</p><p className="text-xs text-orange-600">unidades mayo vs abril</p>
            <p className="mt-4 text-[11px] leading-relaxed text-orange-900">Precio promedio: {fmt(p.precioAbr)} → {fmt(p.precioMay)} ({p.dPrecio}%). Frente a may&apos;25: {p.dVs25 >= 0 ? "+" : ""}{p.dVs25}% uds.</p>
          </div>)}
        </div>
        <div className="mt-4 rounded-lg border border-orange-200 bg-white/80 p-2 text-[11px] text-orange-800"><strong>Conclusión:</strong> La rebaja de Classic White 125g fue la ganadora: +18.0% en volumen y +22.1% vs mayo 2025. Rodajitas tuvo efecto positivo moderado; el 2x$34 de Classic White 25g mejoró el mes, pero no revirtió su caída interanual.</div>
      </div>
    </Slide>
  );
}

/* ── Slide 6 — Hallazgos y Acciones ─────────────────────────── */
function Slide6() {
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
const SLIDES = [Slide1, Slide2, Slide3, Slide4, Slide5, Slide6];

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
