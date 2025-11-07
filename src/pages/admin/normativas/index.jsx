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
    multiplicador: '',
    codigo: '',
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
    { value: 'horas_base_mensuales', label: 'Horas Base Mensuales' },
    { value: 'tipo_hora_laboral', label: 'Tipo de Hora Laboral' },
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
      
      // Limpiar filtros vacíos antes de enviar
      const cleanFilters = {};
      if (filters.tipo && filters.tipo !== '') {
        cleanFilters.tipo = filters.tipo;
      }
      if (filters.activa && filters.activa !== '') {
        cleanFilters.activa = filters.activa;
      }
      if (filters.search && filters.search.trim() !== '') {
        cleanFilters.search = filters.search.trim();
      }
      
      console.log('🔍 Filtros aplicados:', cleanFilters);
      const result = await normativasApi.list(cleanFilters);
      
      // La respuesta viene como { data: { error: '', body: [...] } } según response.js
      let normativasData = [];
      
      if (result && result.data && result.data.body && Array.isArray(result.data.body)) {
        normativasData = result.data.body;
      } else if (result && result.body && Array.isArray(result.body)) {
        normativasData = result.body;
      } else if (Array.isArray(result)) {
        normativasData = result;
      } else if (result && result.data && Array.isArray(result.data)) {
        normativasData = result.data;
      }
      
      console.log('📊 Normativas cargadas:', normativasData.length);
      setNormativas(normativasData);
    } catch (error) {
      console.error('Error cargando normativas:', error);
      toast.error('Error al cargar normativas');
      setNormativas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    // Log para debuggear cambios en activa
    if (name === 'activa') {
      console.log('🔄 Frontend: Cambio en activa:', checked, 'tipo:', typeof checked);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
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
      multiplicador: '',
      codigo: '',
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
      multiplicador: normativa.multiplicador ? normativa.multiplicador.toString() : '',
      codigo: normativa.codigo || '',
      vigencia_desde: normativa.vigencia_desde,
      vigencia_hasta: normativa.vigencia_hasta || '',
      descripcion: normativa.descripcion || '',
      activa: Boolean(normativa.activa) // Asegurar que sea booleano
    });
    setEditingNormativa(normativa);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setActionLoading(true);
      
      // Preparar datos base
      const normativaData = {
        nombre: formData.nombre,
        tipo: formData.tipo,
        valor: parseFloat(formData.valor),
        unidad: formData.unidad,
        multiplicador: formData.multiplicador ? parseFloat(formData.multiplicador) : null,
        codigo: formData.codigo || null,
        vigencia_desde: formData.vigencia_desde,
        vigencia_hasta: formData.vigencia_hasta || null,
        descripcion: formData.descripcion || null,
        activa: Boolean(formData.activa) // Asegurar que sea booleano
      };

      if (editingNormativa) {
        // En actualización, no enviar created_by
        console.log('📝 Frontend: Actualizando normativa:', editingNormativa.id, normativaData);
        const response = await normativasApi.update(editingNormativa.id, normativaData);
        console.log('📝 Frontend: Respuesta de actualización:', response);
        toast.success('Normativa actualizada exitosamente');
      } else {
        // En creación, incluir created_by
        normativaData.created_by = 1; // TODO: Obtener del usuario autenticado
        await normativasApi.create(normativaData);
        toast.success('Normativa creada exitosamente');
      }

      setShowModal(false);
      resetForm();
      
      // Pequeño retraso para asegurar que la actualización se complete en la BD
      setTimeout(() => {
        loadNormativas();
      }, 100);
    } catch (error) {
      console.error('Error guardando normativa:', error);
      toast.error(error.response?.data?.error || error.message || 'Error al guardar normativa');
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
    // Para tipos de hora laboral, el valor no es relevante (se usa el multiplicador)
    if (normativa.tipo === 'tipo_hora_laboral') {
      return '-';
    }
    
    // Si el valor es 0 o null, mostrar guion
    if (!normativa.valor || parseFloat(normativa.valor) === 0) {
      return '-';
    }
    
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
                          <th>Código</th>
                          <th>Valor</th>
                          <th>Multiplicador</th>
                          <th>Vigencia Desde</th>
                          <th>Vigencia Hasta</th>
                          <th>Estado</th>
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
                              {normativa.codigo ? (
                                <Badge color="secondary">{normativa.codigo}</Badge>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td>
                              {normativa.tipo === 'tipo_hora_laboral' ? (
                                <span className="text-muted">-</span>
                              ) : (
                                <strong>{formatValue(normativa)}</strong>
                              )}
                            </td>
                            <td>
                              {normativa.multiplicador ? (
                                (() => {
                                  const mult = parseFloat(normativa.multiplicador);
                                  let texto = '';
                                  if (mult === 1.0) {
                                    texto = '0%';
                                  } else if (mult > 1.0) {
                                    const porcentaje = ((mult - 1) * 100).toFixed(0);
                                    texto = `+${porcentaje}%`;
                                  } else {
                                    const porcentaje = (mult * 100).toFixed(0);
                                    texto = `${porcentaje}%`;
                                  }
                                  return <span className="fw-bold">{texto}</span>;
                                })()
                              ) : (
                                <span className="text-muted">-</span>
                              )}
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
              <Col md={4}>
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
              <Col md={4}>
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
              <Col md={4}>
                <FormGroup>
                  <Label>Multiplicador</Label>
                  <Input
                    type="number"
                    name="multiplicador"
                    value={formData.multiplicador}
                    onChange={handleInputChange}
                    min="0"
                    step="0.0001"
                    placeholder="Ej: 1.25 (para 125%)"
                  />
                  <small className="text-muted">
                    Solo para tipos de hora laboral (ej: 1.25 = 125%)
                  </small>
                </FormGroup>
              </Col>
            </Row>

            {formData.tipo === 'tipo_hora_laboral' && (
              <Row>
                <Col md={12}>
                  <FormGroup>
                    <Label>Código *</Label>
                    <Input
                      type="text"
                      name="codigo"
                      value={formData.codigo}
                      onChange={handleInputChange}
                      required={formData.tipo === 'tipo_hora_laboral'}
                      maxLength={20}
                      placeholder="Ej: HED, HEN, RNO, HO"
                    />
                    <small className="text-muted">
                      Código corto para identificar el tipo de hora (ej: HED = Hora Extra Diurna)
                    </small>
                  </FormGroup>
                </Col>
              </Row>
            )}

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