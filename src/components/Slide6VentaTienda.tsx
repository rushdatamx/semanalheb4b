"use client";

import Image from "next/image";

const topTiendas = [
  { pos: 1, tienda: "HEB Valle Oriente", cluster: "AA", ciudad: "Monterrey", monto: 8148, uds: 331 },
  { pos: 2, tienda: "HEB Chipinque", cluster: "AA", ciudad: "Monterrey", monto: 7720, uds: 334 },
  { pos: 3, tienda: "HEB San Pedro", cluster: "AA", ciudad: "Monterrey", monto: 6924, uds: 316 },
  { pos: 4, tienda: "HEB Contry", cluster: "A", ciudad: "Monterrey", monto: 5936, uds: 260 },
  { pos: 5, tienda: "HEB San Nicolas", cluster: "A", ciudad: "Monterrey", monto: 5092, uds: 204 },
  { pos: 6, tienda: "HEB Tec", cluster: "A", ciudad: "Monterrey", monto: 4973, uds: 229 },
  { pos: 7, tienda: "HEB Valle Alto", cluster: "AA Light", ciudad: "Monterrey", monto: 4959, uds: 215 },
  { pos: 8, tienda: "HEB Puerta de Hierro", cluster: "A", ciudad: "Monterrey", monto: 4451, uds: 181 },
  { pos: 9, tienda: "HEB El Uro", cluster: "AA Light", ciudad: "Monterrey", monto: 4171, uds: 192 },
  { pos: 10, tienda: "HEB Cerro Gordo", cluster: "AA Light", ciudad: "Leon", monto: 3995, uds: 190 },
  { pos: 11, tienda: "HEB Cumbres", cluster: "AA Light", ciudad: "Monterrey", monto: 3545, uds: 152 },
  { pos: 12, tienda: "HEB Los Morales", cluster: "B", ciudad: "Monterrey", monto: 3419, uds: 144 },
  { pos: 13, tienda: "HEB Bosques Lomas", cluster: "A", ciudad: "Monterrey", monto: 3213, uds: 145 },
  { pos: 14, tienda: "HEB San Patricio", cluster: "AA Light", ciudad: "Saltillo", monto: 3026, uds: 121 },
  { pos: 15, tienda: "HEB Santa Catarina", cluster: "B", ciudad: "Monterrey", monto: 3024, uds: 116 },
  { pos: 16, tienda: "HEB Concordia", cluster: "B", ciudad: "Monterrey", monto: 2923, uds: 122 },
  { pos: 17, tienda: "HEB Sendero", cluster: "B", ciudad: "Monterrey", monto: 2795, uds: 121 },
  { pos: 18, tienda: "HEB Juriquilla", cluster: "AA Light", ciudad: "Queretaro", monto: 2639, uds: 96 },
  { pos: 19, tienda: "HEB Linda Vista", cluster: "B", ciudad: "Monterrey", monto: 2490, uds: 93 },
  { pos: 20, tienda: "HEB Chapultepec", cluster: "C", ciudad: "Monterrey", monto: 2263, uds: 94 },
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
            P05-2026 (23 Feb &ndash; 9 Mar 2026, parcial) &middot; 62 tiendas operativas
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
