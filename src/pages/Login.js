import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  
  // --- Nuevo flujo: recuperación automatica ---
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState("");
  const [resetError, setResetError] = useState("");

  const iniciarSesion = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, password }),
      });

      if (!response.ok) throw new Error("Correo o contraseña incorrectos");

      const data = await response.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/inicio");
    } catch (err) {
      setError(err.message || "Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  // --- Nueva función para recuperación ---
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    setResetSuccess("");
    setResetError("");
    try {
      const response = await fetch(`${API_URL}/api/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error al enviar correo");
      setResetSuccess("¡Correo enviado! Revisa tu bandeja para restablecer la contraseña.");
      setResetEmail("");
    } catch (err) {
      setResetError(err.message);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginCard}>
        {/* Logo SERMEX */}
        <div style={styles.logoContainer}>
          <img 
            src="/logo_SERMEX_azul.fw.png" 
            alt="Logo SERMEX" 
            style={styles.logo}
          />
        </div>

        <h2 style={styles.title}>Bienvenido a SERMEX</h2>
        <p style={styles.subtitle}>Ingresa tu correo y contraseña para continuar</p>

        {error && <div style={styles.errorMessage}>{error}</div>}

        <form onSubmit={iniciarSesion} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="correo" style={styles.label}>Correo electrónico</label>
            <input
              id="correo"
              type="email"
              placeholder="tu.correo@.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <button 
            type="submit" 
            style={loading ? styles.buttonDisabled : styles.button}
            disabled={loading}
          >
            {loading ? (
              <div style={styles.loadingContainer}>
                <div style={styles.loadingSpinner}></div>
                Ingresando...
              </div>
            ) : "Ingresar"}
          </button>
        </form>

        {/* ---- Nuevo Modal a lo ChangePassword ---- */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            ¿Problemas para ingresar?{' '}
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setShowResetForm(true);
                setResetSuccess("");
                setResetError("");
              }}
              style={styles.link}
            >
              Solicita restablecer tu contraseña
            </a>
          </p>
        </div>

        {showResetForm && (
          <div
            style={{
              background: "#f8fafe",
              borderRadius: 8,
              boxShadow: "0 4px 22px rgba(52,84,117,0.09)",
              margin: "16px auto",
              padding: "20px",
              maxWidth: "360px"
            }}>
            <form onSubmit={handlePasswordReset}>
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontWeight: 500, color: "#345475" }}>
                  Escribe tu correo para restablecer la contraseña:
                </label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={e => setResetEmail(e.target.value)}
                  required
                  placeholder="Tu correo electrónico"
                  style={{
                    width: "100%", border: "1px solid #cdddec", padding: 8, borderRadius: 7, marginTop: 6
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={resetLoading}
                style={{
                  background: resetLoading ? "#bbb" : "linear-gradient(90deg,#345475 80%,#4474B0 100%)",
                  color: "#fff", border: "none", borderRadius: 8, padding: "11px 24px",
                  fontWeight: 600, marginBottom: 8, cursor: resetLoading ? "not-allowed" : "pointer"
                }}
              >
                {resetLoading ? "Enviando..." : "Enviar correo de recuperación"}
              </button>
              <button
                type="button"
                onClick={() => setShowResetForm(false)}
                style={{
                  background: "transparent", color: "#345475", border: "none",
                  textDecoration: "underline", cursor: "pointer"
                }}
              >
                Cancelar
              </button>
              {resetError && <div style={styles.errorMessage}>{resetError}</div>}
              {resetSuccess && <div style={styles.successMessage}>{resetSuccess}</div>}
            </form>
          </div>
        )}

      </div>
    </div>
  );
};


// Estilos
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    padding: "20px",
  },
  loginCard: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    padding: "40px",
    width: "100%",
    maxWidth: "450px",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  },
  logoContainer: {
    marginBottom: "20px",
  },
  logo: {
    height: "80px",
    objectFit: "contain",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#7f8c8d",
    marginBottom: "30px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    textAlign: "left",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#34495e",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    border: "1px solid #dfe6e9",
    borderRadius: "8px",
    fontSize: "15px",
    transition: "all 0.3s ease",
    backgroundColor: "#f8f9fa",
  },
  inputFocus: {
    borderColor: "#3498db",
    boxShadow: "0 0 0 3px rgba(52, 152, 219, 0.1)",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "10px",
  },
  buttonDisabled: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#bdc3c7",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "not-allowed",
    marginTop: "10px",
  },
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  loadingSpinner: {
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    width: "16px",
    height: "16px",
    animation: "spin 1s linear infinite",
  },
  errorMessage: {
    backgroundColor: "#fee",
    color: "#e74c3c",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "20px",
    border: "1px solid #ffdddd",
  },
  successMessage: {
    backgroundColor: "#eafaf1",
    color: "#2e7d32",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "20px",
    border: "1px solid #b0eacb",
  },
  footer: {
    marginTop: "30px",
    borderTop: "1px solid #ecf0f1",
    paddingTop: "20px",
  },
  footerText: {
    fontSize: "13px",
    color: "#7f8c8d",
  },
  link: {
    color: "#3498db",
    textDecoration: "none",
    fontWeight: "500",
  },
};

export default Login;