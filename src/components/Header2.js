import { NavLink, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useState, useEffect } from "react";

/**
 * Header responsivo:
 * - width: 101% en escritorio/tablet
 * - width: 109% en móvil (máx 600px)
 * - Ajusta paddings para que no se corte contenido en celular
 * - El resto del diseño se mantiene igual, solo se agrega CSS global para el ancho
 */

const Header = ({ productos = [] }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fotoGuardada = localStorage.getItem("fotoPerfil");
    if (fotoGuardada) {
      setFotoPerfil(fotoGuardada);
    }
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleProductoClick = (producto) => {
    navigate("/detalle-producto", { state: { producto } });
  };

  return (
    <header className="header2-sermex" style={{
      width: "101%", // Por defecto, escritorio/tablet
      maxWidth: "1500px",
      background: "linear-gradient(90deg, #345475 70%, #4474B0 100%)",
      color: "#fff",
      margin: "0 auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "15px 30px",
      zIndex: 1000,
      position: "sticky",
      top: 0,
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      boxSizing: "border-box"
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <img 
          src="/logo_SERMEX_blanco.fw.png" 
          alt="Logo" 
          style={{ 
            height: "70px", 
            marginRight: "20px",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
          }} 
          onClick={() => navigate("/inicio")}
        />
      </div>

      {/* Botones de acción */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "15px",
      }}>
        {/* Botón para seleccionar productos (si hay) */}
        {productos.length > 0 && (
          <div style={{ position: "relative" }}>
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "rgba(255,255,255,0.1)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "30px",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: "500",
                transition: "all 0.3s ease"
              }}
            >
              Seleccionar Producto ▼
            </button>
            {/* Menú productos... (puedes implementar el menú aquí si lo necesitas) */}
          </div>
        )}

        {/* Volver */}
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "10px 20px",
            backgroundColor: "transparent",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: "30px",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: "500",
            transition: "all 0.3s ease"
          }}
        >
          Volver
        </button>

        {/* Cerrar Sesión */}
        <button
          onClick={cerrarSesion}
          style={{
            padding: "10px 20px",
            backgroundColor: "rgba(255,255,255,0.1)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: "30px",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: "500",
            transition: "all 0.3s ease"
          }}
        >
          Cerrar Sesión
        </button>

        {/* Perfil */}
        <div
          className="profile-container"
          tabIndex={0}
          onBlur={() => setTimeout(() => setMenuVisible(false), 200)}
          onClick={() => setMenuVisible(!menuVisible)}
          style={{
            position: "relative",
            cursor: "pointer",
            marginLeft: "15px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {fotoPerfil ? (
            <img 
              src={fotoPerfil} 
              alt="Perfil" 
              style={{
                width: "45px",
                height: "45px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid rgba(255,255,255,0.5)",
                transition: "all 0.3s ease"
              }}
            />
          ) : (
            <FaUserCircle 
              size={45} 
              color="#ffffff" 
              style={{ 
                opacity: 0.8,
                transition: "all 0.3s ease"
              }} 
            />
          )}

          {menuVisible && (
            <div 
              style={{
                position: "absolute",
                top: "60px",
                right: "0",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.15)",
                padding: "10px 0",
                display: "flex",
                flexDirection: "column",
                minWidth: "180px",
                zIndex: 1001,
                overflow: "hidden",
              }}
            >
              <NavLink 
                to="/perfil" 
                style={{
                  padding: "10px 20px",
                  color: "#333",
                  textDecoration: "none",
                  transition: "all 0.2s ease"
                }}
                onClick={() => setMenuVisible(false)}
              >
                Mi Perfil
              </NavLink>
              <NavLink 
                to="/configuracion" 
                style={{
                  padding: "10px 20px",
                  color: "#333",
                  textDecoration: "none",
                  transition: "all 0.2s ease"
                }}
                onClick={() => setMenuVisible(false)}
              >
                Configuración
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// CSS global para el width responsivo del header
const header2StyleSheet = `
  @media (max-width: 600px) {
    .header2-sermex {
      width: 109% !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
  }
  @media (min-width: 601px) {
    .header2-sermex {
      width: 101% !important;
    }
  }
`;
if (typeof window !== "undefined") {
  const styleTag = document.getElementById("header2-global-style") || document.createElement("style");
  styleTag.id = "header2-global-style";
  styleTag.innerHTML = header2StyleSheet;
  document.head.appendChild(styleTag);
}

export default Header;