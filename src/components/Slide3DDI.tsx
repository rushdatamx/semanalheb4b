"use client";

const productos = [
  { nombre: "Chicharron Natural", inv: 1118, ddi: 36, semInv: 3.6, vtaSem: 308, status: "Vigilar" },
  { nombre: "Street Elote 25g", inv: 995, ddi: 54, semInv: 3.8, vtaSem: 265, status: "Vigilar" },
  { nombre: "Cheddar Jalapeno 25g", inv: 801, ddi: 44, semInv: 4.2, vtaSem: 191, status: "Vigilar" },
  { nombre: "Classic White 25g", inv: 768, ddi: 56, semInv: 4.7, vtaSem: 164, status: "Vigilar" },
  { nombre: "Rodajitas Spicy Limon", inv: 1901, ddi: 92, semInv: 5.1, vtaSem: 373, status: "OK" },
  { nombre: "Classic White 125g", inv: 2336, ddi: 93, semInv: 6.0, vtaSem: 388, status: "OK" },
  { nombre: "Street Elote 125g", inv: 2205, ddi: 96, semInv: 6.9, vtaSem: 319, status: "OK" },
  { nombre: "Cheddar Jalapeno 125g", inv: 2045, ddi: 99, semInv: 9.7, vtaSem: 212, status: "OK" },
  { nombre: "Chile Piquin", inv: 1527, ddi: 180, semInv: 10.6, vtaSem: 144, status: "OK" },
  { nombre: "Spicy Chia", inv: 0, ddi: 0, semInv: 0, vtaSem: 0, status: "Sin cobertura" },
  { nombre: "Classic Sweet", inv: 0, ddi: 0, semInv: 0, vtaSem: 0, status: "Sin cobertura" },
];

function statusBadge(status: string) {
  if (status === "Vigilar")
    return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">{status}</span>;
  if (status === "Sin cobertura")
    return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30">{status}</span>;
  return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">{status}</span>;
}

function semInvBar(val: number) {
  const maxW = 10.6;
  const pct = Math.min((val / maxW) * 100, 100);
  const color = val < 4 ? "bg-yellow-500" : val < 6 ? "bg-blue-500" : "bg-green-500";
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-400 w-8">{val > 0 ? val.toFixed(1) : "-"}</span>
    </div>
  );
}

export default function Slide3DDI() {
  return (
    <div className="w-full h-full bg-gray-900 p-10 flex flex-col">
      <h2 className="text-2xl font-bold text-white mb-1">Inventario y Dias de Inventario (DDI)</h2>
      <p className="text-sm text-gray-400 mb-4">
        Al 2 de marzo 2026 &middot; 4 SKUs con &lt; 5 semanas de inventario &middot; 5 quiebres puntuales
      </p>

      <div className="flex-1 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left py-2 text-gray-400 font-medium">Producto</th>
              <th className="text-right py-2 text-gray-400 font-medium">Inventario</th>
              <th className="text-right py-2 text-gray-400 font-medium">DDI</th>
              <th className="text-right py-2 text-gray-400 font-medium">Vta/Sem</th>
              <th className="text-center py-2 text-gray-400 font-medium">Sem. Inv.</th>
              <th className="text-center py-2 text-gray-400 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.nombre} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                <td className="py-2 text-white font-medium">{p.nombre}</td>
                <td className="py-2 text-right text-gray-300">{p.inv > 0 ? p.inv.toLocaleString() : "-"}</td>
                <td className="py-2 text-right">
                  <span className={p.ddi < 50 && p.ddi > 0 ? "text-yellow-400" : p.ddi === 0 ? "text-red-400" : "text-green-400"}>
                    {p.ddi > 0 ? `${p.ddi}d` : "-"}
                  </span>
                </td>
                <td className="py-2 text-right text-gray-300">{p.vtaSem > 0 ? p.vtaSem.toLocaleString() : "-"}</td>
                <td className="py-2">{semInvBar(p.semInv)}</td>
                <td className="py-2 text-center">{statusBadge(p.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex gap-4 text-xs text-gray-500">
        <span>Inventario total: 13,696 uds</span>
        <span>&middot;</span>
        <span>DDI promedio: 84 dias</span>
        <span>&middot;</span>
        <span>62 tiendas operativas (excluye CEDIS)</span>
      </div>
    </div>
  );
}
