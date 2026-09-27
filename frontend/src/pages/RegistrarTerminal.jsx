import React, { useEffect, useMemo, useState } from "react";
import { Save, Search, Pencil, Trash2, MapPin, Building2, X } from "lucide-react";

const API_URL = "http://localhost:3000/api";

function getToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token") || "";
}

async function apiRequest(path, options = {}) {
  const token = getToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!response.ok) throw new Error(data?.message || "Error en la solicitud");
  return data;
}

const emptyForm = { sede: "", distrito: "", direccion: "" };

const RegistrarTerminal = () => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      setLoading(true); setError("");
      const rows = await apiRequest("/terminales?limit=500");
      setData(Array.isArray(rows) ? rows : []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onGuardar = async (e) => {
    e.preventDefault();
    if (!form.sede.trim() || !form.distrito.trim() || !form.direccion.trim()) {
      setError("Completa sede, distrito y dirección."); return;
    }
    try {
      setSaving(true); setError(""); setMessage("");
      if (editingId) {
        await apiRequest(`/terminales/${editingId}`, { method: "PUT", body: JSON.stringify(form) });
        setMessage("Sede actualizada correctamente.");
      } else {
        await apiRequest("/terminales", { method: "POST", body: JSON.stringify(form) });
        setMessage("Sede guardada correctamente.");
      }
      setForm(emptyForm); setEditingId(null); await loadData();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const editar = (item) => {
    setEditingId(item.id);
    setForm({ sede: item.sede || "", distrito: item.distrito || "", direccion: item.direccion || "" });
    setError(""); setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta sede?")) return;
    try {
      setError(""); setMessage("");
      await apiRequest(`/terminales/${id}`, { method: "DELETE" });
      setMessage("Sede eliminada correctamente."); await loadData();
    } catch (e) { setError(e.message); }
  };

  const toggleEstado = async (id) => {
    try {
      setError("");
      await apiRequest(`/terminales/${id}/toggle`, { method: "PUT" });
      await loadData();
    } catch (e) { setError(e.message); }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter((x) => `${x.sede || ""} ${x.distrito || ""} ${x.direccion || ""}`.toLowerCase().includes(q));
  }, [data, query]);

  const inputBase = "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";
  const labelBase = "text-xs font-semibold text-slate-700";

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <div className="w-full px-6 py-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-sm"><Building2 className="h-5 w-5" /></div>
            <div><h1 className="text-2xl md:text-3xl font-bold text-slate-900">Registrar Sedes</h1><p className="text-sm text-slate-600">Administra sedes, distritos y direcciones.</p></div>
          </div>
        </div>

        {(error || message) && <div className={`mb-4 rounded-xl border px-4 py-3 text-sm ${error ? "border-rose-200 bg-rose-50 text-rose-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>{error || message}</div>}

        <form onSubmit={onGuardar} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-5 py-4"><div className="font-semibold text-base">{editingId ? "Editar sede" : "Formulario"}</div><div className="text-xs text-white/80">Completa los campos y guarda la sede</div></div>
          <div className="p-5"><div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1"><label className={labelBase}><span className="inline-flex items-center gap-2"><Building2 className="h-4 w-4 text-slate-500" />Nombre de Sede</span></label><input name="sede" value={form.sede} onChange={handleChange} className={inputBase} placeholder="Ej. Lima" /></div>
            <div className="flex flex-col gap-1"><label className={labelBase}><span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-500" />Distrito</span></label><input name="distrito" value={form.distrito} onChange={handleChange} className={inputBase} placeholder="Ej. La Victoria" /></div>
            <div className="flex flex-col gap-1"><label className={labelBase}>Dirección</label><div className="flex gap-2"><input name="direccion" value={form.direccion} onChange={handleChange} className={inputBase} placeholder="Ej. Av. Mariscal Castilla Nº 1234" /><button disabled={saving} type="submit" className="h-11 shrink-0 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"><Save className="h-4 w-4" />{saving ? "..." : "Guardar"}</button></div></div>
          </div>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"><X className="h-4 w-4" />Cancelar edición</button>}</div>
        </form>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm p-4"><div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"><div className="relative w-full lg:max-w-md"><Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por sede, distrito o dirección..." className={["pl-10", inputBase].join(" ")} /></div><div className="flex items-center gap-2 justify-end"><span className="text-sm font-semibold text-slate-700">Lista:</span><select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm"><option value={5}>5</option><option value={10}>10</option><option value={25}>25</option><option value={50}>50</option></select></div></div></div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"><div className="overflow-x-auto"><table className="min-w-[900px] w-full text-sm"><thead className="bg-slate-900 text-white"><tr className="text-left">{["Lista de Sedes","Distrito","Dirección","Estado","Acciones"].map(h => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr></thead><tbody className="divide-y divide-slate-200">
          {loading ? <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-500">Cargando sedes desde MySQL...</td></tr> : filtered.slice(0,pageSize).map(sede => { const activo = String(sede.estado ?? "Activo").toLowerCase() === "activo" || sede.estado === 1 || sede.estado === true; return <tr key={sede.id} className="hover:bg-slate-50"><td className="px-4 py-3 font-medium text-slate-900">{sede.sede}</td><td className="px-4 py-3 text-slate-700">{sede.distrito}</td><td className="px-4 py-3 text-slate-700">{sede.direccion}</td><td className="px-4 py-3"><button type="button" onClick={() => toggleEstado(sede.id)} className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border ${activo ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"}`}><span className={`h-2 w-2 rounded-full ${activo ? "bg-emerald-600" : "bg-rose-600"}`} />{activo ? "Activo" : "Inactivo"}</button></td><td className="px-4 py-3"><div className="flex items-center gap-2"><button type="button" onClick={() => editar(sede)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"><Pencil className="h-4 w-4" />Editar</button><button type="button" onClick={() => eliminar(sede.id)} className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700"><Trash2 className="h-4 w-4" />Eliminar</button></div></td></tr>; })}
          {!loading && filtered.length===0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-500">No se encontraron sedes.</td></tr>}
        </tbody></table></div><div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 text-xs text-slate-500"><span>Mostrando {Math.min(pageSize,filtered.length)} de {filtered.length} registros</span><span className="font-semibold text-slate-700">Mikervip</span></div></div>
      </div>
    </div>
  );
};

export default RegistrarTerminal;
