"use client";

import Image from "next/image";
import { Package, AlertTriangle, Store } from "lucide-react";

export default function Slide1Portada() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-500 flex flex-col items-center justify-center p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl" />

      <div className="relative z-10 text-center space-y-6">
        <Image
          src="/4buddies-logo.jpeg"
          alt="4BUDDIES"
          width={140}
          height={140}
          className="mx-auto rounded-2xl shadow-lg"
        />

        <h1 className="text-5xl font-extrabold text-white tracking-tight drop-shadow-lg">
          Reporte Semanal
        </h1>
        <div className="flex items-center justify-center gap-3">
          <span className="text-2xl font-bold text-white/90">4BUDDIES</span>
          <span className="text-white/50 text-2xl">&times;</span>
          <span className="text-2xl font-bold text-white/90">HEB</span>
        </div>
        <p className="text-lg text-white/80">
          P05-2026 (23 Feb &ndash; 22 Mar) &middot; Periodo en curso
        </p>
        <p className="text-sm text-white/60">
          Datos de sell-out e inventario al 9 de marzo 2026
        </p>

        <div className="flex items-center justify-center gap-4 mt-8">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white/15 backdrop-blur rounded-lg border border-white/20">
            <Package className="w-4 h-4 text-yellow-200" />
            <span className="text-white text-sm font-medium">112 alertas de restock</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white/15 backdrop-blur rounded-lg border border-white/20">
            <AlertTriangle className="w-4 h-4 text-yellow-200" />
            <span className="text-white text-sm font-medium">20 problemas de anaquel</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white/15 backdrop-blur rounded-lg border border-white/20">
            <Store className="w-4 h-4 text-yellow-200" />
            <span className="text-white text-sm font-medium">62 tiendas activas</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 text-xs text-white/40">
        Preparado por Mario Pena &middot; KAM 4BUDDIES &middot; 10 de marzo 2026
      </div>
    </div>
  );
}
