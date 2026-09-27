import React, { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2, UploadCloud, UserRound } from "lucide-react";

/**
 * API
 */
const API_URL = "http://localhost:3000/api";

/**
 * -----------------------------
 * DATA UBIGEO
 * -----------------------------
 */
const UBIGEO = {
  Lima: {
    Lima: [
      "Cercado de Lima",
      "Ate",
      "Barranco",
      "Breña",
      "Chorrillos",
      "Comas",
      "El Agustino",
      "Independencia",
      "Jesús María",
      "La Molina",
      "La Victoria",
      "Lince",
      "Los Olivos",
      "Magdalena del Mar",
      "Miraflores",
      "Pueblo Libre",
      "Puente Piedra",
      "Rímac",
      "San Borja",
      "San Isidro",
      "San Juan de Lurigancho",
      "San Juan de Miraflores",
      "San Luis",
      "San Martín de Porres",
      "San Miguel",
      "Santa Anita",
      "Santiago de Surco",
      "Surquillo",
      "Villa El Salvador",
      "Villa María del Triunfo",
    ],
    Huaral: [
      "Huaral",
      "Aucallama",
      "Chancay",
      "Ihuari",
      "Lampian",
      "Pacaraos",
    ],
    Cañete: [
      "San Vicente de Cañete",
      "Imperial",
      "Asia",
      "Chilca",
      "Mala",
    ],
  },

  Callao: {
    Callao: [
      "Callao",
      "Bellavista",
      "Carmen de la Legua Reynoso",
      "La Perla",
      "La Punta",
      "Ventanilla",
      "Mi Perú",
    ],
  },
};

/**
 * -----------------------------
 * HELPERS UBIGEO
 * -----------------------------
 */
const getDepartments = () => Object.keys(UBIGEO);

const getProvinces = (department) => {
  if (!department || !UBIGEO[department]) return [];
  return Object.keys(UBIGEO[department]);
};

const getDistricts = (department, province) => {
  if (!department || !province) return [];

  const prov = UBIGEO?.[department]?.[province];

  return Array.isArray(prov) ? prov : [];
};

const normalizeIfNotInList = (value, list) => {
  if (!value) return "";
  return list.includes(value) ? value : "";
};

/**
 * -----------------------------
 * TOKEN
 * -----------------------------
 */
const getToken = () => {
  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token") ||
    ""
  );
};

/**
 * -----------------------------
 * PETICIÓN API
 * -----------------------------
 */
