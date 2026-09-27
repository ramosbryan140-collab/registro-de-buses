import React, { useMemo, useState } from "react";

function cn(...c) {
  return c.filter(Boolean).join(" ");
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

function Badge({ variant = "neutral", children }) {
  const styles =
    variant === "en_transito"
      ? "bg-amber-100 text-amber-700 border-amber-200"
      : variant === "recepcionado"
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : variant === "entregado"
      ? "bg-sky-100 text-sky-700 border-sky-200"
      : "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-bold", styles)}>
      {children}
    </span>
  );
}

function MiniButton({ children, variant = "teal", ...props }) {
  const styles =
    variant === "teal"
      ? "bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800"
      : variant === "green"
      ? "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800"
      : variant === "blue"
      ? "bg-sky-600 text-white hover:bg-sky-700 active:bg-sky-800"
      : "bg-slate-600 text-white hover:bg-slate-700 active:bg-slate-800";

  return (
    <button
      type="button"
      {...props}
      className={cn(
        "inline-flex h-7 items-center justify-center rounded-md px-2 text-[11px] font-extrabold",
        styles
      )}
    >
      {children}
    </button>
  );
}

function IconButton({ title, variant = "gray", ...props }) {
  const styles =
    variant === "yellow"
      ? "border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
      : variant === "blue"
      ? "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100"
      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50";

  return (
    <button
      type="button"
      title={title}
      {...props}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md border",
        "active:scale-[0.98]",
        styles
      )}
    >
      {props.children}
    </button>
  );
}

const MOCK = [
  {
    id: "1",
    rem: { tipo: "DNI", doc: "45682232", nombre: "Jazmick Mariela", tel: "963124500" },
    rec: { tipo: "DNI", doc: "45682223", nombre: "Hernan", tel: "963124500" },
    trans: { origen: "Lima", destino: "Huánuco", bus: "ATC - 231", fecha: "10/10/2025", hora: "08:30 pm" },
    recep: { estado: "Recepcionado", fecha: "10/10/2025", hora: "08:30 pm" },
    entr: { estado: "Entregado", fecha: "10/10/2025", hora: "08:30 pm" },
    obs: "",
  },
  {
    id: "2",
    rem: { tipo: "DNI", doc: "56622230", nombre: "Ramirez", tel: "96622230" },
    rec: { tipo: "DNI", doc: "56622230", nombre: "Carmen Luz", tel: "96622230" },
    trans: { origen: "Huánuco", destino: "Lima", bus: "ATC - 241", fecha: "10/10/2025", hora: "08:30 pm" },
    recep: { estado: "En tránsito", fecha: "—", hora: "—" },
    entr: { estado: "—", fecha: "—", hora: "—" },
    obs: "",
  },
  {
    id: "3",
    rem: { tipo: "DNI", doc: "66222312", nombre: "Carmen Luz", tel: "96622230" },
    rec: { tipo: "DNI", doc: "66222312", nombre: "Trujillo Becerra", tel: "96622230" },
    trans: { origen: "Huánuco", destino: "Lima", bus: "ATC - 221", fecha: "10/10/2025", hora: "08:30 pm" },
    recep: { estado: "Recepcionado", fecha: "10/10/2025", hora: "08:30 pm" },
    entr: { estado: "—", fecha: "—", hora: "—" },
    obs: "—",
  },
];

