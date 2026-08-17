"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList,
} from "recharts";
import {
  ChevronLeft, ChevronRight, TrendingUp, Store, Package,
  CalendarDays, Target, Info,
} from "lucide-react";

// ============================================================
//  DEGUSTACIÓN HEB 4BUDDIES · 27 jul – 9 ago 2026
//  8 tiendas Monterrey · 48 asistencias
//  Fuente: sell-out HEB al 9-ago-2026. Todo en UNIDADES.
//  Baseline: mismos días de semana (dom/lun/mar) de las 4 semanas
//  previas (29-jun al 26-jul), en las MISMAS 8 tiendas.
// ============================================================

const GLOBAL = {
  antes: 27.8, durante: 38.3, crec: 37.7,
  extra: 63, vendidas: 230, tiendas: 8, dias: 6, asistencias: 48,
};

const PRODUCTOS = [
  { nombre: "Palomitas Classic White 25g", corto: "Classic White 25g", antes: 10.7, durante: 16.5, crec: 54.7, extra: 35, vend: 99 },
  { nombre: "Palomitas Street Elote 25g", corto: "Street Elote 25g", antes: 12.3, durante: 15.5, crec: 25.7, extra: 19, vend: 93 },
  { nombre: "Palomitas Chile Piquín 25g", corto: "Chile Piquín 25g", antes: 4.8, durante: 6.3, crec: 31.0, extra: 9, vend: 38 },
];


const TIENDAS = [
  { nombre: "San Pedro", cluster: "AA", antes: 5.2, durante: 8.0, crec: 54.8, extra: 17, vend: 48 },
  { nombre: "Chipinque", cluster: "AA", antes: 4.2, durante: 6.8, crec: 64.0, extra: 16, vend: 41 },
  { nombre: "Contry", cluster: "A", antes: 2.9, durante: 5.0, crec: 71.4, extra: 12, vend: 30 },
  { nombre: "TEC", cluster: "A", antes: 2.5, durante: 4.3, crec: 73.3, extra: 11, vend: 26 },
  { nombre: "El Uro", cluster: "AA Light", antes: 3.1, durante: 4.7, crec: 51.4, extra: 10, vend: 28 },
  { nombre: "Valle Oriente", cluster: "AA", antes: 3.2, durante: 3.8, crec: 17.9, extra: 4, vend: 23 },
  { nombre: "San Nicolás", cluster: "A", antes: 2.8, durante: 3.0, crec: 9.1, extra: 2, vend: 18 },
  { nombre: "Valle Alto", cluster: "AA Light", antes: 4.0, durante: 2.7, crec: -33.3, extra: -8, vend: 16 },
];

const DIAS = [
  { fecha: "27 jul", dia: "Lunes", sem: "Semana 1", normal: 35.8, vend: 28, crec: -21.7, extra: -8 },
  { fecha: "28 jul", dia: "Martes", sem: "Semana 1", normal: 24.0, vend: 43, crec: 79.2, extra: 19 },
  { fecha: "2 ago", dia: "Domingo", sem: "Semana 1", normal: 23.8, vend: 39, crec: 64.2, extra: 15 },
  { fecha: "3 ago", dia: "Lunes", sem: "Semana 2", normal: 35.8, vend: 50, crec: 39.9, extra: 14 },
  { fecha: "4 ago", dia: "Martes", sem: "Semana 2", normal: 24.0, vend: 32, crec: 33.3, extra: 8 },
  { fecha: "9 ago", dia: "Domingo", sem: "Semana 2", normal: 23.8, vend: 38, crec: 60.0, extra: 14 },
];

const NAR = "#F58220";
const NAR_D = "#C25F0E";
const GRIS = "#94A3B8";

const fmt = (n: number, d = 1) => n.toFixed(d);
const pct = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;

