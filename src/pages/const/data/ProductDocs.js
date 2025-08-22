import React from "react";
import styled from "styled-components";

export default function ProductDocs({ pdfUrl, descripcion }) {
  if (!pdfUrl) {
    return <NoData>No hay documentación disponible.</NoData>;
  }
  return (
    <DocsContainer>
      <Description>{descripcion}</Description>
      <ViewerContainer>
        <iframe
          src={pdfUrl + "#toolbar=0"}
          title="Documentación PDF"
          width="100%"
          height="500px"
          style={{ border: "1px solid #ddd", borderRadius: "8px" }}
        />
      </ViewerContainer>
      <DownloadBtn href={pdfUrl} target="_blank" rel="noopener noreferrer" download>
        Descargar PDF
      </DownloadBtn>
    </DocsContainer>
  );
}

// Puedes usar estos styled-components o adaptarlo a tu diseño
const DocsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: center;
`;
const ViewerContainer = styled.div`
  width: 100%;
  max-width: 600px;
`;
const DownloadBtn = styled.a`
  background: #128c7e;
  color: #fff;
  padding: 12px 26px;
  border-radius: 18px;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.18s;
  &:hover {
    background: #0e6e5d;
  }
`;
const Description = styled.p`
  font-size: 1.07rem;
  color: #234;
  font-weight: 500;
  margin-bottom: 8px;
  text-align: center;
`;
const NoData = styled.div`
  text-align: center;
  color: #999;
  font-size: 1rem;
`;
