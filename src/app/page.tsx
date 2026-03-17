"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import {
  AlertTriangle, ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight, Store, Box
} from "lucide-react";

// ============================================================
// DATA
// ============================================================

const VENTAS_MES = [
  { mes: "Ene", y2025: 282960, y2026: 278968, u2025: 11158, u2026: 10516 },
  { mes: "Feb", y2025: 269925, y2026: 254380, u2025: 10993, u2026: 9938 },
  { mes: "Mar*", y2025: 164904, y2026: 152952, u2025: 6882, u2026: 6357 },
];

const YTD = {
  monto25: 552885, monto26: 533348, varMonto: -3.5,
  uds25: 22151, uds26: 20454, varUds: -7.7,
  marVar: -7.2,
};

const PRODUCTOS_YTD = [
  { nombre: "Chicharrón Natural", corto: "Chicharrón", m25: 100319, m26: 129188, var: 28.8, inv: 1134, semInv: 4.0, estado: "Vigilar" },
  { nombre: "Palomitas Street Elote 125g", corto: "St. Elote 125g", m25: 84074, m26: 68838, var: -18.1, inv: 971, semInv: 3.7, estado: "Vigilar" },
  { nombre: "Rodajitas Spicy Limón", corto: "Rodajitas", m25: 72669, m26: 68639, var: -5.5, inv: 2083, semInv: 4.3, estado: "OK" },
  { nombre: "Palomitas Classic White 25g", corto: "C. White 25g", m25: 65168, m26: 61894, var: -5.0, inv: 2459, semInv: 5.9, estado: "OK" },
  { nombre: "Palomitas Street Elote 25g", corto: "St. Elote 25g", m25: 61614, m26: 50807, var: -17.5, inv: 2222, semInv: 5.6, estado: "OK" },
  { nombre: "Palomitas Classic White 125g", corto: "C. White 125g", m25: 54405, m26: 49697, var: -8.7, inv: 786, semInv: 4.6, estado: "OK" },
  { nombre: "Palomitas Cheddar Jalapeño 125g", corto: "Ched. Jal 125g", m25: 50719, m26: 49492, var: -2.4, inv: 2003, semInv: 7.7, estado: "Holgado" },
  { nombre: "Palomitas Cheddar Jalapeño 25g", corto: "Ched. Jal 25g", m25: 35590, m26: 32898, var: -7.6, inv: 820, semInv: 4.4, estado: "OK" },
  { nombre: "Palomitas Chile Piquín", corto: "Chile Piquín", m25: 28327, m26: 21894, var: -22.7, inv: 1544, semInv: 9.9, estado: "Holgado" },
];

const PIE_DATA = PRODUCTOS_YTD.map(p => ({ name: p.corto, value: p.m26 }));
const PIE_COLORS = ["#ea580c", "#f97316", "#fb923c", "#fdba74", "#fed7aa", "#c2410c", "#9a3412", "#7c2d12", "#431407"];

const TOP_TIENDAS = [
  { tienda: "HEB MTY Chipinque", ciudad: "Monterrey", cluster: "AA", monto: 36057, uds: 1457 },
  { tienda: "HEB MTY San Pedro", ciudad: "Monterrey", cluster: "AA", monto: 35188, uds: 1546 },
  { tienda: "HEB MTY Valle Oriente", ciudad: "Monterrey", cluster: "AA", monto: 34552, uds: 1275 },
  { tienda: "HEB MTY Contry", ciudad: "Monterrey", cluster: "A", monto: 27628, uds: 1126 },
  { tienda: "HEB MTY Valle Alto", ciudad: "Monterrey", cluster: "AA Light", monto: 26781, uds: 1112 },
  { tienda: "HEB MTY Tec", ciudad: "Monterrey", cluster: "A", monto: 23611, uds: 944 },
  { tienda: "HEB MTY El Uro", ciudad: "Monterrey", cluster: "AA Light", monto: 20948, uds: 934 },
  { tienda: "HEB MTY San Nicolás", ciudad: "Monterrey", cluster: "A", monto: 19894, uds: 766 },
  { tienda: "HEB LEO Cerro Gordo", ciudad: "León", cluster: "AA Light", monto: 19609, uds: 867 },
  { tienda: "HEB MTY Cumbres", ciudad: "Monterrey", cluster: "AA Light", monto: 18618, uds: 734 },
];