const apiRequest = async (url, options = {}) => {
  const token = getToken();

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Error HTTP ${response.status}`;

    throw new Error(message);
  }

  return data;
};

/**
 * -----------------------------
 * CONVERTIR BD → FORMULARIO
 * -----------------------------
 */
const mapFromApi = (row) => {
  return {
    id: row.id,

    documentType: row.tipo_documento || "DNI",

    documentNumber: row.dni || "",

    fullName: row.nombres || "",

    paternalLastName:
      row.apellido_paterno ||
      (row.apellidos ? String(row.apellidos).split(" ")[0] : ""),

    maternalLastName:
      row.apellido_materno ||
      (row.apellidos
        ? String(row.apellidos).split(" ").slice(1).join(" ")
        : ""),

    department: row.departamento || "",

    province: row.provincia || "",

    district: row.distrito || "",

    currentAddress: row.direccion || "",

    gender: row.genero || "",

    userType: row.cargo || "",

    phoneNumber: row.telefono || "",

    status: row.estado || "Activo",

    dob: row.fecha_nacimiento
      ? String(row.fecha_nacimiento).substring(0, 10)
      : "",

    photoUrl: row.foto_url || "",
  };
};

/**
 * -----------------------------
 * CONVERTIR FORMULARIO → BD
 * -----------------------------
 */
const mapToApi = (formData, photoUrl = "") => {
  const apellidos = [
    formData.paternalLastName,
    formData.maternalLastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    tipo_documento: formData.documentType || "DNI",

    dni: formData.documentNumber.trim(),

    nombres: formData.fullName.trim(),

    apellido_paterno: formData.paternalLastName.trim(),

    apellido_materno: formData.maternalLastName.trim(),

    apellidos,

    telefono: formData.phoneNumber.trim() || null,

    genero: formData.gender || null,

    direccion: formData.currentAddress.trim() || null,

    departamento: formData.department || null,

    provincia: formData.province || null,

    distrito: formData.district || null,

    cargo: formData.userType || null,

    estado: formData.status || "Activo",

    fecha_nacimiento: formData.dob || null,

    /**
     * La foto seleccionada mediante URL.createObjectURL
     * solamente sirve como vista previa.
     * No enviamos ese blob URL a MySQL porque deja de funcionar
     * al recargar la página.
     */
    foto_url: "",
  };
};

/**
 * -----------------------------
 * COMPONENTE
 * -----------------------------
 */
function Registropersonal() {
  const emptyForm = {
    documentType: "",
    documentNumber: "",
    fullName: "",
    paternalLastName: "",
    maternalLastName: "",
    department: "",
    province: "",
    district: "",
    currentAddress: "",
    gender: "",
    userType: "",
    phoneNumber: "",
    status: "",
    dob: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  const [photoUrl, setPhotoUrl] = useState("");

  /**
   * IMPORTANTE:
   * Antes había un registro escrito manualmente aquí.
   * Ahora comienza vacío porque los datos vendrán de MySQL.
   */
  const [items, setItems] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  /**
   * -----------------------------
   * CARGAR PERSONAL DESDE MYSQL
   * -----------------------------
   */
  const cargarPersonal = async () => {
    try {
      setLoading(true);

      const data = await apiRequest("/personal");

      if (!Array.isArray(data)) {
        throw new Error("La API no devolvió una lista de personal.");
      }

      const mapped = data.map(mapFromApi);

      setItems(mapped);
    } catch (error) {
      console.error("Error cargando personal:", error);

      if (
        error.message.toLowerCase().includes("token") ||
        error.message.toLowerCase().includes("autoriz") ||
        error.message.includes("401")
      ) {
        alert(
          "Tu sesión ya no es válida. Inicia sesión nuevamente."
        );
      } else {
        alert(
          `No se pudo cargar el personal desde la base de datos.\n\n${error.message}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cargar automáticamente al entrar
   */
  useEffect(() => {
    cargarPersonal();
  }, []);

  /**
   * -----------------------------
   * OPCIONES UBIGEO
   * -----------------------------
   */
  const departmentOptions = useMemo(
    () => getDepartments(),
    []
  );

  const provinceOptions = useMemo(
    () => getProvinces(formData.department),
    [formData.department]
  );

  const districtOptions = useMemo(
    () => getDistricts(
      formData.department,
      formData.province
    ),
    [formData.department, formData.province]
  );

  /**
   * -----------------------------
   * CAMPOS
   * -----------------------------
   */
  const fields = useMemo(
    () => [
      {
        label: "Tipo de Documento",
        type: "select",
        name: "documentType",
        options: [
          "DNI",
          "Pasaporte",
          "Carnet de Extranjería",
        ],
      },

      {
        label: "N° Documento",
        type: "text",
        name: "documentNumber",
      },

      {
        label: "Nombres",
        type: "text",
        name: "fullName",
      },

      {
        label: "Apellido Paterno",
        type: "text",
        name: "paternalLastName",
      },

      {
        label: "Apellido Materno",
        type: "text",
        name: "maternalLastName",
      },

      {
        label: "Género",
        type: "select",
        name: "gender",
        options: [
          "Masculino",
          "Femenino",
          "Otro",
        ],
      },

      {
        label: "Tipo de Usuario",
        type: "select",
        name: "userType",
        options: [
          "Administrador",
          "Chofer",
          "Vendedor",
        ],
      },

      {
        label: "Estado",
        type: "select",
        name: "status",
        options: [
          "Activo",
          "Inactivo",
        ],
      },

      {
        label: "Celular o Teléfono",
        type: "text",
        name: "phoneNumber",
      },

      {
        label: "Departamento",
        type: "combobox",
        name: "department",
      },

      {
        label: "Provincia",
        type: "combobox",
        name: "province",
      },

      {
        label: "Distrito",
        type: "combobox",
        name: "district",
      },

      {
        label: "Dirección Actual",
        type: "text",
        name: "currentAddress",
      },

      {
        label: "Fecha de Nacimiento",
        type: "date",
        name: "dob",
      },
    ],
    []
  );

  /**
   * -----------------------------
   * HANDLE CHANGE
   * -----------------------------
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "department") {
      setFormData((prev) => ({
        ...prev,
        department: value,
        province: "",
        district: "",
      }));

      return;
    }

    if (name === "province") {
      setFormData((prev) => ({
        ...prev,
        province: value,
        district: "",
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * -----------------------------
   * VALIDACIÓN UBIGEO
   * -----------------------------
   */
  const handleComboBlur = (name) => {
    if (name === "department") {
      const normalized = normalizeIfNotInList(
        formData.department,
        departmentOptions
      );

      if (normalized !== formData.department) {
        setFormData((prev) => ({
          ...prev,
          department: "",
          province: "",
          district: "",
        }));
      }

      return;
    }

    if (name === "province") {
      const normalized = normalizeIfNotInList(
        formData.province,
        provinceOptions
      );

      if (normalized !== formData.province) {
        setFormData((prev) => ({
          ...prev,
          province: "",
          district: "",
        }));
      }

      return;
    }

    if (name === "district") {
      const normalized = normalizeIfNotInList(
        formData.district,
        districtOptions
      );

      if (normalized !== formData.district) {
        setFormData((prev) => ({
          ...prev,
          district: "",
        }));
      }
    }
  };

  /**
   * -----------------------------
   * FOTO
   * -----------------------------
   */
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const url = URL.createObjectURL(file);

    setPhotoUrl(url);
  };

  /**
   * -----------------------------
   * RESET
   * -----------------------------
   */
  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setPhotoUrl("");
  };

  /**
   * -----------------------------
   * GUARDAR / ACTUALIZAR
   * -----------------------------
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.documentType ||
      !formData.documentNumber ||
      !formData.fullName
    ) {
      alert(
        "Completa: Tipo de Documento, N° Documento y Nombres."
      );
      return;
    }

    if (
      !formData.paternalLastName ||
      !formData.maternalLastName
    ) {
      alert(
        "Completa el Apellido Paterno y Apellido Materno."
      );
      return;
    }

    if (!formData.userType) {
      alert("Selecciona el Tipo de Usuario.");
      return;
    }

    if (!formData.status) {
      alert("Selecciona el Estado.");
      return;
    }

    try {
      setSaving(true);

      const payload = mapToApi(
        formData,
        photoUrl
      );

      let saved;

      if (editingId) {
        /**
         * ACTUALIZAR
         */
        saved = await apiRequest(
          `/personal/${editingId}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          }
        );

        alert("Registro actualizado correctamente ✅");
      } else {
        /**
         * INSERTAR
         */
        saved = await apiRequest(
          "/personal",
          {
            method: "POST",
            body: JSON.stringify(payload),
          }
        );

        alert("Datos guardados correctamente ✅");
      }

      /**
       * Convertimos la respuesta del backend
       * nuevamente al formato utilizado por React.
       */
      const mappedSaved = mapFromApi(saved);

      if (editingId) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === editingId
              ? mappedSaved
              : item
          )
        );
      } else {
        setItems((prev) => [
          mappedSaved,
          ...prev,
        ]);
      }

      resetForm();
    } catch (error) {
      console.error(
        "Error guardando personal:",
        error
      );

      alert(
        `No se pudo guardar el registro.\n\n${error.message}`
      );
    } finally {
      setSaving(false);
    }
  };

  /**
   * -----------------------------
   * EDITAR
   * -----------------------------
   */
  const onEdit = (row) => {
    setEditingId(row.id);

    setFormData({
      documentType:
        row.documentType || "DNI",

      documentNumber:
        row.documentNumber || "",

      fullName:
        row.fullName || "",

      paternalLastName:
        row.paternalLastName || "",

      maternalLastName:
        row.maternalLastName || "",

      department:
        row.department || "",

      province:
        row.province || "",

      district:
        row.district || "",

      currentAddress:
        row.currentAddress || "",

      gender:
        row.gender || "",

      userType:
        row.userType || "",

      phoneNumber:
        row.phoneNumber || "",

      status:
        row.status || "Activo",

      dob:
        row.dob || "",
    });

    setPhotoUrl(
      row.photoUrl || ""
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /**
   * -----------------------------
   * ELIMINAR
   * -----------------------------
   */
  const onDelete = async (id) => {
    const ok = window.confirm(
      "¿Seguro que deseas eliminar este registro?"
    );

    if (!ok) return;

    try {
      await apiRequest(
        `/personal/${id}`,
        {
          method: "DELETE",
        }
      );

      setItems((prev) =>
        prev.filter(
          (item) => item.id !== id
        )
      );

      alert(
        "Registro eliminado correctamente ✅"
      );
    } catch (error) {
      console.error(
        "Error eliminando personal:",
        error
      );

      alert(
        `No se pudo eliminar el registro.\n\n${error.message}`
      );
    }
  };

  /**
   * -----------------------------
   * RENDER
   * -----------------------------
   */
  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col">
      <div className="w-full px-6 py-8">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-2">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            Registro de Personal
          </h2>

          <p className="text-sm text-slate-600">
            Registra personal, edita datos existentes y gestiona la lista.
          </p>
        </div>

        {/* Card formulario */}
        <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Barra superior */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 border-b border-slate-200">

            {/* Foto */}
            <div className="flex items-center gap-4">

              <div className="h-20 w-20 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Foto"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound className="h-9 w-9 text-slate-400" />
                )}
              </div>

              <div className="flex flex-col gap-1">

                <span className="text-sm font-semibold text-slate-900">
                  Foto del personal
                </span>

                <span className="text-xs text-slate-500">
                  JPG/PNG recomendado (opcional)
                </span>

                <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 active:bg-indigo-800">

                  <UploadCloud className="h-4 w-4" />

                  Subir Foto

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />

                </label>

              </div>
            </div>

            {/* Estado edición */}
            <div className="flex items-center gap-2">

              {editingId ? (
                <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
                  Editando registro
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                  Nuevo registro
                </span>
              )}

            </div>

          </div>

          {/* Formulario */}
          <form
            onSubmit={handleSubmit}
            className="p-5"
          >

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

              {fields.map((field) => {

                const baseInput =
                  "h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

                /**
                 * Combobox
                 */
                if (field.type === "combobox") {

                  const listId =
                    `list-${field.name}`;

                  const options =
                    field.name === "department"
                      ? departmentOptions
                      : field.name === "province"
                      ? provinceOptions
                      : districtOptions;

                  const isDisabled =
                    (
                      field.name === "province" &&
                      !formData.department
                    ) ||
                    (
                      field.name === "district" &&
                      (
                        !formData.department ||
                        !formData.province
                      )
                    );

                  const placeholder =
                    field.name === "department"
                      ? "Seleccione/Busque Departamento"
                      : field.name === "province"
                      ? formData.department
                        ? "Seleccione/Busque Provincia"
                        : "Primero seleccione Departamento"
                      : formData.province
                      ? "Seleccione/Busque Distrito"
                      : "Primero seleccione Provincia";

                  return (
                    <div
                      key={field.name}
                      className="flex flex-col gap-1"
                    >

                      <label className="text-xs font-semibold text-slate-700">
                        {field.label}
                      </label>

                      <input
                        list={listId}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        onBlur={() =>
                          handleComboBlur(field.name)
                        }
                        disabled={isDisabled}
                        placeholder={placeholder}
                        className={[
                          baseInput,
                          isDisabled
                            ? "bg-slate-50 text-slate-400 cursor-not-allowed"
                            : "",
                        ].join(" ")}
                      />

                      <datalist id={listId}>
                        {options.map((op) => (
                          <option
                            key={op}
                            value={op}
                          />
                        ))}
                      </datalist>

                      <span className="text-[11px] text-slate-500">
                        Escribe para buscar (combobox).
                      </span>

                    </div>
                  );
                }

                /**
                 * Select / Input
                 */
                return (
                  <div
                    key={field.name}
                    className="flex flex-col gap-1"
                  >

                    <label className="text-xs font-semibold text-slate-700">
                      {field.label}
                    </label>

                    {field.type === "select" ? (
                      <select
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                      >

                        <option value="">
                          Seleccione...
                        </option>

                        {field.options.map(
                          (op) => (
                            <option
                              key={op}
                              value={op}
                            >
                              {op}
                            </option>
                          )
                        )}

                      </select>
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={
                          field.type !== "date"
                            ? `Ingrese ${field.label}`
                            : ""
                        }
                        className={baseInput}
                      />
                    )}

                  </div>
                );
              })}

            </div>

            {/* Botones */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end">

              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50"
              >
                Limpiar
              </button>

              <button
                type="submit"
                disabled={saving}
                className="h-11 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50"
              >
                {saving
                  ? "Guardando..."
                  : editingId
                  ? "Actualizar"
                  : "Guardar"}
              </button>

            </div>

          </form>

        </div>

        {/* Tabla */}
        <div className="mt-8">

          <div className="mb-3 flex items-end justify-between gap-3">

            <div>

              <h3 className="text-lg font-bold text-slate-900">
                Lista de Personal Registrado
              </h3>

              <p className="text-sm text-slate-600">
                Total:{" "}
                <span className="font-semibold">
                  {items.length}
                </span>
              </p>

            </div>

            <button
              type="button"
              onClick={cargarPersonal}
              disabled={loading}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
            >
              {loading
                ? "Cargando..."
                : "Actualizar lista"}
            </button>

          </div>

          <div className="w-full rounded-none border border-slate-200 bg-white shadow-sm overflow-hidden">

            <div className="overflow-x-auto">

              <table className="min-w-[1200px] w-full text-sm">

                <thead className="bg-slate-900 text-white">

                  <tr className="text-left">

                    {[
                      "Tipo de Usuario",
                      "Estado",
                      "Tipo Doc",
                      "N° Doc",
                      "Nombres",
                      "Apellido Paterno",
                      "Apellido Materno",
                      "F. Nacimiento",
                      "Género",
                      "Celular",
                      "Dirección",
                      "Ubigeo",
                      "Acciones",
                    ].map((col) => (
                      <th
                        key={col}
                        className="px-4 py-3 font-semibold"
                      >
                        {col}
                      </th>
                    ))}

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-200">

                  {loading ? (
                    <tr>
                      <td
                        colSpan={13}
                        className="px-4 py-10 text-center text-slate-500"
                      >
                        Cargando registros desde la base de datos...
                      </td>
                    </tr>
                  ) : items.length === 0 ? (
                    <tr>
                      <td
                        colSpan={13}
                        className="px-4 py-10 text-center text-slate-500"
                      >
                        No hay registros en la base de datos.
                      </td>
                    </tr>
                  ) : (
                    items.map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-slate-50"
                      >

                        {/* Tipo Usuario */}
                        <td className="px-4 py-3">
                          <span className="font-semibold text-slate-900">
                            {row.userType || "-"}
                          </span>
                        </td>

                        {/* Estado */}
                        <td className="px-4 py-3">

                          <span
                            className={[
                              "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border",
                              row.status === "Activo"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-rose-50 text-rose-700 border-rose-200",
                            ].join(" ")}
                          >
                            {row.status || "-"}
                          </span>

                        </td>

                        {/* Tipo documento */}
                        <td className="px-4 py-3 text-slate-700">
                          {row.documentType || "-"}
                        </td>

                        {/* DNI */}
                        <td className="px-4 py-3 text-slate-700">
                          {row.documentNumber || "-"}
                        </td>

                        {/* Nombres */}
                        <td className="px-4 py-3 text-slate-700">
                          {row.fullName || "-"}
                        </td>

                        {/* Paterno */}
                        <td className="px-4 py-3 text-slate-700">
                          {row.paternalLastName || "-"}
                        </td>

                        {/* Materno */}
                        <td className="px-4 py-3 text-slate-700">
                          {row.maternalLastName || "-"}
                        </td>

                        {/* Fecha nacimiento */}
                        <td className="px-4 py-3 text-slate-700">
                          {row.dob
                            ? new Date(
                                `${row.dob}T00:00:00`
                              ).toLocaleDateString()
                            : "-"}
                        </td>

                        {/* Género */}
                        <td className="px-4 py-3 text-slate-700">
                          {row.gender || "-"}
                        </td>

                        {/* Teléfono */}
                        <td className="px-4 py-3 text-slate-700">
                          {row.phoneNumber || "-"}
                        </td>

                        {/* Dirección */}
                        <td className="px-4 py-3 text-slate-700">
                          {row.currentAddress || "-"}
                        </td>

                        {/* Ubigeo */}
                        <td className="px-4 py-3 text-slate-700">
                          {row.department || "-"}{" "}
                          /{" "}
                          {row.province || "-"}{" "}
                          /{" "}
                          {row.district || "-"}
                        </td>

                        {/* Acciones */}
                        <td className="px-4 py-3">

                          <div className="flex items-center gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                onEdit(row)
                              }
                              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                              title="Modificar"
                            >

                              <Pencil className="h-4 w-4" />

                              Editar

                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                onDelete(row.id)
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
                    ))
                  )}

                </tbody>

              </table>

            </div>

            <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3 text-xs text-slate-500">

              <span>
                Consejo: escribe para buscar en los combobox de ubigeo.
              </span>

              <span className="font-semibold text-slate-700">
                Mikervip
              </span>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Registropersonal;