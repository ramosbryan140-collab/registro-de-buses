import React, { useEffect, useMemo, useState } from "react";
import {
  Bus,
  ClipboardList,
  Save,
  Search,
  Pencil,
  Trash2,
  Plus,
  X,
  RefreshCw,
} from "lucide-react";

const API_URL = "http://localhost:3000/api";

const emptyForm = {
  nombres: "",
  apellidos: "",
  partida: "",
  placa: "",
  categoria: "",
  marca: "",
  fabricacion: "",
  modelo: "",
  combustible: "",
  carroceria: "",
  ejes: "",
  color: "",
  motor: "",
  cilindros: "",
  serie: "",
  ruedas: "",
  peso_seco: "",
  peso_bruto: "",
};

function getToken() {
  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token") ||
    ""
  );
}

async function apiRequest(endpoint, options = {}) {
  const token = getToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
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
        `Error ${response.status}: ${response.statusText}`
    );
  }

  return data;
}

function normalizeEstado(value) {
  if (
    value === true ||
    value === 1 ||
    value === "1" ||
    value === "A" ||
    value === "ACTIVO" ||
    value === "Activo"
  ) {
    return true;
  }

  return false;
}

function getRows(response) {
  if (Array.isArray(response)) return response;

  if (Array.isArray(response?.data)) return response.data;

  if (Array.isArray(response?.rows)) return response.rows;

  if (Array.isArray(response?.buses)) return response.buses;

  return [];
}

function mapBus(row) {
  return {
    id:
      row.id ??
      row.id_bus ??
      row.codigo_bus ??
      row.codigo ??
      row.ID_BUS,

    estado: normalizeEstado(
      row.estado ??
        row.estado_bus ??
        row.activo ??
        row.ACTIVO
    ),

    nombres:
      row.nombres ??
      row.nombre_propietario ??
      row.nombres_propietario ??
      "",

    apellidos:
      row.apellidos ??
      row.apellidos_propietario ??
      "",

    partida:
      row.partida ??
      row.partida_registral ??
      row.nro_partida ??
      row.numero_partida ??
      "",

    placa:
      row.placa ??
      row.numero_placa ??
      row.nro_placa ??
      "",

    categoria:
      row.categoria ??
      row.clase ??
      "",

    marca: row.marca ?? "",

    fabricacion:
      row.fabricacion ??
      row.anio_fabricacion ??
      row.ano_fabricacion ??
      "",

    modelo: row.modelo ?? "",

    combustible:
      row.combustible ??
      row.tipo_combustible ??
      "",

    carroceria:
      row.carroceria ?? "",

    ejes: row.ejes ?? "",

    color: row.color ?? "",

    motor:
      row.motor ??
      row.numero_motor ??
      row.nro_motor ??
      "",

    cilindros: row.cilindros ?? "",

    serie:
      row.serie ??
      row.numero_serie ??
      row.nro_serie ??
      "",

    ruedas: row.ruedas ?? "",

    peso_seco:
      row.peso_seco ??
      row.pesoSeco ??
      "",

    peso_bruto:
      row.peso_bruto ??
      row.pesoBruto ??
      "",
  };
}

function mapFormToApi(form) {
  return {
    nombres: form.nombres.trim(),
    apellidos: form.apellidos.trim(),
    partida: form.partida.trim(),
    placa: form.placa.trim().toUpperCase(),
    categoria: form.categoria.trim(),
    marca: form.marca.trim(),
    fabricacion: form.fabricacion
      ? Number(form.fabricacion)
      : null,
    modelo: form.modelo.trim(),
    combustible: form.combustible,
    carroceria: form.carroceria.trim(),
    ejes: form.ejes ? Number(form.ejes) : null,
    color: form.color.trim(),
    motor: form.motor.trim(),
    cilindros: form.cilindros
      ? Number(form.cilindros)
      : null,
    serie: form.serie.trim(),
    ruedas: form.ruedas ? Number(form.ruedas) : null,
    peso_seco: form.peso_seco
      ? Number(form.peso_seco)
      : null,
    peso_bruto: form.peso_bruto
      ? Number(form.peso_bruto)
      : null,
  };
}

