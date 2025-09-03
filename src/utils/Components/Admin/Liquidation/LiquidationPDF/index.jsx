import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardBody,
  Row,
  Col,
  Button,
  Spinner,
  Alert,
} from "reactstrap";
import { toast } from "react-toastify";
import moment from "moment";
import liquidationsApi from "@/utils/api/liquidationsApi";

const LiquidationPDF = ({ liquidationId, employeeId = null }) => {
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState(null);

  const generatePDF = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await liquidationsApi.generatePDF(
        liquidationId,
        employeeId
      );

      if (result.data?.download_url) {
        setPdfUrl(result.data.download_url);
        toast.success("PDF generado exitosamente");
      } else {
        throw new Error("No se recibió URL de descarga");
      }
    } catch (error) {
      console.error("Error al generar PDF:", error);
      setError(
        "Error al generar el PDF: " + (error.message || "Error desconocido")
      );
      toast.error("Error al generar el PDF");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (pdfUrl) {
      // Crear un enlace temporal para descargar el PDF
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `liquidacion_${liquidationId}${
        employeeId ? `_empleado_${employeeId}` : ""
      }.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const openPDFInNewTab = () => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    }
  };

  return (
    <Container fluid>
      <Card>
        <CardBody>
          <Row>
            <Col md="12">
              <h4>Generar PDF de Liquidación</h4>
              <p className="text-muted">
                {employeeId
                  ? `Generar PDF individual para el empleado ID: ${employeeId}`
                  : `Generar PDF completo de la liquidación ID: ${liquidationId}`}
              </p>
            </Col>
          </Row>

          {error && (
            <Row className="mb-3">
              <Col md="12">
                <Alert color="danger">{error}</Alert>
              </Col>
            </Row>
          )}

          <Row className="mb-3">
            <Col md="12">
              <Button
                color="primary"
                onClick={generatePDF}
                disabled={loading}
                className="me-2"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Generando PDF...
                  </>
                ) : (
                  <>
                    <i className="fa fa-file-pdf-o me-2"></i>
                    Generar PDF
                  </>
                )}
              </Button>

              {pdfUrl && (
                <>
                  <Button
                    color="success"
                    onClick={downloadPDF}
                    className="me-2"
                  >
                    <i className="fa fa-download me-2"></i>
                    Descargar PDF
                  </Button>
                  <Button color="info" onClick={openPDFInNewTab}>
                    <i className="fa fa-external-link me-2"></i>
                    Ver PDF
                  </Button>
                </>
              )}
            </Col>
          </Row>

          {pdfUrl && (
            <Row>
              <Col md="12">
                <Alert color="success">
                  <strong>PDF generado exitosamente!</strong>
                  <br />
                  <small>
                    Generado el: {moment().format("DD/MM/YYYY HH:mm:ss")}
                  </small>
                </Alert>
              </Col>
            </Row>
          )}
        </CardBody>
      </Card>
    </Container>
  );
};

export default LiquidationPDF;
