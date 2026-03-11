"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Camera, Loader2 } from "lucide-react";
import Slide1Portada from "@/components/Slide1Portada";
import Slide2KPIs from "@/components/Slide2KPIs";
import Slide3Alertas from "@/components/Slide3Alertas";
import Slide4OC from "@/components/Slide4OC";
import Slide5VentaProducto from "@/components/Slide5VentaProducto";
import Slide6VentaTienda from "@/components/Slide6VentaTienda";
import Slide7Recomendaciones from "@/components/Slide7Recomendaciones";

const slideComponents = [
  Slide1Portada,
  Slide2KPIs,
  Slide3Alertas,
  Slide4OC,
  Slide5VentaProducto,
  Slide6VentaTienda,
  Slide7Recomendaciones,
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [exporting, setExporting] = useState(false);
  const slideRef = useRef<HTMLDivElement>(null);

  const prev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), []);
  const next = useCallback(() => setCurrent((c) => Math.min(slideComponents.length - 1, c + 1)), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  const handleScreenshot = useCallback(async () => {
    if (!slideRef.current) return;
    setExporting(true);
    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const canvas = await html2canvas(slideRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });
      const link = document.createElement("a");
      link.download = `slide_${current + 1}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(false);
    }
  }, [current]);

  const SlideComponent = slideComponents[current];

  return (
    <main className="flex min-h-screen items-center justify-center bg-orange-950 p-4">
      <div className="relative w-full max-w-[1280px] aspect-video">
        <div ref={slideRef} className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-orange-800/30">
          <SlideComponent />
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <button
            onClick={prev}
            disabled={current === 0}
            className="p-2 rounded-full bg-orange-900/80 hover:bg-orange-800 disabled:opacity-30 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-orange-200" />
          </button>

          <div className="flex gap-1.5">
            {slideComponents.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${
                  i === current ? "bg-orange-400 w-6" : "bg-orange-700 hover:bg-orange-600 w-2"
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            disabled={current === slideComponents.length - 1}
            className="p-2 rounded-full bg-orange-900/80 hover:bg-orange-800 disabled:opacity-30 transition-all"
          >
            <ChevronRight className="w-5 h-5 text-orange-200" />
          </button>
        </div>

        <div className="absolute top-4 right-6 flex items-center gap-3">
          <button
            onClick={handleScreenshot}
            disabled={exporting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-900/80 hover:bg-orange-800 disabled:opacity-60 transition-all text-orange-200 text-xs font-medium"
          >
            {exporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Capturando...
              </>
            ) : (
              <>
                <Camera className="w-3.5 h-3.5" />
                Screenshot
              </>
            )}
          </button>
          <span className="text-xs text-orange-400/60">
            {current + 1} / {slideComponents.length}
          </span>
        </div>
      </div>
    </main>
  );
}
