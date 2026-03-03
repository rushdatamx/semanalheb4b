"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Slide1Portada from "@/components/Slide1Portada";
import Slide2KPIs from "@/components/Slide2KPIs";
import Slide3DDI from "@/components/Slide3DDI";
import Slide4OC from "@/components/Slide4OC";
import Slide5VentaProducto from "@/components/Slide5VentaProducto";
import Slide6VentaTienda from "@/components/Slide6VentaTienda";
import Slide7Recomendaciones from "@/components/Slide7Recomendaciones";

const slides = [
  Slide1Portada,
  Slide2KPIs,
  Slide3DDI,
  Slide4OC,
  Slide5VentaProducto,
  Slide6VentaTienda,
  Slide7Recomendaciones,
];

export default function Home() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(slides.length - 1, c + 1));

  const SlideComponent = slides[current];

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-950 p-4">
      <div className="relative w-full max-w-[1280px] aspect-video">
        <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
          <SlideComponent />
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <button
            onClick={prev}
            disabled={current === 0}
            className="p-2 rounded-full bg-gray-800/80 hover:bg-gray-700 disabled:opacity-30 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === current ? "bg-blue-400 w-6" : "bg-gray-600 hover:bg-gray-500"
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            disabled={current === slides.length - 1}
            className="p-2 rounded-full bg-gray-800/80 hover:bg-gray-700 disabled:opacity-30 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute top-4 right-6 text-xs text-gray-500">
          {current + 1} / {slides.length}
        </div>
      </div>
    </main>
  );
}
