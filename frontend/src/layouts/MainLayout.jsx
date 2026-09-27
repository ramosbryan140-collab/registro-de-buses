import React, { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  ChevronDown,
  Home,
  User,
  LogOut,
  Users,
  Bus,
  Map,
  Settings,
  FileText,
  ClipboardList,
  BadgeCheck,
  LayoutGrid,
  ShieldCheck,
  Package,
  Route,
} from "lucide-react";

function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [openAdmin, setOpenAdmin] = useState(true);
  const [openRegistros, setOpenRegistros] = useState(true);
  const [openProcesos, setOpenProcesos] = useState(true);

  // ============================================================
  // OBTENER USUARIO REAL DE LA SESIÓN
  // ============================================================

  const usuarioGuardado =
    localStorage.getItem("usuario") ||
    sessionStorage.getItem("usuario");

  let usuario = null;

  try {
    usuario = usuarioGuardado
      ? JSON.parse(usuarioGuardado)
      : null;
  } catch (error) {
    console.error("Error al leer los datos del usuario:", error);
  }

  // ============================================================
  // DATOS DEL USUARIO
  // ============================================================

  const nombreUsuario =
    usuario?.nombres ||
    usuario?.nombre ||
    usuario?.usuario ||
    "Usuario";

  const apellidosUsuario =
    usuario?.apellidos || "";

  const nombreCompleto =
    `${nombreUsuario} ${apellidosUsuario}`.trim();

  const usuarioLogin =
    usuario?.usuario || "usuario";

  const rolUsuario =
    usuario?.rol ||
    usuario?.nombre_rol ||
    usuario?.role ||
    "Usuario";

  // Primera letra para el avatar
  const inicial =
    nombreCompleto.charAt(0).toUpperCase() || "U";

  // ============================================================
  // CERRAR SESIÓN
  // ============================================================

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("usuario");
    } catch (e) {
      console.warn("No se pudo limpiar la sesión:", e);
    }

    navigate("/");
  };

  const isActive = (path) =>
    location.pathname === path;

  const linkBase =
    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200";

  const linkNormal =
    "text-slate-200 hover:bg-white/10 hover:text-white";

  const linkActive =
    "bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/20";

  const subLinkBase =
    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200";

  const subLinkNormal =
    "text-slate-300 hover:bg-white/10 hover:text-white";

  const subLinkActive =
    "bg-white/15 text-white shadow-sm";

  return (
    <div className="min-h-screen w-full bg-slate-100">

      <div className="flex min-h-screen">

        {/* ======================================================
            SIDEBAR
        ====================================================== */}

        <aside className="w-72 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-white p-5 shadow-2xl flex flex-col">

          {/* Logo / título */}

          <div className="mb-8">

            <div className="flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-md px-4 py-4 border border-white/10">

              <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-md">
                <LayoutGrid size={22} className="text-white" />
              </div>

              <div>

                <h1 className="text-base font-bold tracking-wide">
                  Sistema de Gestión
                </h1>

                <p className="text-xs text-slate-300">
                  Panel administrativo
                </p>

              </div>

            </div>

          </div>


          {/* ====================================================
              NAVEGACIÓN
          ==================================================== */}

          <nav className="flex-1 overflow-auto pr-1">

            <ul className="space-y-3">

              {/* Principal */}

              <li>

                <Link
                  to="/principal"
                  className={`${linkBase} ${
                    isActive("/principal")
                      ? linkActive
                      : linkNormal
                  }`}
                >

                  <Home size={20} />

                  <span className="font-medium">
                    Principal
                  </span>

                </Link>

              </li>


              {/* ==================================================
                  ADMINISTRADOR
              ================================================== */}

              <li className="rounded-2xl bg-white/5 border border-white/10">

                <button
                  onClick={() => setOpenAdmin(!openAdmin)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-white/5 transition"
                >

                  <span className="flex items-center gap-3 font-medium text-slate-100">

                    <ShieldCheck size={20} />

                    Administrador

                  </span>

                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-300 ${
                      openAdmin ? "rotate-180" : ""
                    }`}
                  />

                </button>


                {openAdmin && (

                  <ul className="px-3 pb-3 space-y-2">

                    <li>

                      <Link
                        to="/registropersonal"
                        className={`${subLinkBase} ${
                          isActive("/registropersonal")
                            ? subLinkActive
                            : subLinkNormal
                        }`}
                      >

                        <BadgeCheck size={17} />

                        Registrar Personal

                      </Link>

                    </li>


                    <li>

                      <Link
                        to="/roles"
                        className={`${subLinkBase} ${
                          isActive("/roles")
                            ? subLinkActive
                            : subLinkNormal
                        }`}
                      >

                        <ClipboardList size={17} />

                        Roles y permisos

                      </Link>

                    </li>

                  </ul>

                )}

              </li>


              {/* ==================================================
                  REGISTROS
              ================================================== */}

              <li className="rounded-2xl bg-white/5 border border-white/10">

                <button
                  onClick={() =>
                    setOpenRegistros(!openRegistros)
                  }
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-white/5 transition"
                >

                  <span className="flex items-center gap-3 font-medium text-slate-100">

                    <FileText size={20} />

                    Registros

                  </span>

                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-300 ${
                      openRegistros ? "rotate-180" : ""
                    }`}
                  />

                </button>


                {openRegistros && (

                  <ul className="px-3 pb-3 space-y-2">

                    <li>

                      <Link
                        to="/registrarbuses"
                        className={`${subLinkBase} ${
                          isActive("/registrarbuses")
                            ? subLinkActive
                            : subLinkNormal
                        }`}
                      >

                        <Bus size={17} />

                        Registrar Buses

                      </Link>

                    </li>


                    <li>

                      <Link
                        to="/asignarbuses"
                        className={`${subLinkBase} ${
                          isActive("/asignarbuses")
                            ? subLinkActive
                            : subLinkNormal
                        }`}
                      >

                        <Settings size={17} />

                        Asignar Buses

                      </Link>

                    </li>


                    <li>

                      <Link
                        to="/registrarterminal"
                        className={`${subLinkBase} ${
                          isActive("/registrarterminal")
                            ? subLinkActive
                            : subLinkNormal
                        }`}
                      >

                        <Map size={17} />

                        Registrar Terminal

                      </Link>

                    </li>


                    <li>

                      <Link
                        to="/registrarserie"
                        className={`${subLinkBase} ${
                          isActive("/registrarserie")
                            ? subLinkActive
                            : subLinkNormal
                        }`}
                      >

                        <ClipboardList size={17} />

                        Registrar Serie

                      </Link>

                    </li>


                    <li>

                      <Link
                        to="/rutasyparadas"
                        className={`${subLinkBase} ${
                          isActive("/rutasyparadas")
                            ? subLinkActive
                            : subLinkNormal
                        }`}
                      >

                        <Route size={17} />

                        Rutas y Paradas

                      </Link>

                    </li>


                    <li>

                      <Link
                        to="/tipobuses"
                        className={`${subLinkBase} ${
                          isActive("/tipobuses")
                            ? subLinkActive
                            : subLinkNormal
                        }`}
                      >

                        <Bus size={17} />

                        Tipos de Buses

                      </Link>

                    </li>

                  </ul>

                )}

              </li>


              {/* ==================================================
                  PROCESOS
              ================================================== */}

              <li className="rounded-2xl bg-white/5 border border-white/10">

                <button
                  onClick={() =>
                    setOpenProcesos(!openProcesos)
                  }
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-white/5 transition"
                >

                  <span className="flex items-center gap-3 font-medium text-slate-100">

                    <Settings size={20} />

                    Procesos

                  </span>

                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-300 ${
                      openProcesos ? "rotate-180" : ""
                    }`}
                  />

                </button>


                {openProcesos && (

                  <ul className="px-3 pb-3 space-y-2">

                    <li>

                      <Link
                        to="/ventaboletos"
                        className={`${subLinkBase} ${
                          isActive("/ventaboletos")
                            ? subLinkActive
                            : subLinkNormal
                        }`}
                      >

                        <Bus size={17} />

                        Venta de Boletos

                      </Link>

                    </li>


                    <li>

                      <Link
                        to="/crearrutas"
                        className={`${subLinkBase} ${
                          isActive("/crearrutas")
                            ? subLinkActive
                            : subLinkNormal
                        }`}
                      >

                        <Route size={17} />

                        Crear Rutas

                      </Link>

                    </li>


                    <li>

                      <Link
                        to="/encomiendas"
                        className={`${subLinkBase} ${
                          isActive("/encomiendas")
                            ? subLinkActive
                            : subLinkNormal
                        }`}
                      >

                        <Package size={17} />

                        Encomiendas

                      </Link>

                    </li>


                    <li>

                      <Link
                        to="/consultarencomiendas"
                        className={`${subLinkBase} ${
                          isActive("/consultarencomiendas")
                            ? subLinkActive
                            : subLinkNormal
                        }`}
                      >

                        <ClipboardList size={17} />

                        Consultar Encomiendas

                      </Link>

                    </li>

                  </ul>

                )}

              </li>


              {/* ==================================================
                  REPORTES
              ================================================== */}

              <li>

                <Link
                  to="/reportes"
                  className={`${linkBase} ${
                    isActive("/reportes")
                      ? linkActive
                      : linkNormal
                  }`}
                >

                  <FileText size={20} />

                  <span className="font-medium">
                    Reportes
                  </span>

                </Link>

              </li>

            </ul>

          </nav>


          {/* ====================================================
              FOOTER USUARIO
          ==================================================== */}

          <div className="mt-6 rounded-2xl bg-white/10 border border-white/10 p-4 backdrop-blur-md">

            <div className="flex items-center gap-3 mb-4">

              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-md">

                <User size={20} className="text-white" />

              </div>


              <div>

                {/* USUARIO REAL */}

                <p className="text-sm font-semibold text-white">
                  {nombreCompleto}
                </p>

                <p className="text-xs text-slate-300">
                  @{usuarioLogin} · {rolUsuario}
                </p>

              </div>

            </div>


            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:from-rose-600 hover:to-red-700 transition-all duration-200"
            >

              <LogOut size={17} />

              Cerrar sesión

            </button>

          </div>

        </aside>


        {/* ======================================================
            CONTENIDO PRINCIPAL
        ====================================================== */}

        <div className="flex-1 flex flex-col bg-slate-100">

          {/* Header */}

          <header className="h-20 px-8 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">

            <div>

              <h2 className="text-2xl font-bold text-slate-800">
                Bienvenido al sistema
              </h2>

              <p className="text-sm text-slate-500">
                Administra registros, procesos y reportes
              </p>

            </div>


            <div className="flex items-center gap-4">

              <div className="hidden md:flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 shadow-sm">

                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">

                  <User size={18} className="text-white" />

                </div>


                <div>

                  {/* USUARIO REAL */}

                  <p className="text-sm font-semibold text-slate-800">
                    {nombreCompleto}
                  </p>

                  <p className="text-xs text-slate-500">
                    Sesión activa · @{usuarioLogin}
                  </p>

                </div>

              </div>

            </div>

          </header>


          {/* Main */}

          <main className="flex-1 p-6 overflow-auto">

            <div className="min-h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <Outlet />

            </div>

          </main>

        </div>

      </div>

    </div>
  );
}

export default MainLayout;