const ALERTAS_RESTOCK = [
  { producto: "Rodajitas Spicy Limón", tiendas: 7 },
  { producto: "Palomitas Street Elote 125g", tiendas: 6 },
  { producto: "Palomitas Cheddar Jalapeño 25g", tiendas: 6 },
  { producto: "Palomitas Classic White 25g", tiendas: 4 },
  { producto: "Chicharrón Natural", tiendas: 3 },
];

const ALERTAS_ANAQUEL = [
  { producto: "Palomitas Chile Piquín", tiendas: 6 },
  { producto: "Palomitas Cheddar Jalapeño 125g", tiendas: 4 },
  { producto: "Palomitas Classic White 125g", tiendas: 4 },
  { producto: "Palomitas Street Elote 25g", tiendas: 4 },
  { producto: "Rodajitas Spicy Limón", tiendas: 4 },
];

// ============================================================
// HELPERS
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

const EstadoBadge = ({ e }: { e: string }) => {
  const colors: Record<string, string> = {
    Vigilar: "bg-red-100 text-red-700 border-red-300",
    OK: "bg-green-100 text-green-700 border-green-300",
    Holgado: "bg-blue-100 text-blue-700 border-blue-300",
  };
  return <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${colors[e] || ""}`}>{e}</span>;
};

// ============================================================
// SLIDES
// ============================================================

function Slide1() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-orange-50 to-orange-100 p-8">
      <img src="/4buddies-logo.jpeg" alt="4BUDDIES" className="h-24 mb-6 rounded-xl shadow-lg" />
      <h1 className="text-4xl font-bold text-orange-900 mb-2">Salud del Negocio</h1>
      <h2 className="text-2xl text-orange-700 mb-1">4BUDDIES x HEB</h2>
      <p className="text-orange-600 text-lg mb-8">YTD 2026 vs 2025 | Al 17 de Marzo 2026</p>
      <div className="flex gap-4">
        <div className="bg-white rounded-xl shadow px-6 py-3 text-center border border-orange-200">
          <p className="text-sm text-orange-600 font-medium">YTD Monto</p>
          <p className="text-2xl font-bold text-orange-900">{fmtK(YTD.monto26)}</p>
          <VarBadge v={YTD.varMonto} />
        </div>
        <div className="bg-white rounded-xl shadow px-6 py-3 text-center border border-orange-200">
          <p className="text-sm text-orange-600 font-medium">YTD Unidades</p>
          <p className="text-2xl font-bold text-orange-900">{fmtU(YTD.uds26)}</p>
          <VarBadge v={YTD.varUds} />
        </div>
        <div className="bg-white rounded-xl shadow px-6 py-3 text-center border border-orange-200">
          <p className="text-sm text-orange-600 font-medium">Alertas Inventario</p>
          <p className="text-2xl font-bold text-red-600">31</p>
          <span className="text-xs text-gray-500">restock bajo</span>
        </div>
        <div className="bg-white rounded-xl shadow px-6 py-3 text-center border border-orange-200">
          <p className="text-sm text-orange-600 font-medium">Tiendas</p>
          <p className="text-2xl font-bold text-orange-900">62</p>
          <span className="text-xs text-gray-500">operativas</span>
        </div>
      </div>
    </div>
  );
}

function Slide2() {
  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-orange-50 to-orange-100 p-6">
      <div className="flex items-center gap-3 mb-4">
        <img src="/4buddies-logo.jpeg" alt="" className="h-8 rounded-lg" />
        <h2 className="text-xl font-bold text-orange-900">Venta Mensual — 2025 vs 2026</h2>
        <span className="text-xs text-orange-500 ml-auto">*Marzo 2026 parcial (1-16 Mar), comparado vs mismos 16 días de 2025</span>
      </div>

      <div className="flex gap-4 flex-1">
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

        <div className="flex flex-col gap-3 w-[380px]">
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
                {VENTAS_MES.map((m, i) => {
                  const v = ((m.y2026 / m.y2025) - 1) * 100;
                  return (
                    <tr key={i} className={i % 2 === 0 ? "bg-orange-50" : ""}>
                      <td className="p-1.5 font-medium text-orange-900">{m.mes}</td>
                      <td className="p-1.5 text-right text-gray-700">{fmtK(m.y2025)}</td>
                      <td className="p-1.5 text-right font-semibold text-orange-900">{fmtK(m.y2026)}</td>
                      <td className="p-1.5 text-right"><VarBadge v={v} /></td>
                    </tr>
                  );
                })}
                <tr className="bg-orange-100 font-bold border-t-2 border-orange-300">
                  <td className="p-1.5 text-orange-900">YTD</td>
                  <td className="p-1.5 text-right text-gray-700">{fmtK(YTD.monto25)}</td>
                  <td className="p-1.5 text-right text-orange-900">{fmtK(YTD.monto26)}</td>
                  <td className="p-1.5 text-right"><VarBadge v={YTD.varMonto} /></td>
                </tr>
              </tbody>
            </table>
          </div>

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
                {VENTAS_MES.map((m, i) => {
                  const v = ((m.u2026 / m.u2025) - 1) * 100;
                  return (
                    <tr key={i} className={i % 2 === 0 ? "bg-orange-50" : ""}>
                      <td className="p-1.5 font-medium text-orange-900">{m.mes}</td>
                      <td className="p-1.5 text-right text-gray-700">{fmtU(m.u2025)}</td>
                      <td className="p-1.5 text-right font-semibold text-orange-900">{fmtU(m.u2026)}</td>
                      <td className="p-1.5 text-right"><VarBadge v={v} /></td>
                    </tr>
                  );
                })}
                <tr className="bg-orange-100 font-bold border-t-2 border-orange-300">
                  <td className="p-1.5 text-orange-900">YTD</td>
                  <td className="p-1.5 text-right text-gray-700">{fmtU(YTD.uds25)}</td>
                  <td className="p-1.5 text-right text-orange-900">{fmtU(YTD.uds26)}</td>
                  <td className="p-1.5 text-right"><VarBadge v={YTD.varUds} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-3 bg-white/80 rounded-lg p-2 text-xs text-orange-800 border border-orange-200">
        <strong>Lectura:</strong> YTD (Ene-Feb completos) baja -3.5% en monto y -7.7% en unidades. Marzo parcial (16 días) cae -7.2% vs mismos 16 días de 2025. La tendencia es de baja moderada pero consistente.
      </div>
    </div>
  );
}

function Slide3() {
  const sorted = [...PRODUCTOS_YTD].sort((a, b) => b.m26 - a.m26);
  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-orange-50 to-orange-100 p-6">
      <div className="flex items-center gap-3 mb-3">
        <img src="/4buddies-logo.jpeg" alt="" className="h-8 rounded-lg" />
        <h2 className="text-xl font-bold text-orange-900">Salud por Producto — YTD 2026 vs 2025</h2>
        <span className="text-xs text-orange-500 ml-auto">Ene-Feb 2026 completos</span>
      </div>

      <div className="flex gap-4 flex-1">
        <div className="bg-white rounded-xl shadow p-3 border border-orange-200 w-[280px] flex flex-col items-center">
          <h3 className="text-sm font-semibold text-orange-700 mb-1">Participación YTD 2026</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={PIE_DATA} cx="50%" cy="50%" outerRadius={85} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false} fontSize={9}>
                {PIE_DATA.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => fmt(Number(v))} />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-xs text-orange-700 mt-1 text-center">
            <strong>Chicharrón</strong> es el único producto que crece (+28.8%)
          </div>
        </div>

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
              {sorted.map((p, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-orange-50" : ""}>
                  <td className="p-1.5 font-medium text-orange-900">{p.corto}</td>
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

      <div className="mt-3 bg-white/80 rounded-lg p-2 text-xs text-orange-800 border border-orange-200">
        <strong>Lectura:</strong> Chicharrón crece +28.8% y es el #1 en venta. Street Elote 125g y Chile Piquín son los que más caen (-18% y -23%). Street Elote 125g tiene solo 3.7 semanas de inventario — cuidado con el desabasto.
      </div>
    </div>
  );
}

function Slide4() {
  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-orange-50 to-orange-100 p-6">
      <div className="flex items-center gap-3 mb-3">
        <img src="/4buddies-logo.jpeg" alt="" className="h-8 rounded-lg" />
        <h2 className="text-xl font-bold text-orange-900">Top Tiendas + Alertas</h2>
        <span className="text-xs text-orange-500 ml-auto">YTD 2026</span>
      </div>

      <div className="flex gap-4 flex-1">
        <div className="bg-white rounded-xl shadow p-3 border border-orange-200 flex-1">
          <h3 className="text-sm font-semibold text-orange-700 mb-2 flex items-center gap-1"><Store size={14} /> Top 10 Tiendas YTD 2026</h3>
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
                <tr key={i} className={i % 2 === 0 ? "bg-orange-50" : ""}>
                  <td className="p-1 text-orange-600 font-bold">{i + 1}</td>
                  <td className="p-1 font-medium text-orange-900">{t.tienda}</td>
                  <td className="p-1 text-gray-600">{t.ciudad}</td>
                  <td className="p-1 text-center">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${t.cluster === "AA" ? "bg-orange-600 text-white" : t.cluster === "A" ? "bg-orange-200 text-orange-800" : "bg-orange-100 text-orange-700"}`}>{t.cluster}</span>
                  </td>
                  <td className="p-1 text-right font-semibold text-orange-900">{fmtK(t.monto)}</td>
                  <td className="p-1 text-right text-gray-700">{fmtU(t.uds)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 w-[340px]">
          <div className="bg-white rounded-xl shadow p-3 border border-red-200 flex-1">
            <h3 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-1">
              <AlertTriangle size={14} /> Restock Urgente
              <span className="ml-auto text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full">31 combinaciones</span>
            </h3>
            <p className="text-[10px] text-gray-500 mb-2">Tienda-producto con &lt;15 días de inventario (ajustado con OC en tránsito)</p>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-red-600 text-white">
                  <th className="p-1 text-left rounded-tl">Producto</th>
                  <th className="p-1 text-right rounded-tr">Tiendas</th>
                </tr>
              </thead>
              <tbody>
                {ALERTAS_RESTOCK.map((a, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-red-50" : ""}>
                    <td className="p-1 text-red-900">{a.producto}</td>
                    <td className="p-1 text-right font-bold text-red-700">{a.tiendas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-xl shadow p-3 border border-amber-200 flex-1">
            <h3 className="text-sm font-semibold text-amber-700 mb-2 flex items-center gap-1">
              <Box size={14} /> Problema de Anaquel
              <span className="ml-auto text-[10px] bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">24 combinaciones</span>
            </h3>
            <p className="text-[10px] text-gray-500 mb-2">Inventario &gt;0 pero $0 venta en 15 días (el SKU sí vende en otras tiendas)</p>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-amber-600 text-white">
                  <th className="p-1 text-left rounded-tl">Producto</th>
                  <th className="p-1 text-right rounded-tr">Tiendas</th>
                </tr>
              </thead>
              <tbody>
                {ALERTAS_ANAQUEL.map((a, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-amber-50" : ""}>
                    <td className="p-1 text-amber-900">{a.producto}</td>
                    <td className="p-1 text-right font-bold text-amber-700">{a.tiendas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-3 bg-white/80 rounded-lg p-2 text-xs text-orange-800 border border-orange-200">
        <strong>Recomendaciones:</strong> (1) Solicitar OC para Street Elote 125g y Chicharrón — menos de 4 semanas de inventario. (2) Revisar exhibición de Chile Piquín en 6 tiendas con inventario sin venta. (3) Ver detalle completo en el Excel adjunto.
      </div>
    </div>
  );
}

// ============================================================
// MAIN
// ============================================================

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

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-orange-900/90 backdrop-blur rounded-full px-4 py-1.5 shadow-lg">
          <button onClick={prev} disabled={current === 0} className="text-orange-300 hover:text-white disabled:opacity-30 transition">
            <ChevronLeft size={20} />
          </button>
          <div className="flex gap-1.5">
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 rounded-full transition ${i === current ? "bg-orange-400 scale-125" : "bg-orange-700 hover:bg-orange-500"}`} />
            ))}
          </div>
          <button onClick={next} disabled={current === SLIDES.length - 1} className="text-orange-300 hover:text-white disabled:opacity-30 transition">
            <ChevronRight size={20} />
          </button>
          <span className="text-orange-400 text-xs ml-2">{current + 1}/{SLIDES.length}</span>
        </div>
      </div>
    </div>
  );
}
