"use client";

import { Package, AlertTriangle, Store } from "lucide-react";

export default function Slide1Portada() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-900 to-blue-950 flex flex-col items-center justify-center p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 text-center space-y-6">
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <span className="text-blue-400 font-bold text-lg">4BUDDIES</span>
          </div>
          <span className="text-gray-500 text-2xl">&times;</span>
          <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
            <span className="text-red-400 font-bold text-lg">HEB</span>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-white tracking-tight">
          Reporte Semanal
        </h1>
        <p className="text-xl text-gray-400">
          Periodo Fiscal P04-2026 (completo) &middot; P05-2026 (en curso)
        </p>
        <p className="text-sm text-gray-500">
          Datos de sell-out e inventario al 2 de marzo 2026
        </p>

        <div className="flex items-center justify-center gap-6 mt-8">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <Package className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-300 text-sm font-medium">
              4 SKUs &lt; 5 sem inventario
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-red-300 text-sm font-medium">
              2 SKUs sin cobertura
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 bg-green-500/10 border border-green-500/20 rounded-lg">
            <Store className="w-4 h-4 text-green-400" />
            <span className="text-green-300 text-sm font-medium">
              62 tiendas activas
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 text-xs text-gray-600">
        Preparado por Mario Pena &middot; KAM 4BUDDIES &middot; 3 de marzo 2026
      </div>
    </div>
  );
}
