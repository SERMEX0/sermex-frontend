import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Inicio from "./pages/Inicio";
import ProtectedRoute from "./pages/ProtectedRoute";
import PrivateRoute from "./PrivateRoute";
import SeleccionarProducto from "./pages/SeleccionarProducto";
import ProductDetail from "./pages/ProductDetail"; // Importamos la nueva pantalla
import Reparacion from "./pages/const/Reparacion"; //pantallas principales
import Productos from "./pages/const/Productos";
import Manual from "./pages/const/Manual";
import Tutorial from "./pages/const/Tutorial";
import ProductEvaluation from "./pages/const/ProductEvaluation";
import Perfil from "./pages/Perfil";
//import Header from "./components/Header";
import Logistica from "./pages/const/data/Logistica";
import Logistica1 from "./pages/const/Logistica1";

import Rma from "./pages/const/data/Rma";
import FormDoc from "./pages/const/data/FormDoc";
import ProductDocs from "./pages/const/data/ProductDocs";
import ChangePassword from "./pages/ChangePassword";
import AuthWrapper from "./components/AuthWrapper";
import SessionChecker from "./components/SessionChecker";
import DataResult from "./pages/DataResult";
import Asesoria from "./pages/const/Asesoria";


function App() {
  return (
    <Router>
     
      <Routes>
         
        <Route path="/login" element={<Login />} />
        {/* 🔒 Protegemos la pantalla de inicio */}
        <Route path="/inicio" element={<PrivateRoute><Inicio /></PrivateRoute>} />
        <Route path="/protectedRoute" element={<ProtectedRoute />}/>
        <Route path="/seleccionar-producto" element={<SeleccionarProducto />} />  {/* ✅ Ruta correcta */}
        <Route path="/authWrapper" element={<AuthWrapper />}/>
        <Route path="/sessionChecker" element={<SessionChecker />}/>
        <Route path="/change-Password" element={<ChangePassword />} />
        <Route path="/detalle-producto" element={<ProductDetail />} />  {/* ✅ Nueva ruta */}
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/reparacion" element={<Reparacion />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/manual" element={<Manual />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/asesoria" element={<Asesoria />} />
        <Route path="/producto/:productId/evaluar" element={<ProductEvaluation />} />
        
         {/* Nuevas rutas */}
         <Route path="/logistica" element={<Logistica />} />
         <Route path="/logistica1" element={<Logistica1 />} />
         
         <Route path="/rma" element={<Rma />} />
         <Route path="/formdoc" element={<FormDoc />} />
         <Route path="/productdocs" element={<ProductDocs />} />
         <Route path="/data-result" element={<DataResult />} />
          

        {/* Redirige al login si no hay ninguna ruta coincidente */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
