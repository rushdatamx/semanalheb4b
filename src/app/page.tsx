"use client";
import { useState, useEffect, useCallback } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight,
  AlertTriangle, Store, Box, ShoppingCart, Package, TrendingUp,
} from "lucide-react";

/* ───────── helpers ───────── */
const fmt = (n: number) => "$" + n.toLocaleString("es-MX", { maximumFractionDigits: 0 });
const fmtK = (n: number) => "$" + (n / 1000).toFixed(0) + "K";
const fmtU = (n: number) => n.toLocaleString("es-MX", { maximumFractionDigits: 0 });
const fmtPct = (n: number) => (n >= 0 ? "+" : "") + n.toFixed(1) + "%";

const VarBadge = ({ v }: { v: number }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${v >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
    {v >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
    {fmtPct(v)}
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

const clusterColor = (c: string) => {
  const m: Record<string, string> = {
    AA: "bg-orange-600 text-white",
    EAA: "bg-orange-600 text-white",
    A: "bg-orange-200 text-orange-800",
    "AA Light": "bg-orange-100 text-orange-700",
    B: "bg-gray-200 text-gray-700",
    "B Bajio": "bg-gray-200 text-gray-700",
    "B Frontera": "bg-gray-200 text-gray-700",
    C: "bg-gray-100 text-gray-500",
    "C Bajio": "bg-gray-100 text-gray-500",
  };
  return m[c] || "bg-gray-100 text-gray-600";
};

/* ───────── DATA ───────── */
const KPI = {
  montoYtd26: 1233653, montoYtd25: 1312119, varMonto: -6.0,
  udsYtd26: 48510, udsYtd25: 52645, varUds: -7.9,
  mayoMonto26: 157709, mayoMonto25: 153592, mayoVarMonto: 2.7,
  mayoUds26: 6336, mayoUds25: 6273, mayoVarUds: 1.0,
  tiendasActivas: 64, totalAlertasRestock: 48, totalAlertasAnaquel: 19,
  diaMayo: 17, fechaInv: "2026-05-17", fechaMax: "2026-05-17",
};

const VENTAS_MES = [
  { mes: "Ene", m2025: 282960, m2026: 278968, u2025: 11158, u2026: 10516 },
  { mes: "Feb", m2025: 269925, m2026: 254380, u2025: 10993, u2026: 9938 },
  { mes: "Mar", m2025: 330215, m2026: 276116, u2025: 13380, u2026: 11340 },
  { mes: "Abr", m2025: 275427, m2026: 266481, u2025: 10841, u2026: 10380 },
  { mes: "May*", m2025: 153592, m2026: 157709, u2025: 6273, u2026: 6336 },
  { mes: "Jun", m2025: 265012, m2026: 0, u2025: 10535, u2026: 0 },
  { mes: "Jul", m2025: 254151, m2026: 0, u2025: 9556, u2026: 0 },
  { mes: "Ago", m2025: 275097, m2026: 0, u2025: 10552, u2026: 0 },
  { mes: "Sep", m2025: 278023, m2026: 0, u2025: 11484, u2026: 0 },
  { mes: "Oct", m2025: 267868, m2026: 0, u2025: 10271, u2026: 0 },
  { mes: "Nov", m2025: 241504, m2026: 0, u2025: 9286, u2026: 0 },
  { mes: "Dic", m2025: 206822, m2026: 0, u2025: 7643, u2026: 0 },
];

const VENTAS_MES_YTD = VENTAS_MES.filter(v => v.m2026 > 0);

const PERIODOS_FISCALES = [
  { periodo: "P02-2026", monto: 186795, uds: 6957 },
  { periodo: "P03-2026", monto: 250238, uds: 9353 },
  { periodo: "P04-2026", monto: 249279, uds: 9567 },
  { periodo: "P05-2026", monto: 255648, uds: 10543 },
  { periodo: "P06-2026", monto: 243583, uds: 9690 },
  { periodo: "P07-2026", monto: 254931, uds: 10043 },
];

const PRODUCTOS_SALUD = [
  { nombre: "Chicharrón Natural 75gr", corto: "Chich.Natural 75gr", sku: "7503028921317", m25: 250469, m26: 293272, var: 17.1, u25: 5053, u26: 5887, inv: 1151, semInv: 3.9, estado: "Vigilar" },
  { nombre: "Rodajitas Spicy Limón 30gr", corto: "Rod.Spicy Limón 30gr", sku: "7500462860042", m25: 164246, m26: 165380, var: 0.7, u25: 8373, u26: 8445, inv: 1998, semInv: 4.5, estado: "OK" },
  { nombre: "Palomitas Street Elote 125gr", corto: "Street Elote 125gr", sku: "7500462860004", m25: 197104, m26: 159915, var: -18.9, u25: 6250, u26: 5184, inv: 1030, semInv: 3.9, estado: "Vigilar" },
  { nombre: "Palomitas Classic White 25gr", corto: "Classic White 25gr", sku: "7500462417833", m25: 159625, m26: 133252, var: -16.5, u25: 8990, u26: 7610, inv: 2249, semInv: 5.8, estado: "OK" },
  { nombre: "Palomitas Classic White 125gr", corto: "Classic White 125gr", sku: "7503028921003", m25: 125079, m26: 118040, var: -5.6, u25: 3488, u26: 3311, inv: 804, semInv: 4.8, estado: "OK" },
  { nombre: "Palomitas Street Elote 25gr", corto: "Street Elote 25gr", sku: "7500462417826", m25: 142862, m26: 116604, var: -18.4, u25: 8089, u26: 6720, inv: 2037, semInv: 5.9, estado: "OK" },
  { nombre: "Palomitas Cheddar Jalapeño 125gr", corto: "Cheddar Jalapeño 125gr", sku: "7503028921010", m25: 118063, m26: 114801, var: -2.8, u25: 3777, u26: 3740, inv: 883, semInv: 4.6, estado: "OK" },
  { nombre: "Palomitas Cheddar Jalapeño 25gr", corto: "Cheddar Jalapeño 25gr", sku: "7500462417819", m25: 86375, m26: 77646, var: -10.1, u25: 4898, u26: 4527, inv: 1955, semInv: 8.2, estado: "Holgado" },
  { nombre: "Palomitas Chile Piquín 25gr", corto: "Chile Piquín 25gr", sku: "7500462860066", m25: 68296, m26: 54743, var: -19.8, u25: 3727, u26: 3086, inv: 1557, semInv: 9.8, estado: "Holgado" },
];

const PIE_DATA = PRODUCTOS_SALUD.map(p => ({ name: p.corto, value: p.m26 }));
const PIE_COLORS = ["#ea580c", "#f97316", "#fb923c", "#fdba74", "#fed7aa", "#c2410c", "#9a3412", "#7c2d12", "#431407"];

const PENETRACION = [
  { producto: "Palomitas Classic White 25gr", corto: "Classic White 25gr", tiendasConInv: 63, tiendasConVenta30d: 61, totalTiendas: 62, fillRateInv: 101.6, fillRateVenta: 98.4 },
  { producto: "Palomitas Cheddar Jalapeño 25gr", corto: "Cheddar Jalapeño 25gr", tiendasConInv: 63, tiendasConVenta30d: 63, totalTiendas: 62, fillRateInv: 101.6, fillRateVenta: 101.6 },
  { producto: "Palomitas Street Elote 25gr", corto: "Street Elote 25gr", tiendasConInv: 62, tiendasConVenta30d: 61, totalTiendas: 62, fillRateInv: 100.0, fillRateVenta: 98.4 },
  { producto: "Palomitas Street Elote 125gr", corto: "Street Elote 125gr", tiendasConInv: 62, tiendasConVenta30d: 63, totalTiendas: 62, fillRateInv: 100.0, fillRateVenta: 101.6 },
  { producto: "Rodajitas Spicy Limón 30gr", corto: "Rod.Spicy Limón 30gr", tiendasConInv: 60, tiendasConVenta30d: 58, totalTiendas: 62, fillRateInv: 96.8, fillRateVenta: 93.5 },
  { producto: "Chicharrón Natural 75gr", corto: "Chich.Natural 75gr", tiendasConInv: 58, tiendasConVenta30d: 59, totalTiendas: 62, fillRateInv: 93.5, fillRateVenta: 95.2 },
  { producto: "Palomitas Classic White 125gr", corto: "Classic White 125gr", tiendasConInv: 55, tiendasConVenta30d: 55, totalTiendas: 62, fillRateInv: 88.7, fillRateVenta: 88.7 },
  { producto: "Palomitas Cheddar Jalapeño 125gr", corto: "Cheddar Jalapeño 125gr", tiendasConInv: 55, tiendasConVenta30d: 55, totalTiendas: 62, fillRateInv: 88.7, fillRateVenta: 88.7 },
  { producto: "Palomitas Chile Piquín 25gr", corto: "Chile Piquín 25gr", tiendasConInv: 54, tiendasConVenta30d: 52, totalTiendas: 62, fillRateInv: 87.1, fillRateVenta: 83.9 },
];

const TOP20_TIENDAS = [
  { tienda: "HEB MTY VALLE ORIENTE", ciudad: "MONTERREY", cluster: "AA", monto: 61187, uds: 2334 },
  { tienda: "HEB MTY CHIPINQUE", ciudad: "MONTERREY", cluster: "AA", monto: 61148, uds: 2510 },
  { tienda: "HEB MTY SAN PEDRO", ciudad: "MONTERREY", cluster: "AA", monto: 57360, uds: 2530 },
  { tienda: "HEB MTY CONTRY", ciudad: "MONTERREY", cluster: "A", monto: 50006, uds: 2083 },
  { tienda: "HEB MTY VALLE ALTO", ciudad: "MONTERREY", cluster: "AA Light", monto: 48611, uds: 1994 },
  { tienda: "HEB MTY TEC", ciudad: "MONTERREY", cluster: "A", monto: 43545, uds: 1738 },
  { tienda: "HEB MTY SAN NICOLAS", ciudad: "MONTERREY", cluster: "A", monto: 37705, uds: 1427 },
  { tienda: "HEB MTY EL URO", ciudad: "MONTERREY", cluster: "AA Light", monto: 37185, uds: 1663 },
  { tienda: "HEB LEO CERRO GORDO", ciudad: "LEON", cluster: "AA Light", monto: 36048, uds: 1646 },
  { tienda: "HEB MTY CUMBRES", ciudad: "MONTERREY", cluster: "AA Light", monto: 33879, uds: 1322 },
  { tienda: "HEB MTY PUERTA DE HIERRO", ciudad: "MONTERREY", cluster: "A", monto: 29991, uds: 1176 },
  { tienda: "HEB MTY BOSQUES DE LAS LOMAS", ciudad: "MONTERREY", cluster: "A", monto: 28860, uds: 1160 },
  { tienda: "HEB MTY CONCORDIA", ciudad: "MONTERREY", cluster: "B", monto: 26964, uds: 1078 },
  { tienda: "HEB MTY SANTA CATARINA", ciudad: "MONTERREY", cluster: "B", monto: 26695, uds: 1013 },
  { tienda: "HEB MTY LOS MORALES", ciudad: "MONTERREY", cluster: "B", monto: 26575, uds: 1027 },
  { tienda: "HEB MTY SENDERO", ciudad: "MONTERREY", cluster: "B", monto: 25814, uds: 1016 },
  { tienda: "HEB MTY LINDA VISTA", ciudad: "MONTERREY", cluster: "B", monto: 24347, uds: 885 },
  { tienda: "HEB SAL SAN PATRICIO", ciudad: "SALTILLO", cluster: "AA Light", monto: 24141, uds: 971 },
  { tienda: "HEB MTY GUADALUPE LIVAS", ciudad: "MONTERREY", cluster: "C", monto: 21445, uds: 771 },
  { tienda: "HEB MTY CHAPULTEPEC", ciudad: "MONTERREY", cluster: "C", monto: 19539, uds: 796 },
];

const ALERTAS_RESTOCK = [
  { tienda: "HEB MTY SOLIDARIDAD", producto: "Street Elote 125gr", invActual: 0, ocTransito: 0, invAjustado: 0, vtaDia: 0.6, diasCob: 0.0 },
  { tienda: "HEB QRO ZIBATA", producto: "Rod.Spicy Limón 30gr", invActual: 2, ocTransito: 0, invAjustado: 2, vtaDia: 1.9, diasCob: 1.1 },
  { tienda: "HEB IRA IRAPUATO", producto: "Chile Piquín 25gr", invActual: 3, ocTransito: 0, invAjustado: 3, vtaDia: 1.8, diasCob: 1.7 },
  { tienda: "HEB MTY ACAPULCO", producto: "Cheddar Jalapeño 125gr", invActual: 3, ocTransito: 0, invAjustado: 3, vtaDia: 1.1, diasCob: 2.6 },
  { tienda: "HEB MTY SAN NICOLAS", producto: "Classic White 125gr", invActual: 4, ocTransito: 0, invAjustado: 4, vtaDia: 1.4, diasCob: 2.9 },
  { tienda: "HEB MTY CONCORDIA", producto: "Rod.Spicy Limón 30gr", invActual: 9, ocTransito: 0, invAjustado: 9, vtaDia: 2.2, diasCob: 4.1 },
  { tienda: "HEB MTY EL URO", producto: "Chile Piquín 25gr", invActual: 13, ocTransito: 0, invAjustado: 13, vtaDia: 2.9, diasCob: 4.4 },
  { tienda: "HEB LEO TORRES LANDA", producto: "Rod.Spicy Limón 30gr", invActual: 8, ocTransito: 0, invAjustado: 8, vtaDia: 1.8, diasCob: 4.4 },
  { tienda: "HEB MTY BOSQUES DE LAS LOMAS", producto: "Classic White 125gr", invActual: 7, ocTransito: 0, invAjustado: 7, vtaDia: 1.1, diasCob: 6.2 },
  { tienda: "HEB MTY SANTA CATARINA", producto: "Street Elote 25gr", invActual: 8, ocTransito: 0, invAjustado: 8, vtaDia: 1.3, diasCob: 6.3 },
  { tienda: "HEB MTY GUADALUPE JUAREZ", producto: "Classic White 25gr", invActual: 8, ocTransito: 0, invAjustado: 8, vtaDia: 1.3, diasCob: 6.3 },
  { tienda: "HEB MTY TEC", producto: "Street Elote 25gr", invActual: 18, ocTransito: 0, invAjustado: 18, vtaDia: 2.4, diasCob: 7.5 },
  { tienda: "HEB MTY CUMBRES", producto: "Rod.Spicy Limón 30gr", invActual: 21, ocTransito: 0, invAjustado: 21, vtaDia: 2.7, diasCob: 7.7 },
  { tienda: "HEB MTY PUERTA DE HIERRO", producto: "Classic White 25gr", invActual: 11, ocTransito: 0, invAjustado: 11, vtaDia: 1.4, diasCob: 7.9 },
  { tienda: "HEB SAL SAN PATRICIO", producto: "Chich.Natural 75gr", invActual: 9, ocTransito: 0, invAjustado: 9, vtaDia: 1.1, diasCob: 7.9 },
];

const ALERTAS_ANAQUEL = [
  { tienda: "HEB QRO EL REFUGIO", producto: "Rod.Spicy Limón 30gr", inv: 50 },
  { tienda: "HEB MAT LAURO VILLAR", producto: "Street Elote 25gr", inv: 48 },
  { tienda: "HEB MAT LAURO VILLAR", producto: "Cheddar Jalapeño 25gr", inv: 46 },
  { tienda: "HEB QRO SAN JUAN DEL RIO", producto: "Rod.Spicy Limón 30gr", inv: 45 },
  { tienda: "HEB MTY SANTA CATARINA", producto: "Classic White 25gr", inv: 44 },
  { tienda: "HEB MTY BOSQUES DE LAS LOMAS", producto: "Street Elote 25gr", inv: 42 },
  { tienda: "HEB QRO EL MIRADOR", producto: "Chile Piquín 25gr", inv: 33 },
  { tienda: "HEB LEO TORRES LANDA", producto: "Classic White 25gr", inv: 32 },
  { tienda: "HEB MTY RINCONADA", producto: "Rod.Spicy Limón 30gr", inv: 32 },
  { tienda: "HEB SLP LOS PINOS", producto: "Classic White 25gr", inv: 32 },
  { tienda: "HEB TOR SENDEROS", producto: "Chile Piquín 25gr", inv: 32 },
  { tienda: "HEB QRO EL REFUGIO", producto: "Street Elote 25gr", inv: 26 },
  { tienda: "HEB QRO EL REFUGIO", producto: "Chile Piquín 25gr", inv: 21 },
  { tienda: "HEB QRO EL MIRADOR", producto: "Rod.Spicy Limón 30gr", inv: 19 },
  { tienda: "HEB MAT MATAMOROS", producto: "Street Elote 125gr", inv: 19 },
];

const ALERTAS_RESUMEN = {
  restock: [
    { producto: "Classic White 25gr", tiendas: 8 },
    { producto: "Rod.Spicy Limón 30gr", tiendas: 7 },
    { producto: "Street Elote 25gr", tiendas: 7 },
    { producto: "Classic White 125gr", tiendas: 6 },
    { producto: "Chich.Natural 75gr", tiendas: 5 },
    { producto: "Street Elote 125gr", tiendas: 5 },
    { producto: "Cheddar Jalapeño 125gr", tiendas: 4 },
    { producto: "Cheddar Jalapeño 25gr", tiendas: 3 },
    { producto: "Chile Piquín 25gr", tiendas: 3 },
  ],
  anaquel: [
    { producto: "Chile Piquín 25gr", tiendas: 4 },
    { producto: "Rod.Spicy Limón 30gr", tiendas: 4 },
    { producto: "Classic White 25gr", tiendas: 3 },
    { producto: "Street Elote 25gr", tiendas: 3 },
    { producto: "Cheddar Jalapeño 125gr", tiendas: 2 },
    { producto: "Cheddar Jalapeño 25gr", tiendas: 1 },
    { producto: "Chich.Natural 75gr", tiendas: 1 },
    { producto: "Street Elote 125gr", tiendas: 1 },
  ],
};

const OC_TENDENCIA = [
  { oc: "11-Feb", uds: 3210, fecha: "2026-02-11" },
  { oc: "18-Feb", uds: 2934, fecha: "2026-02-18" },
  { oc: "26-Feb", uds: 934, fecha: "2026-02-26" },
  { oc: "10-Mar", uds: 5008, fecha: "2026-03-10" },
  { oc: "11-Mar", uds: 2874, fecha: "2026-03-11" },
  { oc: "18-Mar", uds: 2846, fecha: "2026-03-18" },
  { oc: "25-Mar", uds: 2476, fecha: "2026-03-25" },
  { oc: "01-Abr", uds: 2432, fecha: "2026-04-01" },
  { oc: "15-Abr", uds: 2670, fecha: "2026-04-15" },
  { oc: "16-Abr", uds: 2050, fecha: "2026-04-16" },
  { oc: "22-Abr", uds: 1550, fecha: "2026-04-22" },
  { oc: "29-Abr", uds: 2606, fecha: "2026-04-29" },
  { oc: "05-May", uds: 2242, fecha: "2026-05-05" },
];

const OC_DETALLE = [
  { sku: "Classic White 25gr", udsOc: 384, vtaSemanal: 385, semCubre: 1.0 },
  { sku: "Chich.Natural 75gr", udsOc: 340, vtaSemanal: 294, semCubre: 1.2 },
  { sku: "Rod.Spicy Limón 30gr", udsOc: 320, vtaSemanal: 442, semCubre: 0.7 },
  { sku: "Street Elote 125gr", udsOc: 260, vtaSemanal: 264, semCubre: 1.0 },
  { sku: "Street Elote 25gr", udsOc: 256, vtaSemanal: 348, semCubre: 0.7 },
  { sku: "Chile Piquín 25gr", udsOc: 224, vtaSemanal: 160, semCubre: 1.4 },
  { sku: "Cheddar Jalapeño 125gr", udsOc: 170, vtaSemanal: 191, semCubre: 0.9 },
  { sku: "Classic White 125gr", udsOc: 160, vtaSemanal: 168, semCubre: 0.9 },
  { sku: "Cheddar Jalapeño 25gr", udsOc: 128, vtaSemanal: 238, semCubre: 0.5 },
];

const ACCIONES = {
  urgente: [
    { accion: "Asegurar restock inmediato", detalle: "48 combinaciones tienda-SKU con menos de 15 dias de cobertura. Foco: Classic White 25gr, Rod.Spicy Limon 30gr, Street Elote 25gr" },
    { accion: "Empujar proxima OC", detalle: "OC del 05-may (2,242 uds) cubre solo ~1 semana de venta. Solicitar nueva OC en los proximos dias." },
    { accion: "Atender 8 tiendas criticas", detalle: "8 combos tienda-SKU con 0-3 dias de inventario (riesgo de quiebre inmediato)." },
  ],
  estaSemana: [
    { accion: "Visitar tiendas con problema de anaquel", detalle: "19 combos con inventario pero sin venta. Top: Chile Piquin 25gr, Rod.Spicy Limon 30gr, Classic White 25gr" },
    { accion: "Revisar Chile Piquin y Cheddar 25gr", detalle: ">8 semanas de inventario y caidas en venta. Validar exhibicion y rotacion." },
    { accion: "Capitalizar repunte de mayo", detalle: "Mayo 1-17 cerro +2.7% vs 2025, primera mejora del ano. Sostener con surtido." },
  ],
  estrategico: [
    { accion: "Cerrar brecha YTD", detalle: "YTD 2026 todavia -6.0% vs 2025. Recuperacion requiere sostener mayo + suplir SKUs en caida." },
    { accion: "Aprovechar fortaleza de Chicharron", detalle: "Unico SKU con crecimiento positivo (+17% YTD). Validar mas espacio en anaquel." },
    { accion: "Mejorar fill rate Chile Piquin", detalle: "87% fill rate inv y 84% venta. Es el de menor cobertura, espacio para crecer presencia." },
  ],
};

/* ───────── SLIDES ───────── */

const Logo = ({ className = "h-10" }: { className?: string }) => (
  <img src="/4buddies-logo.jpeg" alt="4BUDDIES" className={`${className} rounded-lg shadow`} />
);

const SlideHeader = ({ title }: { title: string }) => (
  <div className="flex items-center gap-3 mb-4">
    <Logo />
    <h2 className="text-lg font-bold text-orange-900">{title}</h2>
  </div>
);

/* --- Slide 1: Portada --- */
function Slide1() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-gradient-to-br from-orange-50 to-orange-100">
      <Logo className="h-24 mb-5 rounded-xl shadow-lg" />
      <h1 className="text-2xl font-extrabold text-orange-900 mb-1">Resumen Mensual — 4BUDDIES x HEB</h1>
      <p className="text-orange-600 mb-1 text-sm">Mayo 1-{KPI.diaMayo}, 2026 | Inventario al {KPI.fechaInv}</p>
      <p className="text-orange-500 text-xs mb-5">Comparativo mismo periodo 2025 + YTD acumulado</p>

      {/* Bloque MAYO MTD (foco principal) */}
      <div className="mb-4">
        <p className="text-center text-xs font-bold text-orange-700 mb-2 uppercase tracking-wider">Mayo 1-{KPI.diaMayo} (MTD)</p>
        <div className="flex gap-3">
          {[
            { label: "Venta Mayo", value: fmtK(KPI.mayoMonto26), badge: <VarBadge v={KPI.mayoVarMonto} /> },
            { label: "Unidades Mayo", value: fmtU(KPI.mayoUds26), badge: <VarBadge v={KPI.mayoVarUds} /> },
            { label: "Tiendas Activas", value: String(KPI.tiendasActivas), badge: <span className="text-[10px] text-orange-500">en mayo</span> },
          ].map((k, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg border-2 border-orange-400 px-5 py-3 text-center min-w-[150px]">
              <p className="text-[10px] text-orange-600 font-medium mb-1 uppercase">{k.label}</p>
              <p className="text-2xl font-extrabold text-orange-900">{k.value}</p>
              <div className="mt-1">{k.badge}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bloque YTD secundario */}
      <div>
        <p className="text-center text-xs font-bold text-orange-700 mb-2 uppercase tracking-wider">YTD Ene-{KPI.diaMayo}May</p>
        <div className="flex gap-3">
          {[
            { label: "YTD Monto", value: fmtK(KPI.montoYtd26), badge: <VarBadge v={KPI.varMonto} /> },
            { label: "YTD Unidades", value: fmtU(KPI.udsYtd26), badge: <VarBadge v={KPI.varUds} /> },
            { label: "Alertas Restock", value: String(KPI.totalAlertasRestock), badge: <span className="text-[10px] text-red-600">combinaciones</span> },
            { label: "Anaquel", value: String(KPI.totalAlertasAnaquel), badge: <span className="text-[10px] text-amber-600">combinaciones</span> },
          ].map((k, i) => (
            <div key={i} className="bg-white rounded-xl shadow border border-orange-200 px-4 py-2 text-center min-w-[120px]">
              <p className="text-[10px] text-orange-600 font-medium mb-0.5">{k.label}</p>
              <p className="text-lg font-extrabold text-orange-900">{k.value}</p>
              <div className="mt-0.5">{k.badge}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 bg-green-50 border-2 border-green-300 rounded-xl px-5 py-3 max-w-[780px]">
        <p className="text-center text-[11px] font-bold text-green-800 uppercase tracking-wider mb-2">Mayo vs Abril (mismos 17 dias)</p>
        <div className="flex justify-center gap-8 text-sm">
          <div className="text-center">
            <span className="text-green-700 font-extrabold text-xl">+7.6%</span>
            <span className="text-green-700 text-xs ml-1">monto</span>
          </div>
          <div className="text-center">
            <span className="text-green-700 font-extrabold text-xl">+9.5%</span>
            <span className="text-green-700 text-xs ml-1">unidades</span>
          </div>
          <div className="text-center">
            <span className="text-green-700 font-extrabold text-xl">8 de 9</span>
            <span className="text-green-700 text-xs ml-1">SKUs creciendo</span>
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs text-orange-700 italic text-center max-w-[760px]">
        Mayo no solo rompe la racha negativa vs 2025, tambien crece +7.6% vs abril. El piso de venta diaria subio de ~$8K a ~$9K desde mediados de abril.
      </p>
    </div>
  );
}

/* --- Slide 2: Venta Mensual --- */
function Slide2() {
  const ytd25 = VENTAS_MES_YTD.reduce((s, v) => s + v.m2025, 0);
  const ytd26 = VENTAS_MES_YTD.reduce((s, v) => s + v.m2026, 0);
  const uYtd25 = VENTAS_MES_YTD.reduce((s, v) => s + v.u2025, 0);
  const uYtd26 = VENTAS_MES_YTD.reduce((s, v) => s + v.u2026, 0);
  return (
    <div className="flex flex-col h-full p-6 bg-gradient-to-br from-orange-50 to-orange-100">
      <SlideHeader title="Sell-Out Mensual — 2025 vs 2026" />
      <div className="flex gap-4 flex-1 min-h-0">
        <div className="flex-1 bg-white rounded-xl shadow border border-orange-200 p-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={VENTAS_MES_YTD} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v: number) => `$${(v/1000).toFixed(0)}K`} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => fmt(Number(v))} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="m2025" name="2025" fill="#fdba74" radius={[4,4,0,0]} />
              <Bar dataKey="m2026" name="2026" fill="#ea580c" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="w-[380px] flex flex-col gap-2 overflow-auto">
          <div className="bg-white rounded-xl shadow border border-orange-200 p-2">
            <p className="text-xs font-bold text-orange-800 mb-1 px-1">Ingresos ($)</p>
            <table className="w-full text-xs">
              <thead><tr className="bg-orange-600 text-white"><th className="p-1 text-left">Mes</th><th className="p-1 text-right">2025</th><th className="p-1 text-right">2026</th><th className="p-1 text-right">Var</th></tr></thead>
              <tbody>
                {VENTAS_MES_YTD.map((v, i) => {
                  const vr = v.m2025 > 0 ? ((v.m2026/v.m2025)-1)*100 : 0;
                  return (
                    <tr key={i} className={i % 2 === 0 ? "bg-orange-50" : ""}>
                      <td className="p-1 font-medium">{v.mes}</td>
                      <td className="p-1 text-right">{fmtK(v.m2025)}</td>
                      <td className="p-1 text-right">{fmtK(v.m2026)}</td>
                      <td className="p-1 text-right"><VarBadge v={vr} /></td>
                    </tr>
                  );
                })}
                <tr className="bg-orange-200 font-bold">
                  <td className="p-1">YTD</td>
                  <td className="p-1 text-right">{fmtK(ytd25)}</td>
                  <td className="p-1 text-right">{fmtK(ytd26)}</td>
                  <td className="p-1 text-right"><VarBadge v={KPI.varMonto} /></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-white rounded-xl shadow border border-orange-200 p-2">
            <p className="text-xs font-bold text-orange-800 mb-1 px-1">Unidades</p>
            <table className="w-full text-xs">
              <thead><tr className="bg-orange-600 text-white"><th className="p-1 text-left">Mes</th><th className="p-1 text-right">2025</th><th className="p-1 text-right">2026</th><th className="p-1 text-right">Var</th></tr></thead>
              <tbody>
                {VENTAS_MES_YTD.map((v, i) => {
                  const vr = v.u2025 > 0 ? ((v.u2026/v.u2025)-1)*100 : 0;
                  return (
                    <tr key={i} className={i % 2 === 0 ? "bg-orange-50" : ""}>
                      <td className="p-1 font-medium">{v.mes}</td>
                      <td className="p-1 text-right">{fmtU(v.u2025)}</td>
                      <td className="p-1 text-right">{fmtU(v.u2026)}</td>
                      <td className="p-1 text-right"><VarBadge v={vr} /></td>
                    </tr>
                  );
                })}
                <tr className="bg-orange-200 font-bold">
                  <td className="p-1">YTD</td>
                  <td className="p-1 text-right">{fmtU(uYtd25)}</td>
                  <td className="p-1 text-right">{fmtU(uYtd26)}</td>
                  <td className="p-1 text-right"><VarBadge v={KPI.varUds} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="mt-2 bg-orange-100 rounded-lg px-3 py-1.5 text-xs text-orange-800">
        YTD 2026: -6.0% vs 2025. Marzo fue el mes de mayor brecha (-16.4%). <strong>Mayo (1-17) cierra +2.7%, primera variacion positiva del ano.</strong> May* = parcial Mayo 1-17 vs mismo periodo 2025.
      </div>
    </div>
  );
}

/* --- Slide 3: Salud por Producto --- */
function Slide3() {
  return (
    <div className="flex flex-col h-full p-6 bg-gradient-to-br from-orange-50 to-orange-100">
      <SlideHeader title="Salud por Producto — YTD 2026 vs 2025" />
      <div className="flex gap-4 flex-1 min-h-0">
        <div className="w-[280px] flex flex-col">
          <div className="bg-white rounded-xl shadow border border-orange-200 p-3 flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${(name ?? "").split(" ")[0]} ${((percent ?? 0)*100).toFixed(0)}%`} labelLine={true} fontSize={9}>
                  {PIE_DATA.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => fmt(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 bg-orange-100 rounded-lg px-3 py-1.5 text-xs text-orange-800">
            Chicharron lidera con 24% del mix y es el unico SKU con crecimiento (+17%). Street Elote 125gr y Chile Piquin caen -19/-20%. Chile Piquin y Cheddar 25gr en "Holgado" (&gt;8 sem inv).
          </div>
        </div>
        <div className="flex-1 bg-white rounded-xl shadow border border-orange-200 p-2 overflow-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-orange-600 text-white">
                <th className="p-1.5 text-left">Producto</th>
                <th className="p-1.5 text-right">2025</th>
                <th className="p-1.5 text-right">2026</th>
                <th className="p-1.5 text-right">Var</th>
                <th className="p-1.5 text-right">Inv</th>
                <th className="p-1.5 text-right">Sem</th>
                <th className="p-1.5 text-center">Estado</th>
              </tr>
            </thead>
            <tbody>
              {PRODUCTOS_SALUD.map((p, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-orange-50" : ""}>
                  <td className="p-1.5 font-medium">{p.corto}</td>
                  <td className="p-1.5 text-right">{fmtK(p.m25)}</td>
                  <td className="p-1.5 text-right">{fmtK(p.m26)}</td>
                  <td className="p-1.5 text-right"><VarBadge v={p.var} /></td>
                  <td className="p-1.5 text-right">{fmtU(p.inv)}</td>
                  <td className="p-1.5 text-right">{p.semInv.toFixed(1)}</td>
                  <td className="p-1.5 text-center"><EstadoBadge e={p.estado} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* --- Slide 4: Penetracion / Fill Rate --- */
function Slide4() {
  const frColor = (v: number) => v >= 95 ? "text-green-700" : v >= 85 ? "text-yellow-600" : "text-red-600";
  const barWidth = (v: number) => `${Math.min(v, 100)}%`;
  const barColor = (v: number) => v >= 95 ? "bg-green-500" : v >= 85 ? "bg-yellow-400" : "bg-red-400";
  return (
    <div className="flex flex-col h-full p-6 bg-gradient-to-br from-orange-50 to-orange-100">
      <SlideHeader title="Penetracion por SKU — Fill Rate" />
      <div className="flex-1 bg-white rounded-xl shadow border border-orange-200 p-3 overflow-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-orange-600 text-white">
              <th className="p-1.5 text-left">SKU</th>
              <th className="p-1.5 text-center">Tiendas c/Inv</th>
              <th className="p-1.5 text-center">Fill Rate Inv</th>
              <th className="p-1.5 text-center">Tiendas c/Venta 30d</th>
              <th className="p-1.5 text-center">Fill Rate Venta</th>
              <th className="p-1.5 text-center">Gap</th>
            </tr>
          </thead>
          <tbody>
            {PENETRACION.map((p, i) => {
              const gap = Math.abs(p.fillRateInv - p.fillRateVenta);
              return (
                <tr key={i} className={i % 2 === 0 ? "bg-orange-50" : ""}>
                  <td className="p-1.5 font-medium">{p.corto}</td>
                  <td className="p-1.5 text-center">{p.tiendasConInv} / {p.totalTiendas}</td>
                  <td className="p-1.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div className={`h-full rounded-full ${barColor(p.fillRateInv)}`} style={{ width: barWidth(p.fillRateInv) }} />
                      </div>
                      <span className={`font-bold ${frColor(p.fillRateInv)}`}>{p.fillRateInv}%</span>
                    </div>
                  </td>
                  <td className="p-1.5 text-center">{p.tiendasConVenta30d}</td>
                  <td className="p-1.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div className={`h-full rounded-full ${barColor(p.fillRateVenta)}`} style={{ width: barWidth(p.fillRateVenta) }} />
                      </div>
                      <span className={`font-bold ${frColor(p.fillRateVenta)}`}>{p.fillRateVenta}%</span>
                    </div>
                  </td>
                  <td className="p-1.5 text-center font-bold">{gap.toFixed(1)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-2 bg-orange-100 rounded-lg px-3 py-1.5 text-xs text-orange-800">
        Tiendas operativas: 62. Fill rate &gt;100% indica tiendas con inventario fuera del catalogo formal. Mejor cobertura: Cheddar 25gr (101.6%). Menor: Chile Piquin (87.1%).
      </div>
    </div>
  );
}

/* --- Slide 5: Top 20 Tiendas --- */
function Slide5() {
  const maxMonto = TOP20_TIENDAS[0]?.monto || 1;
  return (
    <div className="flex flex-col h-full p-6 bg-gradient-to-br from-orange-50 to-orange-100">
      <SlideHeader title="Top 20 Tiendas — YTD 2026" />
      <div className="flex-1 bg-white rounded-xl shadow border border-orange-200 p-2 overflow-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-orange-600 text-white">
              <th className="p-1 text-center w-6">#</th>
              <th className="p-1 text-left">Tienda</th>
              <th className="p-1 text-left">Ciudad</th>
              <th className="p-1 text-center">Cluster</th>
              <th className="p-1 text-right">Monto</th>
              <th className="p-1 text-right">Uds</th>
              <th className="p-1 w-24"></th>
            </tr>
          </thead>
          <tbody>
            {TOP20_TIENDAS.map((t, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-orange-50" : ""}>
                <td className="p-1 text-center font-bold text-orange-600">{i + 1}</td>
                <td className="p-1 font-medium">{t.tienda.replace("HEB ", "")}</td>
                <td className="p-1 text-gray-600">{t.ciudad}</td>
                <td className="p-1 text-center">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${clusterColor(t.cluster)}`}>{t.cluster}</span>
                </td>
                <td className="p-1 text-right font-medium">{fmtK(t.monto)}</td>
                <td className="p-1 text-right">{fmtU(t.uds)}</td>
                <td className="p-1">
                  <div className="bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div className="h-full rounded-full bg-orange-500" style={{ width: `${(t.monto / maxMonto) * 100}%` }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* --- Slide 6: Alertas Restock + Anaquel --- */
function Slide6() {
  return (
    <div className="flex flex-col h-full p-6 bg-gradient-to-br from-orange-50 to-orange-100">
      <SlideHeader title="Alertas por Tienda" />
      <div className="flex gap-4 flex-1 min-h-0">
        <div className="flex-1 bg-white rounded-xl shadow border border-red-200 p-2 overflow-auto">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold">Restock Urgente</span>
            <span className="text-[10px] text-gray-500">{KPI.totalAlertasRestock} combinaciones</span>
          </div>
          <table className="w-full text-[10px]">
            <thead>
              <tr className="bg-red-600 text-white">
                <th className="p-1 text-left">Tienda</th>
                <th className="p-1 text-left">Producto</th>
                <th className="p-1 text-right">Inv</th>
                <th className="p-1 text-right">OC</th>
                <th className="p-1 text-right">Ajust.</th>
                <th className="p-1 text-right">Vta/d</th>
                <th className="p-1 text-right">Dias</th>
              </tr>
            </thead>
            <tbody>
              {ALERTAS_RESTOCK.map((a, i) => (
                <tr key={i} className={`${i % 2 === 0 ? "bg-red-50" : ""} ${a.diasCob <= 2 ? "text-red-700 font-bold" : ""}`}>
                  <td className="p-1">{a.tienda.replace("HEB ", "")}</td>
                  <td className="p-1">{a.producto}</td>
                  <td className="p-1 text-right">{a.invActual}</td>
                  <td className="p-1 text-right">{a.ocTransito}</td>
                  <td className="p-1 text-right">{a.invAjustado}</td>
                  <td className="p-1 text-right">{a.vtaDia}</td>
                  <td className="p-1 text-right">{a.diasCob}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[9px] text-gray-400 mt-1 px-1">Inv ajustado = actual + OC en transito</p>
        </div>
        <div className="w-[340px] bg-white rounded-xl shadow border border-amber-200 p-2 overflow-auto">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs font-bold">Problema de Anaquel</span>
            <span className="text-[10px] text-gray-500">{KPI.totalAlertasAnaquel} combinaciones</span>
          </div>
          <table className="w-full text-[10px]">
            <thead>
              <tr className="bg-amber-500 text-white">
                <th className="p-1 text-left">Tienda</th>
                <th className="p-1 text-left">Producto</th>
                <th className="p-1 text-right">Inv</th>
              </tr>
            </thead>
            <tbody>
              {ALERTAS_ANAQUEL.map((a, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-amber-50" : ""}>
                  <td className="p-1">{a.tienda.replace("HEB ", "")}</td>
                  <td className="p-1">{a.producto}</td>
                  <td className="p-1 text-right">{a.inv}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[9px] text-gray-400 mt-1 px-1">Tiendas con inv &gt;0 pero $0 venta en 15 dias</p>
        </div>
      </div>
    </div>
  );
}

/* --- Slide 7: Ordenes de Compra --- */
function Slide7() {
  return (
    <div className="flex flex-col h-full p-6 bg-gradient-to-br from-orange-50 to-orange-100">
      <SlideHeader title="Ordenes de Compra — Tendencia" />
      <div className="flex gap-4 flex-1 min-h-0">
        <div className="flex-1 bg-white rounded-xl shadow border border-orange-200 p-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={OC_TENDENCIA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
              <XAxis dataKey="oc" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => fmtU(Number(v)) + " uds"} />
              <Bar dataKey="uds" name="Unidades" fill="#ea580c" radius={[4,4,0,0]}>
                {OC_TENDENCIA.map((_, i) => (
                  <Cell key={i} fill={i === OC_TENDENCIA.length - 1 ? "#ea580c" : "#fdba74"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="w-[350px] bg-white rounded-xl shadow border border-orange-200 p-2 overflow-auto">
          <p className="text-xs font-bold text-orange-800 mb-2 px-1">OC mas reciente (05-May) — 2,242 uds</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-orange-600 text-white">
                <th className="p-1.5 text-left">SKU</th>
                <th className="p-1.5 text-right">Uds OC</th>
                <th className="p-1.5 text-right">Vta/Sem</th>
                <th className="p-1.5 text-right">Sem Cub</th>
              </tr>
            </thead>
            <tbody>
              {OC_DETALLE.map((o, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-orange-50" : ""}>
                  <td className="p-1.5 font-medium">{o.sku}</td>
                  <td className="p-1.5 text-right">{fmtU(o.udsOc)}</td>
                  <td className="p-1.5 text-right">{fmtU(o.vtaSemanal)}</td>
                  <td className="p-1.5 text-right font-bold">{o.semCubre.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-2 bg-orange-50 rounded p-1.5 text-[10px] text-orange-700">
            Promedio OC: {fmtU(Math.round(OC_TENDENCIA.reduce((s,o) => s+o.uds, 0) / OC_TENDENCIA.length))} uds. Pico 10-Mar (5,008). OC 05-May cubre solo ~1 sem; urge nueva OC.
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- Slide 8: Periodos Fiscales --- */
function Slide8() {
  return (
    <div className="flex flex-col h-full p-6 bg-gradient-to-br from-orange-50 to-orange-100">
      <SlideHeader title="Venta por Periodo Fiscal HEB" />
      <div className="flex gap-4 flex-1 min-h-0">
        <div className="flex-1 bg-white rounded-xl shadow border border-orange-200 p-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={PERIODOS_FISCALES} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
              <XAxis dataKey="periodo" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v: number) => `$${(v/1000).toFixed(0)}K`} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => fmt(Number(v))} />
              <Bar dataKey="monto" name="Monto" fill="#ea580c" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="w-[350px] bg-white rounded-xl shadow border border-orange-200 p-2 overflow-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-orange-600 text-white">
                <th className="p-1.5 text-left">Periodo</th>
                <th className="p-1.5 text-right">Monto</th>
                <th className="p-1.5 text-right">Uds</th>
                <th className="p-1.5 text-right">Var</th>
              </tr>
            </thead>
            <tbody>
              {PERIODOS_FISCALES.map((p, i) => {
                const prev = i > 0 ? PERIODOS_FISCALES[i-1].monto : p.monto;
                const vr = prev > 0 ? ((p.monto/prev)-1)*100 : 0;
                return (
                  <tr key={i} className={i % 2 === 0 ? "bg-orange-50" : ""}>
                    <td className="p-1.5 font-medium">{p.periodo}</td>
                    <td className="p-1.5 text-right">{fmtK(p.monto)}</td>
                    <td className="p-1.5 text-right">{fmtU(p.uds)}</td>
                    <td className="p-1.5 text-right">{i > 0 ? <VarBadge v={vr} /> : <span className="text-gray-400">—</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="mt-3 bg-orange-50 rounded p-2 text-[10px] text-orange-700">
            Periodos fiscales HEB: 13/ano, ~4 semanas c/u. P07 ya cerrado con $255K, similar al P05. Tendencia estable entre $244K-$256K.
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- Slide 9: Acciones --- */
function Slide9() {
  const cards = [
    { title: "Urgente", items: ACCIONES.urgente, border: "border-red-300", bg: "bg-red-50", icon: <AlertTriangle size={16} className="text-red-600" /> },
    { title: "Esta semana", items: ACCIONES.estaSemana, border: "border-yellow-300", bg: "bg-yellow-50", icon: <Package size={16} className="text-yellow-600" /> },
    { title: "Estrategico", items: ACCIONES.estrategico, border: "border-green-300", bg: "bg-green-50", icon: <TrendingUp size={16} className="text-green-600" /> },
  ];
  return (
    <div className="flex flex-col h-full p-6 bg-gradient-to-br from-orange-50 to-orange-100">
      <SlideHeader title="Recomendaciones" />
      <div className="grid grid-cols-3 gap-4 flex-1">
        {cards.map((c, i) => (
          <div key={i} className={`${c.bg} border ${c.border} rounded-xl p-4 flex flex-col`}>
            <div className="flex items-center gap-2 mb-3">
              {c.icon}
              <h3 className="font-bold text-sm text-gray-800">{c.title}</h3>
            </div>
            <div className="space-y-2 flex-1">
              {c.items.map((item, j) => (
                <div key={j} className="bg-white/70 rounded-lg p-2">
                  <p className="text-xs font-bold text-gray-800">{item.accion}</p>
                  <p className="text-[10px] text-gray-600 mt-0.5">{item.detalle}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --- Slide 10: Dashboard resumen --- */
function Slide10() {
  const miniCards = [
    { label: "Venta YTD", value: fmtK(KPI.montoYtd26), sub: <VarBadge v={KPI.varMonto} />, icon: <ShoppingCart size={18} className="text-orange-600" /> },
    { label: "Unidades YTD", value: fmtU(KPI.udsYtd26), sub: <VarBadge v={KPI.varUds} />, icon: <Box size={18} className="text-orange-600" /> },
    { label: "Tiendas Activas", value: String(KPI.tiendasActivas), sub: <span className="text-[10px] text-gray-500">de 62 operativas</span>, icon: <Store size={18} className="text-orange-600" /> },
    { label: "Alertas Restock", value: String(KPI.totalAlertasRestock), sub: <span className="text-[10px] text-red-500">combinaciones</span>, icon: <AlertTriangle size={18} className="text-red-500" /> },
  ];
  return (
    <div className="flex flex-col h-full p-6 bg-gradient-to-br from-orange-50 to-orange-100">
      <SlideHeader title="Resumen Ejecutivo" />
      <div className="grid grid-cols-4 gap-3 mb-4">
        {miniCards.map((c, i) => (
          <div key={i} className="bg-white rounded-xl shadow border border-orange-200 p-3 flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">{c.icon}</div>
            <div>
              <p className="text-[10px] text-orange-600">{c.label}</p>
              <p className="text-lg font-extrabold text-orange-900">{c.value}</p>
              {c.sub}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-3 flex-1 min-h-0">
        <div className="flex-1 bg-white rounded-xl shadow border border-orange-200 p-3">
          <p className="text-xs font-bold text-orange-800 mb-2">Restock por Producto</p>
          {ALERTAS_RESUMEN.restock.map((r, i) => (
            <div key={i} className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] w-[140px] truncate">{r.producto}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                <div className="h-full bg-red-400 rounded-full" style={{ width: `${(r.tiendas / 62) * 100}%` }} />
              </div>
              <span className="text-[10px] font-bold w-8 text-right">{r.tiendas}</span>
            </div>
          ))}
        </div>
        <div className="flex-1 bg-white rounded-xl shadow border border-orange-200 p-3">
          <p className="text-xs font-bold text-orange-800 mb-2">Problema Anaquel por Producto</p>
          {ALERTAS_RESUMEN.anaquel.map((r, i) => (
            <div key={i} className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] w-[140px] truncate">{r.producto}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(r.tiendas / 62) * 100}%` }} />
              </div>
              <span className="text-[10px] font-bold w-8 text-right">{r.tiendas}</span>
            </div>
          ))}
        </div>
        <div className="flex-1 bg-white rounded-xl shadow border border-orange-200 p-3">
          <p className="text-xs font-bold text-orange-800 mb-2">OC Tendencia (uds)</p>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={OC_TENDENCIA} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <XAxis dataKey="oc" tick={{ fontSize: 8 }} />
              <YAxis tick={{ fontSize: 8 }} />
              <Line type="monotone" dataKey="uds" stroke="#ea580c" strokeWidth={2} dot={{ r: 3 }} />
              <Tooltip formatter={(v) => fmtU(Number(v))} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ───────── MAIN ───────── */
const SLIDES = [Slide1, Slide2, Slide3, Slide4, Slide5, Slide6, Slide7, Slide8, Slide9, Slide10];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const next = useCallback(() => setCurrent(c => Math.min(c + 1, SLIDES.length - 1)), []);
  const prev = useCallback(() => setCurrent(c => Math.max(c - 1, 0)), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  const CurrentSlide = SLIDES[current];

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-950 p-4">
      <div className="relative w-[1280px] aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-orange-700">
        <CurrentSlide />
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-orange-900/90 backdrop-blur rounded-full px-4 py-1.5 shadow-lg flex items-center gap-3">
          <button onClick={prev} disabled={current === 0} className="text-white disabled:opacity-30 hover:text-orange-300 transition">
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition ${i === current ? "bg-orange-400 scale-125" : "bg-orange-700 hover:bg-orange-500"}`}
              />
            ))}
          </div>
          <span className="text-orange-300 text-xs font-mono">{current + 1}/{SLIDES.length}</span>
          <button onClick={next} disabled={current === SLIDES.length - 1} className="text-white disabled:opacity-30 hover:text-orange-300 transition">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
