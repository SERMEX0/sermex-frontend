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

// Palabras clave para motivos (puedes editar y ampliar esta lista)
const motivos = [
  { clave: "pantalla", label: "Pantalla" },
  { clave: "batería", label: "Batería" },
  { clave: "bateria", label: "Batería" },
  { clave: "camara", label: "Cámara" },
  { clave: "cámara", label: "Cámara" },
  { clave: "software", label: "Software" },
  { clave: "no enciende", label: "No enciende" },
  { clave: "cargador", label: "Cargador" },
  { clave: "teclado", label: "Teclado" },
  { clave: "otro", label: "Otro" }
];

function clasificaMotivo(texto) {
  if (!texto) return "Sin especificar";
  const textoLimpio = texto.toLowerCase();
  for (const motivo of motivos) {
    if (textoLimpio.includes(motivo.clave)) return motivo.label;
  }
  return "Otro";
}

export default function DataResult({ correo }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/api/logistica${correo ? "/" + correo : ""}`)
      .then((res) => setData(res.data))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [correo]);

  // Gráfica de motivos (usando detalles)
  const conteoMotivos = {};
  data.forEach(row => {
    const motivo = clasificaMotivo(row.detalles);
    conteoMotivos[motivo] = (conteoMotivos[motivo] || 0) + 1;
  });
  const motivoLabels = Object.keys(conteoMotivos);
  const motivoValues = Object.values(conteoMotivos);

  // Gráfica de estados
  const estados = ["recibido", "en_revision", "reparacion", "completado"];
  const countByEstado = estados.map(
    estado => data.filter(row => row.estado === estado).length
  );

  // Gráfica de productos (top 5)
  const productos = {};
  data.forEach(row => {
    productos[row.producto] = (productos[row.producto] || 0) + 1;
  });
  const topProductos = Object.entries(productos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Gráfica línea tiempo
  const fechas = {};
  data.forEach(row => {
    const fecha = row.fecha_creacion?.slice(0, 10); // YYYY-MM-DD
    if (fecha) fechas[fecha] = (fechas[fecha] || 0) + 1;
  });
  const fechasSorted = Object.entries(fechas).sort((a, b) => a[0].localeCompare(b[0]));

  // Tabla básica
  const renderTable = () => (
    <table className="table table-striped mt-4">
      <thead>
        <tr>
          <th>RMA ID</th>
          <th>Correo Cliente</th>
          <th>Producto</th>
          <th>Estado</th>
          <th>Fecha Creación</th>
          <th>Detalles</th>
        </tr>
      </thead>
      <tbody>
        {data.map(row => (
          <tr key={row.id}>
            <td>{row.rma_id}</td>
            <td>{row.correo_cliente}</td>
            <td>{row.producto}</td>
            <td>{row.estado}</td>
            <td>{row.fecha_creacion?.replace("T", " ").slice(0, 19)}</td>
            <td>{row.detalles || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  if (loading) return <p>Cargando datos...</p>;
  if (!data.length) return <p>No hay datos para mostrar.</p>;

  return (
    <div>
      <h2 className="mb-3">Resultados Logística</h2>
      {/* Gráfica motivos de reparación */}
      <div style={{ maxWidth: 600, margin: "auto" }}>
        <h4>Motivos (extraídos de detalles)</h4>
        <Pie
          data={{
            labels: motivoLabels,
            datasets: [{
              data: motivoValues,
              backgroundColor: [
                "#eb3b5a", "#45aaf2", "#26de81", "#3867d6", "#a55eea", "#f7b731", "#888", "#fd9644"
              ]
            }]
          }}
        />
      </div>

      {/* Gráfica de estados */}
      <div style={{ maxWidth: 600, margin: "auto", marginTop: 40 }}>
        <h4>Estados de RMA</h4>
        <Pie
          data={{
            labels: estados,
            datasets: [
              {
                data: countByEstado,
                backgroundColor: ["#eb3b5a", "#45aaf2", "#26de81", "#a55eea"],
              },
            ],
          }}
        />
      </div>

      {/* Gráfica de productos top */}
      <div style={{ maxWidth: 600, margin: "auto", marginTop: 40 }}>
        <h4>Top Productos (por cantidad de RMA)</h4>
        <Bar
          data={{
            labels: topProductos.map(([p]) => p),
            datasets: [
              {
                label: "Cantidad",
                data: topProductos.map(([, c]) => c),
                backgroundColor: "#3867d6",
              },
            ],
          }}
          options={{ indexAxis: "y" }}
        />
      </div>

      {/* Línea de tiempo de creaciones */}
      <div style={{ maxWidth: 800, margin: "auto", marginTop: 40 }}>
        <h4>RMAs por Día</h4>
        <Line
          data={{
            labels: fechasSorted.map(([f]) => f),
            datasets: [
              {
                label: "RMAs creados",
                data: fechasSorted.map(([, c]) => c),
                borderColor: "#45aaf2",
                backgroundColor: "rgba(99, 139, 219, 0.2)",
                fill: true,
                tension: 0.2,
              },
            ],
          }}
        />
      </div>
      {/* Tabla de datos */}
      {renderTable()}
    </div>
  );
}