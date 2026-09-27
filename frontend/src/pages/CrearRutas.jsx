import React, { useMemo, useState } from "react";

function cn(...c) {
  return c.filter(Boolean).join(" ");
}

function Card({ title, subtitle, right, children }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900">{title}</h3>
          {subtitle ? <p className="mt-1 text-xs text-slate-600">{subtitle}</p> : null}
        </div>
        {right}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Label({ children }) {
  return <label className="text-xs font-semibold text-slate-600">{children}</label>;
}

function Input(props) {
  return (
    <input
      {...props}
      className={cn(
        "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 placeholder:text-slate-400",
        "focus:outline-none focus:ring-2 focus:ring-slate-200",
        props.className
      )}
    />
  );
}

function Select(props) {
  return (
    <select
      {...props}
      className={cn(
        "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800",
        "focus:outline-none focus:ring-2 focus:ring-slate-200",
        props.className
      )}
    />
  );
}

function PrimaryButton({ children, className, ...props }) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-lg px-5 text-sm font-semibold",
        "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800",
        className
      )}
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, className, ...props }) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-lg px-5 text-sm font-semibold",
        "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 active:bg-slate-100",
        className
      )}
    >
      {children}
    </button>
  );
}

function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">
      {children}
    </span>
  );
}

export default function CrearRutas() {
  // Form state (UI only)
  const [form, setForm] = useState({
    codigo: "",
    nombre: "",
    origen: "",
    destino: "",
    tipoServicio: "",
    distanciaKm: "",
    duracion: "",
    tarifaBase: "",
    estado: "Activo",
  });

  // Stops (paradas)
  const [stopDraft, setStopDraft] = useState({
    orden: "",
    terminal: "",
    ciudad: "",
    minutos: "",
    precioExtra: "",
  });
  const [stops, setStops] = useState([]);

  // Schedules (horarios)
  const [schedDraft, setSchedDraft] = useState({
    dia: "Todos",
    salida: "",
    llegada: "",
    busTipo: "",
  });
  const [schedules, setSchedules] = useState([]);

  // Preview
  const rutaLabel = useMemo(() => {
    const a = form.origen || "Origen";
    const b = form.destino || "Destino";
    return `${a} → ${b}`;
  }, [form.origen, form.destino]);

  const addStop = () => {
    if (!stopDraft.terminal?.trim() || !stopDraft.ciudad?.trim()) return;
    setStops((prev) => [
      ...prev,
      {
        id: crypto?.randomUUID?.() ?? String(Date.now()),
        orden: Number(stopDraft.orden) || prev.length + 1,
        terminal: stopDraft.terminal,
        ciudad: stopDraft.ciudad,
        minutos: Number(stopDraft.minutos) || 0,
        precioExtra: Number(stopDraft.precioExtra) || 0,
      },
    ].sort((a, b) => a.orden - b.orden));
    setStopDraft({ orden: "", terminal: "", ciudad: "", minutos: "", precioExtra: "" });
  };

  const removeStop = (id) => setStops((prev) => prev.filter((x) => x.id !== id));

  const addSchedule = () => {
    if (!schedDraft.salida) return;
    setSchedules((prev) => [
      ...prev,
      { id: crypto?.randomUUID?.() ?? String(Date.now()), ...schedDraft },
    ]);
    setSchedDraft({ dia: "Todos", salida: "", llegada: "", busTipo: "" });
  };

  const removeSchedule = (id) => setSchedules((prev) => prev.filter((x) => x.id !== id));

  const resetAll = () => {
    setForm({
      codigo: "",
      nombre: "",
      origen: "",
      destino: "",
      tipoServicio: "",
      distanciaKm: "",
      duracion: "",
      tarifaBase: "",
      estado: "Activo",
    });
    setStops([]);
    setSchedules([]);
    setStopDraft({ orden: "", terminal: "", ciudad: "", minutos: "", precioExtra: "" });
    setSchedDraft({ dia: "Todos", salida: "", llegada: "", busTipo: "" });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-extrabold text-slate-900">Crear Rutas</h1>
            <p className="text-sm text-slate-600">Registra ruta, paradas y horarios (solo diseño UI).</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Pill>{rutaLabel}</Pill>
            <Pill>Estado: {form.estado}</Pill>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
          {/* Left column */}
          <div className="space-y-5">
            {/* Datos de Ruta */}
            <Card
              title="Datos de la Ruta"
              subtitle="Completa información principal para el registro."
              right={
                <div className="flex items-center gap-2">
                  <SecondaryButton type="button" onClick={resetAll}>
                    Nuevo
                  </SecondaryButton>
                  <PrimaryButton type="button" onClick={() => {}}>
                    Guardar
                  </PrimaryButton>
                </div>
              }
            >
              <div className="grid gap-3 lg:grid-cols-4">
                <div className="lg:col-span-1">
                  <Label>Código</Label>
                  <Input
                    placeholder="RT-001"
                    value={form.codigo}
                    onChange={(e) => setForm((f) => ({ ...f, codigo: e.target.value }))}
                  />
                </div>

                <div className="lg:col-span-3">
                  <Label>Nombre de Ruta</Label>
                  <Input
                    placeholder="Ej: Lima - Huánuco (Directo)"
                    value={form.nombre}
                    onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                  />
                </div>

                <div className="lg:col-span-2">
                  <Label>Origen</Label>
                  <Select
                    value={form.origen}
                    onChange={(e) => setForm((f) => ({ ...f, origen: e.target.value }))}
                  >
                    <option value="">Seleccione</option>
                    <option>Lima</option>
                    <option>Huánuco</option>
                    <option>Trujillo</option>
                    <option>Chiclayo</option>
                  </Select>
                </div>

                <div className="lg:col-span-2">
                  <Label>Destino</Label>
                  <Select
                    value={form.destino}
                    onChange={(e) => setForm((f) => ({ ...f, destino: e.target.value }))}
                  >
                    <option value="">Seleccione</option>
                    <option>Huánuco</option>
                    <option>Lima</option>
                    <option>Trujillo</option>
                    <option>Chiclayo</option>
                  </Select>
                </div>

                <div className="lg:col-span-2">
                  <Label>Tipo de Servicio</Label>
                  <Select
                    value={form.tipoServicio}
                    onChange={(e) => setForm((f) => ({ ...f, tipoServicio: e.target.value }))}
                  >
                    <option value="">Seleccione</option>
                    <option>Estándar</option>
                    <option>Ejecutivo</option>
                    <option>VIP</option>
                  </Select>
                </div>

                <div className="lg:col-span-1">
                  <Label>Distancia (km)</Label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={form.distanciaKm}
                    onChange={(e) => setForm((f) => ({ ...f, distanciaKm: e.target.value }))}
                    className="text-right"
                  />
                </div>

                <div className="lg:col-span-1">
                  <Label>Duración</Label>
                  <Input
                    placeholder="Ej: 06:30"
                    value={form.duracion}
                    onChange={(e) => setForm((f) => ({ ...f, duracion: e.target.value }))}
                  />
                </div>

                <div className="lg:col-span-1">
                  <Label>Tarifa Base</Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.1"
                    placeholder="0.00"
                    value={form.tarifaBase}
                    onChange={(e) => setForm((f) => ({ ...f, tarifaBase: e.target.value }))}
                    className="text-right"
                  />
                </div>

                <div className="lg:col-span-1">
                  <Label>Estado</Label>
                  <Select
                    value={form.estado}
                    onChange={(e) => setForm((f) => ({ ...f, estado: e.target.value }))}
                  >
                    <option>Activo</option>
                    <option>Inactivo</option>
                  </Select>
                </div>

                <div className="lg:col-span-2">
                  <Label>Observaciones</Label>
                  <Input placeholder="(Opcional) Notas internas" />
                </div>
              </div>
            </Card>

            {/* Paradas */}
            <Card
              title="Paradas"
              subtitle="Agrega terminales intermedios, tiempo y costo adicional."
              right={
                <div className="text-xs text-slate-600">
                  Total paradas: <span className="font-bold text-slate-900">{stops.length}</span>
                </div>
              }
            >
              {/* Draft row */}
              <div className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 lg:grid-cols-12">
                <div className="lg:col-span-1">
                  <Label>Orden</Label>
                  <Input
                    type="number"
                    min={1}
                    placeholder="1"
                    value={stopDraft.orden}
                    onChange={(e) => setStopDraft((d) => ({ ...d, orden: e.target.value }))}
                    className="text-center"
                  />
                </div>
                <div className="lg:col-span-4">
                  <Label>Terminal</Label>
                  <Input
                    placeholder="Terminal Central"
                    value={stopDraft.terminal}
                    onChange={(e) => setStopDraft((d) => ({ ...d, terminal: e.target.value }))}
                  />
                </div>
                <div className="lg:col-span-3">
                  <Label>Ciudad</Label>
                  <Input
                    placeholder="Huacho"
                    value={stopDraft.ciudad}
                    onChange={(e) => setStopDraft((d) => ({ ...d, ciudad: e.target.value }))}
                  />
                </div>
                <div className="lg:col-span-2">
                  <Label>Minutos</Label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={stopDraft.minutos}
                    onChange={(e) => setStopDraft((d) => ({ ...d, minutos: e.target.value }))}
                    className="text-right"
                  />
                </div>
                <div className="lg:col-span-2">
                  <Label>Precio extra</Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.1"
                    placeholder="0.00"
                    value={stopDraft.precioExtra}
                    onChange={(e) => setStopDraft((d) => ({ ...d, precioExtra: e.target.value }))}
                    className="text-right"
                  />
                </div>
                <div className="lg:col-span-12 flex justify-end pt-2">
                  <PrimaryButton type="button" onClick={addStop} className="h-9 px-4 text-xs">
                    Agregar parada
                  </PrimaryButton>
                </div>
              </div>

              {/* Stops table */}
              <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="grid grid-cols-[80px_1fr_1fr_120px_140px_120px] gap-2 bg-slate-50 px-4 py-3 text-xs font-extrabold text-slate-600">
                  <div className="text-center">Orden</div>
                  <div>Terminal</div>
                  <div>Ciudad</div>
                  <div className="text-right">Minutos</div>
                  <div className="text-right">Precio extra</div>
                  <div className="text-center">Acción</div>
                </div>

                {stops.length === 0 ? (
                  <div className="px-4 py-10 text-center text-sm text-slate-500">No hay paradas agregadas.</div>
                ) : (
                  <div className="divide-y divide-slate-200">
                    {stops.map((s) => (
                      <div
                        key={s.id}
                        className="grid grid-cols-[80px_1fr_1fr_120px_140px_120px] gap-2 px-4 py-3 text-sm"
                      >
                        <div className="text-center font-semibold text-slate-900">{s.orden}</div>
                        <div className="text-slate-700">{s.terminal}</div>
                        <div className="text-slate-700">{s.ciudad}</div>
                        <div className="text-right text-slate-700">{s.minutos}</div>
                        <div className="text-right font-semibold text-slate-900">{s.precioExtra.toFixed(2)}</div>
                        <div className="flex justify-center">
                          <button
                            type="button"
                            onClick={() => removeStop(s.id)}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                          >
                            Quitar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Horarios */}
            <Card
              title="Horarios"
              subtitle="Define días y horas de salida/llegada (UI)."
              right={
                <div className="text-xs text-slate-600">
                  Total horarios: <span className="font-bold text-slate-900">{schedules.length}</span>
                </div>
              }
            >
              <div className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 lg:grid-cols-12">
                <div className="lg:col-span-3">
                  <Label>Día</Label>
                  <Select value={schedDraft.dia} onChange={(e) => setSchedDraft((d) => ({ ...d, dia: e.target.value }))}>
                    <option>Todos</option>
                    <option>Lunes</option>
                    <option>Martes</option>
                    <option>Miércoles</option>
                    <option>Jueves</option>
                    <option>Viernes</option>
                    <option>Sábado</option>
                    <option>Domingo</option>
                  </Select>
                </div>
                <div className="lg:col-span-3">
                  <Label>Salida</Label>
                  <Input
                    type="time"
                    value={schedDraft.salida}
                    onChange={(e) => setSchedDraft((d) => ({ ...d, salida: e.target.value }))}
                  />
                </div>
                <div className="lg:col-span-3">
                  <Label>Llegada</Label>
                  <Input
                    type="time"
                    value={schedDraft.llegada}
                    onChange={(e) => setSchedDraft((d) => ({ ...d, llegada: e.target.value }))}
                  />
                </div>
                <div className="lg:col-span-3">
                  <Label>Tipo de Bus</Label>
                  <Select
                    value={schedDraft.busTipo}
                    onChange={(e) => setSchedDraft((d) => ({ ...d, busTipo: e.target.value }))}
                  >
                    <option value="">Seleccione</option>
                    <option>Bus 1 piso</option>
                    <option>Bus 2 pisos</option>
                    <option>Minivan</option>
                  </Select>
                </div>

                <div className="lg:col-span-12 flex justify-end pt-2">
                  <PrimaryButton type="button" onClick={addSchedule} className="h-9 px-4 text-xs">
                    Agregar horario
                  </PrimaryButton>
                </div>
              </div>

              <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="grid grid-cols-[140px_160px_160px_1fr_120px] gap-2 bg-slate-50 px-4 py-3 text-xs font-extrabold text-slate-600">
                  <div>Día</div>
                  <div>Salida</div>
                  <div>Llegada</div>
                  <div>Tipo de Bus</div>
                  <div className="text-center">Acción</div>
                </div>

                {schedules.length === 0 ? (
                  <div className="px-4 py-10 text-center text-sm text-slate-500">No hay horarios agregados.</div>
                ) : (
                  <div className="divide-y divide-slate-200">
                    {schedules.map((h) => (
                      <div
                        key={h.id}
                        className="grid grid-cols-[140px_160px_160px_1fr_120px] gap-2 px-4 py-3 text-sm"
                      >
                        <div className="font-semibold text-slate-900">{h.dia}</div>
                        <div className="text-slate-700">{h.salida || "—"}</div>
                        <div className="text-slate-700">{h.llegada || "—"}</div>
                        <div className="text-slate-700">{h.busTipo || "—"}</div>
                        <div className="flex justify-center">
                          <button
                            type="button"
                            onClick={() => removeSchedule(h.id)}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                          >
                            Quitar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right column: Preview / Summary */}
          <div className="space-y-5">
            <Card title="Resumen" subtitle="Vista previa (UI) de lo que estás creando.">
              <div className="space-y-3">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="text-xs font-semibold text-slate-600">Ruta</div>
                  <div className="mt-1 text-base font-extrabold text-slate-900">{rutaLabel}</div>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <Pill>Código: {form.codigo || "—"}</Pill>
                    <Pill>Servicio: {form.tipoServicio || "—"}</Pill>
                    <Pill>Duración: {form.duracion || "—"}</Pill>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="text-xs font-semibold text-slate-600">Tarifa</div>
                  <div className="mt-1 text-2xl font-extrabold text-slate-900">
                    S/. {Number(form.tarifaBase || 0).toFixed(2)}
                  </div>
                  <div className="mt-1 text-xs text-slate-600">
                    Distancia: {form.distanciaKm || "—"} km • Estado: {form.estado}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="text-xs font-semibold text-slate-600">Paradas</div>
                  <div className="mt-2 space-y-2">
                    {stops.length === 0 ? (
                      <div className="text-sm text-slate-500">—</div>
                    ) : (
                      stops.slice(0, 6).map((s) => (
                        <div key={s.id} className="flex items-center justify-between gap-3 text-sm">
                          <div className="text-slate-700">
                            <span className="font-bold text-slate-900">{s.orden}.</span> {s.ciudad}{" "}
                            <span className="text-slate-500">({s.terminal})</span>
                          </div>
                          <div className="font-semibold text-slate-900">+S/. {s.precioExtra.toFixed(2)}</div>
                        </div>
                      ))
                    )}
                    {stops.length > 6 ? (
                      <div className="text-xs font-semibold text-slate-500">+ {stops.length - 6} más…</div>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="text-xs font-semibold text-slate-600">Horarios</div>
                  <div className="mt-2 space-y-2">
                    {schedules.length === 0 ? (
                      <div className="text-sm text-slate-500">—</div>
                    ) : (
                      schedules.slice(0, 6).map((h) => (
                        <div key={h.id} className="flex items-center justify-between gap-3 text-sm">
                          <div className="text-slate-700">
                            <span className="font-bold text-slate-900">{h.dia}:</span> {h.salida || "—"} -{" "}
                            {h.llegada || "—"}
                          </div>
                          <div className="text-xs font-semibold text-slate-600">{h.busTipo || "—"}</div>
                        </div>
                      ))
                    )}
                    {schedules.length > 6 ? (
                      <div className="text-xs font-semibold text-slate-500">+ {schedules.length - 6} más…</div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <PrimaryButton type="button" onClick={() => {}}>
                  Guardar Ruta
                </PrimaryButton>
                <SecondaryButton type="button" onClick={resetAll}>
                  Nuevo
                </SecondaryButton>
              </div>
            </Card>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-700 shadow-sm">
              <div className="font-extrabold text-slate-900">Tip UI</div>
              <p className="mt-1 text-sm text-slate-600">
                Si ya tienes catálogo de terminales y ciudades, cambia los <code className="font-semibold">Input</code>{" "}
                por <code className="font-semibold">Select</code> y llena sus opciones con tu data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
