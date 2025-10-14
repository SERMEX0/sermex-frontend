import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend
);

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Palabras clave para motivos
const motivos = [
  { clave: "pantalla", label: "Pantalla", color: "#eb3b5a" },
  { clave: "batería", label: "Batería", color: "#45aaf2" },
  { clave: "bateria", label: "Batería", color: "#45aaf2" },
  { clave: "camara", label: "Cámara", color: "#26de81" },
  { clave: "cámara", label: "Cámara", color: "#26de81" },
  { clave: "software", label: "Software", color: "#3867d6" },
  { clave: "no enciende", label: "No enciende", color: "#a55eea" },
  { clave: "cargador", label: "Cargador", color: "#f7b731" },
  { clave: "teclado", label: "Teclado", color: "#fd9644" },
  { clave: "otro", label: "Otro", color: "#778ca3" }
];

function clasificaMotivo(texto) {
  if (!texto) return { label: "Sin especificar", color: "#a5b1c2" };
  const textoLimpio = texto.toLowerCase();
  for (const motivo of motivos) {
    if (textoLimpio.includes(motivo.clave)) return motivo;
  }
  return { label: "Otro", color: "#778ca3" };
}

// Componente para mostrar estadísticas resumidas
const StatsCard = ({ title, value, icon, color }) => (
  <div className="stats-card">
    <div className="stats-icon" style={{ backgroundColor: color }}>
      <i className={icon}></i>
    </div>
    <div className="stats-content">
      <h3>{value}</h3>
      <p>{title}</p>
    </div>
  </div>
);

// Componente para cada gráfica con diseño consistente
const ChartContainer = ({ title, children, width = "49%" }) => (
  <div className="chart-container" style={{ width }}>
    <div className="chart-header">
      <h3>{title}</h3>
    </div>
    <div className="chart-body">
      {children}
    </div>
  </div>
);

// Componente para el modal de detalles
const DetalleModal = ({ registro, onClose }) => {
  if (!registro) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Detalles del RMA</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          <div className="detail-grid">
            <div className="detail-item">
              <label>RMA ID:</label>
              <span className="rma-id">{registro.rma_id}</span>
            </div>
            <div className="detail-item">
              <label>Correo Cliente:</label>
              <span>{registro.correo_cliente}</span>
            </div>
            <div className="detail-item">
              <label>Producto:</label>
              <span>{registro.producto}</span>
            </div>
            <div className="detail-item">
              <label>Estado:</label>
              <span className={`status-badge status-${registro.estado}`}>
                {registro.estado}
              </span>
            </div>
            <div className="detail-item">
              <label>Fecha Creación:</label>
              <span>{registro.fecha_creacion?.replace("T", " ").slice(0, 19)}</span>
            </div>
            <div className="detail-item full-width">
              <label>Detalles:</label>
              <div className="details-text">
                {registro.detalles || "Sin detalles especificados"}
              </div>
            </div>
            <div className="detail-item full-width">
              <label>Motivo Clasificado:</label>
              <div className="motivo-tag" style={{ 
                backgroundColor: clasificaMotivo(registro.detalles).color + '20',
                color: clasificaMotivo(registro.detalles).color,
                border: `1px solid ${clasificaMotivo(registro.detalles).color}`
              }}>
                {clasificaMotivo(registro.detalles).label}
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente de Login
const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === "admin@sermex.com" && password === "admin123") {
      localStorage.setItem("adminAuthenticated", "true");
      localStorage.setItem("adminEmail", email);
      onLogin(true);
    } else {
      setError("Credenciales incorrectas. Solo el administrador puede acceder.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-header">
          <i className="fas fa-lock"></i>
          <h2>Acceso Administrativo</h2>
          <p>Dashboard de Reparaciones SERMEX</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo Electrónico:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@sermex.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="login-btn">
            <i className="fas fa-sign-in-alt"></i>
            Iniciar Sesión
          </button>
        </form>
        
       
      </div>
    </div>
  );
};

