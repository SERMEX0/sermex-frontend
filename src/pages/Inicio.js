import { NavLink } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

// Componente Header ajustado con logo responsivo
const Header = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [imagenPerfil, setImagenPerfil] = useState(localStorage.getItem("fotoPerfil") || null);

  // Manejar cambio de imagen de perfil
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        setImagenPerfil(imageUrl);
        localStorage.setItem("fotoPerfil", imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <style>{`
        .sermex-header {
          width: 100vw;
          position: relative;
          left: 50%;
          right: 50%;
          margin-left: -50vw;
          margin-right: -50vw;
          background-color: #345475;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 20px;
          z-index: 1000;
          box-sizing: border-box;
        }
        .sermex-header-logo {
          height: 70px;
          max-width: 160px;
          width: auto;
          object-fit: contain;
          display: block;
          cursor: pointer;
        }
        .sermex-profile-container {
          position: relative;
          cursor: pointer;
          margin-left: auto;
          margin-right: 10px;
          display: flex;
          align-items: center;
        }
        .sermex-profile-avatar {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #fff;
          background: #eaeaea;
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .sermex-profile-avatar:hover {
          border-color: #4474B0;
          box-shadow: 0 4px 15px 0 rgba(68,116,176,0.11);
        }
        .sermex-profile-menu {
          position: absolute;
          top: 60px;
          right: 0;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
          padding: 10px 0;
          display: flex;
          flex-direction: column;
          min-width: 170px;
          z-index: 1001;
          animation: fadeInMenu 0.17s;
        }
        .sermex-profile-menu input[type="file"] {
          display: none;
        }
        .sermex-profile-link {
          padding: 10px 20px;
          color: #345475;
          text-decoration: none;
          font-weight: 500;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          transition: background 0.13s;
          font-family: inherit;
        }
        .sermex-profile-link:hover {
          background: #f3f7ff;
        }
        .sermex-profile-link.logout {
          color: #e13c3c;
        }
        @keyframes fadeInMenu {
          from { opacity: 0; transform: translateY(10px);}
          to { opacity: 1; transform: translateY(0);}
        }

        /* ----------- AJUSTES RESPONSIVE SOLICITADOS ----------- */

        /* SOLO en móvil: mueve la imagen de perfil a la izquierda */
        @media (max-width: 700px) {
          .sermex-header {
            padding: 6px 15px;
          }
          .sermex-header-logo {
            height: 60px;
            max-width: 140px;
          }
          .sermex-profile-avatar {
            width: 48px;
            height: 48px;
          }
          .sermex-profile-menu {
            top: 50px;
            min-width: 150px;
            font-size: 0.9rem;
            right: 0;
          }
        }
      `}</style>
      <header className="sermex-header">
        {/* Logo */}
        <img
          src="/logo_SERMEX_blanco.fw.png"
          alt="Logo"
          className="sermex-header-logo"
          onClick={() => window.location.href = "/inicio"}
        />

        {/* Contenedor del perfil */}
        <div
          className="sermex-profile-container"
          onClick={() => setMenuVisible(!menuVisible)}
        >
          {/* Si hay imagen de perfil, mostrarla; si no, mostrar el icono */}
          {imagenPerfil ? (
            <img
              src={imagenPerfil}
              alt="Foto de perfil"
              className="sermex-profile-avatar"
            />
          ) : (
            <FaUserCircle size={54} color="#ffffff" />
          )}

          {/* Menú desplegable */}
          {menuVisible && (
            <div className="sermex-profile-menu">
              <NavLink to="/perfil" className="sermex-profile-link">
                Mi Perfil
              </NavLink>
              <button
                className="sermex-profile-link logout"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  localStorage.removeItem("fotoPerfil");
                  window.location.href = "/login";
                  setMenuVisible(false);
                }}
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

// Componente Inicio
const Inicio = () => {
  const navigate = useNavigate();

   return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      {/* Contenido principal con video de fondo */}
      <div
        style={{
          position: "relative",
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100vw",
          minHeight: "calc(100vh - 140px)",
          overflow: "hidden"
        }}
      >
        {/* Video de fondo */}
        <video
          autoPlay
          loop
          muted
          poster="https://sermex0.github.io/Sermex_Api_Images/sermex_img-video.png"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100%",
            objectFit: "cover",
            zIndex: -1,
          }}
        >
          <source src="https://sermex0.github.io/Sermex_Api_Images/SERMEX-video..mp4" type="video/mp4" />
        </video>

        {/* Contenido centrado sobre el video - EXACTAMENTE COMO ESTABA */}
        <div
          style={{
            textAlign: "center",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            color: "#fff",
            padding: "100px", // ← Como estaba
            borderRadius: "10px",
            zIndex: 1,
            maxWidth: "98vw" // ← Como estaba
          }}
        >
          <h2>Centro de Ayuda SERMEX</h2>
          <h5>
            El acceso centralizado a todo el soporte técnico SERMEX. Solicita mantenimiento, gestiona garantías y realiza el seguimiento de tus reportes.
          </h5>

          {/* Botones - EXACTAMENTE COMO ESTABAN */}
          <div>
            <button
              onClick={() => navigate("/seleccionar-producto")}
              style={buttonStyle}
              onMouseOver={e => e.target.style.backgroundColor = "#ddd"}
              onMouseOut={e => e.target.style.backgroundColor = "#fff"}
            >
              Panel principal
            </button>
          </div>
          <div>
            <button
              onClick={() => navigate("/Rma")}
              style={buttonStyle}
              onMouseOver={e => e.target.style.backgroundColor = "#ddd"}
              onMouseOut={e => e.target.style.backgroundColor = "#fff"}
            >
              Crear solicitud de mantenimiento y garantía
            </button>
          </div>
          <div>
            <button
              onClick={() => navigate("/logistica1")}
              style={buttonStyle}
              onMouseOver={e => e.target.style.backgroundColor = "#ddd"}
              onMouseOut={e => e.target.style.backgroundColor = "#fff"}
            >
              Ver seguimiento de reporte
            </button>
          </div>
          <div>
            <button
              onClick={() => navigate("/asesoria")}
              style={buttonStyle}
              onMouseOver={e => e.target.style.backgroundColor = "#ddd"}
              onMouseOut={e => e.target.style.backgroundColor = "#fff"}
            >
              Contáctate con nosotros
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

// Estilos de botones reutilizables - EXACTAMENTE COMO ESTABAN
const buttonStyle = {
  padding: "10px 20px",
  fontSize: "1rem",
  cursor: "pointer",
  backgroundColor: "#fff",
  color: "#345475",
  border: "none",
  borderRadius: "5px",
  marginTop: "15px", // ← Como estaba
  transition: "background-color 0.3s ease",
};
export default Inicio;