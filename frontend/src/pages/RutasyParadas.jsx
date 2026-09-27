import React, { useMemo, useState } from "react";
import {
  Save,
  Edit,
  Trash2,
  MapPinned,
  Route as RouteIcon,
  Search,
  Plus,
  X,
} from "lucide-react";

const RutasView = () => {
  const [activeTab, setActiveTab] = useState("rutas");

  // =========================
  // RUTAS (DATA + FORM)
  // =========================
  const [rutas, setRutas] = useState([
    { id: crypto.randomUUID(), inicio: "Lima", fin: "Huanuco", activo: true },
    { id: crypto.randomUUID(), inicio: "Huanuco", fin: "Lima", activo: true },
    { id: crypto.randomUUID(), inicio: "Lima", fin: "Huanuco", activo: true },
    { id: crypto.randomUUID(), inicio: "Lima", fin: "Huanuco", activo: true },
    { id: crypto.randomUUID(), inicio: "Tingo Maria", fin: "Lima", activo: true },
  ]);

  const ciudades = ["Lima", "Huanuco", "Tingo Maria", "Trujillo", "Arequipa"];

  const [rutaForm, setRutaForm] = useState({ inicio: "", fin: "" });
  const [rutaEditingId, setRutaEditingId] = useState(null);

  const [rutaQuery, setRutaQuery] = useState("");
  const [rutaPageSize, setRutaPageSize] = useState(10);

  const rutasFiltradas = useMemo(() => {
    const q = rutaQuery.trim().toLowerCase();
    if (!q) return rutas;
    return rutas.filter((r) =>
      `${r.inicio} ${r.fin}`.toLowerCase().includes(q)
    );
  }, [rutas, rutaQuery]);

  const toggleRutaEstado = (id) => {
    setRutas((prev) =>
      prev.map((r) => (r.id === id ? { ...r, activo: !r.activo } : r))
    );
  };

  const resetRutaForm = () => {
    setRutaForm({ inicio: "", fin: "" });
    setRutaEditingId(null);
  };

  const onGuardarRuta = () => {
    if (!rutaForm.inicio || !rutaForm.fin) {
      alert("Selecciona Inicio de Ruta y Fin de Ruta.");
      return;
    }
    if (rutaForm.inicio === rutaForm.fin) {
      alert("Inicio y Fin no pueden ser iguales.");
      return;
    }

    if (rutaEditingId) {
      setRutas((prev) =>
        prev.map((r) =>
          r.id === rutaEditingId ? { ...r, ...rutaForm } : r
        )
      );
      alert("Ruta actualizada ✅");
      resetRutaForm();
      return;
    }

    setRutas((prev) => [
      { id: crypto.randomUUID(), ...rutaForm, activo: true },
      ...prev,
    ]);
    alert("Ruta guardada ✅");
    resetRutaForm();
  };

  const onEditarRuta = (row) => {
    setRutaEditingId(row.id);
    setRutaForm({ inicio: row.inicio, fin: row.fin });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onEliminarRuta = (id) => {
    const ok = confirm("¿Seguro que deseas eliminar esta ruta?");
    if (!ok) return;
    setRutas((prev) => prev.filter((r) => r.id !== id));
  };

  // =========================
  // PARADAS (DATA + FORM)
  // =========================
  const [paradas, setParadas] = useState([
    {
      id: crypto.randomUUID(),
      ruta: "Lima → Huanuco",
      parada: "Chosica",
      orden: 1,
      activo: true,
    },
    {
      id: crypto.randomUUID(),
      ruta: "Lima → Huanuco",
      parada: "La Oroya",
      orden: 2,
      activo: true,
    },
    {
      id: crypto.randomUUID(),
      ruta: "Tingo Maria → Lima",
      parada: "Huánuco",
      orden: 1,
      activo: true,
    },
  ]);

  const rutasOptions = useMemo(() => {
    // convertimos rutas a "Inicio → Fin"
    const list = rutas.map((r) => `${r.inicio} → ${r.fin}`);
    // sin duplicados
    return Array.from(new Set(list));
  }, [rutas]);

  const [paradaForm, setParadaForm] = useState({ ruta: "", parada: "", orden: "" });
  const [paradaEditingId, setParadaEditingId] = useState(null);

  const [paradaQuery, setParadaQuery] = useState("");
  const [paradaPageSize, setParadaPageSize] = useState(10);

  const paradasFiltradas = useMemo(() => {
    const q = paradaQuery.trim().toLowerCase();
    if (!q) return paradas;
    return paradas.filter((p) =>
      `${p.ruta} ${p.parada} ${p.orden}`.toLowerCase().includes(q)
    );
  }, [paradas, paradaQuery]);

  const toggleParadaEstado = (id) => {
    setParadas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, activo: !p.activo } : p))
    );
  };

  const resetParadaForm = () => {
    setParadaForm({ ruta: "", parada: "", orden: "" });
    setParadaEditingId(null);
  };

  const onGuardarParada = () => {
    if (!paradaForm.ruta || !paradaForm.parada || !paradaForm.orden) {
      alert("Completa Ruta, Parada y Orden.");
      return;
    }
    const ordenNum = Number(paradaForm.orden);
    if (!Number.isFinite(ordenNum) || ordenNum <= 0) {
      alert("Orden debe ser un número mayor a 0.");
      return;
    }

    if (paradaEditingId) {
      setParadas((prev) =>
        prev.map((p) =>
          p.id === paradaEditingId
            ? { ...p, ruta: paradaForm.ruta, parada: paradaForm.parada, orden: ordenNum }
            : p
        )
      );
      alert("Parada actualizada ✅");
      resetParadaForm();
      return;
    }

    setParadas((prev) => [
      {
        id: crypto.randomUUID(),
        ruta: paradaForm.ruta,
        parada: paradaForm.parada,
        orden: ordenNum,
        activo: true,
      },
      ...prev,
    ]);
    alert("Parada guardada ✅");
    resetParadaForm();
  };

  const onEditarParada = (row) => {
    setParadaEditingId(row.id);
    setParadaForm({ ruta: row.ruta, parada: row.parada, orden: String(row.orden) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onEliminarParada = (id) => {
    const ok = confirm("¿Seguro que deseas eliminar esta parada?");
    if (!ok) return;
    setParadas((prev) => prev.filter((p) => p.id !== id));
  };

  // =========================
  // UI helpers
  // =========================
  const inputBase =
    "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";
  const labelBase = "text-xs font-semibold text-slate-700";

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <div className="w-full px-6 py-8">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              {activeTab === "rutas" ? (
                <RouteIcon className="h-5 w-5" />
              ) : (
                <MapPinned className="h-5 w-5" />
              )}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                {activeTab === "rutas" ? "Registrar Rutas" : "Registrar Paradas"}
              </h1>
              <p className="text-sm text-slate-600">
                {activeTab === "rutas"
                  ? "Crea, edita y administra rutas."
                  : "Crea, edita y administra paradas por ruta."}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex">
            <button
              type="button"
              onClick={() => setActiveTab("rutas")}
              className={[
                "flex-1 px-4 py-3 text-sm font-semibold border-b-2 transition",
                activeTab === "rutas"
                  ? "border-indigo-600 text-indigo-700 bg-indigo-50"
                  : "border-transparent text-slate-600 hover:bg-slate-50",
              ].join(" ")}
            >
              Registrar Rutas
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("paradas")}
              className={[
                "flex-1 px-4 py-3 text-sm font-semibold border-b-2 transition",
                activeTab === "paradas"
                  ? "border-indigo-600 text-indigo-700 bg-indigo-50"
                  : "border-transparent text-slate-600 hover:bg-slate-50",
              ].join(" ")}
            >
              Registrar Paradas
            </button>
          </div>
        </div>

        {/* ========================= RUTAS ========================= */}
        {activeTab === "rutas" && (
          <>
            {/* Card Form Rutas */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-5 py-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-base">Formulario de Ruta</div>
                  <div className="text-xs text-white/80">
                    Selecciona origen y destino
                  </div>
                </div>

                {rutaEditingId ? (
                  <button
                    type="button"
                    onClick={resetRutaForm}
                    className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/20"
                    title="Cancelar edición"
                  >
                    <X className="h-4 w-4" />
                    Cancelar
                  </button>
                ) : null}
              </div>

              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className={labelBase}>Inicio de Ruta</label>
                    <select
                      className={inputBase}
                      value={rutaForm.inicio}
                      onChange={(e) =>
                        setRutaForm((p) => ({ ...p, inicio: e.target.value }))
                      }
                    >
                      <option value="">Selecciona una opción</option>
                      {ciudades.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className={labelBase}>Fin de Ruta</label>
                    <select
                      className={inputBase}
                      value={rutaForm.fin}
                      onChange={(e) =>
                        setRutaForm((p) => ({ ...p, fin: e.target.value }))
                      }
                    >
                      <option value="">Selecciona una opción</option>
                      {ciudades.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={onGuardarRuta}
                      className="h-11 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 active:bg-indigo-800"
                    >
                      {rutaEditingId ? (
                        <>
                          <Edit className="h-4 w-4" /> Actualizar
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" /> Guardar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls Rutas */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="relative w-full lg:max-w-md">
                  <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={rutaQuery}
                    onChange={(e) => setRutaQuery(e.target.value)}
                    placeholder="Buscar por inicio o fin..."
                    className={["pl-10", inputBase].join(" ")}
                  />
                </div>

                <div className="flex items-center gap-2 justify-end">
                  <span className="text-sm font-semibold text-slate-700">Lista:</span>
                  <select
                    value={rutaPageSize}
                    onChange={(e) => setRutaPageSize(Number(e.target.value))}
                    className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tabla Rutas */}
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-[900px] w-full text-sm">
                  <thead className="sticky top-0 z-10 bg-slate-900 text-white">
                    <tr className="text-left">
                      {["Inicio de Ruta", "Fin de Ruta", "Estado", "Acciones"].map((h) => (
                        <th key={h} className="px-4 py-3 font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200">
                    {rutasFiltradas.slice(0, rutaPageSize).map((ruta) => (
                      <tr key={ruta.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-900 font-medium">
                          {ruta.inicio}
                        </td>
                        <td className="px-4 py-3 text-slate-700">{ruta.fin}</td>

                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => toggleRutaEstado(ruta.id)}
                            className={[
                              "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border",
                              ruta.activo
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-rose-50 text-rose-700 border-rose-200",
                            ].join(" ")}
                            title="Cambiar estado"
                          >
                            <span
                              className={[
                                "h-2 w-2 rounded-full",
                                ruta.activo ? "bg-emerald-600" : "bg-rose-600",
                              ].join(" ")}
                            />
                            {ruta.activo ? "Activo" : "Inactivo"}
                          </button>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => onEditarRuta(ruta)}
                              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                              Editar
                            </button>

                            <button
                              type="button"
                              onClick={() => onEliminarRuta(ruta.id)}
                              className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 shadow-sm hover:bg-rose-100"
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {rutasFiltradas.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-10 text-center text-slate-500"
                        >
                          No se encontraron rutas.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-3 text-xs text-slate-500">
                <span>
                  Mostrando {Math.min(rutaPageSize, rutasFiltradas.length)} de{" "}
                  {rutasFiltradas.length} rutas
                </span>
                <span className="font-semibold text-slate-700">Mikervip</span>
              </div>
            </div>
          </>
        )}

        {/* ========================= PARADAS ========================= */}
        {activeTab === "paradas" && (
          <>
            {/* Card Form Paradas */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-5 py-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-base">Formulario de Paradas</div>
                  <div className="text-xs text-white/80">
                    Registra paradas asociadas a una ruta
                  </div>
                </div>

                {paradaEditingId ? (
                  <button
                    type="button"
                    onClick={resetParadaForm}
                    className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/20"
                    title="Cancelar edición"
                  >
                    <X className="h-4 w-4" />
                    Cancelar
                  </button>
                ) : null}
              </div>

              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className={labelBase}>Ruta</label>
                    <select
                      className={inputBase}
                      value={paradaForm.ruta}
                      onChange={(e) =>
                        setParadaForm((p) => ({ ...p, ruta: e.target.value }))
                      }
                    >
                      <option value="">Selecciona una ruta</option>
                      {rutasOptions.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-slate-500">
                      Tip: primero crea rutas en la pestaña “Registrar Rutas”.
                    </p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className={labelBase}>Parada</label>
                    <input
                      className={inputBase}
                      placeholder="Ej: Chosica"
                      value={paradaForm.parada}
                      onChange={(e) =>
                        setParadaForm((p) => ({ ...p, parada: e.target.value }))
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className={labelBase}>Orden</label>
                    <input
                      type="number"
                      min={1}
                      className={inputBase}
                      placeholder="1"
                      value={paradaForm.orden}
                      onChange={(e) =>
                        setParadaForm((p) => ({ ...p, orden: e.target.value }))
                      }
                    />
                  </div>

                  <div className="md:col-span-4 flex justify-end">
                    <button
                      type="button"
                      onClick={onGuardarParada}
                      className="h-11 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 active:bg-indigo-800"
                    >
                      {paradaEditingId ? (
                        <>
                          <Edit className="h-4 w-4" /> Actualizar
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" /> Guardar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls Paradas */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="relative w-full lg:max-w-md">
                  <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={paradaQuery}
                    onChange={(e) => setParadaQuery(e.target.value)}
                    placeholder="Buscar por ruta, parada u orden..."
                    className={["pl-10", inputBase].join(" ")}
                  />
                </div>

                <div className="flex items-center gap-2 justify-end">
                  <span className="text-sm font-semibold text-slate-700">Lista:</span>
                  <select
                    value={paradaPageSize}
                    onChange={(e) => setParadaPageSize(Number(e.target.value))}
                    className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tabla Paradas */}
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-[1000px] w-full text-sm">
                  <thead className="sticky top-0 z-10 bg-slate-900 text-white">
                    <tr className="text-left">
                      {["Ruta", "Parada", "Orden", "Estado", "Acciones"].map((h) => (
                        <th key={h} className="px-4 py-3 font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200">
                    {paradasFiltradas.slice(0, paradaPageSize).map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-900 font-medium">{p.ruta}</td>
                        <td className="px-4 py-3 text-slate-700">{p.parada}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                            {p.orden}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => toggleParadaEstado(p.id)}
                            className={[
                              "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border",
                              p.activo
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-rose-50 text-rose-700 border-rose-200",
                            ].join(" ")}
                            title="Cambiar estado"
                          >
                            <span
                              className={[
                                "h-2 w-2 rounded-full",
                                p.activo ? "bg-emerald-600" : "bg-rose-600",
                              ].join(" ")}
                            />
                            {p.activo ? "Activo" : "Inactivo"}
                          </button>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => onEditarParada(p)}
                              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                              Editar
                            </button>

                            <button
                              type="button"
                              onClick={() => onEliminarParada(p.id)}
                              className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 shadow-sm hover:bg-rose-100"
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {paradasFiltradas.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-10 text-center text-slate-500"
                        >
                          No se encontraron paradas.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-3 text-xs text-slate-500">
                <span>
                  Mostrando {Math.min(paradaPageSize, paradasFiltradas.length)} de{" "}
                  {paradasFiltradas.length} paradas
                </span>
                <span className="font-semibold text-slate-700">Mikervip</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RutasView;