export default function RegistrarBuses() {
  const [activeTab, setActiveTab] = useState("datos");

  const [query, setQuery] = useState("");

  const [pageSize, setPageSize] = useState(10);

  const [data, setData] = useState([]);

  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  useEffect(() => {
    cargarBuses();
  }, []);

  async function cargarBuses() {
    try {
      setLoading(true);
      setError("");

      const response = await apiRequest("/buses");

      const rows = getRows(response).map(mapBus);

      setData(rows);
    } catch (err) {
      console.error("Error cargando buses:", err);
      setError(
        err.message ||
          "No se pudieron cargar los registros de buses."
      );
    } finally {
      setLoading(false);
    }
  }

  function limpiarMensajes() {
    setError("");
    setSuccess("");
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function nuevoRegistro() {
    limpiarMensajes();

    setForm(emptyForm);
    setEditingId(null);
    setActiveTab("datos");
  }

  function editarBus(bus) {
    limpiarMensajes();

    setEditingId(bus.id);

    setForm({
      nombres: bus.nombres || "",
      apellidos: bus.apellidos || "",
      partida: bus.partida || "",
      placa: bus.placa || "",
      categoria: bus.categoria || "",
      marca: bus.marca || "",
      fabricacion: bus.fabricacion || "",
      modelo: bus.modelo || "",
      combustible: bus.combustible || "",
      carroceria: bus.carroceria || "",
      ejes: bus.ejes || "",
      color: bus.color || "",
      motor: bus.motor || "",
      cilindros: bus.cilindros || "",
      serie: bus.serie || "",
      ruedas: bus.ruedas || "",
      peso_seco: bus.peso_seco || "",
      peso_bruto: bus.peso_bruto || "",
    });

    setActiveTab("datos");
  }

  async function guardarBus(event) {
    event.preventDefault();

    limpiarMensajes();

    if (!form.nombres.trim()) {
      setError("Ingrese los nombres del propietario.");
      return;
    }

    if (!form.apellidos.trim()) {
      setError("Ingrese los apellidos del propietario.");
      return;
    }

    if (!form.placa.trim()) {
      setError("Ingrese el número de placa.");
      return;
    }

    if (!form.marca.trim()) {
      setError("Ingrese la marca del vehículo.");
      return;
    }

    try {
      setSaving(true);

      const payload = mapFormToApi(form);

      if (editingId !== null) {
        await apiRequest(`/buses/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });

        setSuccess("Bus actualizado correctamente.");
      } else {
        await apiRequest("/buses", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        setSuccess("Bus registrado correctamente.");
      }

      await cargarBuses();

      setForm(emptyForm);
      setEditingId(null);

      setActiveTab("registros");
    } catch (err) {
      console.error("Error guardando bus:", err);

      setError(
        err.message ||
          "No se pudo guardar el registro."
      );
    } finally {
      setSaving(false);
    }
  }

  async function eliminarBus(id) {
    const confirmar = window.confirm(
      "¿Está seguro de eliminar este registro?"
    );

    if (!confirmar) return;

    try {
      limpiarMensajes();

      setLoading(true);

      await apiRequest(`/buses/${id}`, {
        method: "DELETE",
      });

      setSuccess("Bus eliminado correctamente.");

      await cargarBuses();
    } catch (err) {
      console.error("Error eliminando bus:", err);

      setError(
        err.message ||
          "No se pudo eliminar el registro."
      );
    } finally {
      setLoading(false);
    }
  }

  async function toggleEstado(bus) {
    try {
      limpiarMensajes();

      const nuevoEstado = !bus.estado;

      await apiRequest(`/buses/${bus.id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...mapFormToApi(bus),
          estado: nuevoEstado ? 1 : 0,
        }),
      });

      setSuccess(
        nuevoEstado
          ? "Bus activado correctamente."
          : "Bus desactivado correctamente."
      );

      await cargarBuses();
    } catch (err) {
      console.error("Error cambiando estado:", err);

      setError(
        err.message ||
          "No se pudo cambiar el estado del bus."
      );
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return data;

    return data.filter((b) => {
      const s = `
        ${b.nombres}
        ${b.apellidos}
        ${b.partida}
        ${b.placa}
        ${b.categoria}
        ${b.marca}
        ${b.fabricacion}
        ${b.modelo}
        ${b.combustible}
        ${b.carroceria}
      `.toLowerCase();

      return s.includes(q);
    });
  }, [data, query]);

  const inputBase =
    "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

  const labelBase =
    "text-xs font-semibold text-slate-700";

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <div className="w-full px-6 py-8">

        {/* HEADER */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <Bus className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Registro de Buses
              </h1>

              <p className="text-sm text-slate-600">
                Gestiona datos del vehículo y su lista de registros.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            onClick={nuevoRegistro}
          >
            <Plus className="h-4 w-4" />
            Nuevo
          </button>
        </div>

        {/* MENSAJES */}
        {(error || success) && (
          <div className="mb-5">
            {error && (
              <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <span>{error}</span>

                <button
                  type="button"
                  onClick={() => setError("")}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {success && !error && (
              <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <span>{success}</span>

                <button
                  type="button"
                  onClick={() => setSuccess("")}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* TABS */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm p-2">
          <div className="flex flex-wrap gap-2">

            <button
              type="button"
              onClick={() => setActiveTab("datos")}
              className={[
                "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
                activeTab === "datos"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50",
              ].join(" ")}
            >
              <Bus className="h-4 w-4" />
              Datos Generales de Vehículo
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("registros")}
              className={[
                "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
                activeTab === "registros"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50",
              ].join(" ")}
            >
              <ClipboardList className="h-4 w-4" />
              Lista de Registros
            </button>

          </div>
        </div>

        {/* ================= DATOS ================= */}
        {activeTab === "datos" && (
          <form
            className="space-y-6"
            onSubmit={guardarBus}
          >

            {/* PROPIETARIO */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

              <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-5 py-4">
                <h3 className="font-semibold text-base">
                  Datos de Propietario
                </h3>

                <p className="text-xs text-white/80">
                  Información del propietario del vehículo
                </p>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="flex flex-col gap-1">
                    <label className={labelBase}>
                      Nombres Completos
                    </label>

                    <input
                      type="text"
                      name="nombres"
                      value={form.nombres}
                      onChange={handleChange}
                      placeholder="Ingrese nombres"
                      className={inputBase}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className={labelBase}>
                      Apellidos Completos
                    </label>

                    <input
                      type="text"
                      name="apellidos"
                      value={form.apellidos}
                      onChange={handleChange}
                      placeholder="Ingrese apellidos"
                      className={inputBase}
                    />
                  </div>

                </div>
              </div>
            </div>

            {/* VEHICULO */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

              <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-5 py-4">
                <h3 className="font-semibold text-base">
                  Datos del Vehículo
                </h3>

                <p className="text-xs text-white/80">
                  Complete los datos técnicos del bus
                </p>
              </div>

              <div className="p-5">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                  <div className="flex flex-col gap-1">
                    <label className={labelBase}>
                      Partida Registral
                    </label>

                    <input
                      name="partida"
                      value={form.partida}
                      onChange={handleChange}
                      placeholder="Ej: 56652210"
                      className={inputBase}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className={labelBase}>
                      Número de Placa
                    </label>

                    <input
                      name="placa"
                      value={form.placa}
                      onChange={handleChange}
                      placeholder="Ej: D1A-223"
                      className={inputBase}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className={labelBase}>
                      Clase
                    </label>

                    <input
                      name="categoria"
                      value={form.categoria}
                      onChange={handleChange}
                      placeholder="Ej: M3"
                      className={inputBase}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className={labelBase}>
                      Marca
                    </label>

                    <input
                      name="marca"
                      value={form.marca}
                      onChange={handleChange}
                      placeholder="Ej: Mercedes Benz"
                      className={inputBase}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className={labelBase}>
                      Año de Fabricación
                    </label>

                    <input
                      type="number"
                      name="fabricacion"
                      value={form.fabricacion}
                      onChange={handleChange}
                      placeholder="Ej: 2018"
                      className={inputBase}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className={labelBase}>
                      Modelo
                    </label>

                    <input
                      name="modelo"
                      value={form.modelo}
                      onChange={handleChange}
                      placeholder="Ej: OF 917/48"
                      className={inputBase}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className={labelBase}>
                      Combustible
                    </label>

                    <select
                      name="combustible"
                      value={form.combustible}
                      onChange={handleChange}
                      className={inputBase}
                    >
                      <option value="">
                        Seleccione tipo de combustible
                      </option>
                      <option value="Gasolina">
                        Gasolina
                      </option>
                      <option value="Diésel">
                        Diésel
                      </option>
                      <option value="Petroleo">
                        Petróleo
                      </option>
                      <option value="Gas">
                        Gas
                      </option>
                      <option value="Eléctrico">
                        Eléctrico
                      </option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className={labelBase}>
                      Carrocería
                    </label>

                    <input
                      name="carroceria"
                      value={form.carroceria}
                      onChange={handleChange}
                      placeholder="Ej: chasis O500 R"
                      className={inputBase}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className={labelBase}>
                      Ejes
                    </label>

                    <input
                      type="number"
                      name="ejes"
                      value={form.ejes}
                      onChange={handleChange}
                      placeholder="Ej: 2"
                      className={inputBase}
                    />
                  </div>

                  <div className="flex flex-col gap-1 md:col-span-3">
                    <label className={labelBase}>
                      Color
                    </label>

                    <input
                      name="color"
                      value={form.color}
                      onChange={handleChange}
                      placeholder="Ej: Blanco"
                      className={inputBase}
                    />
                  </div>

                </div>

                {/* ADICIONALES */}
                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">

                  <div className="mb-3 text-sm font-semibold text-slate-900">
                    Datos adicionales
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    <div className="flex flex-col gap-1">
                      <label className={labelBase}>
                        N° de Motor
                      </label>

                      <input
                        name="motor"
                        value={form.motor}
                        onChange={handleChange}
                        placeholder="Ej: 1HGBH41JXMN109186"
                        className={inputBase}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className={labelBase}>
                        Cilindros
                      </label>

                      <input
                        type="number"
                        name="cilindros"
                        value={form.cilindros}
                        onChange={handleChange}
                        placeholder="Ej: 6"
                        className={inputBase}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className={labelBase}>
                        N° de Serie
                      </label>

                      <input
                        name="serie"
                        value={form.serie}
                        onChange={handleChange}
                        placeholder="Ej: SER-998812"
                        className={inputBase}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className={labelBase}>
                        Ruedas
                      </label>

                      <input
                        type="number"
                        name="ruedas"
                        value={form.ruedas}
                        onChange={handleChange}
                        placeholder="Ej: 6"
                        className={inputBase}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className={labelBase}>
                        Peso Seco
                      </label>

                      <input
                        type="number"
                        name="peso_seco"
                        value={form.peso_seco}
                        onChange={handleChange}
                        placeholder="Ej: 6500"
                        className={inputBase}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className={labelBase}>
                        Peso Bruto
                      </label>

                      <input
                        type="number"
                        name="peso_bruto"
                        value={form.peso_bruto}
                        onChange={handleChange}
                        placeholder="Ej: 12000"
                        className={inputBase}
                      />
                    </div>

                  </div>
                </div>

                {/* BOTONES */}
                <div className="mt-6 flex justify-end gap-3">

                  {editingId !== null && (
                    <button
                      type="button"
                      onClick={nuevoRegistro}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                    >
                      <X className="h-4 w-4" />
                      Cancelar
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {saving ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}

                    {saving
                      ? "Guardando..."
                      : editingId !== null
                      ? "Actualizar"
                      : "Guardar"}
                  </button>

                </div>

              </div>
            </div>

          </form>
        )}

        {/* ================= REGISTROS ================= */}
        {activeTab === "registros" && (
          <div className="space-y-4">

            {/* BUSCADOR */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                <div className="flex items-center gap-3 w-full lg:max-w-md">

                  <div className="relative w-full">

                    <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

                    <input
                      value={query}
                      onChange={(e) =>
                        setQuery(e.target.value)
                      }
                      className={[
                        "pl-10",
                        inputBase,
                      ].join(" ")}
                      placeholder="Buscar por placa, propietario, marca, modelo..."
                    />

                  </div>

                </div>

                <div className="flex items-center gap-2 justify-end">

                  <button
                    type="button"
                    onClick={cargarBuses}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    <RefreshCw
                      className={[
                        "h-4 w-4",
                        loading
                          ? "animate-spin"
                          : "",
                      ].join(" ")}
                    />

                    Actualizar
                  </button>

                  <span className="text-sm font-semibold text-slate-700">
                    Mostrar:
                  </span>

                  <select
                    value={pageSize}
                    onChange={(e) =>
                      setPageSize(
                        Number(e.target.value)
                      )
                    }
                    className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>

                </div>

              </div>
            </div>

            {/* TABLA */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

              <div className="overflow-x-auto">

                <table className="min-w-[1100px] w-full text-sm">

                  <thead className="sticky top-0 z-10 bg-slate-900 text-white">

                    <tr className="text-left">

                      {[
                        "Estado",
                        "Nombres",
                        "Apellidos",
                        "Partida",
                        "Placa",
                        "Categoría",
                        "Marca",
                        "Año",
                        "Modelo",
                        "Combustible",
                        "Carrocería",
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

                    {loading && data.length === 0 ? (
                      <tr>
                        <td
                          colSpan={12}
                          className="px-4 py-12 text-center text-slate-500"
                        >
                          <RefreshCw className="mx-auto mb-3 h-6 w-6 animate-spin" />

                          Cargando registros desde la base de datos...
                        </td>
                      </tr>
                    ) : (
                      filtered
                        .slice(0, pageSize)
                        .map((bus) => (
                          <tr
                            key={bus.id}
                            className="hover:bg-slate-50"
                          >

                            <td className="px-4 py-3">

                              <button
                                type="button"
                                onClick={() =>
                                  toggleEstado(bus)
                                }
                                className={[
                                  "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border",
                                  bus.estado
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-rose-50 text-rose-700 border-rose-200",
                                ].join(" ")}
                              >

                                <span
                                  className={[
                                    "h-2 w-2 rounded-full",
                                    bus.estado
                                      ? "bg-emerald-600"
                                      : "bg-rose-600",
                                  ].join(" ")}
                                />

                                {bus.estado
                                  ? "Activo"
                                  : "Inactivo"}

                              </button>

                            </td>

                            <td className="px-4 py-3 text-slate-900 font-medium">
                              {bus.nombres}
                            </td>

                            <td className="px-4 py-3 text-slate-700">
                              {bus.apellidos}
                            </td>

                            <td className="px-4 py-3 text-slate-700">
                              {bus.partida}
                            </td>

                            <td className="px-4 py-3">

                              <span className="inline-flex rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                                {bus.placa}
                              </span>

                            </td>

                            <td className="px-4 py-3 text-slate-700">
                              {bus.categoria}
                            </td>

                            <td className="px-4 py-3 text-slate-700">
                              {bus.marca}
                            </td>

                            <td className="px-4 py-3 text-slate-700">
                              {bus.fabricacion}
                            </td>

                            <td className="px-4 py-3 text-slate-700">
                              {bus.modelo}
                            </td>

                            <td className="px-4 py-3 text-slate-700">
                              {bus.combustible}
                            </td>

                            <td className="px-4 py-3 text-slate-700">
                              {bus.carroceria}
                            </td>

                            <td className="px-4 py-3">

                              <div className="flex items-center gap-2">

                                <button
                                  type="button"
                                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                                  onClick={() =>
                                    editarBus(bus)
                                  }
                                >
                                  <Pencil className="h-4 w-4" />
                                  Editar
                                </button>

                                <button
                                  type="button"
                                  className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 shadow-sm hover:bg-rose-100"
                                  onClick={() =>
                                    eliminarBus(bus.id)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Eliminar
                                </button>

                              </div>

                            </td>

                          </tr>
                        ))
                    )}

                    {!loading &&
                      filtered.length === 0 && (
                        <tr>
                          <td
                            colSpan={12}
                            className="px-4 py-10 text-center text-slate-500"
                          >
                            No se encontraron registros en la base de datos.
                          </td>
                        </tr>
                      )}

                  </tbody>

                </table>

              </div>

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
        )}

      </div>
    </div>
  );
}