import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardBody,
  Row,
  Col,
  Table,
  Badge,
  Alert,
  Button,
  FormGroup,
  Label,
  Input,
  Spinner,
} from "reactstrap";
import { toast } from "react-toastify";
import moment from "moment";
import liquidationsApi from "@/utils/api/liquidationsApi";

const PeriodValidator = ({ companyId, startDate, endDate, onValidationChange }) => {
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [liquidatedPeriods, setLiquidatedPeriods] = useState([]);

  useEffect(() => {
    if (companyId && startDate && endDate) {
      validatePeriod();
    }
  }, [companyId, startDate, endDate]);

  const validatePeriod = async () => {
    try {
      setLoading(true);
      console.log("🔄 Validando período...");
      console.log("📊 Parámetros:", { companyId, startDate, endDate });

      // Obtener todas las liquidaciones
      const liquidations = await liquidationsApi.list(1, 100);
      const liquidationsList = liquidations.body || liquidations.data || [];

      // Filtrar liquidaciones de la empresa
      const companyLiquidations = liquidationsList.filter(
        (liq) => liq.company_id === parseInt(companyId)
      );

      // Verificar solapamientos
      const overlappingPeriods = companyLiquidations.filter((liquidation) => {
        const liquidationStart = liquidation.period_start || (liquidation.period + '-01');
        const liquidationEnd = liquidation.period_end || (liquidation.period + '-31');
        
        // Verificar solapamiento de períodos
        const hasOverlap = (
          (startDate <= liquidationEnd && endDate >= liquidationStart) &&
          liquidation.status !== 'cancelled'
        );

        return hasOverlap;
      });

      setLiquidatedPeriods(overlappingPeriods);

      if (overlappingPeriods.length > 0) {
        setIsValid(false);
        setErrorMessage(`El período seleccionado se solapa con ${overlappingPeriods.length} liquidación(es) existente(s).`);
        onValidationChange && onValidationChange(false, overlappingPeriods);
      } else {
        setIsValid(true);
        setErrorMessage('');
        onValidationChange && onValidationChange(true, []);
      }

      console.log("📋 Período válido:", overlappingPeriods.length === 0);
    } catch (error) {
      console.error("❌ Error validando período:", error);
      setIsValid(false);
      setErrorMessage("Error al validar el período. Intente nuevamente.");
      onValidationChange && onValidationChange(false, []);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { color: "warning", text: "Borrador" },
      approved: { color: "success", text: "Aprobada" },
      paid: { color: "info", text: "Pagada" },
      cancelled: { color: "danger", text: "Cancelada" },
    };

    const config = statusConfig[status] || { color: "secondary", text: status };
    return <Badge color={config.color}>{config.text}</Badge>;
  };

  if (!companyId || !startDate || !endDate) {
    return (
      <Alert color="info">
        <i className="fa fa-info-circle me-2"></i>
        Seleccione una empresa y fechas para validar el período.
      </Alert>
    );
  }

  return (
    <div className="mb-2">
      {loading ? (
        <div className="d-flex align-items-center">
          <Spinner size="sm" color="primary" />
          <span className="ms-2 text-muted">Validando período...</span>
        </div>
      ) : (
        <div>
          {!isValid && (
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <i className="fa fa-exclamation-triangle text-danger me-2"></i>
                <span className="text-danger">
                  <strong>Período no válido:</strong> {errorMessage}
                </span>
              </div>
              <Button 
                size="sm" 
                color="outline-primary" 
                onClick={validatePeriod}
                disabled={loading}
                className="btn-sm"
              >
                <i className="fa fa-refresh"></i>
              </Button>
            </div>
          )}

          {isValid && (
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <i className="fa fa-check-circle text-success me-2"></i>
                <span className="text-success">
                  <strong>Período válido:</strong> Sin conflictos
                </span>
                <span className="text-muted ms-2">
                  ({moment(startDate).format('DD/MM/YYYY')} - {moment(endDate).format('DD/MM/YYYY')})
                </span>
              </div>
              <Button 
                size="sm" 
                color="outline-primary" 
                onClick={validatePeriod}
                disabled={loading}
                className="btn-sm"
              >
                <i className="fa fa-refresh"></i>
              </Button>
            </div>
          )}

          {liquidatedPeriods.length > 0 && (
            <div className="mt-2">
              <span className="text-danger">
                <i className="fa fa-exclamation-triangle me-1"></i>
                {liquidatedPeriods.length} liquidación(es) conflictiva(s)
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PeriodValidator;
