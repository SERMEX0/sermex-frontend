import React, { useState } from "react";
import Header from "../../components/Header2";
import Footer from "../../components/Footer";

const PantallaSimple = () => {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    empresa: "",
    telefono: "",
    asunto: "",
    tipo: "",
    descripcion: "",
  });

  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setEnviando(true);
  setError("");

  try {
    console.log("Enviando datos:", form);
    
    const response = await fetch('http://localhost:5000/api/enviar-contacto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form)
    });

    console.log("Response status:", response.status);
    
    const text = await response.text();
    console.log("Response text:", text);
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError, text);
      throw new Error("Respuesta del servidor no válida");
    }

    if (response.ok) {
      setEnviado(true);
      setForm({
        nombre: "",
        correo: "",
        empresa: "",
        telefono: "",
        asunto: "",
        tipo: "",
        descripcion: "",
      });
    } else {
      setError(data.error || "Error al enviar la solicitud");
    }
  } catch (err) {
    console.error("Error completo:", err);
    setError(err.message || "Error de conexión. Por favor, intente nuevamente.");
  } finally {
    setEnviando(false);
  }
};

  const styles = {
    container: {
      maxWidth: 650,
      margin: "50px auto",
      padding: 36,
      borderRadius: 14,
      background: "#fff",
      boxShadow: "0 4px 25px rgba(0, 0, 0, 0.08)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
      textAlign: "center",
      marginBottom: 28,
    },
    logo: {
      maxWidth: 120,
      marginBottom: 12,
    },
    title: {
      color: "#345475",
      fontWeight: 700,
      fontSize: 24,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      color: "#6b7280",
      marginBottom: 20,
    },
    success: {
      textAlign: "center",
      padding: "30px 20px",
      backgroundColor: "#d1fae5",
      borderRadius: "10px",
      border: "1px solid #10b981",
      marginBottom: "20px",
    },
    successIcon: {
      fontSize: "40px",
      marginBottom: "15px",
    },
    successTitle: {
      color: "#065f46",
      fontWeight: 700,
      fontSize: "20px",
      marginBottom: "10px",
    },
    successMessage: {
      color: "#047857",
      lineHeight: "1.5",
    },
    error: {
      backgroundColor: "#fef2f2",
      color: "#b91c1c",
      padding: "12px",
      borderRadius: "6px",
      marginBottom: "20px",
      border: "1px solid #fecaca",
      textAlign: "center",
    },
    formGroup: {
      marginBottom: 20,
    },
    label: {
      display: "block",
      marginBottom: 6,
      fontWeight: 600,
      color: "#2d3748",
      fontSize: 14,
    },
    input: {
      width: "100%",
      padding: "10px 13px",
      borderRadius: 6,
      border: "1px solid #cbd5e1",
      outline: "none",
      fontSize: 15,
      background: "#f8fafc",
      transition: "border-color 0.25s",
    },
    textarea: {
      width: "100%",
      padding: "10px 13px",
      borderRadius: 6,
      border: "1px solid #cbd5e1",
      outline: "none",
      fontSize: 15,
      resize: "vertical",
      background: "#f8fafc",
      minHeight: 90,
      transition: "border-color 0.25s",
    },
    select: {
      width: "100%",
      padding: "10px 13px",
      borderRadius: 6,
      border: "1px solid #cbd5e1",
      outline: "none",
      fontSize: 15,
      background: "#f8fafc",
      transition: "border-color 0.25s",
    },
    button: {
      width: "100%",
      padding: "14px 0",
      background: "linear-gradient(90deg, #345475, #1565c0)",
      color: "#fff",
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
      fontWeight: 600,
      fontSize: 16,
      letterSpacing: "0.3px",
      boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
      transition: "background 0.25s, transform 0.1s",
    },
    buttonDisabled: {
      width: "100%",
      padding: "14px 0",
      background: "#6b7280",
      color: "#fff",
      border: "none",
      borderRadius: 6,
      cursor: "not-allowed",
      fontWeight: 600,
      fontSize: 16,
      letterSpacing: "0.3px",
      boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
      opacity: 0.7,
    },
  };

  if (enviado) {
    return (
      <div>
        <Header />
        <div style={styles.container}>
          <div style={styles.success}>
            <div style={styles.successIcon}>✅</div>
            <h3 style={styles.successTitle}>¡Solicitud enviada con éxito!</h3>
            <p style={styles.successMessage}>
              Hemos recibido tu solicitud de contacto. Nos pondremos en contacto 
              contigo en un plazo máximo de 24 horas hábiles.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div style={styles.container}>
        <div style={styles.header}>
          <img
            src="/logo_SERMEX_azul.fw.png"
            alt="Logo"
            style={styles.logo}
          />
          <h2 style={styles.title}>Ponte en contacto con nosotros</h2>
          <p style={styles.subtitle}>
            Ingresa tu información y te responderemos lo antes posible.
          </p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} autoComplete="off">
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="nombre">Nombre completo *</label>
            <input
              type="text"
              name="nombre"
              id="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Ej: Juan Pérez"
              disabled={enviando}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="correo">Correo electrónico *</label>
            <input
              type="email"
              name="correo"
              id="correo"
              value={form.correo}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="tu.email@ejemplo.com"
              disabled={enviando}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="empresa">Empresa (opcional)</label>
            <input
              type="text"
              name="empresa"
              id="empresa"
              value={form.empresa}
              onChange={handleChange}
              style={styles.input}
              placeholder="Nombre de tu empresa"
              disabled={enviando}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="telefono">Número de teléfono *</label>
            <input
              type="tel"
              name="telefono"
              id="telefono"
              value={form.telefono}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Ej: 5551234567"
              disabled={enviando}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="asunto">Asunto *</label>
            <input
              type="text"
              name="asunto"
              id="asunto"
              value={form.asunto}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Título breve de tu solicitud"
              disabled={enviando}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="tipo">Tipo de solicitud *</label>
            <select
              name="tipo"
              id="tipo"
              value={form.tipo}
              onChange={handleChange}
              required
              style={styles.select}
              disabled={enviando}
            >
              <option value="">Selecciona una opción</option>
              <option value="soporte">Problema con producto</option>
              <option value="asesoria">Solicitar asesoría</option>
              <option value="experto">Hablar con un experto</option>
              <option value="informacion">Información</option>
              <option value="facturacion">Facturación</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="descripcion">
              Descripción detallada del problema *
            </label>
            <textarea
              name="descripcion"
              id="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              required
              style={styles.textarea}
              placeholder="Describe tu situación o problema con el mayor detalle posible."
              disabled={enviando}
            />
          </div>

          <button
            type="submit"
            style={enviando ? styles.buttonDisabled : styles.button}
            onMouseOver={(e) => !enviando && (e.target.style.background = "linear-gradient(90deg, #2a3d59, #0f4aa3)")}
            onMouseOut={(e) => !enviando && (e.target.style.background = "linear-gradient(90deg, #345475, #1565c0)")}
            onMouseDown={(e) => !enviando && (e.target.style.transform = "scale(0.98)")}
            onMouseUp={(e) => !enviando && (e.target.style.transform = "scale(1)")}
            disabled={enviando}
          >
            {enviando ? "Enviando..." : "Enviar solicitud"}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default PantallaSimple;