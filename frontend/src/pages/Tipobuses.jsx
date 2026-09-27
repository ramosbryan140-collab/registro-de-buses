import React, { useState } from "react";
import {
  Gauge,
  DoorClosed,
  Bed,
  ArrowUp,
  Toilet,
  Users,
  BusFront,
} from "lucide-react";

/* =========================
   ASIENTO
========================= */
const Asiento = ({ numero, estado = "libre" }) => {
  const estilos = {
    libre:
      "bg-white border border-slate-200 text-slate-700 hover:border-sky-400 hover:bg-sky-50",
    seleccionado:
      "bg-emerald-500 border border-emerald-600 text-white shadow-md",
    ocupado: "bg-rose-500 border border-rose-600 text-white cursor-not-allowed",
  };

  return (
    <div
      className={`
        w-11 h-14 rounded-xl p-1 flex flex-col items-center justify-between
        shadow-sm transition-all duration-200 ${estilos[estado]}
      `}
    >
      <div className="w-full h-2 rounded-full bg-slate-400" />
      <div className="w-7 h-7 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center text-[10px] font-bold shadow-inner">
        {numero}
      </div>
    </div>
  );
};

/* =========================
   BLOQUES ESPECIALES
========================= */
const BloqueEspecial = ({
  icon: Icono,
  texto,
  className = "",
  color = "bg-slate-50 border-slate-300 text-slate-800",
}) => (
  <div
    className={`
      rounded-2xl border shadow-sm flex flex-col items-center justify-center
      text-[10px] font-semibold text-center px-2 py-2 ${color} ${className}
    `}
  >
    {Icono && <Icono size={16} className="mb-1" />}
    <span>{texto}</span>
  </div>
);

const Pasadizo = ({ alto = "h-14" }) => (
  <div className={`w-8 min-w-[32px] ${alto} flex items-center justify-center`}>
    <div className="text-[8px] text-slate-400 font-semibold tracking-wide rotate-90">
      PASADIZO
    </div>
  </div>
);

/* =========================
   FILAS
========================= */
const FilaAsientos = ({ izquierda1, izquierda2, derecha }) => (
  <div className="flex items-center justify-center gap-2">
    <div className="flex gap-2">
      <Asiento numero={izquierda1} />
      <Asiento numero={izquierda2} />
    </div>

    <Pasadizo />

    <Asiento numero={derecha} />
  </div>
);

const FilaConBloqueDerecha = ({
  izquierda1,
  izquierda2,
  texto,
  icon: Icono,
  color,
}) => (
  <div className="flex items-center justify-center gap-2">
    <div className="flex gap-2">
      <Asiento numero={izquierda1} />
      <Asiento numero={izquierda2} />
    </div>

    <Pasadizo />

    <BloqueEspecial
      icon={Icono}
      texto={texto}
      className="w-11 h-14 rounded-xl"
      color={color}
    />
  </div>
);

/* =========================
   PRIMER PISO
========================= */
const PrimerPiso = () => {
  return (
    <div className="space-y-4">
      {/* Cabecera del bus */}
      <div className="grid grid-cols-2 gap-3">
        <BloqueEspecial
          icon={Gauge}
          texto="Cabina"
          className="h-20"
          color="bg-amber-50 border-amber-300 text-amber-900"
        />
        <BloqueEspecial
          icon={Users}
          texto="Copiloto"
          className="h-20"
          color="bg-orange-50 border-orange-300 text-orange-900"
        />
        <BloqueEspecial
          icon={Bed}
          texto="Descanso"
          className="h-20"
          color="bg-yellow-50 border-yellow-300 text-yellow-900"
        />
        <BloqueEspecial
          icon={ArrowUp}
          texto="Escalera"
          className="h-20"
          color="bg-sky-50 border-sky-300 text-sky-900"
        />
      </div>

      {/* Baño */}
      <div className="flex justify-start">
        <BloqueEspecial
          icon={Toilet}
          texto="Baño"
          className="w-24 h-16"
          color="bg-cyan-50 border-cyan-300 text-cyan-900"
        />
      </div>

      {/* Puerta estirada */}
      <BloqueEspecial
        icon={DoorClosed}
        texto="Puerta"
        className="w-full h-10 rounded-full"
        color="bg-indigo-50 border-indigo-300 text-indigo-900"
      />

      {/* Asientos debajo de la puerta */}
      <div className="space-y-3">
        <FilaAsientos izquierda1={31} izquierda2={32} derecha={33} />
        <FilaAsientos izquierda1={34} izquierda2={35} derecha={36} />
        <FilaAsientos izquierda1={37} izquierda2={38} derecha={39} />
        <FilaAsientos izquierda1={40} izquierda2={41} derecha={42} />
        <FilaAsientos izquierda1={43} izquierda2={44} derecha={45} />
      </div>
    </div>
  );
};

/* =========================
   SEGUNDO PISO
========================= */
const SegundoPiso = () => {
  return (
    <div className="space-y-3">
      <FilaAsientos izquierda1={1} izquierda2={2} derecha={3} />
      <FilaAsientos izquierda1={4} izquierda2={5} derecha={6} />

      <FilaConBloqueDerecha
        izquierda1={7}
        izquierda2={8}
        texto="Escalera"
        icon={ArrowUp}
        color="bg-sky-50 border-sky-300 text-sky-900"
      />

      <FilaAsientos izquierda1={10} izquierda2={11} derecha={12} />
      <FilaAsientos izquierda1={13} izquierda2={14} derecha={15} />
      <FilaAsientos izquierda1={16} izquierda2={17} derecha={18} />
      <FilaAsientos izquierda1={19} izquierda2={20} derecha={21} />
      <FilaAsientos izquierda1={22} izquierda2={23} derecha={24} />
      <FilaAsientos izquierda1={25} izquierda2={26} derecha={27} />
      <FilaAsientos izquierda1={28} izquierda2={29} derecha={30} />
    </div>
  );
};

/* =========================
   BUS
========================= */
const Bus = ({ turno, capacidad }) => {
  const [pisoActivo, setPisoActivo] = useState("primer");

  return (
    <div className="w-full max-w-[320px] rounded-[28px] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200">
      <div className="mb-4 rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 px-4 py-4 text-white shadow-md">
        <div className="flex items-center justify-center gap-2 text-lg font-bold">
          <BusFront size={18} />
          <span>Bus de {capacidad} pasajeros</span>
        </div>
        <p className="mt-1 text-center text-sm text-blue-100">Turno {turno}</p>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <button
          onClick={() => setPisoActivo("primer")}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
            pisoActivo === "primer"
              ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          1er Piso
        </button>

        <button
          onClick={() => setPisoActivo("segundo")}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
            pisoActivo === "segundo"
              ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          2do Piso
        </button>
      </div>

      <div className="rounded-[30px] border border-slate-200 bg-slate-50 p-4 shadow-inner min-h-[650px] overflow-hidden">
        {pisoActivo === "primer" ? <PrimerPiso /> : <SegundoPiso />}
      </div>
    </div>
  );
};

/* =========================
   APP
========================= */
export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-4">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4 justify-items-center">
        <Bus capacidad={45} turno="8:00 pm" />
        <Bus capacidad={50} turno="8:30 pm" />
        <Bus capacidad={55} turno="9:00 pm" />
        <Bus capacidad={60} turno="9:30 pm" />
      </div>
    </div>
  );
}