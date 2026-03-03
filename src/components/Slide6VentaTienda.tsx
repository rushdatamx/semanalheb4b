"use client";

import Image from "next/image";

const topTiendas = [
  { pos: 1, tienda: "HEB San Pedro", cluster: "AA", ciudad: "Monterrey", monto: 14044, uds: 608 },
  { pos: 2, tienda: "HEB Chipinque", cluster: "AA", ciudad: "Monterrey", monto: 12463, uds: 497 },
  { pos: 3, tienda: "HEB Valle Oriente", cluster: "AA", ciudad: "Monterrey", monto: 12091, uds: 435 },
  { pos: 4, tienda: "HEB Contry", cluster: "A", ciudad: "Monterrey", monto: 10602, uds: 419 },
  { pos: 5, tienda: "HEB Valle Alto", cluster: "AA Light", ciudad: "Monterrey", monto: 9410, uds: 382 },
  { pos: 6, tienda: "HEB El Uro", cluster: "AA Light", ciudad: "Monterrey", monto: 8582, uds: 381 },
  { pos: 7, tienda: "HEB Tec", cluster: "A", ciudad: "Monterrey", monto: 8184, uds: 311 },
  { pos: 8, tienda: "HEB Cerro Gordo", cluster: "AA Light", ciudad: "Leon", monto: 7541, uds: 313 },
  { pos: 9, tienda: "HEB Cumbres", cluster: "AA Light", ciudad: "Monterrey", monto: 7034, uds: 272 },
  { pos: 10, tienda: "HEB San Nicolas", cluster: "A", ciudad: "Monterrey", monto: 6993, uds: 264 },
  { pos: 11, tienda: "HEB Bosques Lomas", cluster: "A", ciudad: "Monterrey", monto: 6123, uds: 240 },
  { pos: 12, tienda: "HEB Puerta de Hierro", cluster: "A", ciudad: "Monterrey", monto: 5839, uds: 230 },
  { pos: 13, tienda: "HEB Concordia", cluster: "B", ciudad: "Monterrey", monto: 5493, uds: 213 },
  { pos: 14, tienda: "HEB Sendero", cluster: "B", ciudad: "Monterrey", monto: 5189, uds: 198 },
  { pos: 15, tienda: "HEB Linda Vista", cluster: "B", ciudad: "Monterrey", monto: 4965, uds: 176 },
  { pos: 16, tienda: "HEB San Patricio", cluster: "AA Light", ciudad: "Saltillo", monto: 4950, uds: 197 },
  { pos: 17, tienda: "HEB Guadalupe Livas", cluster: "C", ciudad: "Monterrey", monto: 4762, uds: 170 },
  { pos: 18, tienda: "HEB Santa Catarina", cluster: "B", ciudad: "Monterrey", monto: 4392, uds: 172 },
  { pos: 19, tienda: "HEB Los Morales", cluster: "B", ciudad: "Monterrey", monto: 4363, uds: 167 },
  { pos: 20, tienda: "HEB SLP Lomas", cluster: "AA Light", ciudad: "San Luis Potosi", monto: 4288, uds: 130 },
];

const maxMonto = topTiendas[0].monto;

function clusterBadge(cluster: string) {
  const colors: Record<string, string> = {
    "AA": "bg-orange-600 text-white",
    "AA Light": "bg-orange-400 text-white",
    "A": "bg-orange-200 text-orange-800",
    "B": "bg-amber-100 text-amber-800",
    "C": "bg-gray-200 text-gray-700",
  };
  return (
    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${colors[cluster] || "bg-gray-100 text-gray-600"}`}>
      {cluster}
    </span>
  );
}

export default function Slide6VentaTienda() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-orange-50 to-orange-100 p-8 flex flex-col">
      <div className="flex items-center gap-3 mb-3">
        <Image src="/4buddies-logo.jpeg" alt="4B" width={36} height={36} className="rounded-lg" />
        <div>
          <h2 className="text-xl font-bold text-orange-900">Venta por Tienda — Top 20</h2>
          <p className="text-xs text-orange-600">
            P04-2026 (26 Ene &ndash; 22 Feb 2026) &middot; 62 tiendas operativas
          </p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-orange-200 p-4 overflow-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b-2 border-orange-200">
              <th className="text-center py-1.5 text-orange-800 font-semibold w-8">#</th>
              <th className="text-left py-1.5 text-orange-800 font-semibold">Tienda</th>
              <th className="text-center py-1.5 text-orange-800 font-semibold">Cluster</th>
              <th className="text-left py-1.5 text-orange-800 font-semibold">Ciudad</th>
              <th className="text-right py-1.5 text-orange-800 font-semibold">Monto</th>
              <th className="text-right py-1.5 text-orange-800 font-semibold">Uds</th>
              <th className="text-left py-1.5 text-orange-800 font-semibold pl-3 w-36"></th>
            </tr>
          </thead>
          <tbody>
            {topTiendas.map((t) => {
              const barW = (t.monto / maxMonto) * 100;
              return (
                <tr key={t.pos} className={`border-b border-orange-50 ${t.pos <= 3 ? "bg-orange-50/50" : ""}`}>
                  <td className="py-1.5 text-center">
                    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                      t.pos <= 3 ? "bg-orange-600 text-white" : "text-orange-600"
                    }`}>
                      {t.pos}
                    </span>
                  </td>
                  <td className="py-1.5 text-orange-900 font-medium">{t.tienda}</td>
                  <td className="py-1.5 text-center">{clusterBadge(t.cluster)}</td>
                  <td className="py-1.5 text-orange-600">{t.ciudad}</td>
                  <td className="py-1.5 text-right text-orange-900 font-semibold">${(t.monto / 1000).toFixed(1)}K</td>
                  <td className="py-1.5 text-right text-orange-600">{t.uds}</td>
                  <td className="py-1.5 pl-3">
                    <div className="w-full h-2 bg-orange-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
                        style={{ width: `${barW}%` }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