export default function ConsultarEncomiendas() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState(""); // en_transito | recepcionado | entregado
  const [pageSize, setPageSize] = useState(10);

  const rows = useMemo(() => {
    const text = q.trim().toLowerCase();
    let data = MOCK;

    if (filter) {
      data = data.filter((r) => {
        const st = (r.entr.estado || "").toLowerCase();
        const rc = (r.recep.estado || "").toLowerCase();

        if (filter === "entregado") return st.includes("entregado");
        if (filter === "recepcionado") return rc.includes("recepcionado");
        if (filter === "en_transito") return rc.includes("tránsito") || rc.includes("transito") || rc.includes("en tránsito");
        return true;
      });
    }

    if (!text) return data.slice(0, pageSize);

    const filtered = data.filter((r) => {
      const blob = [
        r.rem.tipo,
        r.rem.doc,
        r.rem.nombre,
        r.rem.tel,
        r.rec.tipo,
        r.rec.doc,
        r.rec.nombre,
        r.rec.tel,
        r.trans.origen,
        r.trans.destino,
        r.trans.bus,
        r.trans.fecha,
        r.trans.hora,
        r.recep.estado,
        r.entr.estado,
        r.obs,
      ]
        .join(" ")
        .toLowerCase();
      return blob.includes(text);
    });

    return filtered.slice(0, pageSize);
  }, [q, filter, pageSize]);

  const chipFromRow = (r) => {
    const entregado = (r.entr.estado || "").toLowerCase().includes("entregado");
    const recep = (r.recep.estado || "").toLowerCase().includes("recepcionado");
    const trans = (r.recep.estado || "").toLowerCase().includes("tránsito") || (r.recep.estado || "").toLowerCase().includes("transito");
    if (entregado) return <Badge variant="entregado">Entregado</Badge>;
    if (recep) return <Badge variant="recepcionado">Recepcionado</Badge>;
    if (trans) return <Badge variant="en_transito">En tránsito</Badge>;
    return <Badge>—</Badge>;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        {/* Toolbar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-3 md:items-end">
            <div className="md:col-span-1">
              <Label>Buscar</Label>
              <div className="relative">
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="DNI • NOMBRE • ORIGEN • DESTINO"
                  className="pl-10"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
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

            <div className="md:col-span-1">
              <Label>Filtrar</Label>
              <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="">Seleccione</option>
                <option value="en_transito">En tránsito</option>
                <option value="recepcionado">Recepcionado</option>
                <option value="entregado">Entregado</option>
              </Select>
            </div>

            <div className="md:col-span-1 flex items-end justify-end gap-2">
              <div className="text-xs font-semibold text-slate-600">Lista</div>
              <Select
                className="w-28"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </Select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Header groups (like screenshot) */}
          <div className="grid grid-cols-12 text-xs font-extrabold text-white">
            <div className="col-span-3 bg-teal-600 px-4 py-2 text-center">Remitente</div>
            <div className="col-span-3 bg-sky-600 px-4 py-2 text-center">Receptor</div>
            <div className="col-span-3 bg-amber-500 px-4 py-2 text-center">En tránsito</div>
            <div className="col-span-1 bg-emerald-600 px-4 py-2 text-center">Recepcionado</div>
            <div className="col-span-1 bg-sky-600 px-4 py-2 text-center">Entregado</div>
            <div className="col-span-1 bg-slate-600 px-4 py-2 text-center">Obs.</div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1100px] w-full text-left text-sm">
              <thead className="bg-slate-50 text-[11px] font-extrabold text-slate-600">
                <tr>
                  {/* Remitente */}
                  <th className="px-3 py-3">Tipo</th>
                  <th className="px-3 py-3">Documento</th>
                  <th className="px-3 py-3">Remitente</th>
                  <th className="px-3 py-3">Teléfono</th>

                  {/* Receptor */}
                  <th className="px-3 py-3">Tipo</th>
                  <th className="px-3 py-3">Documento</th>
                  <th className="px-3 py-3">Receptor</th>
                  <th className="px-3 py-3">Teléfono</th>

                  {/* En tránsito */}
                  <th className="px-3 py-3">Origen</th>
                  <th className="px-3 py-3">Destino</th>
                  <th className="px-3 py-3">Bus de Envío</th>
                  <th className="px-3 py-3">Fecha / Hora</th>

                  {/* Recepcionado */}
                  <th className="px-3 py-3">Tipo seguimiento</th>
                  <th className="px-3 py-3">Fecha / Hora</th>

                  {/* Entregado */}
                  <th className="px-3 py-3">Tipo seguimiento</th>
                  <th className="px-3 py-3">Fecha / Hora</th>

                  {/* Observaciones + acciones */}
                  <th className="px-3 py-3">Observaciones</th>
                  <th className="px-3 py-3 text-right">Acción</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60">
                    <td className="px-3 py-3 text-slate-700">{r.rem.tipo}</td>
                    <td className="px-3 py-3 text-slate-700">{r.rem.doc}</td>
                    <td className="px-3 py-3 text-slate-700">{r.rem.nombre}</td>
                    <td className="px-3 py-3 text-slate-700">{r.rem.tel}</td>

                    <td className="px-3 py-3 text-slate-700">{r.rec.tipo}</td>
                    <td className="px-3 py-3 text-slate-700">{r.rec.doc}</td>
                    <td className="px-3 py-3 text-slate-700">{r.rec.nombre}</td>
                    <td className="px-3 py-3 text-slate-700">{r.rec.tel}</td>

                    <td className="px-3 py-3 text-slate-700">{r.trans.origen}</td>
                    <td className="px-3 py-3 text-slate-700">{r.trans.destino}</td>
                    <td className="px-3 py-3 text-slate-700">{r.trans.bus}</td>
                    <td className="px-3 py-3 text-slate-700">
                      {r.trans.fecha} <span className="text-slate-400">•</span> {r.trans.hora}
                    </td>

                    <td className="px-3 py-3">{chipFromRow(r)}</td>
                    <td className="px-3 py-3 text-slate-700">
                      {r.recep.fecha}{" "}
                      <span className="text-slate-400">{r.recep.hora !== "—" ? "•" : ""}</span>{" "}
                      {r.recep.hora}
                    </td>

                    <td className="px-3 py-3">
                      {(r.entr.estado || "").toLowerCase().includes("entregado") ? (
                        <Badge variant="entregado">Entregado</Badge>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-slate-700">
                      {r.entr.fecha}{" "}
                      <span className="text-slate-400">{r.entr.hora !== "—" ? "•" : ""}</span>{" "}
                      {r.entr.hora}
                    </td>

                    <td className="px-3 py-3 text-slate-600">{r.obs || "—"}</td>

                    <td className="px-3 py-3">
                      <div className="flex justify-end gap-2">
                        {/* acciones similares a la maqueta */}
                        <MiniButton
                          variant="teal"
                          onClick={() => {}}
                          title="Enviar"
                        >
                          Enviar
                        </MiniButton>

                        <MiniButton
                          variant="green"
                          onClick={() => {}}
                          title="Recepcionar"
                        >
                          Recepcionar
                        </MiniButton>

                        <IconButton title="Ver" variant="yellow" onClick={() => {}}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path
                              d="M12 15a3 3 0 100-6 3 3 0 000 6z"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                          </svg>
                        </IconButton>

                        <IconButton title="Editar" variant="blue" onClick={() => {}}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M12 20h9"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <path
                              d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z"
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
                    <td colSpan={18} className="px-4 py-12 text-center text-slate-500">
                      No hay resultados para tu búsqueda/filtro.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3">
            <div className="text-xs text-slate-600">
              Mostrando <span className="font-bold text-slate-900">{rows.length}</span> registro(s)
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
    </div>
  );
}
