"use client";

import Image from "next/image";
import { AlertTriangle, ShoppingCart } from "lucide-react";

const alertasRestock = [
  { tienda: "HEB LEO LOPEZ MATEOS", producto: "Rodajitas Spicy Limon", inv: 1, vtaDia: 2.13, cob: 0.5 },
  { tienda: "HEB VIC CAMPESTRE", producto: "Classic White 25g", inv: 1, vtaDia: 0.93, cob: 1.1 },
  { tienda: "HEB MTY SAN NICOLAS", producto: "Cheddar Jalapeno 25g", inv: 2, vtaDia: 1.60, cob: 1.2 },
  { tienda: "HEB MTY SAN PEDRO", producto: "Cheddar Jalapeno 25g", inv: 5, vtaDia: 3.93, cob: 1.3 },
  { tienda: "HEB MTY VALLE ORIENTE", producto: "Chile Piquin", inv: 3, vtaDia: 2.27, cob: 1.3 },
  { tienda: "HEB MTY TEC", producto: "Cheddar Jalapeno 125g", inv: 4, vtaDia: 2.53, cob: 1.6 },
  { tienda: "HEB MTY CHIPINQUE", producto: "Cheddar Jalapeno 25g", inv: 4, vtaDia: 2.27, cob: 1.8 },
  { tienda: "HEB MTY CONTRY", producto: "Rodajitas Spicy Limon", inv: 5, vtaDia: 2.73, cob: 1.8 },
  { tienda: "HEB SAL SAN PATRICIO", producto: "Chicharron Natural", inv: 3, vtaDia: 1.53, cob: 2.0 },
  { tienda: "HEB MTY PUERTA DE HIERRO", producto: "Street Elote 25g", inv: 4, vtaDia: 1.87, cob: 2.1 },
  { tienda: "HEB MTY VALLE ALTO", producto: "Classic White 25g", inv: 5, vtaDia: 2.20, cob: 2.3 },
  { tienda: "HEB LEO CERRO GORDO", producto: "Classic White 125g", inv: 7, vtaDia: 2.87, cob: 2.4 },
  { tienda: "HEB MTY SAN PEDRO", producto: "Rodajitas Spicy Limon", inv: 9, vtaDia: 3.53, cob: 2.5 },
  { tienda: "HEB MTY CONTRY", producto: "Street Elote 125g", inv: 8, vtaDia: 2.93, cob: 2.7 },
  { tienda: "HEB MTY CHIPINQUE", producto: "Street Elote 25g", inv: 5, vtaDia: 1.80, cob: 2.8 },
];

const alertasAnaquel = [
  { tienda: "HEB NVO NUEVO LAREDO", producto: "Street Elote 125g", inv: 107 },
  { tienda: "HEB MTY LA PUERTA", producto: "Cheddar Jalapeno 125g", inv: 56 },
  { tienda: "HEB VIC CAMPESTRE", producto: "Classic White 125g", inv: 51 },
  { tienda: "HEB SLP LOS PINOS", producto: "Street Elote 125g", inv: 51 },
  { tienda: "HEB QRO SAN JUAN DEL RIO", producto: "Rodajitas Spicy Limon", inv: 45 },
  { tienda: "HEB SAL REPUBLICA", producto: "Classic White 125g", inv: 42 },
  { tienda: "HEB MTY CUMBRES", producto: "Cheddar Jalapeno 125g", inv: 40 },
  { tienda: "HEB SAL LA NOGALERA", producto: "Street Elote 125g", inv: 33 },
  { tienda: "HEB QRO ZIBATA", producto: "Street Elote 125g", inv: 33 },
  { tienda: "HEB VIC CAMPESTRE", producto: "Rodajitas Spicy Limon", inv: 33 },
  { tienda: "HEB IRA IRAPUATO", producto: "Rodajitas Spicy Limon", inv: 32 },
  { tienda: "HEB MAT MATAMOROS", producto: "Street Elote 125g", inv: 32 },
  { tienda: "HEB TOR INDEPENDENCIA", producto: "Chile Piquin", inv: 32 },
];

export default function Slide3Alertas() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-orange-50 to-orange-100 p-8 flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <Image src="/4buddies-logo.jpeg" alt="4B" width={36} height={36} className="rounded-lg" />
        <div>
          <h2 className="text-xl font-bold text-orange-900">Alertas por Tienda</h2>
          <p className="text-xs text-orange-600">
            Basado en venta diaria de los ultimos 15 dias vs inventario actual al 9 de marzo 2026
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
              <p className="text-[10px] text-red-600">Inventario no alcanza para 15 dias de venta &middot; 112 alertas totales</p>
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
              <p className="text-[10px] text-amber-600">Tiene inventario pero $0 venta en 15 dias &middot; 20 alertas totales</p>
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
