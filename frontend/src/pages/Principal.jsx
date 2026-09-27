import React from "react";
import busImage from "../assets/busprincipal.jpg";
import {
  Ticket,
  Package,
  Users,
  Bus,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

function CardDashboard({ title, value, subtitle, icon: Icon, color }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-800">{value}</h3>
          <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
        </div>

        <div className={`rounded-xl p-3 ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
}

function Principal() {
  return (
    <div className="min-h-screen w-full bg-slate-50">
      <main className="p-6 space-y-6">
        {/* Encabezado */}
        <section className="rounded-3xl overflow-hidden shadow-sm border border-slate-200 bg-white">
          <div className="relative h-[280px] w-full">
            <img
              src={busImage}
              alt="Bus principal"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/50 to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-center px-8">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-sm text-white backdrop-blur-sm border border-white/20">
                <TrendingUp size={16} />
                Panel principal
              </span>

              <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-white">
                Transportes GYM
              </h1>
              <p className="mt-3 max-w-2xl text-base md:text-lg text-slate-200">
                Bienvenido al sistema de gestión. Visualiza de forma rápida el
                estado de ventas, encomiendas, personal y buses registrados.
              </p>
            </div>
          </div>
        </section>

        {/* Tarjetas resumen */}
        <section>
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
            <p className="text-sm text-slate-500">
              Resumen general de operaciones registradas
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <CardDashboard
              title="Ventas de boletos"
              value="1,248"
              subtitle="Boletos vendidos este mes"
              icon={Ticket}
              color="bg-gradient-to-br from-blue-500 to-cyan-500"
            />

            <CardDashboard
              title="Envío de encomiendas"
              value="326"
              subtitle="Encomiendas registradas"
              icon={Package}
              color="bg-gradient-to-br from-amber-500 to-orange-500"
            />

            <CardDashboard
              title="Registro de personal"
              value="58"
              subtitle="Personal activo registrado"
              icon={Users}
              color="bg-gradient-to-br from-emerald-500 to-green-600"
            />

            <CardDashboard
              title="Registro de buses"
              value="24"
              subtitle="Buses disponibles"
              icon={Bus}
              color="bg-gradient-to-br from-violet-500 to-indigo-600"
            />
          </div>
        </section>

        {/* Sección extra informativa */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Resumen operativo
                </h3>
                <p className="text-sm text-slate-500">
                  Indicadores generales del sistema
                </p>
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-blue-600">
                Ver más <ArrowUpRight size={16} />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Ventas hoy</p>
                <h4 className="mt-2 text-2xl font-bold text-slate-800">84</h4>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Encomiendas hoy</p>
                <h4 className="mt-2 text-2xl font-bold text-slate-800">19</h4>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Buses en ruta</p>
                <h4 className="mt-2 text-2xl font-bold text-slate-800">12</h4>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800">
              Estado del sistema
            </h3>
            <p className="text-sm text-slate-500">
              Información rápida de gestión
            </p>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-200">
                <span className="text-sm text-slate-600">Ventas activas</span>
                <span className="text-sm font-semibold text-emerald-600">
                  Operativo
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-200">
                <span className="text-sm text-slate-600">Módulo encomiendas</span>
                <span className="text-sm font-semibold text-emerald-600">
                  Operativo
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-200">
                <span className="text-sm text-slate-600">Gestión de buses</span>
                <span className="text-sm font-semibold text-emerald-600">
                  Activo
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-200">
                <span className="text-sm text-slate-600">Registro personal</span>
                <span className="text-sm font-semibold text-emerald-600">
                  Actualizado
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Principal;