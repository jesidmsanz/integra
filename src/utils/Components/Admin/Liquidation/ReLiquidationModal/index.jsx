import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  Badge,
  Alert,
  FormGroup,
  Label,
  Input,
  Spinner,
} from "reactstrap";
import { toast } from "react-toastify";
import moment from "moment";

const ReLiquidationModal = ({ isOpen, toggle, liquidation, onConfirm }) => {
  const [selectedNews, setSelectedNews] = useState([]);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && liquidation) {
      // Inicializar con novedades seleccionadas
      const newsIds = liquidation.liquidation_details
        ?.flatMap(detail => detail.novedades?.map(n => n.id) || []) || [];
      setSelectedNews(newsIds);
      setReason("");
    }
  }, [isOpen, liquidation]);

  const handleNewsToggle = (newsId) => {
    setSelectedNews(prev => 
      prev.includes(newsId) 
        ? prev.filter(id => id !== newsId)
        : [...prev, newsId]
    );
  };

  const handleSelectAll = () => {
    if (selectedNews.length === getAllNews().length) {
      setSelectedNews([]);
    } else {
      setSelectedNews(getAllNews().map(n => n.id));
    }
  };

  const getAllNews = () => {
    return liquidation?.liquidation_details?.flatMap(detail => 
      detail.novedades?.map(novedad => ({
        ...novedad,
        employee_name: detail.employee_name,
        employee_document: detail.employee_document
      })) || []
    ) || [];
  };

  const handleConfirm = async () => {
    if (selectedNews.length === 0) {
      toast.warning("Debe seleccionar al menos una novedad para re-liquidar");
      return;
    }

    if (!reason.trim()) {
      toast.warning("Debe proporcionar una razón para la re-liquidación");
      return;
    }

    try {
      setLoading(true);
      await onConfirm({
        originalLiquidationId: liquidation.id,
        selectedNewsIds: selectedNews,
        reason: reason.trim()
      });
      
      toast.success("Re-liquidación solicitada exitosamente");
      toggle();
    } catch (error) {
      console.error("Error en re-liquidación:", error);
      toast.error("Error al procesar la re-liquidación");
    } finally {
      setLoading(false);
    }
  };

  const allNews = getAllNews();
  const allSelected = selectedNews.length === allNews.length && allNews.length > 0;

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>
        Re-liquidación Controlada - Liquidación #{liquidation?.id}
      </ModalHeader>
      <ModalBody>
        {liquidation && (
          <div>
            <Alert color="warning">
              <i className="fa fa-exclamation-triangle me-2"></i>
              <strong>Atención:</strong> Esta funcionalidad permite re-liquidar novedades específicas 
              de una liquidación existente. Solo se pueden re-liquidar novedades que no hayan sido 
              marcadas como pagadas.
            </Alert>

            <div className="mb-3">
              <h6>Información de la Liquidación Original:</h6>
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Empresa:</strong> {liquidation.companyname}</p>
                  <p><strong>Período:</strong> {liquidation.period}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Estado:</strong> <Badge color="info">{liquidation.status}</Badge></p>
                  <p><strong>Total Empleados:</strong> {liquidation.total_employees}</p>
                </div>
              </div>
            </div>

            <FormGroup>
              <Label for="reason">Razón de la Re-liquidación *</Label>
              <Input
                type="textarea"
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describa la razón por la cual necesita re-liquidar estas novedades..."
                rows="3"
              />
            </FormGroup>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6>Novedades Disponibles para Re-liquidación:</h6>
              <Button
                size="sm"
                color="outline-primary"
                onClick={handleSelectAll}
              >
                {allSelected ? "Deseleccionar Todo" : "Seleccionar Todo"}
              </Button>
            </div>

            <div className="table-responsive">
              <Table size="sm" striped>
                <thead>
                  <tr>
                    <th width="50">
                      <Input
                        type="checkbox"
                        checked={allSelected}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th>Empleado</th>
                    <th>Tipo de Novedad</th>
                    <th>Período</th>
                    <th>Horas/Días</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {allNews.map((novedad) => (
                    <tr key={novedad.id}>
                      <td>
                        <Input
                          type="checkbox"
                          checked={selectedNews.includes(novedad.id)}
                          onChange={() => handleNewsToggle(novedad.id)}
                        />
                      </td>
                      <td>
                        {novedad.employee_name}<br/>
                        <small className="text-muted">{novedad.employee_document}</small>
                      </td>
                      <td>{novedad.type_name}</td>
                      <td>
                        {moment(novedad.startDate).format('DD/MM/YYYY')}<br/>
                        <small className="text-muted">
                          {moment(novedad.endDate).format('DD/MM/YYYY')}
                        </small>
                      </td>
                      <td>
                        {novedad.hours > 0 && `${novedad.hours}h`}
                        {novedad.days > 0 && `${novedad.days}d`}
                      </td>
                      <td>
                        {new Intl.NumberFormat("es-CO", {
                          style: "currency",
                          currency: "COP",
                          minimumFractionDigits: 0,
                        }).format(novedad.total_amount || novedad.amount || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {allNews.length === 0 && (
              <Alert color="info">
                <i className="fa fa-info-circle me-2"></i>
                No hay novedades disponibles para re-liquidar en esta liquidación.
              </Alert>
            )}

            <div className="mt-3">
              <p className="text-muted">
                <strong>Novedades seleccionadas:</strong> {selectedNews.length} de {allNews.length}
              </p>
            </div>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle} disabled={loading}>
          Cancelar
        </Button>
        <Button 
          color="warning" 
          onClick={handleConfirm}
          disabled={loading || selectedNews.length === 0 || !reason.trim()}
        >
          {loading ? (
            <>
              <Spinner size="sm" className="me-2" />
              Procesando...
            </>
          ) : (
            <>
              <i className="fa fa-redo me-2"></i>
              Re-liquidar Seleccionadas
            </>
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ReLiquidationModal;
