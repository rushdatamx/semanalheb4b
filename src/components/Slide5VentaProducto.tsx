"use client";

import Image from "next/image";
import { AlertTriangle, ShoppingCart } from "lucide-react";

const alertasRestock = [
  { tienda: "TOR REVOLUCION", producto: "Street Elote 125g", inv: 2, oc: 0, ajust: 2, vtaDia: 1.2, cob: 1.7 },
  { tienda: "QRO SAN JUAN DEL RIO", producto: "Chicharron Natural", inv: 4, oc: 0, ajust: 4, vtaDia: 0.93, cob: 4.3 },
  { tienda: "MTY EL URO", producto: "Street Elote 125g", inv: 3, oc: 10, ajust: 13, vtaDia: 1.4, cob: 9.3 },
  { tienda: "QRO JURIQUILLA", producto: "Chicharron Natural", inv: 0, oc: 10, ajust: 10, vtaDia: 1.07, cob: 9.4 },
  { tienda: "MTY CHIPINQUE", producto: "Chicharron Natural", inv: 23, oc: 0, ajust: 23, vtaDia: 2.33, cob: 9.9 },
  { tienda: "MTY CONTRY", producto: "Rodajitas Spicy Limon", inv: 48, oc: 0, ajust: 48, vtaDia: 4.87, cob: 9.9 },
  { tienda: "MTY CONCORDIA", producto: "Cheddar Jalapeno 125g", inv: 14, oc: 0, ajust: 14, vtaDia: 1.27, cob: 11.1 },
  { tienda: "MTY SAN PEDRO", producto: "Street Elote 125g", inv: 68, oc: 0, ajust: 68, vtaDia: 6.13, cob: 11.1 },
  { tienda: "MTY TEC", producto: "Rodajitas Spicy Limon", inv: 36, oc: 0, ajust: 36, vtaDia: 3.2, cob: 11.2 },
  { tienda: "MTY TEC", producto: "Classic White 125g", inv: 38, oc: 0, ajust: 38, vtaDia: 3.27, cob: 11.6 },
  { tienda: "TAM MADERO", producto: "Street Elote 125g", inv: 12, oc: 0, ajust: 12, vtaDia: 1.0, cob: 12.0 },
  { tienda: "MTY SANTA CATARINA", producto: "Street Elote 125g", inv: 3, oc: 10, ajust: 13, vtaDia: 1.07, cob: 12.2 },
  { tienda: "MTY CONTRY", producto: "Street Elote 125g", inv: 33, oc: 0, ajust: 33, vtaDia: 2.67, cob: 12.4 },
];

const alertasAnaquel = [
  { tienda: "NVO NUEVO LAREDO", producto: "Street Elote 125g", inv: 107 },
  { tienda: "VIC CAMPESTRE", producto: "Classic White 125g", inv: 51 },
  { tienda: "QRO SAN JUAN DEL RIO", producto: "Rodajitas Spicy Limon", inv: 45 },
  { tienda: "SAL REPUBLICA", producto: "Street Elote 125g", inv: 34 },
  { tienda: "VIC CAMPESTRE", producto: "Rodajitas Spicy Limon", inv: 33 },
  { tienda: "TOR SENDEROS", producto: "Chile Piquin", inv: 32 },
  { tienda: "IRA IRAPUATO", producto: "Rodajitas Spicy Limon", inv: 32 },
  { tienda: "TOR SENDEROS", producto: "Street Elote 125g", inv: 32 },
  { tienda: "SAL REPUBLICA", producto: "Cheddar Jalapeno 125g", inv: 31 },
  { tienda: "VIC CAMPESTRE", producto: "Cheddar Jalapeno 125g", inv: 31 },
  { tienda: "MAT LAURO VILLAR", producto: "Chile Piquin", inv: 29 },
  { tienda: "VIC CAMPESTRE", producto: "Chile Piquin", inv: 29 },
  { tienda: "SLP LOS PINOS", producto: "Cheddar Jalapeno 125g", inv: 25 },
];

export default function Slide5VentaProducto() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-orange-50 to-orange-100 p-8 flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <Image src="/4buddies-logo.jpeg" alt="4B" width={36} height={36} className="rounded-lg" />
        <div>
          <h2 className="text-xl font-bold text-orange-900">Alertas y Oportunidades</h2>
          <p className="text-xs text-orange-600">
            Inventario ajustado con OC 11Mar en transito &middot; Venta ultimos 15 dias al 16 Mar 2026
          </p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4">
        {/* Restock */}
        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-red-100 rounded-lg">
              <ShoppingCart className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-red-800">Restock Urgente</h3>
              <p className="text-[10px] text-red-600">27 posiciones con &lt;15 dias de cobertura (ya descontando OC 11Mar)</p>
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
                    <td className="py-1 text-orange-900">{r.tienda}</td>
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
          <p className="text-[10px] text-red-600 mt-1">+ 14 alertas mas en el Excel adjunto</p>
        </div>

        {/* Anaquel */}
        <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-amber-100 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-800">Problema de Anaquel</h3>
              <p className="text-[10px] text-amber-600">22 posiciones con inventario pero $0 venta en 15 dias</p>
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
                    <td className="py-1 text-orange-900">{r.tienda}</td>
                    <td className="py-1 text-orange-700">{r.producto}</td>
                    <td className="py-1 text-right font-medium text-amber-700">{r.inv}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-[10px] text-amber-700">
              Estos productos se venden bien en otras tiendas. Posible falta de exhibicion o acomodo.
              VIC Campestre tiene 5 SKUs afectados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
