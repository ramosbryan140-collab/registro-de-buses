import React, { useEffect, useMemo, useState } from "react";
import {
  Save,
  Search,
  Pencil,
  Trash2,
  Ticket,
  Store,
  User,
  X,
} from "lucide-react";

const API_URL = "http://localhost:3000/api";

const getToken = () => {
  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token") ||
    ""
  );
};

const apiRequest = async (url, options = {}) => {
  const token = getToken();

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `Error ${response.status} al comunicarse con el servidor`
    );
  }

  return data;
};

const RegistrarSerie = () => {
  // =========================================================
  // ESTADOS
  // =========================================================

  const [series, setSeries] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [sedes, setSedes] = useState([]);

  const [form, setForm] = useState({
    vendedor_id: "",
    terminal_id: "",
    numero_serie: "",
  });

  const [busqueda, setBusqueda] = useState("");
  const [pageSize, setPageSize] = useState(5);

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [editandoId, setEditandoId] = useState(null);

  // =========================================================
  // ESTILOS
  // =========================================================

  const inputBase =
    "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

  const labelBase = "text-xs font-semibold text-slate-700";

  // =========================================================
  // CARGAR DATOS
  // =========================================================

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError("");

      const [seriesData, personalData, terminalesData] =
        await Promise.all([
          apiRequest("/series"),
          apiRequest("/personal"),
          apiRequest("/terminales"),
        ]);

      // -----------------------------------------------------
      // SERIES
      // -----------------------------------------------------

      const seriesArray = Array.isArray(seriesData)
        ? seriesData
        : Array.isArray(seriesData?.rows)
        ? seriesData.rows
        : [];

      // -----------------------------------------------------
      // PERSONAL
      // -----------------------------------------------------

      const personalArray = Array.isArray(personalData)
        ? personalData
        : Array.isArray(personalData?.rows)
        ? personalData.rows
        : [];

      // Solo vendedores
      const vendedoresArray = personalArray.filter((persona) => {
        const cargo = String(persona.cargo || "").toLowerCase();

        return (
          cargo.includes("vendedor") ||
          cargo.includes("venta")
        );
      });

      // -----------------------------------------------------
      // TERMINALES
      // -----------------------------------------------------

      const terminalesArray = Array.isArray(terminalesData)
        ? terminalesData
        : Array.isArray(terminalesData?.rows)
        ? terminalesData.rows
        : [];

      setSeries(seriesArray);
      setVendedores(vendedoresArray);
      setSedes(terminalesArray);
    } catch (err) {
      console.error("Error cargando series:", err);

      setError(
        err.message ||
          "No se pudieron cargar los datos desde el servidor."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // =========================================================
  // FUNCIONES AUXILIARES
  // =========================================================

  const obtenerNombreVendedor = (vendedorId) => {
    const vendedor = vendedores.find(
      (p) => Number(p.id) === Number(vendedorId)
    );

    if (!vendedor) {
      return `ID ${vendedorId ?? "-"}`;
    }

    const nombres = vendedor.nombres || "";

    const apellidos =
      vendedor.apellidos ||
      [
        vendedor.apellido_paterno,
        vendedor.apellido_materno,
      ]
        .filter(Boolean)
        .join(" ");

    return `${nombres} ${apellidos}`.trim();
  };

  const obtenerNombreSede = (terminalId) => {
    const terminal = sedes.find(
      (t) => Number(t.id) === Number(terminalId)
    );

    if (!terminal) {
      return `ID ${terminalId ?? "-"}`;
    }

    return terminal.sede || terminal.nombre || "-";
  };

  const normalizarEstado = (estado) => {
    if (
      estado === true ||
      estado === 1 ||
      String(estado).toLowerCase() === "activo"
    ) {
      return true;
    }

    return false;
  };

  // =========================================================
  // PREPARAR DATOS PARA LA TABLA
  // =========================================================

  const seriesParaMostrar = useMemo(() => {
    return series.map((serie) => ({
      ...serie,

      sedeNombre: obtenerNombreSede(serie.terminal_id),

      vendedorNombre: obtenerNombreVendedor(
        serie.vendedor_id
      ),

      serieNumero:
        serie.numero_serie ??
        serie.serie ??
        "",

      activo: normalizarEstado(serie.estado),
    }));
  }, [series, vendedores, sedes]);

  // =========================================================
  // BUSQUEDA
  // =========================================================

  const filtered = useMemo(() => {
    const q = busqueda.trim().toLowerCase();

    if (!q) {
      return seriesParaMostrar;
    }

    return seriesParaMostrar.filter((serie) => {
      const texto = `
        ${serie.sedeNombre}
        ${serie.vendedorNombre}
        ${serie.serieNumero}
        ${serie.id}
      `.toLowerCase();

      return texto.includes(q);
    });
  }, [seriesParaMostrar, busqueda]);

  // =========================================================
  // CAMBIAR FORMULARIO
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // LIMPIAR FORMULARIO
  // =========================================================

  const limpiarFormulario = () => {
    setForm({
      vendedor_id: "",
      terminal_id: "",
      numero_serie: "",
    });

    setEditandoId(null);
  };

  // =========================================================
  // GUARDAR / ACTUALIZAR
  // =========================================================

  const onGuardar = async () => {
    setMensaje("");
    setError("");

    if (
      !form.vendedor_id ||
      !form.terminal_id ||
      !form.numero_serie.trim()
    ) {
      setError(
        "Completa Vendedor, Sede y N° de Serie."
      );
      return;
    }

    try {
      setGuardando(true);

      const payload = {
        vendedor_id: Number(form.vendedor_id),
        terminal_id: Number(form.terminal_id),
        numero_serie: form.numero_serie.trim(),
      };

      if (editandoId) {
        // ---------------------------------------------------
        // ACTUALIZAR
        // ---------------------------------------------------

        const actualizado = await apiRequest(
          `/series/${editandoId}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          }
        );

        setSeries((prev) =>
          prev.map((serie) =>
            Number(serie.id) === Number(editandoId)
              ? actualizado
              : serie
          )
        );

        setMensaje("Serie actualizada correctamente.");
      } else {
        // ---------------------------------------------------
        // CREAR
        // ---------------------------------------------------

        const nuevaSerie = await apiRequest(
          "/series",
          {
            method: "POST",
            body: JSON.stringify(payload),
          }
        );

        setSeries((prev) => [
          nuevaSerie,
          ...prev,
        ]);

        setMensaje("Serie guardada correctamente.");
      }

      limpiarFormulario();
    } catch (err) {
      console.error("Error guardando serie:", err);

      setError(
        err.message ||
          "No se pudo guardar la serie."
      );
    } finally {
      setGuardando(false);
    }
  };

  // =========================================================
  // EDITAR
  // =========================================================

  const handleEditar = (serie) => {
    setError("");
    setMensaje("");

    setEditandoId(serie.id);

    setForm({
      vendedor_id: serie.vendedor_id
        ? String(serie.vendedor_id)
        : "",

      terminal_id: serie.terminal_id
        ? String(serie.terminal_id)
        : "",

      numero_serie:
        serie.numero_serie ??
        serie.serie ??
        "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // ELIMINAR
  // =========================================================

  const handleEliminar = async (id) => {
    const ok = window.confirm(
      "¿Seguro que deseas eliminar esta serie?"
    );

    if (!ok) {
      return;
    }

    try {
      setError("");
      setMensaje("");

      await apiRequest(`/series/${id}`, {
        method: "DELETE",
      });

      setSeries((prev) =>
        prev.filter(
          (serie) =>
            Number(serie.id) !== Number(id)
        )
      );

      if (Number(editandoId) === Number(id)) {
        limpiarFormulario();
      }

      setMensaje(
        "Serie eliminada correctamente."
      );
    } catch (err) {
      console.error("Error eliminando serie:", err);

      setError(
        err.message ||
          "No se pudo eliminar la serie."
      );
    }
  };

  // =========================================================
  // CAMBIAR ESTADO
  // =========================================================

  const toggleEstado = async (id) => {
    try {
      setError("");
      setMensaje("");

      const respuesta = await apiRequest(
        `/series/${id}/toggle`,
        {
          method: "PUT",
        }
      );

      setSeries((prev) =>
        prev.map((serie) =>
          Number(serie.id) === Number(id)
            ? {
                ...serie,
                estado: respuesta.estado,
              }
            : serie
        )
      );

      setMensaje(
        "Estado actualizado correctamente."
      );
    } catch (err) {
      console.error(
        "Error cambiando estado:",
        err
      );

      setError(
        err.message ||
          "No se pudo cambiar el estado."
      );
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <div className="w-full px-6 py-8">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">

            <div className="h-11 w-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Ticket className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Registrar Serie de Boletos
              </h1>

              <p className="text-sm text-slate-600">
                Registra series por sede y vendedor,
                y administra el listado.
              </p>
            </div>

          </div>
        </div>

        {/* =====================================================
            MENSAJES
        ====================================================== */}

        {error && (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">

            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              className="text-rose-500 hover:text-rose-700"
            >
              <X className="h-4 w-4" />
            </button>

          </div>
        )}

        {mensaje && (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">

            <span>{mensaje}</span>

            <button
              type="button"
              onClick={() => setMensaje("")}
              className="text-emerald-500 hover:text-emerald-700"
            >
              <X className="h-4 w-4" />
            </button>

          </div>
        )}

        {/* =====================================================
            FORMULARIO
        ====================================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

          <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-5 py-4">

            <div className="font-semibold text-base">
              {editandoId
                ? "Editar Serie"
                : "Formulario"}
            </div>

            <div className="text-xs text-white/80">
              {editandoId
                ? "Modifica los datos de la serie seleccionada"
                : "Completa y guarda la serie"}
            </div>

          </div>

          <div className="p-5">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* =================================================
                  VENDEDOR
              ================================================== */}

              <div className="flex flex-col gap-1">

                <label className={labelBase}>
                  <span className="inline-flex items-center gap-2">

                    <User className="h-4 w-4 text-slate-500" />

                    Vendedor

                  </span>
                </label>

                <select
                  name="vendedor_id"
                  className={inputBase}
                  value={form.vendedor_id}
                  onChange={handleChange}
                  disabled={loading || guardando}
                >

                  <option value="">
                    Selecciona una opción
                  </option>

                  {vendedores.map((vendedor) => {

                    const apellidos =
                      vendedor.apellidos ||
                      [
                        vendedor.apellido_paterno,
                        vendedor.apellido_materno,
                      ]
                        .filter(Boolean)
                        .join(" ");

                    return (
                      <option
                        key={vendedor.id}
                        value={vendedor.id}
                      >
                        {vendedor.nombres}{" "}
                        {apellidos}
                      </option>
                    );
                  })}

                </select>

                {vendedores.length === 0 &&
                  !loading && (
                    <span className="text-xs text-amber-600">
                      No hay personal con cargo de
                      vendedor registrado.
                    </span>
                  )}

              </div>

              {/* =================================================
                  SEDE
              ================================================== */}

              <div className="flex flex-col gap-1">

                <label className={labelBase}>
                  <span className="inline-flex items-center gap-2">

                    <Store className="h-4 w-4 text-slate-500" />

                    Sede

                  </span>
                </label>

                <select
                  name="terminal_id"
                  className={inputBase}
                  value={form.terminal_id}
                  onChange={handleChange}
                  disabled={loading || guardando}
                >

                  <option value="">
                    Selecciona una opción
                  </option>

                  {sedes.map((sede) => (
                    <option
                      key={sede.id}
                      value={sede.id}
                    >
                      {sede.sede}
                      {sede.distrito
                        ? ` - ${sede.distrito}`
                        : ""}
                    </option>
                  ))}

                </select>

                {sedes.length === 0 &&
                  !loading && (
                    <span className="text-xs text-amber-600">
                      No hay sedes registradas.
                    </span>
                  )}

              </div>

              {/* =================================================
                  NUMERO DE SERIE
              ================================================== */}

              <div className="flex flex-col gap-1">

                <label className={labelBase}>
                  N° de Serie
                </label>

                <input
                  type="text"
                  name="numero_serie"
                  className={inputBase}
                  placeholder="Ej: 001"
                  value={form.numero_serie}
                  onChange={handleChange}
                  disabled={guardando}
                  maxLength={50}
                />

              </div>

            </div>

            {/* =================================================
                BOTONES
            ================================================== */}

            <div className="mt-5 flex items-center justify-end gap-3">

              {editandoId && (
                <button
                  type="button"
                  onClick={limpiarFormulario}
                  disabled={guardando}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                  Cancelar
                </button>
              )}

              <button
                type="button"
                onClick={onGuardar}
                disabled={guardando || loading}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 active:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-50"
              >

                <Save className="h-4 w-4" />

                {guardando
                  ? "Guardando..."
                  : editandoId
                  ? "Actualizar"
                  : "Guardar"}

              </button>

            </div>

          </div>
        </div>

        {/* =====================================================
            CONTROLES
        ====================================================== */}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm p-4">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div className="relative w-full lg:max-w-md">

              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

              <input
                type="text"
                value={busqueda}
                onChange={(e) =>
                  setBusqueda(e.target.value)
                }
                placeholder="Buscar por sede, vendedor o serie..."
                className={[
                  "pl-10",
                  inputBase,
                ].join(" ")}
              />

            </div>

            <div className="flex items-center gap-2 justify-end">

              <span className="text-sm font-semibold text-slate-700">
                Lista:
              </span>

              <select
                value={pageSize}
                onChange={(e) =>
                  setPageSize(
                    Number(e.target.value)
                  )
                }
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              >

                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>

              </select>

            </div>

          </div>

        </div>

        {/* =====================================================
            TABLA
        ====================================================== */}

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

          {loading ? (
            <div className="px-4 py-12 text-center text-slate-500">
              Cargando series desde la base de datos...
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="min-w-[900px] w-full text-sm">

                <thead className="sticky top-0 z-10 bg-slate-900 text-white">

                  <tr className="text-left">

                    {[
                      "Sede",
                      "Vendedor",
                      "N° de Serie",
                      "Estado",
                      "Acciones",
                    ].map((h) => (

                      <th
                        key={h}
                        className="px-4 py-3 font-semibold"
                      >
                        {h}
                      </th>

                    ))}

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-200">

                  {filtered
                    .slice(0, pageSize)
                    .map((serie) => (

                      <tr
                        key={serie.id}
                        className="hover:bg-slate-50"
                      >

                        {/* SEDE */}

                        <td className="px-4 py-3 text-slate-900 font-medium">
                          {serie.sedeNombre}
                        </td>

                        {/* VENDEDOR */}

                        <td className="px-4 py-3 text-slate-700">
                          {serie.vendedorNombre}
                        </td>

                        {/* SERIE */}

                        <td className="px-4 py-3">

                          <span className="inline-flex rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                            {serie.serieNumero}
                          </span>

                        </td>

                        {/* ESTADO */}

                        <td className="px-4 py-3">

                          <button
                            type="button"
                            onClick={() =>
                              toggleEstado(
                                serie.id
                              )
                            }
                            className={[
                              "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border",
                              serie.activo
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-rose-50 text-rose-700 border-rose-200",
                            ].join(" ")}
                            title="Cambiar estado"
                          >

                            <span
                              className={[
                                "h-2 w-2 rounded-full",
                                serie.activo
                                  ? "bg-emerald-600"
                                  : "bg-rose-600",
                              ].join(" ")}
                            />

                            {serie.activo
                              ? "Activo"
                              : "Inactivo"}

                          </button>

                        </td>

                        {/* ACCIONES */}

                        <td className="px-4 py-3">

                          <div className="flex items-center gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                handleEditar(
                                  serie
                                )
                              }
                              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                              title="Editar"
                            >

                              <Pencil className="h-4 w-4" />

                              Editar

                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleEliminar(
                                  serie.id
                                )
                              }
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

                  {filtered.length === 0 && (

                    <tr>

                      <td
                        colSpan={5}
                        className="px-4 py-10 text-center text-slate-500"
                      >
                        No se encontraron series.
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>
          )}

          {/* ===================================================
              FOOTER
          ==================================================== */}

          <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-3 text-xs text-slate-500">

            <span>
              Mostrando{" "}
              {Math.min(
                pageSize,
                filtered.length
              )}{" "}
              de {filtered.length} registros
            </span>

            <span className="font-semibold text-slate-700">
              Mikervip
            </span>

          </div>

        </div>

      </div>
    </div>
  );
};

export default RegistrarSerie;