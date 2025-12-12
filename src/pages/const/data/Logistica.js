import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Header from "../../../components/Header";

/*
  Pantalla Logistica (modal profesional)
  - Al hacer clic en la tarjeta se abre un modal con información detallada.
  - No se muestran las secciones Descripción / Fallas / Notas / Contacto / Fecha de recepción
    cuando esos campos no existen en el pedido.
*/

const descripcionesEstado = {
  recibido: 'El producto llegó a SERMEX; pronto empezará la revisión.',
  en_revision: 'El producto se encuentra en revisión. Actualmente se están reportando y descartando fallas.',
  reparacion: 'El producto se encuentra en proceso de reparación.',
  completado: 'El producto está listo y ya ha sido enviado de vuelta.',
};

const estadosOrdenados = ['recibido', 'en_revision', 'reparacion', 'completado'];

const Logistica = () => {
  const [pedidos, setPedidos] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPedido, setSelectedPedido] = useState(null); // pedido mostrado en modal
  const API_URL = process.env.REACT_APP_API_URL || '';

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error("No hay token en localStorage");
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
      .catch(error => {
        console.error("Error al obtener datos:", error);
        setPedidos([]);
        setLoading(false);
      });
    } catch (error) {
      console.error("Error decodificando token:", error);
      setLoading(false);
    }
  }, [API_URL]);

  // Filtrar pedidos: sólo mostrar 'completado' si no han pasado más de 5 días desde su última actualización
  const now = new Date();
  const pedidosFiltrados = pedidos.filter(pedido => {
    if (!pedido) return false;
    if (pedido.estado !== 'completado') return true;
    const fecha = pedido.fecha_actualizacion ? new Date(pedido.fecha_actualizacion) : null;
    if (!fecha) return false;
    const dias = (now - fecha) / (1000 * 60 * 60 * 24);
    return dias <= 5;
  });

  const getStatusStyle = (estado) => {
    const colores = {
      recibido: { backgroundColor: '#E8F4FF', color: '#0B63CE' },
      en_revision: { backgroundColor: '#FFF7E6', color: '#B86B00' },
      reparacion: { backgroundColor: '#F0FBF3', color: '#117A37' },
      completado: { backgroundColor: '#E8F8FA', color: '#007E8A' }
    };
    return colores[estado] || { backgroundColor: '#F3F4F6', color: '#4B5563' };
  };

  const openModal = (pedido) => {
    setSelectedPedido(pedido);
  };

  const closeModal = useCallback(() => {
    setSelectedPedido(null);
  }, []);

  // cerrar modal con Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    if (selectedPedido) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedPedido, closeModal]);

  if (loading) {
    return <div style={styles.loading}>Cargando tus pedidos...</div>;
  }

  return (
    <>
      <Header />
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.headerRow}>
            <div>
              <h1 style={styles.title}>Seguimiento de Equipos</h1>
              <p style={styles.subtitle}>Mostrando resultados para: <span style={styles.emailText}>{userEmail || '—'}</span></p>
            </div>
          </div>

          {pedidosFiltrados.length === 0 ? (
            <div style={styles.emptyState}>
              No hay pedidos registrados para este correo.
            </div>
          ) : (
            <div style={styles.grid}>
              {pedidosFiltrados.map((pedido, idx) => {
                const keyId = pedido?.id ?? pedido?.rma_id ?? idx;
                return (
                  <article
                    key={keyId}
                    onClick={() => openModal(pedido)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(pedido); } }}
                    style={styles.card}
                    aria-label={`Ver detalles del pedido ${pedido.rma_id ?? keyId}`}
                  >
                    <div style={styles.cardHeader}>
                      <div>
                        <h3 style={styles.productName}>{pedido.producto || 'Producto sin nombre'}</h3>
                        <div style={styles.rmaText}>Folio RMA: <strong>{pedido.rma_id ?? '—'}</strong></div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ ...styles.statusPill, ...getStatusStyle(pedido.estado) }}>
                          {(pedido.estado || 'desconocido').replace('_', ' ').toUpperCase()}
                        </div>
                        <div style={styles.updateSmall}>Última: {pedido.fecha_actualizacion ? new Date(pedido.fecha_actualizacion).toLocaleDateString() : '—'}</div>
                      </div>
                    </div>

                    <div style={styles.cardBody}>
                      <p style={styles.cardSnippet}>{descripcionesEstado[pedido.estado] ?? 'Estado no documentado.'}</p>

                      <div style={styles.timeline}>
                        {estadosOrdenados.map((estado, i) => {
                          const idxEstadoPedido = estadosOrdenados.indexOf(pedido.estado);
                          const completed = idxEstadoPedido > i;
                          const active = pedido.estado === estado;
                          return (
                            <div key={estado} style={styles.timelineItem}>
                              <div style={{
                                ...styles.timelineDot,
                                background: active ? '#0B63CE' : (completed ? '#9CA3AF' : '#E5E7EB'),
                                boxShadow: active ? '0 2px 8px rgba(11,99,206,0.18)' : 'none'
                              }} />
                              <div style={styles.timelineLabel}>{estado.replace('_', ' ')}</div>
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
      </div>

      {/* Modal */}
      {selectedPedido && (
        <div style={styles.modalOverlay} onMouseDown={closeModal} role="presentation">
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Detalles RMA ${selectedPedido.rma_id ?? 'pedido'}`}
            style={styles.modal}
            onMouseDown={(e) => e.stopPropagation()} // evitar que click dentro cierre
          >
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>{selectedPedido.producto || 'Producto'}</h2>
                <div style={styles.modalSubtitle}>RMA: <strong>{selectedPedido.rma_id ?? '—'}</strong></div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ ...styles.statusPill, ...getStatusStyle(selectedPedido.estado) }}>
                  {(selectedPedido.estado || 'desconocido').replace('_', ' ').toUpperCase()}
                </div>
                <button onClick={closeModal} style={styles.closeButton} aria-label="Cerrar detalles">✕</button>
              </div>
            </div>

            <div style={styles.modalContent}>
              <div style={styles.modalColumn}>
                {/* Renderizar sólo si existe descripción */}
                {selectedPedido.descripcion && (
                  <div style={styles.detailRow}>
                    <div style={styles.detailLabel}>Descripción</div>
                    <div style={styles.detailValue}>{selectedPedido.descripcion}</div>
                  </div>
                )}

                {/* Renderizar sólo si existen fallas */}
                {selectedPedido.fallas && (
                  <div style={styles.detailRow}>
                    <div style={styles.detailLabel}>Fallas reportadas</div>
                    <div style={styles.detailValue}>{selectedPedido.fallas}</div>
                  </div>
                )}

                {/* Renderizar sólo si existen notas */}
                {selectedPedido.notas && (
                  <div style={styles.detailRow}>
                    <div style={styles.detailLabel}>Notas</div>
                    <div style={styles.detailValue}>{selectedPedido.notas}</div>
                  </div>
                )}

                {/* Renderizar sólo si existe contacto/telefono */}
                {(selectedPedido.contacto || selectedPedido.telefono) && (
                  <div style={styles.detailRow}>
                    <div style={styles.detailLabel}>Contacto</div>
                    <div style={styles.detailValue}>{selectedPedido.contacto || selectedPedido.telefono}</div>
                  </div>
                )}
              </div>

              <div style={styles.modalColumn}>
                {/* Renderizar sólo si existe fecha_recepcion */}
                {selectedPedido.fecha_recepcion && (
                  <div style={styles.detailRow}>
                    <div style={styles.detailLabel}>Fecha de recepción</div>
                    <div style={styles.detailValue}>{new Date(selectedPedido.fecha_recepcion).toLocaleString()}</div>
                  </div>
                )}

                {/* Última actualización se mantiene siempre visible */}
                <div style={styles.detailRow}>
                  <div style={styles.detailLabel}>Última actualización</div>
                  <div style={styles.detailValue}>{selectedPedido.fecha_actualizacion ? new Date(selectedPedido.fecha_actualizacion).toLocaleString() : '—'}</div>
                </div>

                <div style={styles.detailRow}>
                  <div style={styles.detailLabel}>Ubicación</div>
                  <div style={styles.detailValue}>{selectedPedido.ubicacion || 'SERMEX'}</div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <div style={{ marginBottom: 6, color: '#374151', fontWeight: 600 }}>Progreso</div>
                  <div style={styles.progressBar}>
                    {estadosOrdenados.map((estado, i) => {
                      const idxPedido = estadosOrdenados.indexOf(selectedPedido.estado);
                      const filled = i <= idxPedido;
                      return (
                        <div key={estado} style={{
                          ...styles.progressSegment,
                          background: filled ? '#0B63CE' : '#E5E7EB'
                        }} />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button onClick={closeModal} style={styles.actionSecondary}>Cerrar</button>
              <a href={`/rma/${selectedPedido.rma_id ?? ''}`} style={styles.actionPrimary}>Ver RMA</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  page: {
    background: '#F7FAFC',
    minHeight: '100vh',
    paddingBottom: 40
  },
  container: {
    maxWidth: 1200,
    margin: '28px auto',
    padding: '0 20px'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18
  },
  title: {
    margin: 0,
    fontSize: 22,
    color: '#0F172A',
    letterSpacing: '-0.2px'
  },
  subtitle: {
    margin: '6px 0 0',
    color: '#6B7280',
    fontSize: 13
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
    boxShadow: '0 6px 18px rgba(15, 23, 42, 0.06)',
    cursor: 'pointer',
    transition: 'transform 0.16s ease, box-shadow 0.16s ease',
    border: '1px solid rgba(15,23,42,0.04)'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 6
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
  statusPill: {
    display: 'inline-block',
    padding: '6px 10px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    boxSizing: 'border-box'
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
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(2,6,23,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1200,
    padding: 20
  },
  modal: {
    width: '100%',
    maxWidth: 920,
    background: '#FFFFFF',
    borderRadius: 12,
    boxShadow: '0 30px 80px rgba(2,6,23,0.35)',
    overflow: 'hidden',
    border: '1px solid rgba(15,23,42,0.06)',
    padding: 0
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '20px 24px',
    borderBottom: '1px solid #F3F4F6'
  },
  modalTitle: {
    margin: 0,
    fontSize: 18,
    color: '#0F172A'
  },
  modalSubtitle: {
    marginTop: 6,
    color: '#6B7280',
    fontSize: 13
  },
  closeButton: {
    marginTop: 8,
    marginLeft: 8,
    background: 'transparent',
    border: 'none',
    color: '#6B7280',
    fontSize: 16,
    cursor: 'pointer'
  },

  modalContent: {
    display: 'flex',
    gap: 24,
    padding: 20,
    flexWrap: 'wrap'
  },
  modalColumn: {
    flex: '1 1 320px',
    minWidth: 260
  },

  detailRow: {
    marginBottom: 12,
    padding: '8px 0',
    borderBottom: '1px dashed #F3F4F6'
  },
  detailLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
    fontWeight: 700
  },
  detailValue: {
    fontSize: 14,
    color: '#111827'
  },

  progressBar: {
    display: 'flex',
    height: 10,
    borderRadius: 8,
    overflow: 'hidden',
    background: '#E5E7EB'
  },
  progressSegment: {
    flex: 1,
    transition: 'background 0.25s ease'
  },

  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
    padding: '16px 24px',
    borderTop: '1px solid #F3F4F6'
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