export default function DataResult({ correo }) {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [filtroFecha, setFiltroFecha] = useState("ultimo_mes");
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Verificar autenticación al cargar el componente
  useEffect(() => {
    const authStatus = localStorage.getItem("adminAuthenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
    setCheckingAuth(false);
  }, []);

  // Cargar datos solo si está autenticado
  useEffect(() => {
    if (!isAuthenticated) return;

    setLoading(true);
    axios
      .get(`${API_URL}/api/logistica${correo ? "/" + correo : ""}`)
      .then((res) => {
        setData(res.data);
        setFilteredData(res.data);
      })
      .catch(() => {
        setData([]);
        setFilteredData([]);
      })
      .finally(() => setLoading(false));
  }, [correo, isAuthenticated]);

  // Función para filtrar datos por fecha
  const filtrarPorFecha = (filtro) => {
    const ahora = new Date();
    let fechaLimite = new Date();

    switch (filtro) {
      case "ultimo_mes":
        fechaLimite.setMonth(ahora.getMonth() - 1);
        break;
      case "ultimos_3_meses":
        fechaLimite.setMonth(ahora.getMonth() - 3);
        break;
      case "ultimos_6_meses":
        fechaLimite.setMonth(ahora.getMonth() - 6);
        break;
      case "este_año":
        fechaLimite = new Date(ahora.getFullYear(), 0, 1);
        break;
      case "año_pasado":
        fechaLimite = new Date(ahora.getFullYear() - 1, 0, 1);
        const finAñoPasado = new Date(ahora.getFullYear() - 1, 11, 31);
        return data.filter(row => {
          const fechaRow = new Date(row.fecha_creacion);
          return fechaRow >= fechaLimite && fechaRow <= finAñoPasado;
        });
      case "todos":
      default:
        return data;
    }

    return data.filter(row => new Date(row.fecha_creacion) >= fechaLimite);
  };

  useEffect(() => {
    if (isAuthenticated) {
      const datosFiltrados = filtrarPorFecha(filtroFecha);
      setFilteredData(datosFiltrados);
    }
  }, [filtroFecha, data, isAuthenticated]);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    localStorage.removeItem("adminEmail");
    setIsAuthenticated(false);
  };

  // Estadísticas generales (usando filteredData para reflejar los filtros)
  const totalRMAs = filteredData.length;
  const completados = filteredData.filter(row => row.estado === "completado").length;
  const enProceso = filteredData.filter(row => 
    row.estado === "en_revision" || row.estado === "reparacion"
  ).length;

  // Gráfica de motivos (usando detalles)
  const conteoMotivos = {};
  filteredData.forEach(row => {
    const motivo = clasificaMotivo(row.detalles);
    const label = motivo.label;
    conteoMotivos[label] = {
      count: (conteoMotivos[label]?.count || 0) + 1,
      color: motivo.color
    };
  });
  
  const motivoLabels = Object.keys(conteoMotivos);
  const motivoData = Object.values(conteoMotivos);
  const motivoColors = motivoData.map(m => m.color);
  const motivoValues = motivoData.map(m => m.count);

  // Gráfica de estados
  const estados = [
    { estado: "recibido", label: "Recibido", color: "#eb3b5a" },
    { estado: "en_revision", label: "En revisión", color: "#45aaf2" },
    { estado: "reparacion", label: "En reparación", color: "#f7b731" },
    { estado: "completado", label: "Completado", color: "#26de81" }
  ];
  
  const countByEstado = estados.map(
    item => filteredData.filter(row => row.estado === item.estado).length
  );
  const estadoLabels = estados.map(e => e.label);
  const estadoColors = estados.map(e => e.color);

  // Gráfica de productos (top 5)
  const productos = {};
  filteredData.forEach(row => {
    productos[row.producto] = (productos[row.producto] || 0) + 1;
  });
  const topProductos = Object.entries(productos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Gráfica línea tiempo
  const fechas = {};
  filteredData.forEach(row => {
    const fecha = row.fecha_creacion?.slice(0, 10); // YYYY-MM-DD
    if (fecha) fechas[fecha] = (fechas[fecha] || 0) + 1;
  });
  const fechasSorted = Object.entries(fechas).sort((a, b) => a[0].localeCompare(b[0]));

  // Tabla mejorada
  const renderTable = () => (
    <div className="table-container">
      <div className="table-filters">
        <div className="filter-group">
          <label>Filtrar por fecha:</label>
          <select 
            value={filtroFecha} 
            onChange={(e) => setFiltroFecha(e.target.value)}
            className="filter-select"
          >
            <option value="ultimo_mes">Último mes</option>
            <option value="ultimos_3_meses">Últimos 3 meses</option>
            <option value="ultimos_6_meses">Últimos 6 meses</option>
            <option value="este_año">Este año</option>
            <option value="año_pasado">Año pasado</option>
            <option value="todos">Todos los registros</option>
          </select>
        </div>
        <div className="results-count">
          Mostrando {filteredData.length} de {data.length} registros
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>RMA ID</th>
            <th>Correo Cliente</th>
            <th>Producto</th>
            <th>Estado</th>
            <th>Fecha Creación</th>
            <th>Detalles</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map(row => (
            <tr key={row.id} className="table-row">
              <td className="rma-id">{row.rma_id}</td>
              <td>{row.correo_cliente}</td>
              <td>{row.producto}</td>
              <td>
                <span className={`status-badge status-${row.estado}`}>
                  {row.estado}
                </span>
              </td>
              <td>{row.fecha_creacion?.replace("T", " ").slice(0, 19)}</td>
              <td className="details-cell">
                {row.detalles ? (
                  <div className="truncated-details">
                    {row.detalles.length > 50 
                      ? `${row.detalles.substring(0, 50)}...` 
                      : row.detalles
                    }
                  </div>
                ) : "-"}
              </td>
              <td>
                <button 
                  className="view-btn"
                  onClick={() => setRegistroSeleccionado(row)}
                  title="Ver detalles completos"
                >
                  <i className="fas fa-eye"></i>
                  Ver
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Mostrar loading mientras se verifica la autenticación
  if (checkingAuth) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Verificando acceso...</p>
      </div>
    );
  }

  // Mostrar formulario de login si no está autenticado
  if (!isAuthenticated) {
    return <LoginForm onLogin={setIsAuthenticated} />;
  }

  // Contenido principal para usuarios autenticados
  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Cargando datos...</p>
    </div>
  );
  
  if (!data.length) return (
    <div className="no-data">
      <i className="fas fa-database"></i>
      <p>No hay datos para mostrar.</p>
      <button className="logout-btn" onClick={handleLogout}>
        <i className="fas fa-sign-out-alt"></i>
        Cerrar Sesión
      </button>
    </div>
  );

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Dashboard de Reparaciones SERMEX</h1>
          <div className="user-info">
            <i className="fas fa-user-shield"></i>
            <span>Administrador</span>
          </div>
        </div>
        <div className="header-right">
          <div className="tabs">
            <button 
              className={activeTab === "dashboard" ? "active" : ""}
              onClick={() => setActiveTab("dashboard")}
            >
              <i className="fas fa-chart-bar"></i> Dashboard
            </button>
            <button admin
              className={activeTab === "tabla" ? "active" : ""}
              onClick={() => setActiveTab("tabla")}
            >
              <i className="fas fa-table"></i> Datos Detallados
            </button>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            Cerrar Sesión
          </button>
        </div>
      </header>

      {activeTab === "dashboard" ? (
        <>
          <div className="stats-grid">
            <StatsCard 
              title="Total RMAs" 
              value={totalRMAs} 
              icon="fas fa-clipboard-list" 
              color="#4b7bec" 
            />
            <StatsCard 
              title="Completados" 
              value={completados} 
              icon="fas fa-check-circle" 
              color="#26de81" 
            />
            <StatsCard 
              title="En Proceso" 
              value={enProceso} 
              icon="fas fa-tools" 
              color="#f7b731" 
            />
            <StatsCard 
              title="Tasa de Completación" 
              value={totalRMAs ? `${Math.round((completados/totalRMAs)*100)}%` : "0%"} 
              icon="fas fa-chart-line" 
              color="#a55eea" 
            />
          </div>

          <div className="charts-grid">
            <ChartContainer title="Fallas Reportadas en Equipos">
              <Pie
                data={{
                  labels: motivoLabels,
                  datasets: [{
                    data: motivoValues,
                    backgroundColor: motivoColors,
                    borderWidth: 1,
                    borderColor: "#fff"
                  }]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'right',
                    }
                  }
                }}
              />
            </ChartContainer>

            <ChartContainer title="Estados de Reparación Activos">
              <Pie
                data={{
                  labels: estadoLabels,
                  datasets: [{
                    data: countByEstado,
                    backgroundColor: estadoColors,
                    borderWidth: 1,
                    borderColor: "#fff"
                  }]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'right',
                    }
                  }
                }}
              />
            </ChartContainer>

            <ChartContainer title="Top Productos (por cantidad de RMA)" width="100%">
              <Bar
                data={{
                  labels: topProductos.map(([p]) => p),
                  datasets: [{
                    label: "Cantidad",
                    data: topProductos.map(([, c]) => c),
                    backgroundColor: "#3867d6",
                    borderRadius: 5
                  }]
                }}
                options={{ 
                  indexAxis: "y",
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }}
              />
            </ChartContainer>

            <ChartContainer title="RMAs por Día" width="100%">
              <Line
                data={{
                  labels: fechasSorted.map(([f]) => f),
                  datasets: [{
                    label: "RMAs creados",
                    data: fechasSorted.map(([, c]) => c),
                    borderColor: "#45aaf2",
                    backgroundColor: "rgba(69, 170, 242, 0.1)",
                    fill: true,
                    tension: 0.3,
                    pointBackgroundColor: "#45aaf2",
                    pointBorderColor: "#fff",
                    pointRadius: 4
                  }]
                }}
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1
                      }
                    }
                  }
                }}
              />
            </ChartContainer>
          </div>
        </>
      ) : (
        <div className="tabla-container">
          <div className="tabla-header">
            <h2>Datos Detallados de Reparaciones</h2>
            <p>Total de registros: {filteredData.length} {filteredData.length !== data.length && `(Filtrados de ${data.length} totales)`}</p>
          </div>
          {renderTable()}
        </div>
      )}

      {/* Modal de detalles */}
      <DetalleModal 
        registro={registroSeleccionado}
        onClose={() => setRegistroSeleccionado(null)}
      />

      <style jsx>{`
        /* Estilos generales */
        .dashboard-container {
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f8f9fa;
          min-height: 100vh;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 1px solid #e0e0e0;
        }

        .header-left h1 {
          color: #2c3e50;
          margin: 0 0 5px 0;
          font-weight: 600;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #7f8c8d;
          font-size: 14px;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .tabs {
          display: flex;
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }

        .tabs button {
          padding: 10px 20px;
          border: none;
          background: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .tabs button:hover {
          background: #f1f3f5;
        }

        .tabs button.active {
          background: #4b7bec;
          color: white;
        }

        .logout-btn {
          background: #eb3b5a;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          transition: background 0.3s ease;
        }

        .logout-btn:hover {
          background: #fc5c65;
        }

        /* Estadísticas */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stats-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          transition: transform 0.3s ease;
        }

        .stats-card:hover {
          transform: translateY(-5px);
        }

        .stats-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          color: white;
          font-size: 24px;
        }

        .stats-content h3 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          color: #2c3e50;
        }

        .stats-content p {
          margin: 5px 0 0;
          color: #7f8c8d;
          font-weight: 500;
        }

        /* Gráficas */
        .charts-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 30px;
        }

        .chart-container {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          margin-bottom: 20px;
        }

        .chart-header {
          padding: 15px 20px;
          border-bottom: 1px solid #eee;
        }

        .chart-header h3 {
          margin: 0;
          font-size: 16px;
          color: #2c3e50;
          font-weight: 600;
        }

        .chart-body {
          padding: 20px;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Login Styles */
        .login-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .login-form {
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
        }

        .login-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .login-header i {
          font-size: 48px;
          color: #4b7bec;
          margin-bottom: 15px;
        }

        .login-header h2 {
          margin: 0 0 10px 0;
          color: #2c3e50;
        }

        .login-header p {
          margin: 0;
          color: #7f8c8d;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #2c3e50;
        }

        .form-group input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 16px;
          transition: border 0.3s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: #4b7bec;
        }

        .error-message {
          background: #ffeaea;
          color: #eb3b5a;
          padding: 10px;
          border-radius: 6px;
          margin-bottom: 15px;
          font-size: 14px;
        }

        .login-btn {
          width: 100%;
          background: #4b7bec;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.3s ease;
        }

        .login-btn:hover {
          background: #3867d6;
        }

        .login-info {
          margin-top: 25px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 6px;
          font-size: 14px;
          color: #7f8c8d;
        }

        .login-info p {
          margin: 5px 0;
        }

        /* Resto de estilos (tabla, modal, etc.) se mantienen igual */
        /* ... (mantener todos los estilos anteriores de tabla, modal, etc.) */

        /* Tabla y Filtros */
        .tabla-container {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }

        .tabla-header {
          padding: 20px;
          border-bottom: 1px solid #eee;
        }

        .tabla-header h2 {
          margin: 0 0 5px;
          color: #2c3e50;
        }

        .tabla-header p {
          margin: 0;
          color: #7f8c8d;
        }

        .table-filters {
          padding: 15px 20px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f8f9fa;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .filter-group label {
          font-weight: 600;
          color: #2c3e50;
          font-size: 14px;
        }

        .filter-select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          background: white;
          font-size: 14px;
          cursor: pointer;
        }

        .results-count {
          color: #7f8c8d;
          font-size: 14px;
          font-weight: 500;
        }

        .table-container {
          overflow-x: auto;
          width: 100%;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th {
          background-color: #f8f9fa;
          padding: 12px 15px;
          text-align: left;
          font-weight: 600;
          color: #2c3e50;
          border-bottom: 2px solid #eee;
        }

        .data-table td {
          padding: 12px 15px;
          border-bottom: 1px solid #eee;
          color: #34495e;
        }

        .table-row:hover {
          background-color: #f8f9fa;
        }

        .status-badge {
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .status-recibido {
          background-color: #ffeaea;
          color: #eb3b5a;
        }

        .status-en_revision {
          background-color: #e3f2ff;
          color: #45aaf2;
        }

        .status-reparacion {
          background-color: #fff8e1;
          color: #f7b731;
        }

        .status-completado {
          background-color: #e7f9ed;
          color: #26de81;
        }

        .rma-id {
          font-weight: 600;
          color: #4b7bec;
        }

        .details-cell {
          max-width: 200px;
        }

        .truncated-details {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .view-btn {
          background: #4b7bec;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 5px;
          transition: background 0.3s ease;
        }

        .view-btn:hover {
          background: #3867d6;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          padding: 20px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h2 {
          margin: 0;
          color: #2c3e50;
          font-size: 20px;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          color: #7f8c8d;
          padding: 5px;
          border-radius: 4px;
        }

        .close-btn:hover {
          background: #f8f9fa;
          color: #2c3e50;
        }

        .modal-body {
          padding: 20px;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .detail-item.full-width {
          grid-column: 1 / -1;
        }

        .detail-item label {
          font-weight: 600;
          color: #2c3e50;
          font-size: 14px;
        }

        .detail-item span {
          color: #34495e;
        }

        .details-text {
          background: #f8f9fa;
          padding: 12px;
          border-radius: 6px;
          border: 1px solid #e9ecef;
          line-height: 1.5;
          max-height: 150px;
          overflow-y: auto;
        }

        .motivo-tag {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          display: inline-block;
          width: fit-content;
        }

        .modal-footer {
          padding: 15px 20px;
          border-top: 1px solid #eee;
          display: flex;
          justify-content: flex-end;
        }

        .btn-primary {
          background: #4b7bec;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.3s ease;
        }

        .btn-primary:hover {
          background: #3867d6;
        }

        /* Estados de carga y sin datos */
        .loading-container, .no-data {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50vh;
          color: #7f8c8d;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e0e0e0;
          border-top: 4px solid #4b7bec;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 15px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .no-data i {
          font-size: 48px;
          margin-bottom: 15px;
          color: #bdc3c7;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }
          
          .header-right {
            width: 100%;
            justify-content: space-between;
          }
          
          .tabs {
            width: auto;
          }
          
          .charts-grid {
            flex-direction: column;
          }
          
          .chart-container {
            width: 100% !important;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .table-filters {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }

          .detail-grid {
            grid-template-columns: 1fr;
          }

          .modal-content {
            margin: 10px;
            width: calc(100% - 20px);
          }

          .login-form {
            padding: 25px;
          }
        }
      `}</style>
    </div>
  );
}