"use client";

import Image from "next/image";
import { AlertTriangle, ShoppingCart } from "lucide-react";

const alertasRestock = [
  { tienda: "HEB MTY TEC", producto: "Classic White 125g", inv: 3, vtaDia: 3.7, cob: 1 },
  { tienda: "HEB TOR SENDEROS", producto: "Chicharron Natural", inv: 2, vtaDia: 1.5, cob: 1 },
  { tienda: "HEB MTY SAN PEDRO", producto: "Rodajitas Spicy Limon", inv: 11, vtaDia: 6.7, cob: 2 },
  { tienda: "HEB SAL SAN PATRICIO", producto: "Street Elote 25g", inv: 3, vtaDia: 1.7, cob: 2 },
  { tienda: "HEB MTY CONTRY", producto: "Cheddar Jalapeno 125g", inv: 4, vtaDia: 1.7, cob: 2 },
  { tienda: "HEB MTY PUERTA DE HIERRO", producto: "Street Elote 125g", inv: 7, vtaDia: 2.9, cob: 2 },
  { tienda: "HEB TAM EJERCITO", producto: "Cheddar Jalapeno 125g", inv: 6, vtaDia: 1.5, cob: 4 },
  { tienda: "HEB VIC CAMPESTRE", producto: "Cheddar Jalapeno 125g", inv: 5, vtaDia: 1.1, cob: 5 },
  { tienda: "HEB VIC CAMPESTRE", producto: "Street Elote 25g", inv: 6, vtaDia: 1.3, cob: 5 },
  { tienda: "HEB MTY VALLE ORIENTE", producto: "Rodajitas Spicy Limon", inv: 20, vtaDia: 3.7, cob: 5 },
  { tienda: "HEB MTY VALLE ORIENTE", producto: "Street Elote 125g", inv: 24, vtaDia: 4.0, cob: 6 },
  { tienda: "HEB MTY SAN PEDRO", producto: "Street Elote 125g", inv: 41, vtaDia: 6.7, cob: 6 },
  { tienda: "HEB SLP CARRETERA 57", producto: "Rodajitas Spicy Limon", inv: 13, vtaDia: 2.1, cob: 6 },
  { tienda: "HEB MTY VALLE ORIENTE", producto: "Classic White 125g", inv: 10, vtaDia: 1.6, cob: 6 },
  { tienda: "HEB MTY TEC", producto: "Street Elote 125g", inv: 20, vtaDia: 3.2, cob: 6 },
];

const alertasAnaquel = [
  { tienda: "HEB NVO NUEVO LAREDO", producto: "Street Elote 125g", inv: 107 },
  { tienda: "HEB QRO SAN JUAN DEL RIO", producto: "Rodajitas Spicy Limon", inv: 45 },
  { tienda: "HEB MTY CUMBRES", producto: "Cheddar Jalapeno 125g", inv: 40 },
  { tienda: "HEB SAL REPUBLICA", producto: "Street Elote 125g", inv: 34 },
  { tienda: "HEB SAL LA NOGALERA", producto: "Street Elote 125g", inv: 33 },
  { tienda: "HEB VIC CAMPESTRE", producto: "Rodajitas Spicy Limon", inv: 33 },
  { tienda: "HEB QRO ZIBATA", producto: "Street Elote 125g", inv: 33 },
  { tienda: "HEB TOR INDEPENDENCIA", producto: "Chile Piquin", inv: 32 },
  { tienda: "HEB MAT MATAMOROS", producto: "Street Elote 125g", inv: 32 },
  { tienda: "HEB IRA IRAPUATO", producto: "Rodajitas Spicy Limon", inv: 32 },
  { tienda: "HEB VIC CAMPESTRE", producto: "Cheddar Jalapeno 125g", inv: 31 },
  { tienda: "HEB SAL LA NOGALERA", producto: "Cheddar Jalapeno 125g", inv: 31 },
  { tienda: "HEB MVA PAPE", producto: "Chile Piquin", inv: 30 },
];

export default function Slide3Alertas() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-orange-50 to-orange-100 p-8 flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <Image src="/4buddies-logo.jpeg" alt="4B" width={36} height={36} className="rounded-lg" />
        <div>
          <h2 className="text-xl font-bold text-orange-900">Alertas por Tienda</h2>
          <p className="text-xs text-orange-600">
            Basado en venta diaria de los ultimos 15 dias vs inventario actual al 2 de marzo 2026
          </p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4">
        {/* Columna 1: Restock */}
        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-red-100 rounded-lg">
              <ShoppingCart className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-red-800">Restock Urgente</h3>
              <p className="text-[10px] text-red-600">Inventario no alcanza para 15 dias de venta &middot; 78 alertas totales</p>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b-2 border-red-200">
                  <th className="text-left py-1 text-red-800 font-semibold">Tienda</th>
                  <th className="text-left py-1 text-red-800 font-semibold">Producto</th>
                  <th className="text-right py-1 text-red-800 font-semibold">Inv</th>
                  <th className="text-right py-1 text-red-800 font-semibold">Vta/dia</th>
                  <th className="text-right py-1 text-red-800 font-semibold">Dias</th>
                </tr>
              </thead>
              <tbody>
                {alertasRestock.map((r, i) => (
                  <tr key={i} className={`border-b border-red-50 ${r.cob <= 2 ? "bg-red-50" : ""}`}>
                    <td className="py-1 text-orange-900">{r.tienda.replace("HEB ", "")}</td>
                    <td className="py-1 text-orange-700">{r.producto}</td>
                    <td className="py-1 text-right font-medium text-red-700">{r.inv}</td>
                    <td className="py-1 text-right text-orange-600">{r.vtaDia.toFixed(1)}</td>
                    <td className="py-1 text-right">
                      <span className={`px-1.5 py-0.5 rounded-full font-bold ${
                        r.cob <= 2 ? "bg-red-600 text-white" : r.cob <= 7 ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                      }`}>
                        {r.cob}d
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Columna 2: Problema de Anaquel */}
        <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-amber-100 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-800">Problema de Anaquel</h3>
              <p className="text-[10px] text-amber-600">Tiene inventario pero $0 venta en 15 dias &middot; 25 alertas totales</p>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b-2 border-amber-200">
                  <th className="text-left py-1 text-amber-800 font-semibold">Tienda</th>
                  <th className="text-left py-1 text-amber-800 font-semibold">Producto</th>
                  <th className="text-right py-1 text-amber-800 font-semibold">Inv</th>
                </tr>
              </thead>
              <tbody>
                {alertasAnaquel.map((r, i) => (
                  <tr key={i} className="border-b border-amber-50">
                    <td className="py-1 text-orange-900">{r.tienda.replace("HEB ", "")}</td>
                    <td className="py-1 text-orange-700">{r.producto}</td>
                    <td className="py-1 text-right font-medium text-amber-700">{r.inv}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-[10px] text-amber-700">
              Estos productos se venden en otras tiendas pero no aqui. Posible producto no exhibido, mal acomodado o sin precio visible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
