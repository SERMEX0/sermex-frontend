import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Header from "../../components/Header2";

const estadoInfo = {
  recibido: {
    text: 'El producto llegó a SERMEX, pronto empezará la revisión.',
    color: '#1976d2',
    bg: 'linear-gradient(90deg,#e3f2fd,#ffffff)',
    icon: '📦',
  },
  en_revision: {
    text: 'El producto se encuentra en revisión. Actualmente se están reportando y descartando fallas.',
    color: '#ff8f00',
    bg: 'linear-gradient(90deg,#fff3e1,#ffffff)',
    icon: '🔎',
  },
  reparacion: {
    text: 'El producto se encuentra en proceso de reparación.',
    color: '#388e3c',
    bg: 'linear-gradient(90deg,#e8f5e9,#ffffff)',
    icon: '🛠️',
  },
  completado: {
    text: 'El producto está listo y ya ha sido enviado de vuelta.',
    color: '#00acc1',
    bg: 'linear-gradient(90deg,#e0f7fa,#ffffff)',
    icon: '✅',
  },
};

const estadosOrdenados = ['recibido', 'en_revision', 'reparacion', 'completado'];

const Logistica = () => {
  const [pedidos, setPedidos] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalPedido, setModalPedido] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const decoded = jwtDecode(token);
      const email = decoded.correo || decoded.email || '';
      setUserEmail(email);

      axios.get(`${API_URL}/api/logistica/${email}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        setPedidos(res.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    } catch {
      setLoading(false);
    }
  }, []);

  // Pedidos filtrados: solo los completados si no han pasado más de 5 días desde su última actualización
  const now = new Date();
  const pedidosFiltrados = pedidos.filter(pedido => {
    if (pedido.estado !== 'completado') return true;
    const fechaActualizacion = new Date(pedido.fecha_actualizacion);
    const diasPasados = (now - fechaActualizacion) / (1000 * 60 * 60 * 24);
    return diasPasados <= 5;
  });

  const getStatusStyle = (estado) => {
    // Solo para las chips/etiquetas
    const info = estadoInfo[estado];
    return {
      backgroundColor: info ? info.bg.split(",")[0].replace("linear-gradient(90deg,","").replace("#","") : "#eee",
      color: info ? info.color : "#555",
      padding: '1px 10px',
      borderRadius: '12px',
      fontWeight: 500,
      fontSize: '12.5px'
    };
  };

  if (loading) {
    return (
      <>
        <Header />
        <div style={styles.loading}>Cargando tus pedidos...</div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div style={styles.container}>
        <h2 style={styles.title}>Seguimiento de Tus Equipos</h2>
        <p style={styles.subtitle}>Mostrando resultados para: {userEmail}</p>
        {pedidosFiltrados.length === 0 ? (
          <div style={styles.emptyState}>
            No hay pedidos registrados para este correo.
          </div>
        ) : (
          <div style={styles.grid}>
            {pedidosFiltrados.map(pedido => (
              <div
                key={pedido.id}
                style={styles.card}
                onClick={() => setModalPedido(pedido)}
                tabIndex={0}
                role="button"
                aria-label="Ver detalles"
              >
                <h3 style={styles.productName}>{pedido.producto}</h3>
                <p style={styles.rmaText}>Folio RMA: <strong>{pedido.rma_id}</strong></p>
                <div style={styles.statusContainer}>
                  <span style={getStatusStyle(pedido.estado)}>
                    {pedido.estado.replace('_', ' ').toUpperCase()}
                  </span>
                  <div style={styles.timeline}>
                    {estadosOrdenados.map(estado => (
                      <div 
                        key={estado}
                        style={{
                          ...styles.timelineStep,
                          ...(pedido.estado === estado ? styles.activeStep : {}),
                          ...(estadosOrdenados.indexOf(pedido.estado) > estadosOrdenados.indexOf(estado) ? styles.completedStep : {})
                        }}
                      />
                    ))}
                  </div>
                </div>
                <p style={styles.updateText}>
                  Última actualización: {new Date(pedido.fecha_actualizacion).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Pro+Diseño */}
      {modalPedido && (
        <div style={styles.modalBg} onClick={() => setModalPedido(null)}>
          <div
            style={{
              ...styles.modal,
              background: estadoInfo[modalPedido.estado]?.bg,
              animation: 'modalIn 0.23s'
            }}
            onClick={e => e.stopPropagation()}
          >
            <button style={styles.modalClose} onClick={() => setModalPedido(null)}>
              <span style={{fontSize: "22px", fontWeight: "bold"}}>&times;</span>
            </button>
            
            {/* Encabezado moderno con icono grande */}
            <div style={{
              ...styles.modalHeader,
              color: estadoInfo[modalPedido.estado]?.color
            }}>
              <span style={styles.modalIcon}>{estadoInfo[modalPedido.estado]?.icon}</span>
              <span style={styles.modalEstado}>{modalPedido.estado.replace('_', ' ').toUpperCase()}</span>
            </div>

            {/* Barra de progreso vertical ilustrando estados */}
            <div style={styles.estadoVertContainer}>
              {estadosOrdenados.map((estado, idx) => (
                <div key={estado} style={{
                  ...styles.estadoVertStep,
                  background: idx < estadosOrdenados.indexOf(modalPedido.estado) ? estadoInfo[estado].color : "#ddd",
                  boxShadow: idx === estadosOrdenados.indexOf(modalPedido.estado) ? "0 0 6px "+estadoInfo[estado].color : "",
                }}>
                  <span style={{
                    ...styles.estadoVertIcon,
                    filter: idx === estadosOrdenados.indexOf(modalPedido.estado) ? 'brightness(1.2)' : 'brightness(0.8)'
                  }}>{estadoInfo[estado].icon}</span>
                  <span style={{
                    ...styles.estadoVertLabel,
                    fontWeight: idx === estadosOrdenados.indexOf(modalPedido.estado) ? 600 : 400,
                  }}>{estado.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
            
            {/* Separador visual */}
            <div style={styles.modalLine}></div>

            {/* Info principal con jerarquía */}
            <div style={styles.modalInfoBlock}>
              <h3 style={styles.modalTitle}>{modalPedido.producto}</h3>
              <div style={styles.modalLabel}>{estadoInfo[modalPedido.estado]?.text}</div>
              <div style={styles.modalDetails}>
                <div>
                  <span style={styles.modalDetailName}>Folio RMA:</span>{" "}
                  <span style={styles.modalDetailValue}>{modalPedido.rma_id}</span>
                </div>
                <div>
                  <span style={styles.modalDetailName}>Última actualización:</span>{" "}
                  <span style={styles.modalDetailValue}>{new Date(modalPedido.fecha_actualizacion).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Animación */}
          <style>
            {`
              @keyframes modalIn {
                0% { transform: scale(0.85); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
              }
            `}
          </style>
        </div>
      )}
    </>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    padding: '20px',
    width: '100%',
    maxWidth: '1500px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    color: '#2c3e50',
    marginBottom: '10px',
    textAlign: 'center'
  },
  subtitle: {
    color: '#7f8c8d',
    marginBottom: '30px',
    fontSize: '14px',
    textAlign: 'center'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#555',
    width: '100%'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
    fontSize: '16px',
    border: '1px dashed #ddd',
    borderRadius: '8px'
  },
  grid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  },
  card: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
    backgroundColor: '#fff',
    transition: 'transform 0.2s',
    cursor: 'pointer',
    position: 'relative',
  },
  productName: {
    marginTop: '0',
    color: '#345475',
    fontSize: '18px'
  },
  rmaText: {
    color: '#555',
    fontSize: '14px',
    marginBottom: '15px'
  },
  statusContainer: { 
    margin: '20px 0',
    display: 'flex', flexDirection: 'column', gap: 6
  },
  timeline: {
    display: 'flex',
    justifyContent: 'space-between',
    height: '6px',
    backgroundColor: '#f0f0f0',
    borderRadius: '3px',
    margin: '10px 0',
  },
  timelineStep: {
    width: '23%',
    height: '6px',
    borderRadius: '3px',
    transition: 'background-color 0.3s ease'
  },
  activeStep: {
    backgroundColor: '#345475',
    transform: 'scaleY(1.14)'
  },
  completedStep: {
    backgroundColor: '#b0b0b0'
  },
  updateText: {
    color: '#666',
    fontSize: '13px',
    marginBottom: '0',
    fontStyle: 'italic'
  },

  // MODAL styles
  modalBg: {
    position: 'fixed',
    top: 0, left: 0, width: '100vw', height: '100vh',
    background: 'rgba(60,68,90,0.28)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1001,
  },
  modal: {
    borderRadius: '20px',
    boxShadow: '0 8px 28px rgba(50,52,96,0.16)',
    minWidth: '320px',
    maxWidth: '95vw',
    width: '390px',
    padding: '36px 30px 22px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    background: '#fff',
    border: '1.5px solid #d4dde4',
    animation: 'modalIn 0.22s',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    fontSize: '21px',
    fontWeight: 700,
    marginBottom: '10px'
  },
  modalIcon: {
    fontSize: '34px',
    marginRight: '10px',
    padding: '2px 4px'
  },
  modalEstado: {
    fontWeight: 600,
    fontSize: '19px',
    textShadow: '0 1px 6px rgba(120,120,255,0.1)',
  },
  modalClose: {
    position: 'absolute',
    right: '16px',
    top: '16px',
    border: 'none',
    background: '#fff',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    boxShadow: '0 2px 6px rgba(160,170,180,0.14)',
    cursor: 'pointer',
    zIndex: 1002,
    transition: 'background 0.21s',
  },
  modalLine: {
    width: '100%',
    height: '2px',
    backgroundColor: '#e2e5ec',
    margin: '17px 0 10px 0',
    borderRadius: '2px'
  },
  modalInfoBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: 7,
    alignItems: 'start'
  },
  modalTitle: {
    color: '#345475',
    fontSize: '20px',
    marginBottom: '0'
  },
  modalLabel: {
    color: '#444',
    fontSize: '13.2px',
    fontStyle: 'italic',
    marginBottom: '2px',
    maxWidth: '90%',
  },
  modalDetails: {
    marginTop: '8px',
    fontSize: '14px',
    color: '#555',
    display: 'flex',
    flexDirection: 'column',
    gap: '3px'
  },
  modalDetailName: {
    fontWeight: 'bold',
    color: '#345475',
    fontSize: '13px'
  },
  modalDetailValue: {
    color: '#333',
    fontSize: '13.7px',
    fontWeight: 500,
  },
  // Vertical Estado bar
  estadoVertContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: '8px',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '17px 0 3px',
  },
  estadoVertStep: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '5px',
    borderRadius: '8px',
    background: '#eee',
    minWidth: '55px',
    boxShadow: ''
  },
  estadoVertIcon: {
    fontSize: '19px',
    marginBottom: '2px',
    opacity: 1
  },
  estadoVertLabel: {
    fontSize: '11.25px',
    color: '#636b80',
    textTransform: 'capitalize'
  },
};

export default Logistica;