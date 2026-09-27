import React, { useMemo, useState } from "react";
import { Save, Edit, Trash2, Search, BusFront, User, Users } from "lucide-react";

const AsignarBuses = () => {
  const [busSeleccionado, setBusSeleccionado] = useState("");
  const [choferSeleccionado, setChoferSeleccionado] = useState("");
  const [copilotoSeleccionado, setCopilotoSeleccionado] = useState("");

  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);

  // ✅ Ejemplo de opciones (reemplaza por tus datos reales)
  const buses = [
    { id: "A1C-221", label: "A1C-221 — 45 pasajeros" },
    { id: "C8H-903", label: "C8H-903 — 35 pasajeros" },
  ];

  const choferes = [
    { id: "c1", label: "Javier Raul Ordoñez Salgado" },
    { id: "c2", label: "Carlos Huamán Pérez" },
  ];

  const copilotos = [
    { id: "p1", label: "Luis Alfonso Garcia Perez" },
    { id: "p2", label: "José Ramírez Soto" },
  ];

  const [data, setData] = useState([
    {
      id: 1,
      chofer: "Javier Raul Ordoñez Salgado",
      copiloto: "Luis Alfonso Garcia Perez",
      placa: "A1C-221",
      pasajeros: 45,
      estado: true,
    },
    {
      id: 2,
      chofer: "Javier Raul Ordoñez Salgado",
      copiloto: "Luis Alfonso Garcia Perez",
      placa: "A1C-221",
      pasajeros: 45,
      estado: true,
    },
    {
      id: 3,
      chofer: "Javier Raul Ordoñez Salgado",
      copiloto: "Luis Alfonso Garcia Perez",
      placa: "A1C-221",
      pasajeros: 45,
      estado: true,
    },
    {
      id: 4,
      chofer: "Javier Raul Ordoñez Salgado",
      copiloto: "Luis Alfonso Garcia Perez",
      placa: "A1C-221",
      pasajeros: 45,
      estado: true,
    },
    {
      id: 5,
      chofer: "Javier Raul Ordoñez Salgado",
      copiloto: "Luis Alfonso Garcia Perez",
      placa: "A1C-221",
      pasajeros: 45,
      estado: true,
    },
  ]);

  const toggleEstado = (id) => {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, estado: !item.estado } : item))
    );
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter((x) => {
      const s = `${x.chofer} ${x.copiloto} ${x.placa} ${x.pasajeros}`.toLowerCase();
      return s.includes(q);
    });
  }, [data, query]);

  const inputBase =
    "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";
  const labelBase = "text-xs font-semibold text-slate-700";

  const onGuardar = () => {
    if (!busSeleccionado || !choferSeleccionado || !copilotoSeleccionado) {
      alert("Selecciona Bus, Chofer y Copiloto.");
      return;
    }
    alert("Asignación guardada (simulado) ✅");
  };

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <div className="w-full px-6 py-8">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <BusFront className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Asignar Buses
              </h1>
              <p className="text-sm text-slate-600">
                Asigna bus, chofer y copiloto. Administra el listado de asignaciones.
              </p>
            </div>
          </div>
        </div>

        {/* Card: Form */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-5 py-4 flex items-center justify-between">
            <div>
              <div className="font-semibold text-base">Asignación</div>
              <div className="text-xs text-white/80">
                Completa los campos y guarda la asignación
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Bus */}
              <div className="flex flex-col gap-1">
                <label className={labelBase}>
                  <span className="inline-flex items-center gap-2">
                    <BusFront className="h-4 w-4 text-slate-500" /> Bus
                  </span>
                </label>
                <select
                  value={busSeleccionado}
                  onChange={(e) => setBusSeleccionado(e.target.value)}
                  className={inputBase}
                >
                  <option value="">Selecciona una opción</option>
                  {buses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chofer */}
              <div className="flex flex-col gap-1">
                <label className={labelBase}>
                  <span className="inline-flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-500" /> Chofer
                  </span>
                </label>
                <select
                  value={choferSeleccionado}
                  onChange={(e) => setChoferSeleccionado(e.target.value)}
                  className={inputBase}
                >
                  <option value="">Selecciona una opción</option>
                  {choferes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Copiloto */}
              <div className="flex flex-col gap-1">
                <label className={labelBase}>
                  <span className="inline-flex items-center gap-2">
                    <Users className="h-4 w-4 text-slate-500" /> Copiloto
                  </span>
                </label>
                <select
                  value={copilotoSeleccionado}
                  onChange={(e) => setCopilotoSeleccionado(e.target.value)}
                  className={inputBase}
                >
                  <option value="">Selecciona una opción</option>
                  {copilotos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onGuardar}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 active:bg-indigo-800"
              >
                <Save className="h-4 w-4" />
                Guardar
              </button>
            </div>
          </div>
        </div>

        {/* List controls */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="relative w-full lg:max-w-md">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por chofer, copiloto, placa..."
                className={["pl-10", inputBase].join(" ")}
              />
            </div>

            <div className="flex items-center gap-2 justify-end">
              <span className="text-sm font-semibold text-slate-700">Lista:</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[1000px] w-full text-sm">
              <thead className="sticky top-0 z-10 bg-slate-900 text-white">
                <tr className="text-left">
                  {["Chofer", "Copiloto", "Placa", "Pasajeros", "Estado", "Acciones"].map(
                    (h) => (
                      <th key={h} className="px-4 py-3 font-semibold">
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {filtered.slice(0, pageSize).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-900 font-medium">{item.chofer}</td>
                    <td className="px-4 py-3 text-slate-700">{item.copiloto}</td>

                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                        {item.placa}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-slate-700">{item.pasajeros}</td>

                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleEstado(item.id)}
                        className={[
                          "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border",
                          item.estado
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200",
                        ].join(" ")}
                        title="Cambiar estado"
                      >
                        <span
                          className={[
                            "h-2 w-2 rounded-full",
                            item.estado ? "bg-emerald-600" : "bg-rose-600",
                          ].join(" ")}
                        />
                        {item.estado ? "Activo" : "Inactivo"}
                      </button>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                          onClick={() => alert("Editar (simulado)")}
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                          Editar
                        </button>

                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 shadow-sm hover:bg-rose-100"
                          onClick={() => alert("Eliminar (simulado)")}
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                      No se encontraron registros.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-3 text-xs text-slate-500">
            <span>
              Mostrando {Math.min(pageSize, filtered.length)} de {filtered.length} registros
            </span>
            <span className="font-semibold text-slate-700">Mikervip</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsignarBuses;