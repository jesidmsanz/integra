import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, Button, Table, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Alert } from "reactstrap";
import Breadcrumbs from "@/utils/CommonComponent/Breadcrumb";
import { normativesApi } from "@/utils/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RootLayout from "../layout";

const NormativasPage = () => {
  const [normativas, setNormativas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNormativa, setEditingNormativa] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    effective_date: "",
    expiration_date: "",
    minimum_wage: "",
    transportation_assistance: "",
    workday_hours: 8.0,
    hourly_rate: "",
    max_overtime_hours_daily: 2,
    max_overtime_hours_weekly: 12,
    max_daily_hours: 8,
    max_weekly_hours: 48,
    overtime_rate: 1.25,
    night_shift_rate: 1.35,
    holiday_rate: 1.75,
    sunday_rate: 1.75,
    prima_legal_percentage: 8.33,
    cesantias_legal_percentage: 8.33,
    intereses_cesantias_percentage: 12.00,
    vacations_legal_days: 15,
    health_contribution_percentage: 4.00,
    pension_contribution_percentage: 4.00,
    solidarity_pension_fund_percentage: 1.00,
    arl_contribution_percentage: 0.522,
    sena_contribution_percentage: 2.00,
    icbf_contribution_percentage: 3.00,
    ccf_contribution_percentage: 4.00,
  });

  useEffect(() => {
    loadNormativas();
  }, []);

  const loadNormativas = async () => {
    try {
      setLoading(true);
      const response = await normativesApi.list(1, 100);
      setNormativas(response.data || []);
    } catch (error) {
      console.error("Error al cargar normativas:", error);
      toast.error("Error al cargar las normativas");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingNormativa) {
        await normativesApi.update(editingNormativa.id, formData);
        toast.success("Normativa actualizada exitosamente");
      } else {
        await normativesApi.create(formData);
        toast.success("Normativa creada exitosamente");
      }
      setModalOpen(false);
      setEditingNormativa(null);
      setFormData({
        name: "",
        description: "",
        effective_date: "",
        expiration_date: "",
        minimum_wage: "",
        transportation_assistance: "",
        workday_hours: 8.0,
        hourly_rate: "",
        max_overtime_hours_daily: 2,
        max_overtime_hours_weekly: 12,
        max_daily_hours: 8,
        max_weekly_hours: 48,
        overtime_rate: 1.25,
        night_shift_rate: 1.35,
        holiday_rate: 1.75,
        sunday_rate: 1.75,
        prima_legal_percentage: 8.33,
        cesantias_legal_percentage: 8.33,
        intereses_cesantias_percentage: 12.00,
        vacations_legal_days: 15,
        health_contribution_percentage: 4.00,
        pension_contribution_percentage: 4.00,
        solidarity_pension_fund_percentage: 1.00,
        arl_contribution_percentage: 0.522,
        sena_contribution_percentage: 2.00,
        icbf_contribution_percentage: 3.00,
        ccf_contribution_percentage: 4.00,
      });
      loadNormativas();
    } catch (error) {
      console.error("Error al guardar normativa:", error);
      toast.error("Error al guardar la normativa");
    }
  };

  const handleEdit = (normativa) => {
    setEditingNormativa(normativa);
    setFormData({
      ...normativa,
      effective_date: normativa.effective_date?.split('T')[0] || '',
      expiration_date: normativa.expiration_date?.split('T')[0] || '',
    });
    setModalOpen(true);
  };

  const handleDeactivate = async (id) => {
    if (window.confirm("¿Está seguro de que desea desactivar esta normativa?")) {
      try {
        await normativesApi.deactivate(id);
        toast.success("Normativa desactivada exitosamente");
        loadNormativas();
      } catch (error) {
        console.error("Error al desactivar normativa:", error);
        toast.error("Error al desactivar la normativa");
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("es-CO");
  };

  return (
    <RootLayout>
      <Breadcrumbs pageTitle="Normativas Laborales" parent="Configuración" />
      <Container fluid>
        <Card>
          <CardBody>
            <Row className="mb-3">
              <Col md="12">
                <div className="d-flex justify-content-between align-items-center">
                  <h4>Gestión de Normativas Laborales</h4>
                  <Button
                    color="primary"
                    onClick={() => {
                      setEditingNormativa(null);
                      setFormData({
                        name: "",
                        description: "",
                        effective_date: "",
                        expiration_date: "",
                        minimum_wage: "",
                        transportation_assistance: "",
                        workday_hours: 8.0,
                        hourly_rate: "",
                        max_overtime_hours_daily: 2,
                        max_overtime_hours_weekly: 12,
                        max_daily_hours: 8,
                        max_weekly_hours: 48,
                        overtime_rate: 1.25,
                        night_shift_rate: 1.35,
                        holiday_rate: 1.75,
                        sunday_rate: 1.75,
                        prima_legal_percentage: 8.33,
                        cesantias_legal_percentage: 8.33,
                        intereses_cesantias_percentage: 12.00,
                        vacations_legal_days: 15,
                        health_contribution_percentage: 4.00,
                        pension_contribution_percentage: 4.00,
                        solidarity_pension_fund_percentage: 1.00,
                        arl_contribution_percentage: 0.522,
                        sena_contribution_percentage: 2.00,
                        icbf_contribution_percentage: 3.00,
                        ccf_contribution_percentage: 4.00,
                      });
                      setModalOpen(true);
                    }}
                  >
                    <i className="fa fa-plus me-2"></i>
                    Nueva Normativa
                  </Button>
                </div>
              </Col>
            </Row>

            <div className="table-responsive">
              <Table responsive striped hover>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Fecha Vigencia</th>
                    <th>Fecha Expiración</th>
                    <th>Salario Mínimo</th>
                    <th>Auxilio Transporte</th>
                    <th>Jornada (h)</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="text-center">
                        <i className="fa fa-spinner fa-spin me-2"></i>
                        Cargando...
                      </td>
                    </tr>
                  ) : normativas.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center">
                        No hay normativas registradas
                      </td>
                    </tr>
                  ) : (
                    normativas.map((normativa) => (
                      <tr key={normativa.id}>
                        <td>
                          <strong>{normativa.name}</strong>
                          {normativa.description && (
                            <>
                              <br />
                              <small className="text-muted">{normativa.description}</small>
                            </>
                          )}
                        </td>
                        <td>{formatDate(normativa.effective_date)}</td>
                        <td>{formatDate(normativa.expiration_date)}</td>
                        <td>{formatCurrency(normativa.minimum_wage)}</td>
                        <td>{formatCurrency(normativa.transportation_assistance)}</td>
                        <td>{normativa.workday_hours}</td>
                        <td>
                          <span className={`badge ${normativa.is_active ? 'bg-success' : 'bg-secondary'}`}>
                            {normativa.is_active ? 'Activa' : 'Inactiva'}
                          </span>
                        </td>
                        <td>
                          <Button
                            color="info"
                            size="sm"
                            onClick={() => handleEdit(normativa)}
                            className="me-2"
                          >
                            <i className="fa fa-edit"></i>
                          </Button>
                          {normativa.is_active && (
                            <Button
                              color="warning"
                              size="sm"
                              onClick={() => handleDeactivate(normativa.id)}
                            >
                              <i className="fa fa-ban"></i>
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </CardBody>
        </Card>
      </Container>

      {/* Modal para crear/editar normativa */}
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} size="xl">
        <ModalHeader toggle={() => setModalOpen(false)}>
          {editingNormativa ? "Editar Normativa" : "Nueva Normativa"}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label for="name">Nombre de la Normativa *</Label>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="effective_date">Fecha de Vigencia *</Label>
                  <Input
                    type="date"
                    name="effective_date"
                    id="effective_date"
                    value={formData.effective_date}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md="12">
                <FormGroup>
                  <Label for="description">Descripción</Label>
                  <Input
                    type="textarea"
                    name="description"
                    id="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md="6">
                <FormGroup>
                  <Label for="minimum_wage">Salario Mínimo *</Label>
                  <Input
                    type="number"
                    name="minimum_wage"
                    id="minimum_wage"
                    value={formData.minimum_wage}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="transportation_assistance">Auxilio de Transporte *</Label>
                  <Input
                    type="number"
                    name="transportation_assistance"
                    id="transportation_assistance"
                    value={formData.transportation_assistance}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md="6">
                <FormGroup>
                  <Label for="workday_hours">Jornada Laboral (horas) *</Label>
                  <Input
                    type="number"
                    name="workday_hours"
                    id="workday_hours"
                    value={formData.workday_hours}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="hourly_rate">Valor Hora Laboral</Label>
                  <Input
                    type="number"
                    name="hourly_rate"
                    id="hourly_rate"
                    value={formData.hourly_rate}
                    onChange={handleInputChange}
                    step="0.01"
                  />
                </FormGroup>
              </Col>
            </Row>

            <Alert color="info" className="mt-3">
              <strong>Nota:</strong> Los demás campos se configurarán con valores por defecto según la normativa colombiana vigente.
            </Alert>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            Cancelar
          </Button>
          <Button color="primary" onClick={handleSubmit}>
            {editingNormativa ? "Actualizar" : "Crear"}
          </Button>
        </ModalFooter>
      </Modal>
    </RootLayout>
  );
};

export default NormativasPage;
