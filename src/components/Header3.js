import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header
      style={{
        width: "100%",
        background: "linear-gradient(90deg, #345475 70%, #4474B0 100%)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "15px 30px",
        position: "sticky",
        top: 0,
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        boxSizing: "border-box",
        zIndex: 1000
      }}
    >
      {/* Logo Sermex */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src="/logo_SERMEX_blanco.fw.png"
          alt="Logo Sermex"
          style={{
            height: "70px",
            cursor: "pointer",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
          }}
          onClick={() => navigate("/inicio")}
        />
      </div>

      {/* Botón Iniciar sesión */}
      <button
        onClick={() => navigate("/login")}
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
        onMouseOver={(e) => (e.target.style.backgroundColor = "rgba(255,255,255,0.1)")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
      >
        Iniciar sesión
      </button>
    </header>
  );
};

export default Header;
