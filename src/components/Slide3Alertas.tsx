"use client";

import Image from "next/image";
import { AlertTriangle, ShoppingCart } from "lucide-react";

const alertasRestock = [
  { tienda: "HEB LEO TORRES LANDA", producto: "Rodajitas Spicy Limon", inv: 3, oc: 0, ajust: 3, vtaDia: 1.67, cob: 1.8 },
  { tienda: "HEB AGS SANTA MONICA", producto: "Street Elote 125g", inv: 9, oc: 0, ajust: 9, vtaDia: 2.20, cob: 4.1 },
  { tienda: "HEB MTY VALLE ORIENTE", producto: "Cheddar Jalapeno 25g", inv: 10, oc: 0, ajust: 10, vtaDia: 1.13, cob: 8.8 },
  { tienda: "HEB MTY SAN NICOLAS", producto: "Chicharron Natural", inv: 0, oc: 20, ajust: 20, vtaDia: 2.20, cob: 9.1 },
  { tienda: "HEB MTY SAN PEDRO", producto: "Cheddar Jalapeno 25g", inv: 5, oc: 32, ajust: 37, vtaDia: 3.93, cob: 9.4 },
  { tienda: "HEB MTY EL URO", producto: "Chile Piquin", inv: 21, oc: 0, ajust: 21, vtaDia: 2.13, cob: 9.8 },
  { tienda: "HEB VIC CAMPESTRE", producto: "Classic White 25g", inv: 1, oc: 10, ajust: 11, vtaDia: 0.93, cob: 11.8 },
  { tienda: "HEB MTY ESCOBEDO", producto: "Classic White 125g", inv: 15, oc: 0, ajust: 15, vtaDia: 1.27, cob: 11.8 },
  { tienda: "HEB MTY SAN NICOLAS", producto: "Chile Piquin", inv: 14, oc: 0, ajust: 14, vtaDia: 1.13, cob: 12.4 },
  { tienda: "HEB MTY PUERTA HIERRO", producto: "Chicharron Natural", inv: 9, oc: 10, ajust: 19, vtaDia: 1.53, cob: 12.4 },
  { tienda: "HEB MTY CHIPINQUE", producto: "Cheddar Jalapeno 25g", inv: 4, oc: 24, ajust: 28, vtaDia: 2.27, cob: 12.3 },
  { tienda: "HEB MTY CONTRY", producto: "Rodajitas Spicy Limon", inv: 5, oc: 32, ajust: 37, vtaDia: 2.73, cob: 13.5 },
  { tienda: "HEB MTY TEC", producto: "Classic White 125g", inv: 15, oc: 0, ajust: 15, vtaDia: 1.13, cob: 13.3 },
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
            Inventario ajustado con OC 4Mar en transito. Venta diaria ultimos 15 dias al 9 de marzo 2026.
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
              <p className="text-[10px] text-red-600">Inv + OC en transito &lt; 15 dias de venta &middot; 23 alertas (ajustado)</p>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b-2 border-red-200">
                  <th className="text-left py-1 text-red-800 font-semibold">Tienda</th>
                  <th className="text-left py-1 text-red-800 font-semibold">Producto</th>
                  <th className="text-right py-1 text-red-800 font-semibold">Inv</th>
                  <th className="text-right py-1 text-red-800 font-semibold">+OC</th>
                  <th className="text-right py-1 text-red-800 font-semibold">Dias</th>
                </tr>
              </thead>
              <tbody>
                {alertasRestock.map((r, i) => (
                  <tr key={i} className={`border-b border-red-50 ${r.cob <= 5 ? "bg-red-50" : ""}`}>
                    <td className="py-1 text-orange-900">{r.tienda.replace("HEB ", "")}</td>
                    <td className="py-1 text-orange-700">{r.producto}</td>
                    <td className="py-1 text-right font-medium text-red-700">{r.inv}</td>
                    <td className="py-1 text-right text-green-600 font-medium">{r.oc > 0 ? `+${r.oc}` : "-"}</td>
                    <td className="py-1 text-right">
                      <span className={`px-1.5 py-0.5 rounded-full font-bold ${
                        r.cob <= 5 ? "bg-red-600 text-white" : r.cob <= 10 ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
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
