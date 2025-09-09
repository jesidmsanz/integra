import React, { useState, useEffect } from 'react';
import RootLayout from '../layout';
import { 
  Container, 
  Card, 
  CardBody, 
  Row, 
  Col, 
  Button, 
  Table, 
  Input, 
  FormGroup, 
  Label, 
  Spinner, 
  Alert, 
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Badge,
  Form
} from 'reactstrap';
import { toast } from 'react-toastify';
import Breadcrumbs from '@/utils/CommonComponent/Breadcrumb';
import normativasApi from '@/utils/api/normativasApi';
import moment from 'moment';

const NormativasPage = () => {
  const [normativas, setNormativas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingNormativa, setEditingNormativa] = useState(null);
  const [filters, setFilters] = useState({
    tipo: '',
    activa: '',
    search: ''
  });

  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    valor: '',
    unidad: 'pesos',
    vigencia_desde: '',
    vigencia_hasta: '',
    descripcion: '',
    activa: true
  });

  const tiposNormativa = [
    { value: 'salario_minimo', label: 'Salario Mínimo' },
    { value: 'auxilio_transporte', label: 'Auxilio de Transporte' },
    { value: 'hora_extra', label: 'Hora Extra' },
    { value: 'recargo_nocturno', label: 'Recargo Nocturno' },
    { value: 'recargo_domingo', label: 'Recargo Domingo' },
    { value: 'vacaciones', label: 'Vacaciones' },
    { value: 'cesantias', label: 'Cesantías' },
    { value: 'prima', label: 'Prima' },
    { value: 'otro', label: 'Otro' }
  ];

  const unidades = [
    { value: 'pesos', label: 'Pesos ($)' },
    { value: 'porcentaje', label: 'Porcentaje (%)' },
    { value: 'horas', label: 'Horas' },
    { value: 'dias', label: 'Días' }
  ];

  useEffect(() => {
    loadNormativas();
  }, [filters]);

  const loadNormativas = async () => {
    try {
      setLoading(true);
      const result = await normativasApi.list(filters);
      setNormativas(result.data || []);
    } catch (error) {
      console.error('Error cargando normativas:', error);
      toast.error('Error al cargar normativas');
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      tipo: '',
      valor: '',
      unidad: 'pesos',
      vigencia_desde: '',
      vigencia_hasta: '',
      descripcion: '',
      activa: true
    });
    setEditingNormativa(null);
  };

  const handleCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (normativa) => {
    setFormData({
      nombre: normativa.nombre,
      tipo: normativa.tipo,
      valor: normativa.valor.toString(),
      unidad: normativa.unidad,
      vigencia_desde: normativa.vigencia_desde,
      vigencia_hasta: normativa.vigencia_hasta || '',
      descripcion: normativa.descripcion || '',
      activa: normativa.activa
    });
    setEditingNormativa(normativa);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setActionLoading(true);
      
      const normativaData = {
        ...formData,
        valor: parseFloat(formData.valor),
        vigencia_desde: formData.vigencia_desde,
        vigencia_hasta: formData.vigencia_hasta || null,
        created_by: 1 // TODO: Obtener del usuario autenticado
      };

      if (editingNormativa) {
        await normativasApi.update(editingNormativa.id, normativaData);
        toast.success('Normativa actualizada exitosamente');
      } else {
        await normativasApi.create(normativaData);
        toast.success('Normativa creada exitosamente');
      }

      setShowModal(false);
      resetForm();
      loadNormativas();
    } catch (error) {
      console.error('Error guardando normativa:', error);
      toast.error('Error al guardar normativa');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (normativa) => {
    if (!window.confirm(`¿Está seguro de eliminar la normativa "${normativa.nombre}"?`)) {
      return;
    }

    try {
      setActionLoading(true);
      await normativasApi.delete(normativa.id);
      toast.success('Normativa eliminada exitosamente');
      loadNormativas();
    } catch (error) {
      console.error('Error eliminando normativa:', error);
      toast.error('Error al eliminar normativa');
    } finally {
      setActionLoading(false);
    }
  };

  const getTipoLabel = (tipo) => {
    const tipoObj = tiposNormativa.find(t => t.value === tipo);
    return tipoObj ? tipoObj.label : tipo;
  };

  const getUnidadLabel = (unidad) => {
    const unidadObj = unidades.find(u => u.value === unidad);
    return unidadObj ? unidadObj.label : unidad;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatValue = (normativa) => {
    if (normativa.unidad === 'pesos') {
      return formatCurrency(normativa.valor);
    } else if (normativa.unidad === 'porcentaje') {
      return `${normativa.valor}%`;
    } else {
      return `${normativa.valor} ${getUnidadLabel(normativa.unidad)}`;
    }
  };

  return (
    <RootLayout>
      <Breadcrumbs main="Normativas" parent="Administración" title="Gestión de Normativas" />
      
      <Container fluid>
        <Row>
          <Col>
            <Card>
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="card-title mb-0">Normativas de Salarios</h4>
                  <Button color="primary" onClick={handleCreate}>
                    <i className="fa fa-plus me-2" />
                    Nueva Normativa
                  </Button>
                </div>

                {/* Filtros */}
                <Row className="mb-4">
                  <Col md={3}>
                    <FormGroup>
                      <Label>Tipo</Label>
                      <Input
                        type="select"
                        name="tipo"
                        value={filters.tipo}
                        onChange={handleFilterChange}
                      >
                        <option value="">Todos los tipos</option>
                        {tiposNormativa.map(tipo => (
                          <option key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md={3}>
                    <FormGroup>
                      <Label>Estado</Label>
                      <Input
                        type="select"
                        name="activa"
                        value={filters.activa}
                        onChange={handleFilterChange}
                      >
                        <option value="">Todas</option>
                        <option value="true">Activas</option>
                        <option value="false">Inactivas</option>
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Buscar</Label>
                      <Input
                        type="text"
                        name="search"
                        placeholder="Buscar por nombre..."
                        value={filters.search}
                        onChange={handleFilterChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                {/* Tabla */}
                {loading ? (
                  <div className="text-center py-4">
                    <Spinner color="primary" />
                    <p className="mt-2">Cargando normativas...</p>
                  </div>
                ) : normativas.length > 0 ? (
                  <div className="table-responsive">
                    <Table>
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>Tipo</th>
                          <th>Valor</th>
                          <th>Vigencia Desde</th>
                          <th>Vigencia Hasta</th>
                          <th>Estado</th>
                          <th>Creado por</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {normativas.map((normativa) => (
                          <tr key={normativa.id}>
                            <td>
                              <strong>{normativa.nombre}</strong>
                              {normativa.descripcion && (
                                <div className="text-muted small">
                                  {normativa.descripcion}
                                </div>
                              )}
                            </td>
                            <td>
                              <Badge color="info">
                                {getTipoLabel(normativa.tipo)}
                              </Badge>
                            </td>
                            <td>
                              <strong>{formatValue(normativa)}</strong>
                            </td>
                            <td>
                              {moment(normativa.vigencia_desde).format('DD/MM/YYYY')}
                            </td>
                            <td>
                              {normativa.vigencia_hasta 
                                ? moment(normativa.vigencia_hasta).format('DD/MM/YYYY')
                                : 'Indefinida'
                              }
                            </td>
                            <td>
                              <Badge color={normativa.activa ? 'success' : 'secondary'}>
                                {normativa.activa ? 'Activa' : 'Inactiva'}
                              </Badge>
                            </td>
                            <td>
                              {normativa.creator 
                                ? `${normativa.creator.firstName} ${normativa.creator.lastName}`
                                : 'N/A'
                              }
                            </td>
                            <td>
                              <div className="d-flex gap-1">
                                <Button
                                  size="sm"
                                  color="primary"
                                  onClick={() => handleEdit(normativa)}
                                  disabled={actionLoading}
                                >
                                  <i className="fa fa-edit" />
                                </Button>
                                <Button
                                  size="sm"
                                  color="danger"
                                  onClick={() => handleDelete(normativa)}
                                  disabled={actionLoading}
                                >
                                  <i className="fa fa-trash" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  <Alert color="info">
                    <i className="fa fa-info-circle me-2" />
                    No se encontraron normativas
                  </Alert>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal para crear/editar normativa */}
      <Modal isOpen={showModal} toggle={() => setShowModal(false)} size="lg">
        <ModalHeader toggle={() => setShowModal(false)}>
          {editingNormativa ? 'Editar Normativa' : 'Nueva Normativa'}
        </ModalHeader>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label>Nombre *</Label>
                  <Input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: Salario Mínimo 2025"
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Tipo *</Label>
                  <Input
                    type="select"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar tipo</option>
                    {tiposNormativa.map(tipo => (
                      <option key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label>Valor *</Label>
                  <Input
                    type="number"
                    name="valor"
                    value={formData.valor}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Unidad *</Label>
                  <Input
                    type="select"
                    name="unidad"
                    value={formData.unidad}
                    onChange={handleInputChange}
                    required
                  >
                    {unidades.map(unidad => (
                      <option key={unidad.value} value={unidad.value}>
                        {unidad.label}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label>Vigencia Desde *</Label>
                  <Input
                    type="date"
                    name="vigencia_desde"
                    value={formData.vigencia_desde}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Vigencia Hasta</Label>
                  <Input
                    type="date"
                    name="vigencia_hasta"
                    value={formData.vigencia_hasta}
                    onChange={handleInputChange}
                    placeholder="Dejar vacío para indefinida"
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <FormGroup>
                  <Label>Descripción</Label>
                  <Input
                    type="textarea"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Descripción detallada de la normativa..."
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <FormGroup check>
                  <Input
                    type="checkbox"
                    name="activa"
                    checked={formData.activa}
                    onChange={handleInputChange}
                  />
                  <Label check>
                    Normativa activa
                  </Label>
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button color="primary" type="submit" disabled={actionLoading}>
              {actionLoading ? <Spinner size="sm" /> : 'Guardar'}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </RootLayout>
  );
};

export default NormativasPage;