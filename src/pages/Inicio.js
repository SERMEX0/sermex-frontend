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
          width: 102%;
          max-width: 1500px;
          margin: 0 auto;
          background-color: #345475;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 20px;
          z-index: 2;
          position: relative;
        }
        .sermex-header-logo {
          height: 70px;
          max-width: 160px;
          width: auto;
          object-fit: contain;
          display: block;
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
          transition: box-shadow 0.2s, border-color 0.2s, left 0.2s;
          position: relative;
          left: 0;
        }
        .sermex-profile-avatar:hover {
          border-color: #4474B0;
          box-shadow: 0 4px 15px 0 rgba(68,116,176,0.11);
        }
        .sermex-profile-menu {
          position: absolute;
          top: 54px;
          right: 0;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
          padding: 10px 0;
          display: flex;
          flex-direction: column;
          min-width: 170px;
          z-index: 100;
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
            padding: 6px 3vw;
          }
          .sermex-header-logo {
            height: 68px;
            max-width: 145px;
          }
          .sermex-profile-avatar {
            width: 52px;
            height: 52px;
            left: -13px; /* mueve un poco a la izquierda SOLO en móvil */
          }
          .sermex-profile-menu {
            top: 38px;
            min-width: 97px;
            font-size: 0.97rem;
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
            <FaUserCircle size={40} color="#ffffff" />
          )}

          {/* Menú desplegable */}
          {menuVisible && (
            <div className="sermex-profile-menu">
              {/* Input oculto para subir imagen */}
              <NavLink to="/perfil" className="sermex-profile-link">
                Mi Perfil
              </NavLink>
              <NavLink to="/" className="sermex-profile-link logout">
                Cerrar Sesión
              </NavLink>
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
    <div>
      <Header />

      {/* Contenido principal con video de fondo */}
      <div
        style={{
          position: "relative",
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "107%",
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
            width: "101%",
            height: "100%",
            objectFit: "cover",
            zIndex: -1,
          }}
        >
          <source src="https://sermex0.github.io/Sermex_Api_Images/SERMEX-video..mp4" type="video/mp4" />
        </video>

        {/* Contenido centrado sobre el video */}
        <div
          style={{
            textAlign: "center",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            color: "#fff",
            padding: "100px",
            borderRadius: "10px",
            zIndex: 1,
            maxWidth: "98vw"
          }}
        >
          <h2>Centro de Ayuda SERMEX</h2>
          <h6>
            SERMEX ofrece soporte técnico para resolver problemas con tus equipos y optimizar su rendimiento.
          </h6>

          {/* Botones */}
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
              Crear solicitud RMA
            </button>
          </div>
          <div>
            <button
              onClick={() => navigate("/logistica")}
              style={buttonStyle}
              onMouseOver={e => e.target.style.backgroundColor = "#ddd"}
              onMouseOut={e => e.target.style.backgroundColor = "#fff"}
            >
              Ver seguimiento de reporte
            </button>
          </div>
        </div>
      </div>
      {/* El Footer se ajusta abajo solo en escritorio */}
      <Footer />
      <style>{`
        @media (min-width: 1024px) {
          .sermex-footer {
            margin-top: 60px !important; /* Solo en escritorio, baja el footer */
          }
        }
      `}</style>
    </div>
  );
};

// Estilos de botones reutilizables
const buttonStyle = {
  padding: "10px 20px",
  fontSize: "1rem",
  cursor: "pointer",
  backgroundColor: "#fff",
  color: "#345475",
  border: "none",
  borderRadius: "5px",
  marginTop: "15px",
  transition: "background-color 0.3s ease",
};

export default Inicio;