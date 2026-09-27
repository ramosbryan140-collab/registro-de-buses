import React, { useEffect, useMemo, useState } from "react";
import {
  Shield,
  UserCog,
  Search,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Check,
  ChevronDown,
  Lock,
  Users,
  RefreshCw,
} from "lucide-react";

const API_URL = "http://localhost:3000/api";

const PERMISOS_BASE = [
  {
    grupo: "Principal",
    permisos: [],
  },
  {
    grupo: "Registros",
    permisos: [
      "Registrar Buses",
      "Asignar Buses",
      "Registrar Terminal",
      "Registrar Serie de Boletos",
      "Rutas y Paradas",
      "Tipos de Buses",
    ],
  },
  {
    grupo: "Procesos",
    permisos: [
      "Venta de Boletos",
      "Crear Rutas",
      "Encomiendas",
      "Consultar Encomiendas",
    ],
  },
  {
    grupo: "Administrador",
    permisos: [
      "Registrar Personal",
      "Roles y Permisos",
    ],
  },
];

const DEFAULT_TEMPLATES = {
  Administrador: [
    "Registrar Buses",
    "Asignar Buses",
    "Registrar Terminal",
    "Registrar Serie de Boletos",
    "Rutas y Paradas",
    "Tipos de Buses",
    "Venta de Boletos",
    "Crear Rutas",
    "Encomiendas",
    "Consultar Encomiendas",
    "Registrar Personal",
    "Roles y Permisos",
  ],

  Vendedor: [
    "Venta de Boletos",
    "Consultar Encomiendas",
  ],

  Chofer: [
    "Consultar Encomiendas",
  ],
};

function getToken() {
  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token") ||
    ""
  );
}

async function apiFetch(url, options = {}) {
  const token = getToken();

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
      ...(options.headers || {}),
    },
  });

  const text = await response.text();

  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        data.error ||
        `Error ${response.status}`
    );
  }

  return data;
}

function nombreCompleto(persona) {
  if (!persona) return "";

  const nombres = persona.nombres || "";

  const apellidos =
    persona.apellidos ||
    [
      persona.apellido_paterno,
      persona.apellido_materno,
    ]
      .filter(Boolean)
      .join(" ");

  return `${nombres} ${apellidos}`.trim();
}

