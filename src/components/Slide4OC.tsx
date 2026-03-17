"use client";

import Image from "next/image";
import { TrendingDown, CheckCircle, Target } from "lucide-react";

export default function Slide4OC() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-orange-50 to-orange-100 p-8 flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <Image src="/4buddies-logo.jpeg" alt="4B" width={36} height={36} className="rounded-lg" />
        <div>
          <h2 className="text-xl font-bold text-orange-900">Marzo 2026 — Como vamos?</h2>
          <p className="text-xs text-orange-600">Avance al dia 16 vs marzo 2025 completo (mismos dias)</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-4">
        {/* KPIs de Marzo */}
        <div className="col-span-1 flex flex-col gap-3">
          <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-4 flex-1 flex flex-col justify-center">
            <p className="text-[10px] text-orange-600 uppercase tracking-wider font-semibold mb-1">Venta Mar 2026 (al 16)</p>
            <p className="text-3xl font-extrabold text-orange-900">$153K</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingDown className="w-3.5 h-3.5 text-red-500" />
              <span className="text-sm font-semibold text-red-600">-7.2% vs 2025</span>
            </div>
            <p className="text-[10px] text-orange-500 mt-1">Mar 2025 al dia 16: $165K</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-4 flex-1 flex flex-col justify-center">
            <p className="text-[10px] text-orange-600 uppercase tracking-wider font-semibold mb-1">Avance vs Mar 2025 completo</p>
            <p className="text-3xl font-extrabold text-orange-900">46.3%</p>
            <div className="w-full h-3 bg-orange-100 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full" style={{ width: "46.3%" }} />
            </div>
            <p className="text-[10px] text-orange-500 mt-1">Mar 2025 completo: $330K</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-4 flex-1 flex flex-col justify-center">
            <p className="text-[10px] text-orange-600 uppercase tracking-wider font-semibold mb-1">Proyeccion Mar 2026</p>
            <p className="text-3xl font-extrabold text-orange-900">$296K</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingDown className="w-3.5 h-3.5 text-red-500" />
              <span className="text-sm font-semibold text-red-600">-10.3% vs Mar 2025</span>
            </div>
            <p className="text-[10px] text-orange-500 mt-1">Si mantiene ritmo actual (16 dias restantes)</p>
          </div>
        </div>

        {/* Inventario y cobertura */}
        <div className="col-span-2 flex flex-col gap-3">
          <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-4 flex-1">
            <h3 className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-3">Inventario y Cobertura al 16 Mar</h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b-2 border-orange-200">
                  <th className="text-left py-1.5 text-orange-800 font-semibold">Producto</th>
                  <th className="text-right py-1.5 text-orange-800 font-semibold">Inv (uds)</th>
                  <th className="text-right py-1.5 text-orange-800 font-semibold">Sem Inv</th>
                  <th className="text-right py-1.5 text-orange-800 font-semibold">Cobertura</th>
                  <th className="text-center py-1.5 text-orange-800 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { prod: "Street Elote 125g", inv: 971, sem: 3.6, cob: "100%", status: "vigilar" },
                  { prod: "Chicharron Natural", inv: 1134, sem: 3.8, cob: "90%", status: "vigilar" },
                  { prod: "Rodajitas Spicy Limon", inv: 2083, sem: 4.1, cob: "95%", status: "ok" },
                  { prod: "Cheddar Jalapeno 125g", inv: 820, sem: 4.2, cob: "95%", status: "ok" },
                  { prod: "Classic White 25g", inv: 786, sem: 4.5, cob: "98%", status: "ok" },
                  { prod: "Street Elote 25g", inv: 2222, sem: 5.3, cob: "95%", status: "ok" },
                  { prod: "Classic White 125g", inv: 2459, sem: 5.7, cob: "87%", status: "ok" },
                  { prod: "Cheddar Jalapeno 25g", inv: 2003, sem: 7.5, cob: "87%", status: "holgado" },
                  { prod: "Chile Piquin", inv: 1544, sem: 9.5, cob: "85%", status: "holgado" },
                ].map((r) => (
                  <tr key={r.prod} className="border-b border-orange-50">
                    <td className="py-1.5 text-orange-900 font-medium">{r.prod}</td>
                    <td className="py-1.5 text-right text-orange-700">{r.inv.toLocaleString()}</td>
                    <td className="py-1.5 text-right font-semibold">
                      <span className={r.status === "vigilar" ? "text-red-600" : r.status === "holgado" ? "text-green-600" : "text-orange-700"}>
                        {r.sem}
                      </span>
                    </td>
                    <td className="py-1.5 text-right text-orange-600">{r.cob}</td>
                    <td className="py-1.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.status === "vigilar" ? "bg-red-100 text-red-700" :
                        r.status === "holgado" ? "bg-green-100 text-green-700" :
                        "bg-orange-100 text-orange-700"
                      }`}>
                        {r.status === "vigilar" ? "Vigilar" : r.status === "holgado" ? "Holgado" : "OK"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-orange-50 rounded-xl border border-orange-200 p-3 flex items-start gap-2">
            <Target className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
            <p className="text-xs text-orange-800">
              <strong>Oportunidad:</strong> La caida de -7.2% en marzo es menor que febrero (-5.8% ingreso pero -9.6% uds).
              Quedan 15 dias para cerrar el gap. Enfocarse en Street Elote 125g y Chicharron que necesitan resurtido urgente
              y en las 22 posiciones con problema de anaquel que tienen inventario pero no venden.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
