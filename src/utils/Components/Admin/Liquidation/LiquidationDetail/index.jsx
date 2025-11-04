import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Card,
  CardBody,
  Row,
  Col,
  Button,
  Table,
  Badge,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { toast } from "react-toastify";
import moment from "moment";
import liquidationsApi from "@/utils/api/liquidationsApi";

const LiquidationDetail = ({ liquidationId }) => {
  const router = useRouter();
  const [liquidation, setLiquidation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (liquidationId) {
      loadLiquidationDetails();
    }
  }, [liquidationId]);

  const loadLiquidationDetails = async () => {
    try {
      setLoading(true);
      const response = await liquidationsApi.getById(liquidationId);
      setLiquidation(response.data);
    } catch (error) {
      console.error("Error al cargar detalles:", error);
      toast.error("Error al cargar los detalles de la liquidación");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount || 0);
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

  const handleViewEmployeeDetails = (employee) => {
    setSelectedEmployee(employee);
    setModalOpen(true);
  };

  const handleApprove = async () => {
    if (!window.confirm("¿Está seguro de aprobar esta liquidación?")) return;

    try {
      await liquidationsApi.approve(liquidation.id, { approved_by: 1 }); // TODO: usar usuario real
      toast.success("Liquidación aprobada exitosamente");
      loadLiquidationDetails();
    } catch (error) {
      console.error("Error al aprobar liquidación:", error);
      toast.error("Error al aprobar la liquidación");
    }
  };

  const handleMarkAsPaid = async () => {
    if (!window.confirm("¿Está seguro de marcar esta liquidación como pagada?"))
      return;

    try {
      await liquidationsApi.markAsPaid(liquidation.id);
      toast.success("Liquidación marcada como pagada");
      loadLiquidationDetails();
    } catch (error) {
      console.error("Error al marcar como pagada:", error);
      toast.error("Error al marcar la liquidación como pagada");
    }
  };

  const handleGeneratePDF = async () => {
    try {
      const result = await liquidationsApi.generatePDF(liquidation.id);
      toast.success("PDF generado exitosamente");
      // Aquí se podría abrir el PDF en una nueva ventana
      // window.open(result.data.download_url, '_blank');
    } catch (error) {
      console.error("Error al generar PDF:", error);
      toast.error("Error al generar el PDF");
    }
  };

  const canApprove = () => liquidation?.status === "draft";
  const canMarkAsPaid = () => liquidation?.status === "approved";

  if (loading) {
    return (
      <Container
        fluid
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <Spinner size="sm" color="primary" style={{ width: "3rem", height: "3rem" }} />
      </Container>
    );
  }

  if (!liquidation) {
    return (
      <Container fluid>
        <Card>
          <CardBody>
            <div className="text-center">
              <h3>Liquidación no encontrada</h3>
              <Button color="primary" onClick={() => router.back()}>
                Volver
              </Button>
            </div>
          </CardBody>
        </Card>
      </Container>
    );
  }

  return (
    <>
      <Container fluid>
        <Card>
          <CardBody>
            <Row className="mb-3">
              <Col md="12">
                <div className="d-flex justify-content-between align-items-center">
                  <h3>Detalle de Liquidación #{liquidation.id}</h3>
                  <div>
                    <Button
                      color="secondary"
                      className="me-2"
                      onClick={() => router.back()}
                    >
                      Volver
                    </Button>
                    {canApprove() && (
                      <Button
                        color="success"
                        className="me-2"
                        onClick={handleApprove}
                      >
                        Aprobar
                      </Button>
                    )}
                    {canMarkAsPaid() && (
                      <Button
                        color="primary"
                        className="me-2"
                        onClick={handleMarkAsPaid}
                      >
                        Marcar como Pagada
                      </Button>
                    )}
                    <Button color="info" onClick={handleGeneratePDF}>
                      Generar PDF
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Información general */}
            <Row className="mb-4">
              <Col md="6">
                <Card>
                  <CardBody>
                    <h5>Información General</h5>
                    <p>
                      <strong>Empresa:</strong>{" "}
                      {liquidation.company?.companyname}
                    </p>
                    <p>
                      <strong>Período:</strong>{" "}
                      {moment(liquidation.period_start).format("DD/MM/YYYY")} -{" "}
                      {moment(liquidation.period_end).format("DD/MM/YYYY")}
                    </p>
                    <p>
                      <strong>Frecuencia:</strong>{" "}
                      {liquidation.payment_frequency}
                    </p>
                    <p>
                      <strong>Estado:</strong>{" "}
                      {getStatusBadge(liquidation.status)}
                    </p>
                  </CardBody>
                </Card>
              </Col>
              <Col md="6">
                <Card>
                  <CardBody>
                    <h5>Resumen</h5>
                    <p>
                      <strong>Total Empleados:</strong>{" "}
                      {liquidation.total_employees}
                    </p>
                    <p>
                      <strong>Total Liquidación:</strong>{" "}
                      {formatCurrency(liquidation.total_amount)}
                    </p>
                    <p>
                      <strong>Creado por:</strong>{" "}
                      {liquidation.creator?.firstName}{" "}
                      {liquidation.creator?.lastName}
                    </p>
                    <p>
                      <strong>Fecha de Creación:</strong>{" "}
                      {moment(liquidation.created_at).format(
                        "DD/MM/YYYY HH:mm"
                      )}
                    </p>
                    {liquidation.approver && (
                      <p>
                        <strong>Aprobado por:</strong>{" "}
                        {liquidation.approver?.firstName}{" "}
                        {liquidation.approver?.lastName}
                      </p>
                    )}
                  </CardBody>
                </Card>
              </Col>
            </Row>

            {/* Tabla de empleados */}
            <Row>
              <Col md="12">
                <Card>
                  <CardBody>
                    <h5>Detalles por Empleado</h5>
                    <div className="table-responsive">
                      <Table striped hover>
                        <thead>
                          <tr>
                            <th>Empleado</th>
                            <th>Documento</th>
                            <th>Cargo</th>
                            <th>Salario Básico</th>
                            <th>Transporte</th>
                            <th>Novedades</th>
                            <th>Descuentos</th>
                            <th>Neto</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {liquidation.details?.map((detail) => (
                            <tr key={detail.id}>
                              <td>
                                {detail.employee?.firstname}{" "}
                                {detail.employee?.lastname}
                              </td>
                              <td>{detail.employee?.document}</td>
                              <td>{detail.employee?.position}</td>
                              <td>{formatCurrency(detail.basic_salary)}</td>
                              <td>
                                {formatCurrency(
                                  detail.transportation_assistance
                                )}
                              </td>
                              <td>{formatCurrency(detail.total_novedades)}</td>
                              <td>{formatCurrency(detail.total_discounts)}</td>
                              <td>
                                <strong>
                                  {formatCurrency(detail.net_amount)}
                                </strong>
                              </td>
                              <td>
                                <Button
                                  size="sm"
                                  color="info"
                                  onClick={() =>
                                    handleViewEmployeeDetails(detail)
                                  }
                                >
                                  Ver Detalles
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Container>

      {/* Modal de detalles del empleado */}
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} size="lg">
        <ModalHeader toggle={() => setModalOpen(false)}>
          Detalles del Empleado: {selectedEmployee?.employee?.firstname}{" "}
          {selectedEmployee?.employee?.lastname}
        </ModalHeader>
        <ModalBody>
          {selectedEmployee && (
            <div>
              <Row>
                <Col md="6">
                  <h6>Información del Empleado</h6>
                  <p>
                    <strong>Nombre:</strong>{" "}
                    {selectedEmployee.employee?.firstname}{" "}
                    {selectedEmployee.employee?.lastname}
                  </p>
                  <p>
                    <strong>Documento:</strong>{" "}
                    {selectedEmployee.employee?.document}
                  </p>
                  <p>
                    <strong>Cargo:</strong>{" "}
                    {selectedEmployee.employee?.position}
                  </p>
                </Col>
                <Col md="6">
                  <h6>Liquidación</h6>
                  <p>
                    <strong>Salario Básico:</strong>{" "}
                    {formatCurrency(selectedEmployee.basic_salary)}
                  </p>
                  <p>
                    <strong>Transporte:</strong>{" "}
                    {formatCurrency(selectedEmployee.transportation_assistance)}
                  </p>
                  <p>
                    <strong>Novedades:</strong>{" "}
                    {formatCurrency(selectedEmployee.total_novedades)}
                  </p>
                  <p>
                    <strong>Descuentos:</strong>{" "}
                    {formatCurrency(selectedEmployee.total_discounts)}
                  </p>
                  <p>
                    <strong>Neto:</strong>{" "}
                    <strong>
                      {formatCurrency(selectedEmployee.net_amount)}
                    </strong>
                  </p>
                </Col>
              </Row>

              {selectedEmployee.news && selectedEmployee.news.length > 0 && (
                <div className="mt-3">
                  <h6>Novedades Aplicadas</h6>
                  <div className="table-responsive">
                    <Table size="sm">
                      <thead>
                        <tr>
                          <th>Tipo de Novedad</th>
                          <th>Horas</th>
                          <th>Días</th>
                          <th>Valor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedEmployee.news.map((news) => (
                          <tr key={news.id}>
                            <td>{news.typeNews?.name}</td>
                            <td>{news.hours}</td>
                            <td>{news.days}</td>
                            <td>{formatCurrency(news.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default LiquidationDetail;
