import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header2";
import Footer from "../../../components/Footer";

const FormDoc = () => {
  const [form, setForm] = useState({ 
    nombre: "", 
    correo: "", 
    telefono: "",
    empresa: "",
    producto: "",
    tipoSolicitud: "documentacion",
    descripcion: "",
    contactoPreferido: "correo"
  });
  
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const tiposSolicitud = [
    { value: "documentacion", label: "Documentación del producto" },
    { value: "soporte", label: "Soporte técnico" },
    { value: "garantia", label: "Solicitud de garantía" },
    { value: "dudas", label: "Resolución de dudas" },
    { value: "contacto", label: "Contactar con un especialista" },
    { value: "otro", label: "Otro tipo de solicitud" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError("");

    try {
      // Enviar datos al servidor
      const response = await fetch('http://localhost:5000/api/enviar-solicitud', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (response.ok) {
        setEnviado(true);
      } else {
        setError(data.error || "Error al enviar la solicitud");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error de conexión. Por favor, intente nuevamente.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <Header />
      <Container>
        <Card>
          <Logo src="/logo_SERMEX_azul.fw.png" alt="Logo Sermex" />
          <Title>Solicitud de documentación y soporte técnico</Title>
          <Subtitle>
            Complete este formulario para recibir la documentación, soporte o información que necesita.
          </Subtitle>
          
          {enviado ? (
            <Success>
              <SuccessIcon>✅</SuccessIcon>
              <SuccessTitle>¡Solicitud enviada con éxito!</SuccessTitle>
              <SuccessMessage>
                Hemos recibido su solicitud de <strong>{tiposSolicitud.find(t => t.value === form.tipoSolicitud)?.label}</strong>. 
                Nos pondremos en contacto con usted en un plazo máximo de 24 horas hábiles.
              </SuccessMessage>
              <Button onClick={() => navigate("/inicio")}>Volver al inicio</Button>
            </Success>
          ) : (
            <Form onSubmit={handleSubmit}>
              {error && <ErrorMessage>{error}</ErrorMessage>}
              
              <SectionTitle>Información personal</SectionTitle>
              
              <FormGroup>
                <Label>Nombre completo *</Label>
                <Input
                  required
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Juan Pérez García"
                  disabled={enviando}
                />
              </FormGroup>

              <FormGroup>
                <Label>Correo electrónico *</Label>
                <Input
                  required
                  type="email"
                  name="correo"
                  value={form.correo}
                  onChange={handleChange}
                  placeholder="tu.email@ejemplo.com"
                  disabled={enviando}
                />
              </FormGroup>

              <FormGroup>
                <Label>Teléfono de contacto *</Label>
                <Input
                  required
                  type="tel"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  placeholder="Ej: +52 55 1234 5678"
                  disabled={enviando}
                />
              </FormGroup>

              <FormGroup>
                <Label>Empresa (opcional)</Label>
                <Input
                  name="empresa"
                  value={form.empresa}
                  onChange={handleChange}
                  placeholder="Nombre de su empresa"
                  disabled={enviando}
                />
              </FormGroup>

              <SectionTitle>Detalles de la solicitud</SectionTitle>
              
              <FormGroup>
                <Label>Tipo de solicitud *</Label>
                <Select 
                  name="tipoSolicitud" 
                  value={form.tipoSolicitud} 
                  onChange={handleChange}
                  required
                  disabled={enviando}
                >
                  {tiposSolicitud.map(opcion => (
                    <option key={opcion.value} value={opcion.value}>
                      {opcion.label}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Producto de interés (opcional)</Label>
                <Input
                  name="producto"
                  value={form.producto}
                  onChange={handleChange}
                  placeholder="Nombre del producto que necesita"
                  disabled={enviando}
                />
              </FormGroup>

              <FormGroup>
                <Label>Descripción de la solicitud *</Label>
                <TextArea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  placeholder="Describa en detalle qué documentación, soporte o información necesita..."
                  rows="4"
                  required
                  disabled={enviando}
                />
              </FormGroup>

              <SectionTitle>Preferencias de contacto</SectionTitle>
              
              <FormGroup>
                <Label>Método de contacto preferido *</Label>
                <RadioGroup>
                  <RadioLabel>
                    <input 
                      type="radio" 
                      name="contactoPreferido" 
                      value="correo" 
                      checked={form.contactoPreferido === "correo"} 
                      onChange={handleChange}
                      disabled={enviando}
                    />
                    Correo electrónico
                  </RadioLabel>
                  <RadioLabel>
                    <input 
                      type="radio" 
                      name="contactoPreferido" 
                      value="telefono" 
                      checked={form.contactoPreferido === "telefono"} 
                      onChange={handleChange}
                      disabled={enviando}
                    />
                    Llamada telefónica
                  </RadioLabel>
                  <RadioLabel>
                    <input 
                      type="radio" 
                      name="contactoPreferido" 
                      value="whatsapp" 
                      checked={form.contactoPreferido === "whatsapp"} 
                      onChange={handleChange}
                      disabled={enviando}
                    />
                    WhatsApp
                  </RadioLabel>
                </RadioGroup>
              </FormGroup>

              <Info>
                <span style={{ color: "#4474B0", fontWeight: 500 }}>
                  Mientras tanto, puedes realizar una solicitud de garantía y soporte desde el inicio.
                </span>
              </Info>

              <Button type="submit" disabled={enviando}>
                {enviando ? "Enviando..." : "Enviar solicitud"}
              </Button>
            </Form>
          )}
        </Card>
      </Container>
      <Footer />
    </>
  );
};

export default FormDoc;

// --- STYLED COMPONENTS ---
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  padding: 80px 20px 40px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 14px;
  padding: 35px 28px;
  box-shadow: 0 4px 28px rgba(52, 84, 117, 0.13);
  max-width: 600px;
  width: 100%;
  text-align: center;
`;

const Logo = styled.img`
  width: 110px;
  margin-bottom: 18px;
`;

const Title = styled.h2`
  color: #345475;
  font-weight: 700;
  margin-bottom: 6px;
  font-size: 1.5rem;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #555;
  margin-bottom: 20px;
  line-height: 1.4;
`;

const SectionTitle = styled.h3`
  color: #4474b0;
  font-weight: 600;
  font-size: 1.1rem;
  margin: 25px 0 15px;
  text-align: left;
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e7ff;
`;

const Info = styled.div`
  font-size: 0.95rem;
  margin: 20px 0;
  padding: 12px;
  background: #e8f4fd;
  border-radius: 8px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  text-align: left;
`;

const FormGroup = styled.div`
  margin-bottom: 18px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #345475;
  font-size: 0.95rem;
  display: block;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border-radius: 7px;
  border: 1px solid #b0c4d9;
  font-size: 1rem;
  background: #f8fafc;
  outline: none;
  box-sizing: border-box;
  
  &:focus {
    border-color: #4474b0;
    box-shadow: 0 0 0 2px rgba(68, 116, 176, 0.15);
  }
  
  &:disabled {
    background: #e9ecef;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 14px;
  border-radius: 7px;
  border: 1px solid #b0c4d9;
  font-size: 1rem;
  background: #f8fafc;
  outline: none;
  resize: vertical;
  font-family: inherit;
  box-sizing: border-box;
  
  &:focus {
    border-color: #4474b0;
    box-shadow: 0 0 0 2px rgba(68, 116, 176, 0.15);
  }
  
  &:disabled {
    background: #e9ecef;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 14px;
  border-radius: 7px;
  border: 1px solid #b0c4d9;
  font-size: 1rem;
  background: #f8fafc;
  outline: none;
  box-sizing: border-box;
  
  &:focus {
    border-color: #4474b0;
    box-shadow: 0 0 0 2px rgba(68, 116, 176, 0.15);
  }
  
  &:disabled {
    background: #e9ecef;
    cursor: not-allowed;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  font-weight: normal;
  cursor: pointer;
  
  input {
    margin-right: 8px;
  }
  
  input:disabled {
    cursor: not-allowed;
  }
`;

const Button = styled.button`
  background: linear-gradient(90deg, #345475 70%, #1565c0 100%);
  color: #fff;
  padding: 15px 0;
  border-radius: 7px;
  font-weight: 600;
  font-size: 1.05rem;
  margin-top: 10px;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);
  
  &:hover {
    background: linear-gradient(90deg, #2f4a66 70%, #1356a8 100%);
  }
  
  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const Success = styled.div`
  text-align: center;
  padding: 20px 0;
`;

const SuccessIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 15px;
`;

const SuccessTitle = styled.h3`
  color: #4474b0;
  font-weight: 700;
  margin-bottom: 15px;
  font-size: 1.4rem;
`;

const SuccessMessage = styled.p`
  color: #555;
  margin-bottom: 25px;
  line-height: 1.5;
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  border: 1px solid #f5c6cb;
`;