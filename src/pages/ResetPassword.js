import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header2";
import Footer from "../components/Footer";

const API_URL = process.env.REACT_APP_API_URL;

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Leer token desde la URL
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newPassword || !confirmPassword) {
      setError("Todos los campos son obligatorios");
      return;
    }
    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (!token) {
      setError("Token inválido o ausente.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error al restablecer contraseña");
      setSuccess("¡Contraseña restablecida correctamente! Ahora puedes iniciar sesión.");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header />
      <Card>
        <Title>Restablecer Contraseña</Title>
        <Info>
          Ingresa tu nueva contraseña. Si el enlace ha expirado puedes volver a solicitarlo.
        </Info>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Nueva Contraseña</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
            />
          </InputGroup>
          <InputGroup>
            <Label>Confirmar Nueva Contraseña</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirmar contraseña"
              required
            />
          </InputGroup>
          <Button type="submit" disabled={loading}>
            {loading ? "Restableciendo..." : "Restablecer Contraseña"}
          </Button>
        </Form>
      </Card>
      <Footer />
    </Container>
  );
};

export default ResetPassword;

// ----- Styled Components -----
const Container = styled.div`
  min-height: 97vh;
  background: linear-gradient(135deg, #e9f1fa 60%, #f9fafc 100%);
  display: flex;
  flex-direction: column;
`;
const Card = styled.div`
  margin: 40px auto 0 auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(52,84,117,0.12), 0 1.5px 7px rgba(0,0,0,0.09);
  padding: 38px 32px 32px 32px;
  max-width: 380px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 22px;
  align-items: center;

  @media (max-width: 500px) {
    padding: 22px 6vw 18px 6vw;
    margin: 18px auto 0 auto;
    border-radius: 11px;
  }
`;
const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #345475;
  text-align: center;
  margin-bottom: 10px;
  margin-top: 0;
`;
const Info = styled.p`
  font-size: 0.98rem;
  color: #7f8c8d;
  text-align: center;
  margin: 0;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;
const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;
const Label = styled.label`
  font-size: 0.98rem;
  font-weight: 500;
  color: #345475;
  margin-bottom: 2px;
`;
const Input = styled.input`
  padding: 13px 15px;
  border: 1.5px solid #d3e0ee;
  border-radius: 7px;
  font-size: 1rem;
  width: 100%;
  background: #f9fbfd;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
  box-shadow: 0 1.5px 6px rgba(0, 94, 151, 0.04);

  &:focus {
    border: 1.7px solid #005e97;
    box-shadow: 0 2px 12px 0 rgba(0,94,151,0.13);
  }
`;
const Button = styled.button`
  padding: 14px;
  background: ${({ disabled }) =>
    disabled
      ? "#aab7b8"
      : "linear-gradient(90deg,#345475 80%,#4474B0 100%)"};
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.08rem;
  font-weight: 600;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  margin-top: 6px;
  transition: background 0.18s, color 0.18s;
  letter-spacing: -0.5px;
  box-shadow: 0 2px 10px rgba(52,84,117,0.07);
`;
const ErrorMessage = styled.div`
  background: rgba(231,76,60,0.08);
  color: #e74c3c;
  padding: 12px;
  border-radius: 7px;
  margin-bottom: 10px;
  font-size: 0.98rem;
  width: 100%;
  text-align: center;
  border: 1px solid #f9d6d5;
  font-weight: 500;
`;
const SuccessMessage = styled.div`
  background: rgba(46,125,50,0.09);
  color: #2e7d32;
  padding: 12px;
  border-radius: 7px;
  margin-bottom: 10px;
  font-size: 0.98rem;
  width: 100%;
  text-align: center;
  border: 1px solid #c6e7cb;
  font-weight: 500;
`;