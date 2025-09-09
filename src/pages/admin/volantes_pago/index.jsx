import React, { useState, useEffect } from 'react';
import RootLayout from '../layout';
import { Container, Card, CardBody, Row, Col, Button, Table, Input, FormGroup, Label, Spinner, Alert, Modal, ModalHeader, ModalBody, ModalFooter, Badge } from 'reactstrap';
import { toast } from 'react-toastify';
import Breadcrumbs from '@/utils/CommonComponent/Breadcrumb';
import liquidationsApi from '@/utils/api/liquidationsApi';
import employeesApi from '@/utils/api/employeesApi';
import PaySlipGenerator from '@/utils/Components/Admin/Liquidation/PaySlipGenerator';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  const [showPaySlipModal, setShowPaySlipModal] = useState(false);

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

    // Generar PDF con diseño profesional y descargar
    await generatePDFDirectly(true);
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

    // Generar PDF directamente sin modal
    await generatePDFDirectly();
  };

  const generatePDFDirectly = async (download = false) => {
    try {
      if (download) {
        setDownloadingPDFs(true);
      } else {
      setPrintingPDFs(true);
      }
      
      // Crear un elemento temporal para generar el PDF
      const tempElement = document.createElement('div');
      tempElement.style.position = 'absolute';
      tempElement.style.left = '-9999px';
      tempElement.style.top = '-9999px';
      tempElement.style.width = '210mm';
      tempElement.style.minHeight = '297mm';
      tempElement.style.backgroundColor = 'white';
      tempElement.style.padding = '0';
      tempElement.style.fontFamily = 'Arial, sans-serif';
      tempElement.style.fontSize = '11px';
      tempElement.style.lineHeight = '1.3';
      tempElement.style.color = '#333';
      tempElement.style.boxShadow = '0 0 20px rgba(0,0,0,0.1)';
      tempElement.style.borderRadius = '8px';
      tempElement.style.overflow = 'hidden';
      
      // Obtener datos del empleado seleccionado
      const employee = employees.find(emp => emp.id === selectedEmployee);
      
      // Generar el HTML del volante
      tempElement.innerHTML = generatePaySlipHTML(selectedLiquidation, employee);
      
      // Agregar al DOM temporalmente
      document.body.appendChild(tempElement);
      
      // Generar PDF
      const canvas = await html2canvas(tempElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Limpiar elemento temporal
      document.body.removeChild(tempElement);

      if (download) {
        // Descargar PDF
        const pdfBlob = pdf.output('blob');
        const link = document.createElement('a');
        link.href = URL.createObjectURL(pdfBlob);
        link.download = `volante-pago-${employee.documentnumber}-${selectedLiquidation.period}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('PDF descargado exitosamente');
      } else {
        // Abrir PDF en nueva pestaña
        const pdfBlob = pdf.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
        setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
        toast.success('PDF generado exitosamente');
      }
      
    } catch (error) {
      console.error('Error generando PDF:', error);
      toast.error('Error al generar PDF');
    } finally {
      if (download) {
        setDownloadingPDFs(false);
      } else {
      setPrintingPDFs(false);
      }
    }
  };

  const handleGenerateProfessionalPDF = () => {
    if (!selectedLiquidation || !selectedEmployee) {
      toast.error('Seleccione una liquidación y un empleado');
      return;
    }
    setShowPaySlipModal(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const generatePaySlipHTML = (liquidation, employee) => {
    // Datos de ejemplo para el volante
    const salary = 4000000;
    const transportAllowance = 100000;
    const overtime = 82965;
    const healthFund = 160000;
    const pensionFund = 160000;
    
    const totalIngresos = salary + transportAllowance + overtime;
    const totalDeducciones = healthFund + pensionFund;
    const netoPagar = totalIngresos - totalDeducciones;

    return `
      <div style="width: 100%; height: 100%; background: white;">
        <!-- Header -->
        <div style="background-color: #2c3e50; color: white; padding: 20px; margin-bottom: 0;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <!-- Logo y datos empresa -->
            <div>
              <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <div style="width: 35px; height: 35px; background-color: #3498db; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 16px; margin-right: 12px;">S</div>
                <span style="color: white; font-weight: bold; font-size: 18px;">proaseo</span>
              </div>
              <div style="color: #bdc3c7; font-size: 10px; margin-bottom: 6px;">Innovación a tu servicio</div>
              <div style="font-weight: bold; font-size: 13px; text-transform: uppercase; margin-bottom: 4px;">${liquidation.companyname || 'PROFESIONALES DE ASEO DE COLOMBIA SAS'}</div>
              <div style="font-size: 11px; color: #ecf0f1;">Nit ${liquidation.company_nit || '901831125'}</div>
            </div>
            <!-- Título y datos comprobante -->
            <div style="text-align: right;">
              <h1 style="font-size: 20px; font-weight: bold; margin: 0 0 8px 0; color: white;">COMPROBANTE DE NÓMINA</h1>
              <div style="margin-bottom: 4px; font-size: 11px;"><strong>Período:</strong> ${liquidation.period}</div>
              <div style="margin-bottom: 4px; font-size: 11px;"><strong>Comprobante N°:</strong> ${liquidation.id}</div>
              <div style="font-size: 11px;"><strong>Estado:</strong> ${liquidation.status === 'approved' ? 'Aprobada' : liquidation.status}</div>
            </div>
          </div>
        </div>

        <!-- Información del empleado -->
        <div style="padding: 20px; background-color: #f8f9fa; border-left: 4px solid #3498db;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <div style="margin-bottom: 6px; font-size: 12px; font-weight: bold; color: #2c3e50;"><strong>Nombre:</strong> ${employee.fullname}</div>
              <div style="margin-bottom: 6px; font-size: 12px; color: #34495e;"><strong>Identificación:</strong> ${employee.documentnumber}</div>
            </div>
            <div style="text-align: right;">
              <div style="margin-bottom: 6px; font-size: 12px; color: #34495e;"><strong>Cargo:</strong> ${employee.position || 'GERENTE OPERATIVO'}</div>
              <div style="font-size: 12px; font-weight: bold; color: #27ae60;"><strong>Salario básico:</strong> ${formatCurrency(salary)}</div>
            </div>
          </div>
        </div>

        <!-- Tablas de Ingresos y Deducciones -->
        <div style="display: flex; gap: 15px; padding: 20px; margin-bottom: 0;">
          <!-- Ingresos -->
          <div style="flex: 1;">
            <div style="background-color: #34495e; color: white; padding: 10px; text-align: center; font-weight: bold; font-size: 13px; border-radius: 4px 4px 0 0;">INGRESOS</div>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #bdc3c7; border-radius: 0 0 4px 4px; overflow: hidden;">
              <thead>
                <tr style="background-color: #ecf0f1;">
                  <th style="padding: 10px 8px; text-align: left; border: 1px solid #bdc3c7; font-weight: bold; font-size: 11px; color: #2c3e50;">Concepto</th>
                  <th style="padding: 10px 8px; text-align: right; border: 1px solid #bdc3c7; font-weight: bold; font-size: 11px; color: #2c3e50;">Cantidad</th>
                  <th style="padding: 10px 8px; text-align: right; border: 1px solid #bdc3c7; font-weight: bold; font-size: 11px; color: #2c3e50;">Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr style="background-color: white;">
                  <td style="padding: 10px 8px; border: 1px solid #bdc3c7; font-size: 11px; color: #2c3e50;">Sueldo</td>
                  <td style="padding: 10px 8px; border: 1px solid #bdc3c7; text-align: right; font-size: 11px; color: #2c3e50;">15.00</td>
                  <td style="padding: 10px 8px; border: 1px solid #bdc3c7; text-align: right; font-size: 11px; font-weight: bold; color: #27ae60;">${formatCurrency(salary)}</td>
                </tr>
                <tr style="background-color: #f8f9fa;">
                  <td style="padding: 10px 8px; border: 1px solid #bdc3c7; font-size: 11px; color: #2c3e50;">Aux. de transporte</td>
                  <td style="padding: 10px 8px; border: 1px solid #bdc3c7; text-align: right; font-size: 11px; color: #2c3e50;">15.00</td>
                  <td style="padding: 10px 8px; border: 1px solid #bdc3c7; text-align: right; font-size: 11px; font-weight: bold; color: #27ae60;">${formatCurrency(transportAllowance)}</td>
                </tr>
                <tr style="background-color: white;">
                  <td style="padding: 10px 8px; border: 1px solid #bdc3c7; font-size: 11px; color: #2c3e50;">Hora extra</td>
                  <td style="padding: 10px 8px; border: 1px solid #bdc3c7; text-align: right; font-size: 11px; color: #2c3e50;">7.66</td>
                  <td style="padding: 10px 8px; border: 1px solid #bdc3c7; text-align: right; font-size: 11px; font-weight: bold; color: #27ae60;">${formatCurrency(overtime)}</td>
                </tr>
                <tr style="background-color: #34495e; font-weight: bold;">
                  <td colspan="2" style="padding: 12px 8px; border: 1px solid #bdc3c7; background-color: #34495e; color: white; font-size: 12px;">Total Ingresos</td>
                  <td style="padding: 12px 8px; border: 1px solid #bdc3c7; text-align: right; background-color: #34495e; color: white; font-size: 12px; font-weight: bold;">${formatCurrency(totalIngresos)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Deducciones -->
          <div style="flex: 1;">
            <div style="background-color: #34495e; color: white; padding: 10px; text-align: center; font-weight: bold; font-size: 13px; border-radius: 4px 4px 0 0;">DEDUCCIONES</div>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #bdc3c7; border-radius: 0 0 4px 4px; overflow: hidden;">
              <thead>
                <tr style="background-color: #ecf0f1;">
                  <th style="padding: 10px 8px; text-align: left; border: 1px solid #bdc3c7; font-weight: bold; font-size: 11px; color: #2c3e50;">Concepto</th>
                  <th style="padding: 10px 8px; text-align: right; border: 1px solid #bdc3c7; font-weight: bold; font-size: 11px; color: #2c3e50;">Cantidad</th>
                  <th style="padding: 10px 8px; text-align: right; border: 1px solid #bdc3c7; font-weight: bold; font-size: 11px; color: #2c3e50;">Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr style="background-color: white;">
                  <td style="padding: 10px 8px; border: 1px solid #bdc3c7; font-size: 11px; color: #2c3e50;">Fondo de salud</td>
                  <td style="padding: 10px 8px; border: 1px solid #bdc3c7; text-align: right; font-size: 11px; color: #2c3e50;">0</td>
                  <td style="padding: 10px 8px; border: 1px solid #bdc3c7; text-align: right; font-size: 11px; font-weight: bold; color: #e74c3c;">${formatCurrency(healthFund)}</td>
                </tr>
                <tr style="background-color: #f8f9fa;">
                  <td style="padding: 10px 8px; border: 1px solid #bdc3c7; font-size: 11px; color: #2c3e50;">Fondo de pensión</td>
                  <td style="padding: 10px 8px; border: 1px solid #bdc3c7; text-align: right; font-size: 11px; color: #2c3e50;">0</td>
                  <td style="padding: 10px 8px; border: 1px solid #bdc3c7; text-align: right; font-size: 11px; font-weight: bold; color: #e74c3c;">${formatCurrency(pensionFund)}</td>
                </tr>
                <tr style="background-color: #34495e; font-weight: bold;">
                  <td colspan="2" style="padding: 12px 8px; border: 1px solid #bdc3c7; background-color: #34495e; color: white; font-size: 12px;">Total Deducciones</td>
                  <td style="padding: 12px 8px; border: 1px solid #bdc3c7; text-align: right; background-color: #34495e; color: white; font-size: 12px; font-weight: bold;">${formatCurrency(totalDeducciones)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Neto a Pagar -->
        <div style="background-color: #2c3e50; color: white; padding: 20px; text-align: center; font-weight: bold; font-size: 16px; display: flex; justify-content: space-between; align-items: center; margin-top: 0;">
          <span>NETO A PAGAR</span>
          <span style="font-size: 18px; color: #27ae60;">${formatCurrency(netoPagar)}</span>
        </div>

        <!-- Pie de página -->
        <div style="padding: 15px 20px; font-size: 9px; color: #7f8c8d; text-align: center; background-color: #ecf0f1;">
          Este comprobante de nómina fue elaborado y enviado a través de Integra. Si desea esta funcionalidad contáctenos.
        </div>
      </div>
    `;
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

      {/* Modal para generar volante de pago profesional */}
      <Modal 
        isOpen={showPaySlipModal} 
        toggle={() => setShowPaySlipModal(false)}
        size="xl"
        style={{ maxWidth: '95vw' }}
      >
        <ModalHeader toggle={() => setShowPaySlipModal(false)}>
          Generar Volante de Pago Profesional
        </ModalHeader>
        <ModalBody style={{ padding: 0 }}>
          {selectedLiquidation && selectedEmployee && (
            <PaySlipGenerator
              liquidation={selectedLiquidation}
              employee={employees.find(emp => emp.id === selectedEmployee)}
              onClose={() => setShowPaySlipModal(false)}
            />
          )}
        </ModalBody>
      </Modal>
    </RootLayout>
  );
};

export default VolantesPago;
