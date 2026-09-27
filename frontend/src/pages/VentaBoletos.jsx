import React, { useMemo, useState } from "react";

const TABS = ["Ventas", "Reservados", "Pasajeros"];

// Helpers UI
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Badge({ variant = "neutral", children }) {
  const styles =
    variant === "reserved"
      ? "bg-red-100 text-red-700 border-red-200"
      : variant === "sold"
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold", styles)}>
      {children}
    </span>
  );
}

function IconButton({ title, onClick, children }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100"
    >
      {children}
    </button>
  );
}

function Section({ title, tone = "default", children, right }) {
  const toneStyles =
    tone === "desc"
      ? "bg-amber-200/70 border-amber-300"
      : tone === "bus"
      ? "bg-sky-200/70 border-sky-300"
      : "bg-slate-100 border-slate-200";

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className={cn("flex items-center justify-between gap-3 border-b px-4 py-2.5", toneStyles)}>
        <div className="font-semibold text-slate-800">{title}</div>
        {right}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function Tabs({ value, onChange }) {
  return (
    <div className="flex w-full items-center gap-2 rounded-xl bg-lime-100/70 p-2">
      {TABS.map((t) => {
        const active = value === t;
        return (
          <button
            key={t}
            type="button"
            onClick={() => onChange(t)}
            className={cn(
              "flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition",
              active ? "bg-white text-slate-900 shadow-sm" : "text-slate-700 hover:bg-white/60"
            )}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}

function Seat({
  id,
  status = "free", // free | reserved | selected | sold
  onClick,
}) {
  const base =
    "relative flex h-10 w-10 items-center justify-center rounded-lg border text-xs font-bold select-none";
  const styles =
    status === "selected"
      ? "border-emerald-300 bg-emerald-100 text-emerald-800"
      : status === "reserved"
      ? "border-red-300 bg-red-100 text-red-800"
      : status === "sold"
      ? "border-slate-300 bg-slate-200 text-slate-600"
      : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(base, styles)}
      title={`Asiento ${id}`}
    >
      {id}
      <span className="absolute bottom-1 left-1 h-1.5 w-1.5 rounded-full bg-slate-300" />
      <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-slate-300" />
    </button>
  );
}

// Mock data
const MOCK_ROWS = [
  {
    estado: "Reservado",
    tipoDoc: "DNI",
    documento: "45528610",
    nombres: "Carlos",
    apellidos: "Venturo Villanueva",
    destino: "Lima",
    asiento: "11",
    precio: "S/. 50",
  },
  {
    estado: "Reservado",
    tipoDoc: "DNI",
    documento: "22368900",
    nombres: "Carlos",
    apellidos: "Venturo Villanueva",
    destino: "Huánuco",
    asiento: "23",
    precio: "S/. 60",
  },
];

// Construye dos pisos tipo maqueta (puedes ajustar)
function buildSeats() {
  // ids 1..27 (como maqueta). Marcamos algunos reservados/vendidos para demo
  const reserved = new Set([11, 23]);
  const sold = new Set([4, 6, 10, 16, 17, 20, 21, 25]);

  const seatStatus = {};
  for (let i = 1; i <= 27; i++) {
    seatStatus[i] = sold.has(i) ? "sold" : reserved.has(i) ? "reserved" : "free";
  }

  // piso 1: 1..15 (aprox), piso 2: 16..27
  const piso1 = Array.from({ length: 15 }, (_, idx) => idx + 1);
  const piso2 = Array.from({ length: 12 }, (_, idx) => idx + 16);

  return { seatStatus, piso1, piso2 };
}

export default function VentaBoletas() {
  const { seatStatus: initialStatus, piso1, piso2 } = useMemo(buildSeats, []);
  const [piso, setPiso] = useState("1er Piso");
  const [tab, setTab] = useState("Reservados");
  const [query, setQuery] = useState("");
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [statusMap, setStatusMap] = useState(initialStatus);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = MOCK_ROWS;

    if (!q) return base;
    return base.filter((r) => {
      const blob = Object.values(r).join(" ").toLowerCase();
      return blob.includes(q);
    });
  }, [query]);

  const currentSeats = piso === "1er Piso" ? piso1 : piso2;

  const onSeatClick = (seatId) => {
    const st = statusMap[seatId];
    if (st === "sold") return;

    setSelectedSeat(seatId);

    // UI: marcar como selected (y desmarcar el anterior)
    setStatusMap((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (next[k] === "selected") next[k] = "free";
      });
      next[seatId] = st === "reserved" ? "reserved" : "selected";
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Left: Seat map */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-slate-800">Mapa de Asientos</div>
              <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                {["1er Piso", "2do Piso"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPiso(p)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-semibold",
                      piso === p ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:bg-white/70"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm border border-slate-200 bg-white" />
                <span className="text-slate-600">Libre</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm border border-red-300 bg-red-100" />
                <span className="text-slate-600">Reservado</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm border border-emerald-300 bg-emerald-100" />
                <span className="text-slate-600">Seleccionado</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm border border-slate-300 bg-slate-200" />
                <span className="text-slate-600">Vendido</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-[1fr_auto] gap-3">
              {/* Seats grid */}
              <div className="grid grid-cols-3 gap-3">
                {currentSeats.map((id) => (
                  <Seat
                    key={id}
                    id={id}
                    status={statusMap[id]}
                    onClick={() => onSeatClick(id)}
                  />
                ))}
              </div>

              {/* Side labels like maqueta */}
              <div className="flex flex-col items-center justify-between gap-3">
                <div className="flex w-12 flex-col items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2 py-3">
                  <span className="text-[10px] font-semibold text-slate-600">ESCALERA</span>
                  <div className="h-16 w-full rounded-lg bg-white" />
                </div>
                <div className="flex w-12 flex-col items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2 py-3">
                  <span className="text-[10px] font-semibold text-slate-600">CONDUCTOR</span>
                  <div className="h-16 w-full rounded-lg bg-white" />
                </div>
              </div>
            </div>

            {/* Selected seat info */}
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-slate-700">Asiento seleccionado</div>
                {selectedSeat ? (
                  <Badge variant={statusMap[selectedSeat] === "reserved" ? "reserved" : "sold"}>
                    #{selectedSeat}
                  </Badge>
                ) : (
                  <span className="text-xs text-slate-500">—</span>
                )}
              </div>
              <div className="mt-2 text-xs text-slate-600">
                {selectedSeat
                  ? statusMap[selectedSeat] === "reserved"
                    ? "Este asiento está reservado (solo vista UI)."
                    : "Listo para completar la venta (solo vista UI)."
                  : "Haz click en un asiento para seleccionarlo."}
              </div>
            </div>
          </div>

          {/* Right: Panels */}
          <div className="space-y-4">
            <Section title="Descripción" tone="desc">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <div className="text-xs font-semibold text-slate-600">Ruta</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">Lima → Huánuco</div>
                  <div className="mt-1 text-xs text-slate-600">Servicio: Ejecutivo</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <div className="text-xs font-semibold text-slate-600">Salida</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">04:30 PM</div>
                  <div className="mt-1 text-xs text-slate-600">Fecha: 2026-02-18</div>
                </div>
              </div>
            </Section>

            <Section
              title="Detalle de Bus"
              tone="bus"
              right={
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700">Lista:</span>
                  <select className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700">
                    <option>5</option>
                    <option>10</option>
                    <option>25</option>
                  </select>
                </div>
              }
            >
              <div className="space-y-3">
                <Tabs value={tab} onChange={setTab} />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-700">Buscar:</span>
                    <div className="relative">
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar por DNI, nombre, destino, asiento..."
                        className="h-10 w-full min-w-[280px] rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        {/* lupa */}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M21 21l-4.3-4.3m1.3-5.2a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <IconButton title="Refrescar" onClick={() => {}}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M20 12a8 8 0 10-2.3 5.7M20 12v-6m0 6h-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </IconButton>
                    <IconButton title="Exportar" onClick={() => {}}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 3v12m0 0l4-4m-4 4l-4-4M5 21h14"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </IconButton>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead className="bg-slate-50 text-xs font-semibold text-slate-600">
                        <tr>
                          <th className="px-4 py-3">Estado</th>
                          <th className="px-4 py-3">Tipo Doc</th>
                          <th className="px-4 py-3">Documento</th>
                          <th className="px-4 py-3">Nombres</th>
                          <th className="px-4 py-3">Apellidos</th>
                          <th className="px-4 py-3">Destino</th>
                          <th className="px-4 py-3">Asiento</th>
                          <th className="px-4 py-3">Precio</th>
                          <th className="px-4 py-3 text-right">Seleccionar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {rows.map((r, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/60">
                            <td className="px-4 py-3">
                              <Badge variant={r.estado === "Reservado" ? "reserved" : "neutral"}>
                                {r.estado}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-slate-700">{r.tipoDoc}</td>
                            <td className="px-4 py-3 text-slate-700">{r.documento}</td>
                            <td className="px-4 py-3 text-slate-700">{r.nombres}</td>
                            <td className="px-4 py-3 text-slate-700">{r.apellidos}</td>
                            <td className="px-4 py-3 text-slate-700">{r.destino}</td>
                            <td className="px-4 py-3 font-semibold text-slate-900">{r.asiento}</td>
                            <td className="px-4 py-3 text-slate-700">{r.precio}</td>
                            <td className="px-4 py-3">
                              <div className="flex justify-end">
                                <IconButton
                                  title="Elegir asiento"
                                  onClick={() => onSeatClick(Number(r.asiento))}
                                >
                                  {/* cursor icon */}
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path
                                      d="M4 4l7.5 16 2.2-6.2L20 11.6 4 4z"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </IconButton>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {rows.length === 0 && (
                          <tr>
                            <td className="px-4 py-10 text-center text-slate-500" colSpan={9}>
                              No hay resultados para tu búsqueda.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Footer pagination */}
                  <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3">
                    <div className="text-xs text-slate-600">
                      {rows.length} registro(s) •{" "}
                      <button className="font-semibold text-sky-700 hover:underline" type="button">
                        Ver todo
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <span>1 de 1 página</span>
                      <div className="flex items-center gap-1">
                        <IconButton title="Anterior" onClick={() => {}}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M15 18l-6-6 6-6"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </IconButton>
                        <IconButton title="Siguiente" onClick={() => {}}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M9 18l6-6-6-6"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </IconButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}
