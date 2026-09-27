import React, { useMemo, useState } from "react";

function cn(...c) {
  return c.filter(Boolean).join(" ");
}

function Card({ title, children, right }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-3">
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
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

function IconButton({ title, onClick, children }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100"
    >
      {children}
    </button>
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

function SoftButton({ children, className, ...props }) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-lg px-4 text-xs font-bold",
        "bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800",
        className
      )}
    >
      {children}
    </button>
  );
}

export default function Encomiendas() {
  // UI-only state
  const [detalle, setDetalle] = useState([]);
  const [draft, setDraft] = useState({
    cantidad: 1,
    tipo: "",
    descripcion: "",
    precio: "",
  });

  const total = useMemo(() => {
    return detalle.reduce((acc, it) => acc + (Number(it.cantidad) || 0) * (Number(it.precio) || 0), 0);
  }, [detalle]);

  const addRow = () => {
    if (!draft.descripcion?.trim()) return;
    setDetalle((prev) => [
      ...prev,
      {
        id: crypto?.randomUUID?.() ?? String(Date.now()),
        cantidad: Number(draft.cantidad) || 1,
        tipo: draft.tipo || "Paquete",
        descripcion: draft.descripcion,
        precio: Number(draft.precio) || 0,
      },
    ]);
    setDraft({ cantidad: 1, tipo: "", descripcion: "", precio: "" });
  };

  const removeRow = (id) => setDetalle((prev) => prev.filter((x) => x.id !== id));

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-extrabold text-slate-900">Registrar Encomienda</h1>
            <p className="text-sm text-slate-600">Complete los datos del emisor, receptor, envío y detalle.</p>
          </div>
          <div className="flex items-center gap-2">
            <SecondaryButton type="button" onClick={() => setDetalle([])}>
              Limpiar
            </SecondaryButton>
          </div>
        </div>

        {/* Emisor + Receptor */}
        <div className="grid gap-5 lg:grid-cols-2">
          <Card
            title="Datos de Emisor"
            right={
              <div className="flex items-center gap-2">
                <Select className="w-48">
                  <option value="">Seleccione Tipo Documento</option>
                  <option>DNI</option>
                  <option>CE</option>
                  <option>Pasaporte</option>
                  <option>RUC</option>
                </Select>
                <IconButton title="Buscar" onClick={() => {}}>
                  {/* lupa */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 21l-4.3-4.3m1.3-5.2a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </IconButton>
              </div>
            }
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label>Nombres</Label>
                <Input placeholder="Ingrese nombres" />
              </div>
              <div>
                <Label>Apellidos</Label>
                <Input placeholder="Ingrese apellidos" />
              </div>
              <div>
                <Label>Teléfono</Label>
                <Input placeholder="Ej: 999999999" />
              </div>
              <div>
                <Label>E-mail</Label>
                <Input placeholder="correo@dominio.com" />
              </div>
              <div>
                <Label>Dirección</Label>
                <Input placeholder="Av. / Jr. / Calle" />
              </div>
              <div>
                <Label>Ubigeo</Label>
                <Input placeholder="Ej: 150101" />
              </div>
            </div>
          </Card>

          <Card
            title="Datos de Receptor"
            right={
              <div className="flex items-center gap-2">
                <Select className="w-48">
                  <option value="">Seleccione Tipo Documento</option>
                  <option>DNI</option>
                  <option>CE</option>
                  <option>Pasaporte</option>
                  <option>RUC</option>
                </Select>
                <IconButton title="Buscar" onClick={() => {}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 21l-4.3-4.3m1.3-5.2a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </IconButton>
              </div>
            }
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label>Nombres</Label>
                <Input placeholder="Ingrese nombres" />
              </div>
              <div>
                <Label>Apellidos</Label>
                <Input placeholder="Ingrese apellidos" />
              </div>
              <div>
                <Label>Teléfono</Label>
                <Input placeholder="Ej: 999999999" />
              </div>
              <div>
                <Label>E-mail</Label>
                <Input placeholder="correo@dominio.com" />
              </div>
              <div>
                <Label>Dirección</Label>
                <Input placeholder="Av. / Jr. / Calle" />
              </div>
              <div>
                <Label>Ubigeo</Label>
                <Input placeholder="Ej: 150101" />
              </div>
            </div>
          </Card>
        </div>

        {/* Datos de envío */}
        <Card title="Datos de Envío">
          <div className="grid gap-3 lg:grid-cols-4">
            <div>
              <Label>Fecha Envío</Label>
              <div className="relative">
                <Input type="date" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {/* calendar */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M8 7V3m8 4V3M4 11h16M6 5h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </div>

            <div>
              <Label>Tipo Documento a Emitir</Label>
              <Select>
                <option value="">Seleccione</option>
                <option>Boleta</option>
                <option>Factura</option>
                <option>Guía</option>
              </Select>
            </div>

            <div>
              <Label>Origen</Label>
              <Select>
                <option value="">Seleccione</option>
                <option>Lima</option>
                <option>Huánuco</option>
                <option>Trujillo</option>
              </Select>
            </div>

            <div>
              <Label>Destino</Label>
              <Select>
                <option value="">Seleccione</option>
                <option>Huánuco</option>
                <option>Lima</option>
                <option>Chiclayo</option>
              </Select>
            </div>

            <div className="lg:col-span-2">
              <Label>N° Documento / RUC</Label>
              <div className="relative">
                <Input placeholder="Ingrese N° Documento / RUC" className="pr-12" />
                <span className="absolute right-1 top-1/2 -translate-y-1/2">
                  <IconButton title="Buscar" onClick={() => {}}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M21 21l-4.3-4.3m1.3-5.2a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </IconButton>
                </span>
              </div>
            </div>

            <div className="lg:col-span-2">
              <Label>Nombres / Razón Social</Label>
              <Input placeholder="Ingrese nombres o razón social" />
            </div>
          </div>
        </Card>

        {/* Detalle */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-teal-600 px-5 py-3">
            <div className="grid grid-cols-[90px_120px_1fr_140px_140px_120px] gap-2 text-xs font-extrabold text-white">
              <div className="text-center">Cantidad</div>
              <div className="text-center">Tipo</div>
              <div className="text-center">Descripción</div>
              <div className="text-center">Precio / U</div>
              <div className="text-center">Total</div>
              <div className="text-center">Acción</div>
            </div>
          </div>

          {/* Row inputs */}
          <div className="grid grid-cols-[90px_120px_1fr_140px_140px_120px] gap-2 border-b border-slate-200 bg-slate-50 px-5 py-3">
            <Input
              type="number"
              min={1}
              value={draft.cantidad}
              onChange={(e) => setDraft((d) => ({ ...d, cantidad: e.target.value }))}
              className="text-center"
            />
            <Select value={draft.tipo} onChange={(e) => setDraft((d) => ({ ...d, tipo: e.target.value }))}>
              <option value="">Seleccione</option>
              <option>Paquete</option>
              <option>Documento</option>
              <option>Caja</option>
            </Select>
            <Input
              value={draft.descripcion}
              onChange={(e) => setDraft((d) => ({ ...d, descripcion: e.target.value }))}
              placeholder="Descripción del envío"
            />
            <Input
              type="number"
              min={0}
              step="0.10"
              value={draft.precio}
              onChange={(e) => setDraft((d) => ({ ...d, precio: e.target.value }))}
              className="text-right"
              placeholder="0.00"
            />
            <Input
              value={(
                (Number(draft.cantidad) || 0) * (Number(draft.precio) || 0)
              ).toFixed(2)}
              readOnly
              className="text-right bg-white"
            />
            <div className="flex items-center justify-center">
              <SoftButton type="button" onClick={addRow}>
                Agregar
              </SoftButton>
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-200">
            {detalle.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-slate-500">
                No hay items agregados.
              </div>
            ) : (
              detalle.map((it) => {
                const rowTotal = (Number(it.cantidad) || 0) * (Number(it.precio) || 0);
                return (
                  <div
                    key={it.id}
                    className="grid grid-cols-[90px_120px_1fr_140px_140px_120px] gap-2 px-5 py-3 text-sm"
                  >
                    <div className="text-center text-slate-700">{it.cantidad}</div>
                    <div className="text-center text-slate-700">{it.tipo}</div>
                    <div className="text-slate-700">{it.descripcion}</div>
                    <div className="text-right text-slate-700">{it.precio.toFixed(2)}</div>
                    <div className="text-right font-semibold text-slate-900">{rowTotal.toFixed(2)}</div>
                    <div className="flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeRow(it.id)}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer total */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-5 py-3">
            <div className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-extrabold text-white">
              Total: {total.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => {}}
            className="inline-flex h-10 w-36 items-center justify-center rounded-lg bg-orange-500 text-sm font-bold text-white hover:bg-orange-600 active:bg-orange-700"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={() => {
              setDetalle([]);
              setDraft({ cantidad: 1, tipo: "", descripcion: "", precio: "" });
            }}
            className="inline-flex h-10 w-36 items-center justify-center rounded-lg bg-sky-500 text-sm font-bold text-white hover:bg-sky-600 active:bg-sky-700"
          >
            Nuevo
          </button>
        </div>
      </div>
    </div>
  );
}
