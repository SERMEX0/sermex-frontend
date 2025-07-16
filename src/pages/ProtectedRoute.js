import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  // Aquí podrías también verificar que el token no haya expirado, pero JWT no se puede validar en frontend sin backend.
  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;