import styled, { createGlobalStyle } from 'styled-components';

const ResponsiveFooterWidth = createGlobalStyle`
  @media (max-width: 600px) {
    .footer-sermex {
      width: 108% !important;
    }
  }
  @media (min-width: 601px) {
    .footer-sermex {
      width: 108% !important;
    }
  }
`;

const FooterContainer = styled.footer.attrs(() => ({
  className: 'footer-sermex'
}))`
  width: 97%;
  background-color: #345475;
  color: #ffffff;
  text-align: center;
  padding: 20px 0;
`;

const LogoGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px;
`;

const Logo = styled.img`
  width: 100px;
  height: 48px;
  object-fit: contain;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

const partnerLogos = [
  { src: "/images/vicon.png", alt: "Vicon logo" },
  { src: "/images/od.png", alt: "OD logo" },
  { src: "/images/milesight.png", alt: "Milesight logo" },
  { src: "/images/flir.png", alt: "FLIR logo" },
  { src: "/images/eagle.png", alt: "Eagle logo" },
  { src: "/images/ceia.png", alt: "CEIA logo" },
  { src: "/images/flexradio.png", alt: "FlexRadio logo" },
  { src: "/images/or-technology.png", alt: "OR Technology logo" },
  { src: "/images/trafictec.png", alt: "Trafictec logo" },
  { src: "/images/louroe.png", alt: "Louroe logo" },
];

const Footer = () => {
  return (
    <>
      <ResponsiveFooterWidth />
      <FooterContainer>
        <p>© 2025 En Proceso de Certificación ISO 9001:2015.</p>
        <LogoGrid>
          {partnerLogos.map((logo, index) => (
            <Logo 
              key={index}
              src={logo.src}
              alt={logo.alt}
              loading="lazy"
            />
          ))}
        </LogoGrid>
      </FooterContainer>
    </>
  );
};

export default Footer;