export default function Roles() {
  const [personal, setPersonal] = useState([]);
  const [roles, setRoles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [selectedPersonal, setSelectedPersonal] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [roleName, setRoleName] = useState("");
  const [editingRole, setEditingRole] = useState(null);

  const [permissions, setPermissions] = useState([]);

  /**
   * ==========================================================
   * CARGAR DATOS
   * ==========================================================
   */
  const cargarDatos = async () => {
    try {
      setLoading(true);

      const [personalData, rolesData] = await Promise.all([
        apiFetch(`${API_URL}/roles/personal`),
        apiFetch(`${API_URL}/roles`),
      ]);

      setPersonal(Array.isArray(personalData) ? personalData : []);
      setRoles(Array.isArray(rolesData) ? rolesData : []);
    } catch (error) {
      console.error(error);

      alert(
        error.message ||
          "No se pudieron cargar los datos de roles."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  /**
   * ==========================================================
   * FILTRO DE PERSONAL
   * ==========================================================
   */
  const personalFiltrado = useMemo(() => {
    const texto = search.toLowerCase().trim();

    if (!texto) return personal;

    return personal.filter((item) => {
      const nombre = nombreCompleto(item).toLowerCase();

      const dni = String(item.dni || "").toLowerCase();

      const usuario = String(
        item.usuario || ""
      ).toLowerCase();

      const cargo = String(
        item.cargo || ""
      ).toLowerCase();

      const rol = String(
        item.rol_nombre || ""
      ).toLowerCase();

      return (
        nombre.includes(texto) ||
        dni.includes(texto) ||
        usuario.includes(texto) ||
        cargo.includes(texto) ||
        rol.includes(texto)
      );
    });
  }, [personal, search]);

  /**
   * ==========================================================
   * SELECCIONAR PERSONAL
   * ==========================================================
   */
  const seleccionarPersonal = (item) => {
    setSelectedPersonal(item);

    setSelectedRole(
      item.rol_id
        ? String(item.rol_id)
        : ""
    );

    const nombreRol = item.rol_nombre;

    if (nombreRol && DEFAULT_TEMPLATES[nombreRol]) {
      setPermissions(
        DEFAULT_TEMPLATES[nombreRol]
      );
    } else {
      setPermissions([]);
    }
  };

  /**
   * ==========================================================
   * CAMBIAR ROL SELECCIONADO
   * ==========================================================
   */
  const handleRoleChange = (roleId) => {
    setSelectedRole(roleId);

    const role = roles.find(
      (item) =>
        String(item.id) === String(roleId)
    );

    if (role && DEFAULT_TEMPLATES[role.nombre]) {
      setPermissions(
        DEFAULT_TEMPLATES[role.nombre]
      );
    } else {
      setPermissions([]);
    }
  };

  /**
   * ==========================================================
   * GUARDAR ASIGNACIÓN DE ROL
   * ==========================================================
   */
  const guardarRol = async () => {
    if (!selectedPersonal) {
      alert("Selecciona un personal.");
      return;
    }

    if (!selectedPersonal.usuario_id) {
      alert(
        "Este personal no tiene un usuario registrado en el sistema."
      );
      return;
    }

    if (!selectedRole) {
      alert("Selecciona un rol.");
      return;
    }

    try {
      setSaving(true);

      await apiFetch(
        `${API_URL}/roles/usuario/${selectedPersonal.usuario_id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            rol_id: Number(selectedRole),
          }),
        }
      );

      alert("Rol asignado correctamente.");

      await cargarDatos();

      const actualizado = personal.find(
        (item) =>
          item.personal_id ===
          selectedPersonal.personal_id
      );

      if (actualizado) {
        setSelectedPersonal({
          ...actualizado,
          rol_id: Number(selectedRole),
          rol_nombre:
            roles.find(
              (r) =>
                Number(r.id) ===
                Number(selectedRole)
            )?.nombre || "",
        });
      }
    } catch (error) {
      console.error(error);

      alert(
        error.message ||
          "No se pudo asignar el rol."
      );
    } finally {
      setSaving(false);
    }
  };

  /**
   * ==========================================================
   * CREAR ROL
   * ==========================================================
   */
  const crearRol = async () => {
    const nombre = roleName.trim();

    if (!nombre) {
      alert("Escribe el nombre del rol.");
      return;
    }

    try {
      setSaving(true);

      await apiFetch(`${API_URL}/roles`, {
        method: "POST",
        body: JSON.stringify({
          nombre,
        }),
      });

      alert("Rol creado correctamente.");

      setRoleName("");
      setShowRoleModal(false);

      await cargarDatos();
    } catch (error) {
      console.error(error);

      alert(
        error.message ||
          "No se pudo crear el rol."
      );
    } finally {
      setSaving(false);
    }
  };

  /**
   * ==========================================================
   * EDITAR ROL
   * ==========================================================
   */
  const abrirEditarRol = (role) => {
    setEditingRole(role);
    setRoleName(role.nombre);
    setShowEditModal(true);
  };

  const actualizarRol = async () => {
    if (!editingRole) return;

    const nombre = roleName.trim();

    if (!nombre) {
      alert("Escribe el nombre del rol.");
      return;
    }

    try {
      setSaving(true);

      await apiFetch(
        `${API_URL}/roles/${editingRole.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            nombre,
          }),
        }
      );

      alert("Rol actualizado correctamente.");

      setRoleName("");
      setEditingRole(null);
      setShowEditModal(false);

      await cargarDatos();
    } catch (error) {
      console.error(error);

      alert(
        error.message ||
          "No se pudo actualizar el rol."
      );
    } finally {
      setSaving(false);
    }
  };

  /**
   * ==========================================================
   * ELIMINAR ROL
   * ==========================================================
   */
  const eliminarRol = async (role) => {
    const confirmar = window.confirm(
      `¿Deseas eliminar el rol "${role.nombre}"?`
    );

    if (!confirmar) return;

    try {
      setSaving(true);

      await apiFetch(
        `${API_URL}/roles/${role.id}`,
        {
          method: "DELETE",
        }
      );

      alert("Rol eliminado correctamente.");

      if (
        selectedRole &&
        Number(selectedRole) ===
          Number(role.id)
      ) {
        setSelectedRole("");
      }

      await cargarDatos();
    } catch (error) {
      console.error(error);

      alert(
        error.message ||
          "No se pudo eliminar el rol."
      );
    } finally {
      setSaving(false);
    }
  };

  /**
   * ==========================================================
   * PERMISOS
   * ==========================================================
   */
  const togglePermission = (permiso) => {
    setPermissions((actuales) => {
      if (actuales.includes(permiso)) {
        return actuales.filter(
          (item) => item !== permiso
        );
      }

      return [...actuales, permiso];
    });
  };

  /**
   * ==========================================================
   * ESTADÍSTICAS
   * ==========================================================
   */
  const totalConUsuario = personal.filter(
    (item) => item.usuario_id
  ).length;

  const totalConRol = personal.filter(
    (item) => item.usuario_id && item.rol_id
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* =====================================================
            ENCABEZADO
        ====================================================== */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <div>
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Shield
                  className="text-purple-600"
                  size={28}
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Roles y Permisos
                </h1>

                <p className="text-sm text-gray-500">
                  Gestión de roles del personal del sistema
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">

            <button
              onClick={cargarDatos}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
            >
              <RefreshCw
                size={18}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              Actualizar
            </button>

            <button
              onClick={() =>
                setShowRoleModal(true)
              }
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Plus size={18} />

              Nuevo rol
            </button>
          </div>
        </div>

        {/* =====================================================
            ESTADÍSTICAS
        ====================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Personal registrado
                </p>

                <p className="text-2xl font-bold text-gray-800">
                  {personal.length}
                </p>
              </div>

              <Users
                className="text-blue-500"
                size={28}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Usuarios con cuenta
                </p>

                <p className="text-2xl font-bold text-gray-800">
                  {totalConUsuario}
                </p>
              </div>

              <UserCog
                className="text-green-500"
                size={28}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Usuarios con rol
                </p>

                <p className="text-2xl font-bold text-gray-800">
                  {totalConRol}
                </p>
              </div>

              <Shield
                className="text-purple-500"
                size={28}
              />
            </div>
          </div>

        </div>

        {/* =====================================================
            CONTENIDO
        ====================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ===================================================
              LISTA DE PERSONAL
          ==================================================== */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">

            <div className="p-5 border-b border-gray-200">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>
                  <h2 className="font-bold text-gray-800">
                    Personal y roles
                  </h2>

                  <p className="text-sm text-gray-500">
                    Selecciona un trabajador para asignarle un rol
                  </p>
                </div>

                <div className="relative">

                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Buscar personal..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 w-full md:w-64"
                  />

                </div>

              </div>

            </div>

            <div className="overflow-x-auto">

              {loading ? (
                <div className="p-10 text-center text-gray-500">
                  Cargando información...
                </div>
              ) : personalFiltrado.length === 0 ? (
                <div className="p-10 text-center text-gray-500">
                  No se encontró personal.
                </div>
              ) : (

                <table className="w-full">

                  <thead className="bg-gray-50">

                    <tr>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                        Personal
                      </th>

                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                        Usuario
                      </th>

                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                        Cargo
                      </th>

                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                        Rol
                      </th>
                    </tr>

                  </thead>

                  <tbody className="divide-y divide-gray-100">

                    {personalFiltrado.map((item) => {

                      const seleccionado =
                        selectedPersonal?.personal_id ===
                        item.personal_id;

                      return (
                        <tr
                          key={item.personal_id}
                          onClick={() =>
                            seleccionarPersonal(item)
                          }
                          className={`cursor-pointer transition ${
                            seleccionado
                              ? "bg-purple-50"
                              : "hover:bg-gray-50"
                          }`}
                        >

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-semibold">
                                {(
                                  item.nombres ||
                                  "?"
                                )
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div>

                                <p className="font-medium text-gray-800">
                                  {nombreCompleto(
                                    item
                                  )}
                                </p>

                                <p className="text-xs text-gray-500">
                                  DNI:{" "}
                                  {item.dni ||
                                    "Sin DNI"}
                                </p>

                              </div>

                            </div>

                          </td>

                          <td className="px-5 py-4">

                            {item.usuario ? (
                              <span className="text-gray-700">
                                {item.usuario}
                              </span>
                            ) : (
                              <span className="text-xs text-orange-500">
                                Sin usuario
                              </span>
                            )}

                          </td>

                          <td className="px-5 py-4">

                            <span className="text-gray-600">
                              {item.cargo ||
                                "Sin cargo"}
                            </span>

                          </td>

                          <td className="px-5 py-4">

                            {item.rol_nombre ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
                                {item.rol_nombre}
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs">
                                Sin rol
                              </span>
                            )}

                          </td>

                        </tr>
                      );
                    })}

                  </tbody>

                </table>
              )}

            </div>
          </div>

          {/* ===================================================
              PANEL DE ASIGNACIÓN
          ==================================================== */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

            <div className="p-5 border-b border-gray-200">

              <div className="flex items-center gap-3">

                <div className="bg-purple-100 p-2 rounded-lg">
                  <Shield
                    size={20}
                    className="text-purple-600"
                  />
                </div>

                <div>
                  <h2 className="font-bold text-gray-800">
                    Asignar rol
                  </h2>

                  <p className="text-xs text-gray-500">
                    Rol del usuario seleccionado
                  </p>
                </div>

              </div>

            </div>

            <div className="p-5">

              {!selectedPersonal ? (

                <div className="text-center py-10">

                  <UserCog
                    size={42}
                    className="mx-auto text-gray-300 mb-3"
                  />

                  <p className="text-gray-500">
                    Selecciona un personal
                  </p>

                </div>

              ) : (

                <div className="space-y-5">

                  {/* PERSONA */}

                  <div className="bg-gray-50 rounded-xl p-4">

                    <p className="text-xs text-gray-500 mb-1">
                      Personal seleccionado
                    </p>

                    <p className="font-semibold text-gray-800">
                      {nombreCompleto(
                        selectedPersonal
                      )}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      DNI:{" "}
                      {selectedPersonal.dni ||
                        "Sin DNI"}
                    </p>

                    <p className="text-sm text-gray-500">
                      Usuario:{" "}
                      {selectedPersonal.usuario ||
                        "Sin usuario"}
                    </p>

                    {!selectedPersonal.usuario_id && (
                      <div className="mt-3 bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-700">
                        Este personal no tiene una cuenta
                        de usuario asociada.
                      </div>
                    )}

                  </div>

                  {/* ROL */}

                  <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rol
                    </label>

                    <div className="relative">

                      <select
                        value={selectedRole}
                        onChange={(e) =>
                          handleRoleChange(
                            e.target.value
                          )
                        }
                        disabled={
                          !selectedPersonal.usuario_id
                        }
                        className="w-full appearance-none border border-gray-300 rounded-lg px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:text-gray-400"
                      >

                        <option value="">
                          Seleccionar rol
                        </option>

                        {roles.map((role) => (
                          <option
                            key={role.id}
                            value={role.id}
                          >
                            {role.nombre}
                          </option>
                        ))}

                      </select>

                      <ChevronDown
                        size={18}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />

                    </div>

                  </div>

                  {/* PERMISOS */}

                  <div>

                    <div className="flex items-center justify-between mb-3">

                      <label className="text-sm font-medium text-gray-700">
                        Permisos del módulo
                      </label>

                      <Lock
                        size={16}
                        className="text-gray-400"
                      />

                    </div>

                    <div className="space-y-4">

                      {PERMISOS_BASE.map(
                        (grupo) => {

                          if (
                            !grupo.permisos.length
                          ) {
                            return null;
                          }

                          return (
                            <div
                              key={grupo.grupo}
                            >

                              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                                {grupo.grupo}
                              </p>

                              <div className="space-y-2">

                                {grupo.permisos.map(
                                  (permiso) => {

                                    const activo =
                                      permissions.includes(
                                        permiso
                                      );

                                    return (
                                      <label
                                        key={
                                          permiso
                                        }
                                        className="flex items-center gap-3 cursor-pointer"
                                      >

                                        <input
                                          type="checkbox"
                                          checked={
                                            activo
                                          }
                                          onChange={() =>
                                            togglePermission(
                                              permiso
                                            )
                                          }
                                          className="w-4 h-4 accent-purple-600"
                                        />

                                        <span
                                          className={`text-sm ${
                                            activo
                                              ? "text-gray-800"
                                              : "text-gray-500"
                                          }`}
                                        >
                                          {
                                            permiso
                                          }
                                        </span>

                                      </label>
                                    );
                                  }
                                )}

                              </div>

                            </div>
                          );
                        }
                      )}

                    </div>

                  </div>

                  {/* BOTÓN */}

                  <button
                    onClick={guardarRol}
                    disabled={
                      saving ||
                      !selectedPersonal.usuario_id ||
                      !selectedRole
                    }
                    className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition"
                  >

                    <Save size={18} />

                    {saving
                      ? "Guardando..."
                      : "Guardar asignación"}

                  </button>

                </div>
              )}

            </div>
          </div>
        </div>

        {/* =====================================================
            ROLES REGISTRADOS
        ====================================================== */}
        <div className="mt-6 bg-white rounded-xl border border-gray-200 overflow-hidden">

          <div className="p-5 border-b border-gray-200">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="font-bold text-gray-800">
                  Roles registrados
                </h2>

                <p className="text-sm text-gray-500">
                  Roles existentes en la base de datos
                </p>
              </div>

              <span className="text-sm text-gray-500">
                {roles.length} rol(es)
              </span>

            </div>

          </div>

          <div className="p-5">

            {roles.length === 0 ? (

              <div className="text-center py-8 text-gray-500">
                No existen roles registrados.
              </div>

            ) : (

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                {roles.map((role) => {

                  const cantidad =
                    personal.filter(
                      (item) =>
                        Number(item.rol_id) ===
                        Number(role.id)
                    ).length;

                  return (
                    <div
                      key={role.id}
                      className="border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition"
                    >

                      <div className="flex items-start justify-between gap-3">

                        <div className="flex items-center gap-3">

                          <div className="bg-purple-100 p-2 rounded-lg">
                            <Shield
                              size={20}
                              className="text-purple-600"
                            />
                          </div>

                          <div>

                            <p className="font-semibold text-gray-800">
                              {role.nombre}
                            </p>

                            <p className="text-xs text-gray-500">
                              {cantidad} usuario(s)
                            </p>

                          </div>

                        </div>

                        <div className="flex items-center gap-1">

                          <button
                            onClick={() =>
                              abrirEditarRol(
                                role
                              )
                            }
                            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600"
                            title="Editar rol"
                          >
                            <Edit size={16} />
                          </button>

                          <button
                            onClick={() =>
                              eliminarRol(
                                role
                              )
                            }
                            className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                            title="Eliminar rol"
                          >
                            <Trash2
                              size={16}
                            />
                          </button>

                        </div>

                      </div>

                    </div>
                  );
                })}

              </div>
            )}

          </div>

        </div>

      </div>

      {/* =======================================================
          MODAL NUEVO ROL
      ======================================================== */}
      {showRoleModal && (

        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">

            <div className="flex items-center justify-between p-5 border-b border-gray-200">

              <div>
                <h3 className="font-bold text-gray-800">
                  Nuevo rol
                </h3>

                <p className="text-sm text-gray-500">
                  Registrar un nuevo rol
                </p>
              </div>

              <button
                onClick={() =>
                  setShowRoleModal(false)
                }
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={18} />
              </button>

            </div>

            <div className="p-5">

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del rol
              </label>

              <input
                type="text"
                value={roleName}
                onChange={(e) =>
                  setRoleName(e.target.value)
                }
                placeholder="Ej. Supervisor"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    crearRol();
                  }
                }}
              />

            </div>

            <div className="flex justify-end gap-3 p-5 border-t border-gray-200">

              <button
                onClick={() =>
                  setShowRoleModal(false)
                }
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                Cancelar
              </button>

              <button
                onClick={crearRol}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white"
              >
                {saving
                  ? "Guardando..."
                  : "Crear rol"}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =======================================================
          MODAL EDITAR ROL
      ======================================================== */}
      {showEditModal && editingRole && (

        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">

            <div className="flex items-center justify-between p-5 border-b border-gray-200">

              <div>
                <h3 className="font-bold text-gray-800">
                  Editar rol
                </h3>

                <p className="text-sm text-gray-500">
                  Modificar nombre del rol
                </p>
              </div>

              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingRole(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={18} />
              </button>

            </div>

            <div className="p-5">

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del rol
              </label>

              <input
                type="text"
                value={roleName}
                onChange={(e) =>
                  setRoleName(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
              />

            </div>

            <div className="flex justify-end gap-3 p-5 border-t border-gray-200">

              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingRole(null);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                Cancelar
              </button>

              <button
                onClick={actualizarRol}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white"
              >

                <Check size={18} />

                {saving
                  ? "Guardando..."
                  : "Guardar cambios"}

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}