import React, { useState, useEffect } from 'react';
import RootLayout from '../layout';
import { Container, Card, CardBody, Row, Col, Button, Table, Input, FormGroup, Label, Spinner, Alert, Modal, ModalHeader, ModalBody, ModalFooter, Badge } from 'reactstrap';
import { toast } from 'react-toastify';
import Breadcrumbs from '@/utils/CommonComponent/Breadcrumb';
import liquidationsApi from '@/utils/api/liquidationsApi';
import employeesApi from '@/utils/api/employeesApi';

const VolantesPago = () => {
  const [liquidations, setLiquidations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedLiquidation, setSelectedLiquidation] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [downloadingPDFs, setDownloadingPDFs] = useState(false);
  const [printingPDFs, setPrintingPDFs] = useState(false);
  const [sendingEmails, setSendingEmails] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailResults, setEmailResults] = useState([]);

  useEffect(() => {
    loadLiquidations();
  }, []);

  const loadLiquidations = async () => {
    try {
      setLoading(true);
      const result = await liquidationsApi.list();
      setLiquidations(result.data || []);
    } catch (error) {
      console.error('Error cargando liquidaciones:', error);
      toast.error('Error al cargar liquidaciones');
    } finally {
      setLoading(false);
    }
  };

  const loadEmployeesFromLiquidation = async (liquidationId) => {
    try {
      setLoadingEmployees(true);
      const result = await liquidationsApi.getById(liquidationId);
      if (result.data && result.data.liquidation_details) {
        // Extraer empleados de los detalles de la liquidación
        const employeesFromLiquidation = result.data.liquidation_details.map(detail => ({
          id: detail.employee_id,
          fullname: detail.employee_name,
          documentnumber: detail.employee_document,
          email: detail.employee_email || '',
          position: detail.employee_position || ''
        }));
        setEmployees(employeesFromLiquidation);
      } else {
        setEmployees([]);
      }
    } catch (error) {
      console.error('Error cargando empleados de liquidación:', error);
      toast.error('Error al cargar empleados de la liquidación');
      setEmployees([]);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const filteredEmployees = employees.filter(employee => 
    employee.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.documentnumber.includes(searchTerm)
  );

  const handleEmployeeSelect = (employeeId) => {
    setSelectedEmployee(employeeId);
  };

  const handleDownloadPDF = async () => {
    if (!selectedLiquidation) {
      toast.error('Seleccione una liquidación');
      return;
    }

    if (!selectedEmployee) {
      toast.error('Seleccione un empleado');
      return;
    }

    try {
      setDownloadingPDFs(true);
      
      const result = await liquidationsApi.generatePDF(selectedLiquidation.id, selectedEmployee);
      if (result.success) {
        // Descargar PDF
        const link = document.createElement('a');
        link.href = result.data.downloadUrl;
        link.download = `liquidacion_${selectedLiquidation.id}_empleado_${selectedEmployee}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('PDF descargado exitosamente');
      }
    } catch (error) {
      console.error('Error descargando PDF:', error);
      toast.error('Error al descargar PDF');
    } finally {
      setDownloadingPDFs(false);
    }
  };

  const handlePrintPDF = async () => {
    if (!selectedLiquidation) {
      toast.error('Seleccione una liquidación');
      return;
    }

    if (!selectedEmployee) {
      toast.error('Seleccione un empleado');
      return;
    }

    try {
      setPrintingPDFs(true);
      
      const result = await liquidationsApi.generatePDF(selectedLiquidation.id, selectedEmployee);
      if (result.success) {
        // Abrir PDF en nueva ventana para imprimir
        window.open(result.data.downloadUrl, '_blank');
        toast.success('PDF abierto para impresión');
      }
    } catch (error) {
      console.error('Error imprimiendo PDF:', error);
      toast.error('Error al imprimir PDF');
    } finally {
      setPrintingPDFs(false);
    }
  };

  const handleSendEmail = async () => {
    if (!selectedLiquidation) {
      toast.error('Seleccione una liquidación');
      return;
    }

    if (!selectedEmployee) {
      toast.error('Seleccione un empleado');
      return;
    }

    const selectedEmployeeData = employees.find(emp => emp.id === selectedEmployee);
    
    if (!selectedEmployeeData || !selectedEmployeeData.email) {
      toast.error('El empleado seleccionado no tiene email');
      return;
    }

    setShowEmailModal(true);
    
    try {
      setSendingEmails(true);
      
      // Aquí se integraría con el servicio de correo
      const results = await liquidationsApi.sendBulkEmails(
        selectedLiquidation.id, 
        [selectedEmployeeData]
      );
      
      setEmailResults(results);
      toast.success('Correo enviado exitosamente');
    } catch (error) {
      console.error('Error enviando correo:', error);
      toast.error('Error al enviar correo');
    } finally {
      setSendingEmails(false);
    }
  };

  return (
    <RootLayout>
      <Breadcrumbs pageTitle="Volantes de Pago" parent="Liquidación" />
      
      <Container fluid>
        <Card>
          <CardBody>
            <Row className="mb-3">
              <Col md="12">
                <div className="d-flex justify-content-between align-items-center">
                  <h3>Desprendibles por empleado</h3>
                  <div className="d-flex gap-2">
                    <Badge color="info" className="px-3 py-2">
                      {selectedEmployee ? '1 empleado seleccionado' : 'Ningún empleado seleccionado'}
                    </Badge>
                  </div>
                </div>
                <p className="text-muted mb-0">Seleccione una liquidación y un empleado para generar volante de pago</p>
              </Col>
            </Row>

            {/* Filtros */}
            <Row className="mb-3">
              <Col md="4">
                <FormGroup>
                  <Label>Liquidación</Label>
                  <Input
                    type="select"
                    value={selectedLiquidation?.id || ''}
                    onChange={async (e) => {
                      const liquidationId = parseInt(e.target.value);
                      const liquidation = liquidations.find(l => l.id === liquidationId);
                      setSelectedLiquidation(liquidation);
                      setSelectedEmployee(null); // Limpiar selección
                      setSearchTerm(''); // Limpiar búsqueda
                      
                      if (liquidationId) {
                        await loadEmployeesFromLiquidation(liquidationId);
                      } else {
                        setEmployees([]);
                      }
                    }}
                    disabled={loading}
                  >
                    <option value="">{loading ? 'Cargando liquidaciones...' : 'Seleccione una liquidación'}</option>
                    {liquidations.map(liquidation => (
                      <option key={liquidation.id} value={liquidation.id}>
                        {liquidation.period} - {liquidation.status}
                      </option>
                    ))}
                  </Input>
                  {loading && (
                    <div className="text-center mt-2">
                      <Spinner size="sm" color="primary" />
                      <span className="ms-2 text-muted">Cargando liquidaciones...</span>
                    </div>
                  )}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>Buscar Empleado</Label>
                  <Input
                    type="text"
                    placeholder="Buscar por identificación o nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>Acciones</Label>
                  <div className="d-flex gap-2">
                    <Button
                      color="success"
                      size="sm"
                      onClick={handleDownloadPDF}
                      disabled={!selectedLiquidation || !selectedEmployee || downloadingPDFs || printingPDFs || sendingEmails}
                    >
                      {downloadingPDFs ? <Spinner size="sm" className="me-2" /> : <i className="fa fa-download me-2" />}
                      Descargar
                    </Button>
                    
                    <Button
                      color="info"
                      size="sm"
                      onClick={handlePrintPDF}
                      disabled={!selectedLiquidation || !selectedEmployee || downloadingPDFs || printingPDFs || sendingEmails}
                    >
                      {printingPDFs ? <Spinner size="sm" className="me-2" /> : <i className="fa fa-print me-2" />}
                      Imprimir
                    </Button>
                    
                    <Button
                      color="primary"
                      size="sm"
                      onClick={handleSendEmail}
                      disabled={!selectedLiquidation || !selectedEmployee || downloadingPDFs || printingPDFs || sendingEmails}
                    >
                      {sendingEmails ? <Spinner size="sm" className="me-2" /> : <i className="fa fa-envelope me-2" />}
                      Enviar
                    </Button>
                  </div>
                </FormGroup>
              </Col>
            </Row>

            {/* Tabla de Empleados */}
            <Row>
              <Col md="12">
                {!selectedLiquidation ? (
                  <Alert color="info" className="text-center">
                    <i className="fa fa-info-circle me-2" />
                    Seleccione una liquidación para ver los empleados
                  </Alert>
                ) : loadingEmployees ? (
                  <div className="text-center py-4">
                    <Spinner size="lg" color="primary" />
                    <p className="mt-2 text-muted">Cargando empleados...</p>
                  </div>
                ) : employees.length === 0 ? (
                  <Alert color="warning" className="text-center">
                    <i className="fa fa-exclamation-triangle me-2" />
                    No hay empleados en esta liquidación
                  </Alert>
                ) : (
                  <div className="table-responsive">
                    <Table striped hover>
                      <thead>
                        <tr>
                          <th>Seleccionar</th>
                          <th>ID</th>
                          <th>Nombre</th>
                          <th>Documento</th>
                          <th>Email</th>
                          <th>Cargo</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEmployees.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="text-center text-muted">
                              <i className="fa fa-search me-2" />
                              No se encontraron empleados con el criterio de búsqueda
                            </td>
                          </tr>
                        ) : (
                          filteredEmployees.map(employee => (
                            <tr key={employee.id}>
                              <td>
                                <Input
                                  type="radio"
                                  name="selectedEmployee"
                                  checked={selectedEmployee === employee.id}
                                  onChange={() => handleEmployeeSelect(employee.id)}
                                />
                              </td>
                              <td>{employee.id}</td>
                              <td>
                                <strong>{employee.fullname}</strong>
                              </td>
                              <td>{employee.documentnumber}</td>
                              <td>
                                {employee.email ? (
                                  <span className="text-primary">{employee.email}</span>
                                ) : (
                                  <span className="text-muted">Sin email</span>
                                )}
                              </td>
                              <td>{employee.position}</td>
                              <td>
                                <Badge color={employee.email ? "success" : "warning"}>
                                  {employee.email ? "Con email" : "Sin email"}
                                </Badge>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Container>

      {/* Modal de Resultados de Email */}
      <Modal isOpen={showEmailModal} toggle={() => setShowEmailModal(false)} size="lg">
        <ModalHeader toggle={() => setShowEmailModal(false)}>
          <h4 className="mb-0">Resultados del Envío de Correos</h4>
        </ModalHeader>
        <ModalBody>
          {emailResults.length > 0 ? (
            <div className="table-responsive">
              <Table striped hover>
                <thead>
                  <tr>
                    <th>Empleado</th>
                    <th>Email</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {emailResults.map((result, index) => (
                    <tr key={index}>
                      <td>
                        <strong>{result.employeeName}</strong>
                      </td>
                      <td>
                        <span className="text-primary">{result.email}</span>
                      </td>
                      <td>
                        {result.success ? (
                          <Badge color="success">
                            <i className="fa fa-check me-1" />
                            Enviado
                          </Badge>
                        ) : (
                          <Badge color="danger">
                            <i className="fa fa-times me-1" />
                            Error: {result.error}
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <Alert color="info">
              <i className="fa fa-info-circle me-2" />
              No hay resultados para mostrar
            </Alert>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setShowEmailModal(false)}>
            <i className="fa fa-times me-2" />
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>
    </RootLayout>
  );
};

export default VolantesPago;
