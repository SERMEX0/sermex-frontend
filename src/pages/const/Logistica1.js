import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Header from "../../components/Header2";

const estadoInfo = {
  recibido: {
    text: 'El producto llegó a SERMEX, pronto empezará la revisión.',
    color: '#0B63CE',
    bg: 'linear-gradient(90deg,#E8F4FF,#FFFFFF)'
  },
  en_revision: {
    text: 'El producto se encuentra en revisión. Actualmente se están reportando y descartando fallas.',
    color: '#B86B00',
    bg: 'linear-gradient(90deg,#FFF6EA,#FFFFFF)'  },
  reparacion: {
    text: 'El producto se encuentra en proceso de reparación.',
    color: '#117A37',
    bg: 'linear-gradient(90deg,#F0FBF3,#FFFFFF)'
  },
  completado: {
    text: 'El producto está listo y ya ha sido enviado de vuelta.',
    color: '#007E8A',
    bg: 'linear-gradient(90deg,#E8F8FA,#FFFFFF)'
  },
};

const estadosOrdenados = ['recibido', 'en_revision', 'reparacion', 'completado'];

const Logistica = () => {
  const [pedidos, setPedidos] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalPedido, setModalPedido] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL || '';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const decoded = jwtDecode(token);
      const email = decoded?.correo || decoded?.email || '';
      setUserEmail(email);

      axios.get(`${API_URL}/api/logistica/${encodeURIComponent(email)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        setPedidos(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching pedidos:', err);
        setPedidos([]);
        setLoading(false);
      });
    } catch (err) {
      console.error('Error decoding token:', err);
      setLoading(false);
    }
  }, [API_URL]);

  // Filtrar pedidos: solo mostrar los "completados" si NO han pasado más de 5 días desde su última actualización
  const now = new Date();
  const pedidosFiltrados = (pedidos || []).filter(pedido => {
    if (!pedido) return false;
    if (pedido.estado !== 'completado') return true;
    const fechaActualizacion = pedido.fecha_actualizacion ? new Date(pedido.fecha_actualizacion) : null;
    if (!fechaActualizacion) return false;
    const diasPasados = (now - fechaActualizacion) / (1000 * 60 * 60 * 24);
    return diasPasados <= 5;
  });

  const getStatusPillStyle = (estado) => {
    const info = estadoInfo[estado] || {};
    return {
      background: info.bg || '#F3F4F6',
      color: info.color || '#374151',
      padding: '6px 10px',
      borderRadius: 999,
      fontWeight: 600,
      fontSize: 13,
      display: 'inline-block'
    };
  };

  const openModal = (pedido) => setModalPedido(pedido);
  const closeModal = useCallback(() => setModalPedido(null), []);

  useEffect(() => {
    if (!modalPedido) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalPedido, closeModal]);

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
        <p style={styles.subtitle}>Mostrando resultados para: <span style={styles.emailText}>{userEmail || '—'}</span></p>

        {pedidosFiltrados.length === 0 ? (
          <div style={styles.emptyState}>No hay pedidos registrados para este correo.</div>
        ) : (
          <div style={styles.grid}>
            {pedidosFiltrados.map((pedido, idx) => {
              const key = pedido?.id ?? pedido?.rma_id ?? idx;
              const estado = pedido?.estado || 'desconocido';
              return (
                <article
                  key={key}
                  style={styles.card}
                  role="button"
                  tabIndex={0}
                  onClick={() => openModal(pedido)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(pedido); } }}
                  aria-label={`Ver detalles RMA ${pedido?.rma_id ?? key}`}
                >
                  <div style={styles.cardHeader}>
                    <div>
                      <h3 style={styles.productName}>{pedido.producto || 'Sin nombre'}</h3>
                      <div style={styles.rmaText}>Folio RMA: <strong>{pedido.rma_id ?? '—'}</strong></div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={getStatusPillStyle(estado)}>
                        {estado.replace('_', ' ').toUpperCase()}
                      </div>
                      <div style={styles.updateSmall}>Última: {pedido.fecha_actualizacion ? new Date(pedido.fecha_actualizacion).toLocaleDateString() : '—'}</div>
                    </div>
                  </div>

                  <div style={styles.cardBody}>
                    <p style={styles.cardSnippet}>{estadoInfo[estado]?.text ?? 'Estado no documentado.'}</p>

                    <div style={styles.timeline}>
                      {estadosOrdenados.map((e, i) => {
                        const idxPedido = estadosOrdenados.indexOf(estado);
                        const completed = idxPedido > i;
                        const active = estado === e;
                        return (
                          <div key={e} style={styles.timelineItem}>
                            <div style={{
                              ...styles.timelineDot,
                              background: active ? '#0B63CE' : (completed ? '#9CA3AF' : '#E5E7EB'),
                              boxShadow: active ? '0 2px 8px rgba(11,99,206,0.2)' : 'none'
                            }} />
                            <div style={styles.timelineLabel}>{e.replace('_', ' ')}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal profesional */}
      {modalPedido && (
        <div style={styles.modalBg} onMouseDown={closeModal}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Detalles RMA ${modalPedido.rma_id ?? ''}`}
            style={{
              ...styles.modal,
              background: estadoInfo[modalPedido.estado]?.bg || '#fff'
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button style={styles.modalClose} onClick={closeModal} aria-label="Cerrar">
              ✕
            </button>

            <div style={{ ...styles.modalHeader, color: estadoInfo[modalPedido.estado]?.color || '#111' }}>
              <span style={styles.modalIcon}>{estadoInfo[modalPedido.estado]?.icon}</span>
              <div>
                <div style={styles.modalEstado}>{(modalPedido.estado || 'DESCONOCIDO').replace('_', ' ').toUpperCase()}</div>
                <div style={styles.modalSubtitle}>{estadoInfo[modalPedido.estado]?.text}</div>
              </div>
            </div>

            <div style={styles.modalLine} />

            <div style={styles.modalInfoBlock}>
              <h3 style={styles.modalTitle}>{modalPedido.producto || 'Producto'}</h3>
              <div style={styles.modalDetails}>
                <div>
                  <span style={styles.modalDetailName}>Folio RMA:</span>{" "}
                  <span style={styles.modalDetailValue}>{modalPedido.rma_id ?? '—'}</span>
                </div>

                <div>
                  <span style={styles.modalDetailName}>Última actualización:</span>{" "}
                  <span style={styles.modalDetailValue}>{modalPedido.fecha_actualizacion ? new Date(modalPedido.fecha_actualizacion).toLocaleString() : '—'}</span>
                </div>

                {/* Solo mostrar Recepción si existe */}
                {modalPedido.fecha_recepcion && (
                  <div>
                    <span style={styles.modalDetailName}>Recepción:</span>{" "}
                    <span style={styles.modalDetailValue}>{new Date(modalPedido.fecha_recepcion).toLocaleString()}</span>
                  </div>
                )}

                {/* Solo mostrar Contacto si existe */}
                {(modalPedido.contacto || modalPedido.telefono) && (
                  <div>
                    <span style={styles.modalDetailName}>Contacto:</span>{" "}
                    <span style={styles.modalDetailValue}>{modalPedido.contacto || modalPedido.telefono}</span>
                  </div>
                )}

                <div style={{ marginTop: 10 }}>
                  <div style={{ marginBottom: 8, color: '#374151', fontWeight: 700 }}>Progreso</div>
                  <div style={styles.progressBar}>
                    {estadosOrdenados.map((e, i) => {
                      const idxPedido = estadosOrdenados.indexOf(modalPedido.estado);
                      const filled = i <= idxPedido;
                      return <div key={e} style={{ ...styles.progressSegment, background: filled ? '#0B63CE' : '#E5E7EB' }} />;
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button onClick={closeModal} style={styles.actionSecondary}>Cerrar</button>
              <a href={`/rma/${modalPedido.rma_id ?? ''}`} style={styles.actionPrimary}>Ver RMA</a>
            </div>
          </div>
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
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: 'Inter, Arial, sans-serif',
  },
  title: {
    color: '#0F172A',
    marginBottom: '6px',
    textAlign: 'center',
    fontSize: 20
  },
  subtitle: {
    color: '#6B7280',
    marginBottom: '18px',
    fontSize: 13,
    textAlign: 'center'
  },
  emailText: {
    color: '#111827',
    fontWeight: 600
  },

  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#374151'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: '#6B7280',
    fontSize: '16px',
    background: '#FFFFFF',
    border: '1px solid #E6E9EF',
    borderRadius: 10
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 20
  },

  card: {
    background: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    boxShadow: '0 6px 18px rgba(15,23,42,0.06)',
    cursor: 'pointer',
    transition: 'transform 0.14s ease, box-shadow 0.14s ease',
    border: '1px solid rgba(15,23,42,0.04)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12
  },
  productName: {
    margin: 0,
    fontSize: 16,
    color: '#0F172A'
  },
  rmaText: {
    marginTop: 6,
    color: '#6B7280',
    fontSize: 13
  },
  updateSmall: {
    marginTop: 6,
    color: '#9CA3AF',
    fontSize: 12
  },

  cardBody: {
    marginTop: 12
  },
  cardSnippet: {
    margin: '0 0 12px 0',
    color: '#374151',
    fontSize: 14
  },

  timeline: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 8,
    alignItems: 'center'
  },
  timelineItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    minWidth: 0
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 12
  },
  timelineLabel: {
    marginTop: 6,
    fontSize: 11,
    color: '#6B7280',
    textTransform: 'capitalize'
  },

  /* Modal styles */
  modalBg: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(2,6,23,0.45)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1200,
    padding: 20
  },
  modal: {
    width: '100%',
    maxWidth: 760,
    background: '#FFFFFF',
    borderRadius: 14,
    boxShadow: '0 30px 80px rgba(2,6,23,0.35)',
    overflow: 'hidden',
    border: '1px solid rgba(15,23,42,0.06)',
    position: 'relative',
    padding: 22
  },
  modalClose: {
    position: 'absolute',
    right: 16,
    top: 16,
    border: 'none',
    background: '#fff',
    borderRadius: 8,
    width: 36,
    height: 36,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(2,6,23,0.08)',
    cursor: 'pointer'
  },
  modalHeader: {
    display: 'flex',
    gap: 14,
    alignItems: 'center'
  },
  modalIcon: {
    fontSize: 34
  },
  modalEstado: {
    fontSize: 18,
    fontWeight: 800,
    color: '#0F172A'
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#374151',
    marginTop: 4
  },
  modalLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#E6EEF7',
    margin: '16px 0',
    borderRadius: 4
  },
  modalInfoBlock: {
    display: 'flex',
    gap: 20,
    alignItems: 'flex-start',
    flexWrap: 'wrap'
  },
  modalTitle: {
    color: '#0F172A',
    fontSize: 20,
    margin: 0
  },
  modalDetails: {
    fontSize: 14,
    color: '#111827',
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },

  progressBar: {
    display: 'flex',
    height: 12,
    borderRadius: 8,
    overflow: 'hidden',
    background: '#E5E7EB',
    marginTop: 6
  },
  progressSegment: {
    flex: 1,
    transition: 'background 0.25s ease'
  },

  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 18
  },
  actionPrimary: {
    display: 'inline-block',
    padding: '10px 16px',
    background: '#0B63CE',
    color: '#FFF',
    borderRadius: 8,
    textDecoration: 'none',
    fontWeight: 700
  },
  actionSecondary: {
    padding: '10px 16px',
    background: 'transparent',
    border: '1px solid #E6E9EF',
    color: '#111827',
    borderRadius: 8,
    cursor: 'pointer'
  }
};

export default Logistica;