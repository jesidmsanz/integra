import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Breadcrumbs from "@/utils/CommonComponent/Breadcrumb";
import {
  Container,
  Card,
  CardBody,
  Row,
  Col,
  Button,
  Table,
  Badge,
  Input,
  FormGroup,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "reactstrap";
import { toast } from "react-toastify";
import moment from "moment";
import liquidationsApi from "@/utils/api/liquidationsApi";
import companiesApi from "@/utils/api/companiesApi";

const LiquidationsDashboard = () => {
  const router = useRouter();
  const [liquidations, setLiquidations] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredLiquidations, setFilteredLiquidations] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    company_id: "",
    search: "",
  });
  const [selectedLiquidation, setSelectedLiquidation] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterLiquidations();
  }, [liquidations, filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Cargar liquidaciones
      const liquidationsData = await liquidationsApi.list(1, 100);
      setLiquidations(liquidationsData.data || []);

      // Cargar empresas (igual que en liquidación)
      const companiesResponse = await companiesApi.list();
      if (companiesResponse.length) {
        setCompanies(companiesResponse);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
      toast.error("Error al cargar las liquidaciones");
    } finally {
      setLoading(false);
    }
  };

  const filterLiquidations = () => {
    let filtered = [...liquidations];

    if (filters.status) {
      filtered = filtered.filter((liq) => liq.status === filters.status);
    }

    if (filters.company_id) {
      filtered = filtered.filter(
        (liq) => liq.company_id === parseInt(filters.company_id)
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (liq) =>
          liq.period?.toLowerCase().includes(searchLower) ||
          liq.id.toString().includes(searchLower)
      );
    }

    setFilteredLiquidations(filtered);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const handleViewDetails = async (liquidation) => {
    try {
      setActionLoading(true);
      console.log(
        "🔍 Solicitando detalles para liquidación ID:",
        liquidation.id
      );
      const details = await liquidationsApi.getById(liquidation.id);
      console.log("🔍 Respuesta recibida:", details);
      setSelectedLiquidation(details.data);
      setModalOpen(true);
    } catch (error) {
      console.error("Error al cargar detalles:", error);
      toast.error("Error al cargar los detalles de la liquidación");
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async (liquidation) => {
    if (!window.confirm("¿Está seguro de aprobar esta liquidación?")) return;

    try {
      setActionLoading(true);
      await liquidationsApi.approve(liquidation.id, { approved_by: 1 }); // TODO: usar usuario real
      toast.success("Liquidación aprobada exitosamente");
      loadData();
    } catch (error) {
      console.error("Error al aprobar liquidación:", error);
      toast.error("Error al aprobar la liquidación");
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAsPaid = async (liquidation) => {
    if (!window.confirm("¿Está seguro de marcar esta liquidación como pagada?"))
      return;

    try {
      setActionLoading(true);
      await liquidationsApi.markAsPaid(liquidation.id);
      toast.success("Liquidación marcada como pagada");
      loadData();
    } catch (error) {
      console.error("Error al marcar como pagada:", error);
      toast.error("Error al marcar la liquidación como pagada");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (liquidation) => {
    if (
      !window.confirm(
        "¿Está seguro de eliminar esta liquidación? Esta acción no se puede deshacer."
      )
    )
      return;

    try {
      setActionLoading(true);
      await liquidationsApi.delete(liquidation.id);
      toast.success("Liquidación eliminada exitosamente");
      loadData();
    } catch (error) {
      console.error("Error al eliminar liquidación:", error);
      toast.error("Error al eliminar la liquidación");
    } finally {
      setActionLoading(false);
    }
  };

  const handleGeneratePDF = async (liquidation) => {
    try {
      setActionLoading(true);
      console.log("🔍 Generando PDF para liquidación:", liquidation.id);

      const result = await liquidationsApi.generatePDF(liquidation.id);
      console.log("📄 Resultado del PDF:", result);

      if (result.success && result.data) {
        toast.success("PDF generado exitosamente");

        // Crear enlace de descarga
        const downloadUrl = result.data.downloadUrl;
        if (downloadUrl) {
          // Abrir PDF en nueva ventana
          window.open(downloadUrl, "_blank");
        } else {
          console.error("No se recibió URL de descarga");
          toast.error("Error: No se pudo obtener el enlace de descarga");
        }
      } else {
        toast.error("Error al generar el PDF");
      }
    } catch (error) {
      console.error("Error al generar PDF:", error);
      toast.error("Error al generar el PDF");
    } finally {
      setActionLoading(false);
    }
  };

  const canApprove = (liquidation) => liquidation.status === "draft";
  const canMarkAsPaid = (liquidation) => liquidation.status === "approved";
  const canDelete = (liquidation) => liquidation.status === "draft";

  if (loading) {
    return (
      <Container
        fluid
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <Spinner size="lg" color="primary" />
      </Container>
    );
  }

  return (
    <>
      <Breadcrumbs pageTitle="Liquidaciones Guardadas" parent="Liquidación" />
      <Container fluid>
        <Card>
          <CardBody>
            <Row className="mb-3">
              <Col md="12">
                <div className="d-flex justify-content-between align-items-center">
                  <h3>Listado de Liquidaciones Guardadas</h3>
                  <Button
                    color="primary"
                    onClick={() => router.push("/admin/liquidacion")}
                  >
                    Nueva Liquidación
                  </Button>
                </div>
              </Col>
            </Row>

            {/* Filtros */}
            <Row className="mb-3">
              <Col md="3">
                <FormGroup>
                  <Label>Estado</Label>
                  <Input
                    type="select"
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                  >
                    <option value="">Todos</option>
                    <option value="draft">Borrador</option>
                    <option value="approved">Aprobada</option>
                    <option value="paid">Pagada</option>
                    <option value="cancelled">Cancelada</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Empresa</Label>
                  <Input
                    type="select"
                    value={filters.company_id}
                    onChange={(e) =>
                      handleFilterChange("company_id", e.target.value)
                    }
                  >
                    <option value="">Todas</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.companyname}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label>Buscar</Label>
                  <Input
                    type="text"
                    placeholder="Buscar por empresa, creador o ID..."
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                  />
                </FormGroup>
              </Col>
            </Row>

            {/* Tabla */}
            <Row>
              <Col md="12">
                <div className="table-responsive">
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Empresa</th>
                        <th>Período</th>
                        <th>Frecuencia</th>
                        <th>Empleados</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Creado por</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLiquidations.map((liquidation) => (
                        <tr key={liquidation.id}>
                          <td>{liquidation.id}</td>
                          <td>
                            {liquidation.companyname ||
                              `Empresa ${liquidation.company_id}`}
                          </td>
                          <td>{liquidation.period}</td>
                          <td>Mensual</td>
                          <td>{liquidation.total_employees}</td>
                          <td>
                            {formatCurrency(liquidation.total_net_amount)}
                          </td>
                          <td>{getStatusBadge(liquidation.status)}</td>
                          <td>
                            {liquidation.user_first_name &&
                            liquidation.user_last_name
                              ? `${liquidation.user_first_name} ${liquidation.user_last_name}`
                              : `Usuario ${liquidation.user_id}`}
                          </td>
                          <td>
                            {moment(liquidation.created_at).format(
                              "DD/MM/YYYY HH:mm"
                            )}
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button
                                size="sm"
                                color="primary"
                                onClick={() => handleViewDetails(liquidation)}
                                disabled={actionLoading}
                                className="px-3"
                              >
                                Ver
                              </Button>
                              {canApprove(liquidation) && (
                                <Button
                                  size="sm"
                                  color="success"
                                  onClick={() => handleApprove(liquidation)}
                                  disabled={actionLoading}
                                  className="px-3"
                                >
                                  Aprobar
                                </Button>
                              )}
                              {canMarkAsPaid(liquidation) && (
                                <Button
                                  size="sm"
                                  color="info"
                                  onClick={() => handleMarkAsPaid(liquidation)}
                                  disabled={actionLoading}
                                  className="px-3"
                                >
                                  Pagar
                                </Button>
                              )}
                              <Button
                                size="sm"
                                color="secondary"
                                onClick={() => handleGeneratePDF(liquidation)}
                                disabled={actionLoading}
                                className="px-3"
                              >
                                PDF
                              </Button>
                              {canDelete(liquidation) && (
                                <Button
                                  size="sm"
                                  color="danger"
                                  onClick={() => handleDelete(liquidation)}
                                  disabled={actionLoading}
                                  className="px-3"
                                >
                                  Eliminar
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Container>

      {/* Modal de detalles */}
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} size="xl">
        <ModalHeader toggle={() => setModalOpen(false)}>
          Detalles de Liquidación #{selectedLiquidation?.id}
        </ModalHeader>
        <ModalBody>
          {selectedLiquidation && (
            <div>
              <Row className="mb-2">
                <Col md="3">
                  <div>
                    <strong>Empresa:</strong>
                    <br />
                    {selectedLiquidation.companyname ||
                      `Empresa ${selectedLiquidation.company_id}`}
                  </div>
                </Col>
                <Col md="2">
                  <div>
                    <strong>Período:</strong>
                    <br />
                    {selectedLiquidation.period}
                  </div>
                </Col>
                <Col md="2">
                  <div>
                    <strong>Estado:</strong>
                    <br />
                    {getStatusBadge(selectedLiquidation.status)}
                  </div>
                </Col>
                <Col md="2">
                  <div>
                    <strong>Empleados:</strong>
                    <br />
                    {selectedLiquidation.total_employees}
                  </div>
                </Col>
                <Col md="3">
                  <div>
                    <strong>Total:</strong>
                    <br />
                    {formatCurrency(selectedLiquidation.total_net_amount)}
                  </div>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col md="6">
                  <div>
                    <strong>Creado por:</strong>{" "}
                    {selectedLiquidation.user_first_name &&
                    selectedLiquidation.user_last_name
                      ? `${selectedLiquidation.user_first_name} ${selectedLiquidation.user_last_name}`
                      : `Usuario ${selectedLiquidation.user_id}`}
                  </div>
                </Col>
                <Col md="6">
                  <div>
                    <strong>Fecha:</strong>{" "}
                    {moment(selectedLiquidation.created_at).format(
                      "DD/MM/YYYY HH:mm"
                    )}
                  </div>
                </Col>
              </Row>

              {selectedLiquidation.liquidation_details &&
                selectedLiquidation.liquidation_details.length > 0 && (
                  <div className="mt-3">
                    <h5>Detalles por Empleado</h5>
                    <div className="table-responsive">
                      <Table size="sm" className="mb-0">
                        <thead>
                          <tr>
                            <th style={{ fontSize: "1rem", padding: "0.5rem" }}>
                              Empleado
                            </th>
                            <th style={{ fontSize: "1rem", padding: "0.5rem" }}>
                              Documento
                            </th>
                            <th style={{ fontSize: "1rem", padding: "0.5rem" }}>
                              Cargo
                            </th>
                            <th style={{ fontSize: "1rem", padding: "0.5rem" }}>
                              Salario Básico
                            </th>
                            <th style={{ fontSize: "1rem", padding: "0.5rem" }}>
                              Transporte
                            </th>
                            <th style={{ fontSize: "1rem", padding: "0.5rem" }}>
                              Novedades
                            </th>
                            <th style={{ fontSize: "1rem", padding: "0.5rem" }}>
                              Descuentos
                            </th>
                            <th style={{ fontSize: "1rem", padding: "0.5rem" }}>
                              Neto
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedLiquidation.liquidation_details.map(
                            (detail) => (
                              <tr key={detail.id}>
                                <td
                                  style={{
                                    fontSize: "1rem",
                                    padding: "0.5rem",
                                  }}
                                >
                                  {detail.employee_name}
                                </td>
                                <td
                                  style={{
                                    fontSize: "1rem",
                                    padding: "0.5rem",
                                  }}
                                >
                                  {detail.employee_document}
                                </td>
                                <td
                                  style={{
                                    fontSize: "1rem",
                                    padding: "0.5rem",
                                  }}
                                >
                                  {detail.employee_position}
                                </td>
                                <td
                                  style={{
                                    fontSize: "1rem",
                                    padding: "0.5rem",
                                  }}
                                >
                                  {formatCurrency(detail.basic_salary)}
                                </td>
                                <td
                                  style={{
                                    fontSize: "1rem",
                                    padding: "0.5rem",
                                  }}
                                >
                                  {formatCurrency(
                                    detail.transportation_assistance
                                  )}
                                </td>
                                <td
                                  style={{
                                    fontSize: "1rem",
                                    padding: "0.5rem",
                                  }}
                                >
                                  {formatCurrency(detail.total_earnings)}
                                </td>
                                <td
                                  style={{
                                    fontSize: "1rem",
                                    padding: "0.5rem",
                                  }}
                                >
                                  {formatCurrency(detail.total_deductions)}
                                </td>
                                <td
                                  style={{
                                    fontSize: "1rem",
                                    padding: "0.5rem",
                                  }}
                                >
                                  <strong>
                                    {formatCurrency(detail.net_amount)}
                                  </strong>
                                </td>
                              </tr>
                            )
                          )}
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

export default LiquidationsDashboard;
