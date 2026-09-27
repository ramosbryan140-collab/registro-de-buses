import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import MainLayout from "./layouts/MainLayout";
import React from "react";
import Principal from "./pages/Principal";
import Registros from "./pages/Registros";
import Procesos from "./pages/Procesos";
import Administrador from "./pages/Administrador";
import Roles from "./pages/Roles";
import Personal from "./pages/Personal";
import Reportes from "./pages/Reportes";
import Registropersonal from "./pages/Registropersonal";
import RegistrarBuses from "./pages/RegistrarBuses";
import AsignarBuses from "./pages/AsignarBuses";
import RegistrarTerminal from "./pages/RegistrarTerminal";
import RegistrarSerie from "./pages/RegistrarSerie";
import RutasyParadas from "./pages/RutasyParadas";
import Tipobuses from "./pages/Tipobuses";
import VentaBoletos from "./pages/VentaBoletos";
import CrearRutas from "./pages/CrearRutas";

import Encomiendas from "./pages/Encomiendas";
import ConsultarEncomiendas from "./pages/ConsultarEncomiendas";

function App() {
  return (
    <Router>
      <Routes>
        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        {/* RUTAS QUE USAN EL LAYOUT */}
        <Route element={<MainLayout />}>
          <Route path="principal" element={<Principal />} />
          <Route path="registros" element={<Registros />} />
          <Route path="procesos" element={<Procesos />} />
          <Route path="administrador" element={<Administrador />} />
          <Route path="roles" element={<Roles />} />
          <Route path="personal" element={<Personal />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="registropersonal" element={<Registropersonal />} />
          <Route path="registrarbuses" element={<RegistrarBuses />} />
          <Route path="asignarbuses" element={<AsignarBuses />} />
          <Route path="registrarterminal" element={<RegistrarTerminal />} />
          <Route path="registrarserie" element={<RegistrarSerie />} />
          <Route path="rutasyparadas" element={<RutasyParadas />} />
          <Route path="tipobuses" element={<Tipobuses />} />
          <Route path="ventaboletos" element={<VentaBoletos />} />
          <Route path="crearrutas" element={<CrearRutas />} />

          <Route path="encomiendas" element={<Encomiendas />} />
          <Route path="consultarencomiendas" element={<ConsultarEncomiendas />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