// ---------- UI helpers ----------
function Pill({ children, tone = "nar" }: { children: React.ReactNode; tone?: "nar" | "ok" | "neu" }) {
  const t = {
    nar: "bg-orange-500/15 text-orange-700 ring-orange-500/30",
    ok: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/30",
    neu: "bg-stone-200 text-stone-600 ring-stone-300",
  }[tone];
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ${t}`}>{children}</span>;
}

function Delta({ v, big = false }: { v: number; big?: boolean }) {
  const pos = v >= 0;
  return (
    <span className={`font-bold tabular-nums ${big ? "text-3xl" : "text-base"} ${pos ? "text-emerald-600" : "text-rose-600"}`}>
      {pct(v)}
    </span>
  );
}

function Slide({ children, n, total }: { children: React.ReactNode; n: number; total: number }) {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] w-full flex-col px-6 py-8 sm:px-10 lg:px-16">
      {children}
      <div className="pointer-events-none absolute bottom-3 right-6 text-xs text-stone-300">{n} / {total}</div>
    </div>
  );
}

function TituloSlide({ icon, kicker, titulo, sub }: { icon: React.ReactNode; kicker: string; titulo: string; sub?: string }) {
  return (
    <div className="mb-6 shrink-0">
      <div className="mb-2 flex items-center gap-2 text-orange-600">
        {icon}<span className="text-xs font-semibold uppercase tracking-[0.18em]">{kicker}</span>
      </div>
      <h2 className="text-2xl font-bold leading-tight text-stone-900 sm:text-3xl lg:text-4xl">{titulo}</h2>
      {sub && <p className="mt-2 max-w-4xl text-sm text-stone-500 sm:text-base">{sub}</p>}
    </div>
  );
}

const NotaBase = () => (
  <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-stone-400">
    <Info size={14} className="mt-0.5 shrink-0" />
    <span>
      Comparación contra los mismos días de la semana (domingo, lunes y martes) de las 4 semanas previas,
      en las mismas 8 tiendas de la degustación. Todo en unidades de sell-out.
    </span>
  </p>
);

// ============================================================
//  SLIDE 1 — PORTADA
// ============================================================
function S1() {
  return (
    <Slide n={1} total={4}>
      <div className="flex flex-1 flex-col justify-center">
        <div className="mb-8 flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/4buddies-logo.jpeg" alt="4BUDDIES" className="h-14 w-14 rounded-xl object-cover ring-2 ring-orange-300" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">4BUDDIES × HEB</p>
            <p className="text-sm text-stone-500">27 julio – 9 agosto 2026</p>
          </div>
        </div>

        <h1 className="max-w-4xl text-4xl font-bold leading-[1.1] text-stone-900 sm:text-5xl lg:text-6xl">
          Resultados de la<br />
          <span className="text-orange-600">degustación en HEB</span>
        </h1>

        <div className="mt-8 flex flex-wrap gap-2">
          <Pill><Store size={13} /> 8 tiendas Monterrey</Pill>
          <Pill><CalendarDays size={13} /> 6 días de activación</Pill>
          <Pill><Target size={13} /> 48 asistencias</Pill>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-6 shadow-lg shadow-orange-500/25">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/85">Crecimiento en venta</p>
            <p className="mt-1 text-5xl font-bold tabular-nums text-white">+{fmt(GLOBAL.crec)}%</p>
            <p className="mt-1 text-sm text-white/85">productos degustados</p>
          </div>
          <div className="rounded-2xl bg-white p-6 ring-1 ring-stone-200">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Unidades extra</p>
            <p className="mt-1 text-5xl font-bold tabular-nums text-stone-900">{GLOBAL.extra}</p>
            <p className="mt-1 text-sm text-stone-500">en los 6 días</p>
          </div>
          <div className="rounded-2xl bg-white p-6 ring-1 ring-stone-200">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Venta diaria</p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-stone-900">
              {fmt(GLOBAL.antes)} <span className="text-stone-300">→</span> {fmt(GLOBAL.durante)}
            </p>
            <p className="mt-1 text-sm text-stone-500">unidades por día</p>
          </div>
        </div>

        <p className="mt-8 max-w-3xl text-base leading-relaxed text-stone-600">
          La degustación funcionó. Los tres productos que sí se degustaron crecieron en conjunto
          <span className="font-semibold text-orange-700"> +{fmt(GLOBAL.crec)}%</span> durante los días de activación,
          con <span className="font-semibold text-orange-700">{GLOBAL.extra} unidades extra</span> sobre su venta normal.
        </p>
      </div>
    </Slide>
  );
}

// ============================================================
//  SLIDE 2 — POR PRODUCTO
// ============================================================
function S2() {
  const data = PRODUCTOS.map(p => ({ name: p.corto, Antes: p.antes, "Con degustación": p.durante }));
  return (
    <Slide n={2} total={4}>
      <TituloSlide
        icon={<Package size={16} />}
        kicker="Por producto"
        titulo="Classic White lideró el crecimiento"
        sub="Venta diaria promedio antes y durante la degustación, en unidades."
      />

      <div className="grid flex-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="h-64 rounded-2xl bg-white p-4 ring-1 ring-stone-200 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 18, right: 8, left: -18, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#57534E", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#78716C", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#FFFFFF", border: "1px solid #E7E5E4", borderRadius: 10, fontSize: 12 }}
                  labelStyle={{ color: "#1C1917" }} cursor={{ fill: "#00000006" }}
                />
                <Legend wrapperStyle={{ fontSize: 12, color: "#57534E" }} />
                <Bar dataKey="Antes" fill={GRIS} radius={[5, 5, 0, 0]} maxBarSize={46} />
                <Bar dataKey="Con degustación" fill={NAR} radius={[5, 5, 0, 0]} maxBarSize={46}>
                  <LabelList dataKey="Con degustación" position="top" fill="#1C1917" fontSize={11} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-3 lg:col-span-2">
          {PRODUCTOS.map(p => (
            <div key={p.corto} className="rounded-xl bg-white p-4 ring-1 ring-stone-200">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold leading-snug text-stone-900">{p.corto}</p>
                <Delta v={p.crec} />
              </div>
              <div className="mt-2 flex items-center gap-4 text-xs text-stone-500">
                <span className="tabular-nums">{fmt(p.antes)} → <span className="font-semibold text-stone-700">{fmt(p.durante)}</span> uds/día</span>
                <span className="tabular-nums text-orange-700">+{p.extra} uds extra</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-xl border-l-4 border-orange-500 bg-orange-50 px-5 py-4">
        <p className="text-sm leading-relaxed text-stone-700">
          <span className="font-semibold text-orange-700">Classic White fue el gran ganador:</span> pasó de 10.7 a 16.5 unidades
          por día y aportó 35 de las 63 unidades extra. Es el producto con el que conviene entrar en la próxima activación.
        </p>
      </div>
      <NotaBase />
    </Slide>
  );
}

// ============================================================
//  SLIDE 4 — POR TIENDA
// ============================================================
function S4() {
  const max = Math.max(...TIENDAS.map(t => t.vend));
  return (
    <Slide n={3} total={4}>
      <TituloSlide
        icon={<Store size={16} />}
        kicker="Por tienda"
        titulo="7 de 8 tiendas crecieron"
        sub="San Pedro y Chipinque aportaron más de la mitad de las unidades extra."
      />

      <div className="flex-1 overflow-hidden rounded-2xl ring-1 ring-stone-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-100 text-xs uppercase tracking-wider text-stone-500">
              <th className="px-4 py-3 text-left font-semibold">Tienda</th>
              <th className="px-3 py-3 text-left font-semibold">Cluster</th>
              <th className="px-3 py-3 text-right font-semibold">Antes</th>
              <th className="px-3 py-3 text-right font-semibold">Con degust.</th>
              <th className="px-3 py-3 text-right font-semibold">Crecimiento</th>
              <th className="px-3 py-3 text-right font-semibold">Uds extra</th>
              <th className="hidden px-4 py-3 text-left font-semibold sm:table-cell">Vendidas</th>
            </tr>
          </thead>
          <tbody>
            {TIENDAS.map((t, i) => (
              <tr key={t.nombre} className={`border-t border-stone-200 ${i % 2 ? "bg-stone-50" : ""}`}>
                <td className="px-4 py-2.5 font-medium text-stone-900">{t.nombre}</td>
                <td className="px-3 py-2.5 text-stone-500">{t.cluster}</td>
                <td className="px-3 py-2.5 text-right tabular-nums text-stone-500">{fmt(t.antes)}</td>
                <td className="px-3 py-2.5 text-right font-semibold tabular-nums text-stone-900">{fmt(t.durante)}</td>
                <td className="px-3 py-2.5 text-right"><Delta v={t.crec} /></td>
                <td className={`px-3 py-2.5 text-right font-semibold tabular-nums ${t.extra >= 0 ? "text-orange-700" : "text-rose-600"}`}>
                  {t.extra > 0 ? "+" : ""}{t.extra}
                </td>
                <td className="hidden px-4 py-2.5 sm:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-stone-200">
                      <div className="h-full rounded-full bg-orange-500" style={{ width: `${(t.vend / max) * 100}%` }} />
                    </div>
                    <span className="tabular-nums text-xs text-stone-500">{t.vend}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5">
        <div className="rounded-xl border-l-4 border-emerald-500 bg-emerald-50 px-5 py-4">
          <p className="text-sm leading-relaxed text-stone-700">
            <span className="font-semibold text-emerald-700">San Pedro y Chipinque</span> destacaron con 17 y 16 unidades
            extra. Contry y TEC crecieron más de 70% sobre su venta normal.
          </p>
        </div>
      </div>
      <NotaBase />
    </Slide>
  );
}

// ============================================================
//  SLIDE 5 — POR DÍA + CONCLUSIONES
// ============================================================
function S5() {
  const data = DIAS.map(d => ({ name: `${d.fecha}`, Normal: d.normal, "Con degustación": d.vend, dia: d.dia }));
  return (
    <Slide n={4} total={4}>
      <TituloSlide
        icon={<CalendarDays size={16} />}
        kicker="Por día y conclusiones"
        titulo="Martes y domingo fueron los días más fuertes"
        sub="Cada día comparado contra lo que ese mismo día de la semana vende normalmente."
      />

      <div className="grid flex-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="h-56 rounded-2xl bg-white p-4 ring-1 ring-stone-200 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 18, right: 8, left: -18, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#57534E", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#78716C", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#FFFFFF", border: "1px solid #E7E5E4", borderRadius: 10, fontSize: 12 }}
                  labelStyle={{ color: "#1C1917" }} cursor={{ fill: "#00000006" }}
                />
                <Legend wrapperStyle={{ fontSize: 12, color: "#57534E" }} />
                <Bar dataKey="Normal" fill={GRIS} radius={[5, 5, 0, 0]} maxBarSize={34} />
                <Bar dataKey="Con degustación" fill={NAR} radius={[5, 5, 0, 0]} maxBarSize={34}>
                  <LabelList dataKey="Con degustación" position="top" fill="#1C1917" fontSize={10} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {DIAS.map(d => (
              <div key={d.fecha} className="rounded-lg bg-white px-3 py-2 text-center ring-1 ring-stone-200">
                <p className="text-[11px] text-stone-500">{d.dia} {d.fecha}</p>
                <p className={`text-sm font-bold tabular-nums ${d.crec >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{pct(d.crec)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 lg:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">Conclusiones</p>

          {[
            { i: <TrendingUp size={16} />, t: "La degustación funcionó", d: `+${fmt(GLOBAL.crec)}% de crecimiento y ${GLOBAL.extra} unidades extra en los productos degustados.` },
            { i: <Package size={16} />, t: "Classic White es la punta de lanza", d: "Creció +55% y concentró más de la mitad de las unidades extra." },
            { i: <CalendarDays size={16} />, t: "Martes y domingo rinden más", d: "Ambos crecieron por encima de 60% en su mejor semana. Ahí conviene concentrar las asistencias." },
            { i: <Store size={16} />, t: "Asegurar abasto antes del evento", d: "Valle Alto y San Nicolás tuvieron poco producto en piso. Es crecimiento disponible para la próxima." },
          ].map(c => (
            <div key={c.t} className="rounded-xl bg-white p-4 ring-1 ring-stone-200">
              <div className="flex items-center gap-2 text-orange-600">{c.i}
                <p className="text-sm font-semibold text-stone-900">{c.t}</p>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-stone-500">{c.d}</p>
            </div>
          ))}
        </div>
      </div>
      <NotaBase />
    </Slide>
  );
}

// ============================================================
//  SHELL
// ============================================================
const SLIDES = [S1, S2, S4, S5];

export default function Page() {
  const [i, setI] = useState(0);
  const total = SLIDES.length;

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") setI(v => Math.min(v + 1, total - 1));
      if (e.key === "ArrowLeft") setI(v => Math.max(v - 1, 0));
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [total]);

  const Cur = SLIDES[i];

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-stone-200 bg-[#FAF7F2]/95 px-6 backdrop-blur sm:px-10 lg:px-16">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/4buddies-logo.jpeg" alt="4BUDDIES" className="h-8 w-8 rounded-lg object-cover ring-1 ring-orange-300" />
          <div className="leading-tight">
            <p className="text-sm font-semibold text-stone-900">Degustación HEB</p>
            <p className="text-[11px] text-stone-500">27 jul – 9 ago 2026</p>
          </div>
        </div>

        <div className="hidden items-center gap-1.5 sm:flex">
          {SLIDES.map((_, k) => (
            <button key={k} onClick={() => setI(k)} aria-label={`Slide ${k + 1}`}
              className={`h-1.5 rounded-full transition-all ${k === i ? "w-7 bg-orange-500" : "w-1.5 bg-stone-300 hover:bg-stone-400"}`} />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setI(v => Math.max(v - 1, 0))} disabled={i === 0}
            className="rounded-lg bg-stone-200 p-2 text-stone-700 transition hover:bg-stone-300 disabled:opacity-25">
            <ChevronLeft size={17} />
          </button>
          <span className="min-w-[3rem] text-center text-xs tabular-nums text-stone-500">{i + 1} / {total}</span>
          <button onClick={() => setI(v => Math.min(v + 1, total - 1))} disabled={i === total - 1}
            className="rounded-lg bg-stone-200 p-2 text-stone-700 transition hover:bg-stone-300 disabled:opacity-25">
            <ChevronRight size={17} />
          </button>
        </div>
      </header>

      <Cur />
    </main>
  );
}
