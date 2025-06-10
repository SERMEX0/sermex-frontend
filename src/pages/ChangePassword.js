import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styled from "styled-components";
import Header from "../components/Header2";

// Puedes copiar este Footer o usar el tuyo propio
const Footer = () => (
  <FooterStyled>
    <p>© 2025 - Todos los derechos reservados</p>
  </FooterStyled>
);

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Todos los campos son obligatorios");
      return;
    }
    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas nuevas no coinciden");
      return;
    }
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/change-password", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          currentPassword, 
          newPassword 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || "Error al cambiar contraseña";
        throw new Error(
          typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg
        );
      }
      setSuccess("¡Contraseña cambiada exitosamente!");
      setTimeout(() => navigate("/perfil"), 2000);

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
        <LabelTitle>Cambia tu contraseña para mejorar la seguridad de tu cuenta.</LabelTitle>
        <IconContainer>
          <img 
            src="/logo_SERMEX_azul.fw.png" 
            alt="Logo" 
            style={{ 
              height: "88px",
              filter: "drop-shadow(0 2px 8px rgba(52,84,117,0.13))"
            }} 
            onClick={() => navigate("/inicio")}
          />
        </IconContainer>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <Form onSubmit={handleSubmit} autoComplete="off">
          <InputGroup>
            <Label>Contraseña Actual</Label>
            <PasswordContainer>
              <Input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                placeholder="Ingresa tu contraseña actual"
              />
              <EyeIcon
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                tabIndex={0}
                aria-label="Mostrar/Ocultar contraseña actual"
              >
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </EyeIcon>
            </PasswordContainer>
          </InputGroup>

          <InputGroup>
            <Label>Nueva Contraseña</Label>
            <PasswordContainer>
              <Input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Mínimo 6 caracteres"
                minLength="6"
              />
              <EyeIcon
                onClick={() => setShowNewPassword(!showNewPassword)}
                tabIndex={0}
                aria-label="Mostrar/Ocultar nueva contraseña"
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </EyeIcon>
            </PasswordContainer>
          </InputGroup>

          <InputGroup>
            <Label>Confirmar Nueva Contraseña</Label>
            <PasswordContainer>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Repite tu nueva contraseña"
                minLength="6"
              />
              <EyeIcon
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={0}
                aria-label="Mostrar/Ocultar confirmación"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </EyeIcon>
            </PasswordContainer>
          </InputGroup>

          <Button type="submit" disabled={loading} $loading={loading}>
            {loading ? "Cambiando..." : "Cambiar Contraseña"}
          </Button>
      
          <FooterText>
            ¿Quieres restablecer tu contraseña?{" "}
            <FooterLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                const phoneNumber = "524434368655";
                const message = `¡Hola! Necesito ayuda para restablecer mi contraseña.\n\nPor favor indíquenme cómo proceder para recuperar mi acceso.`;
                window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
              }}
            >
              Contacta al administrador
            </FooterLink>
          </FooterText>
        </Form>
      </Card>
      <Footer/>
    </Container>
  );
};

export default ChangePassword;

// ---- Styled Components (100% responsivo) ----

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

const LabelTitle = styled.h2`
  font-size: 1.12rem;
  font-weight: 600;
  color: #345475;
  text-align: center;
  margin-bottom: 10px;
  margin-top: 0;
  letter-spacing: -0.5px;
  line-height: 1.4;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 18px;
  margin-top: 0;
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

const PasswordContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`;

const EyeIcon = styled.span`
  position: absolute;
  right: 14px;
  cursor: pointer;
  color: #7f8c8d;
  font-size: 1.2rem;
  transition: color 0.18s;
  z-index: 2;
`;

const Label = styled.label`
  font-size: 0.98rem;
  font-weight: 500;
  color: #345475;
  margin-bottom: 2px;
  letter-spacing: -0.5px;
`;

const Input = styled.input`
  padding: 13px 44px 13px 15px;
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
  background: ${({ $loading }) =>
    $loading
      ? "#aab7b8"
      : "linear-gradient(90deg,#345475 80%,#4474B0 100%)"};
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.08rem;
  font-weight: 600;
  cursor: ${({ $loading }) => ($loading ? "not-allowed" : "pointer")};
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

const FooterStyled = styled.footer`
  background: linear-gradient(90deg, #345475 78%, #4474B0 100%);
  color: #fff;
  padding: 20px;
  text-align: center;
  margin-top: auto;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: -0.5px;
  box-shadow: 0 -2px 16px rgba(52,84,117,0.03);
`;

const FooterText = styled.p`
  font-size: 0.98rem;
  color: #7f8c8d;
  text-align: center;
  margin-top: 8px;
`;

const FooterLink = styled.a`
  color: #005e97;
  text-decoration: underline;
  font-weight: 500;
  cursor: pointer;
`;