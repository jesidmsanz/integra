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

const PeriodValidator = ({ companyId, startDate, endDate, onValidationChange, corte1, corte2, paymentMethod }) => {
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [liquidatedPeriods, setLiquidatedPeriods] = useState([]);

  useEffect(() => {
    if (companyId && startDate && endDate) {
      validatePeriod();
    }
  }, [companyId, startDate, endDate, corte1, corte2, paymentMethod]);

  const validatePeriod = async () => {
    try {
      setLoading(true);
      console.log("🔄 Validando período...");
      console.log("📊 Parámetros:", { companyId, startDate, endDate, corte1, corte2 });

      // Obtener todas las liquidaciones
      const liquidations = await liquidationsApi.list(1, 100);
      const liquidationsList = liquidations.body || liquidations.data || [];

      // Filtrar liquidaciones de la empresa
      const companyLiquidations = liquidationsList.filter(
        (liq) => liq.company_id === parseInt(companyId)
      );

      // Verificar solapamientos
      const currentFrequency = paymentMethod || "Mensual";
      const currentCut = corte1 ? 1 : corte2 ? 2 : null;

      const overlappingPeriods = companyLiquidations.filter((liquidation) => {
        // Solo validar si no está cancelada
        if (liquidation.status === 'cancelled') return false;

        // Obtener fechas de la liquidación existente
        const liquidationStart = liquidation.start_date || liquidation.period_start || (liquidation.period ? liquidation.period + '-01' : null);
        const liquidationEnd = liquidation.end_date || liquidation.period_end || (() => {
          if (liquidation.period) {
            const [year, month] = liquidation.period.split('-');
            const lastDay = new Date(year, month, 0).getDate();
            return liquidation.period + '-' + String(lastDay).padStart(2, '0');
          }
          return null;
        })();

        if (!liquidationStart || !liquidationEnd) return false;

        // Verificar solapamiento de fechas
        const hasDateOverlap = startDate <= liquidationEnd && endDate >= liquidationStart;
        if (!hasDateOverlap) return false;

        // Verificar frecuencia de pago - solo hay conflicto si es la misma frecuencia
        const liquidationFrequency = liquidation.payment_frequency || "Mensual";
        if (liquidationFrequency !== currentFrequency) return false;

        // Si es quincenal, verificar que el corte coincida
        if (currentFrequency === "Quincenal") {
          const liquidationCut = liquidation.cut_number;
          return liquidationCut === currentCut;
        }

        // Si es mensual, cualquier solapamiento es conflicto
        return true;
      });

      setLiquidatedPeriods(overlappingPeriods);

      if (overlappingPeriods.length > 0) {
        setIsValid(false);
        const cutInfo = currentFrequency === "Quincenal" 
          ? (corte1 ? " (Corte 1-15)" : corte2 ? " (Corte 16-30)" : "")
          : "";
        setErrorMessage(`El período seleccionado${cutInfo} se cruza con ${overlappingPeriods.length} liquidación(es) existente(s).`);
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
                  {corte1 && !corte2 && " (Corte 1-15)"}
                  {corte2 && !corte1 && " (Corte 16-30)"}
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
