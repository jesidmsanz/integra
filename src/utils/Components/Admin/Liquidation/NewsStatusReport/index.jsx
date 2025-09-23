import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardBody,
  Row,
  Col,
  Table,
  Badge,
  Spinner,
  Button,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { toast } from "react-toastify";
import moment from "moment";
import employeeNewsApi from "@/utils/api/employeeNewsApi";
import liquidationNewsTrackingApi from "@/utils/api/liquidationNewsTrackingApi";

const NewsStatusReport = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState({});
  const [trackingStats, setTrackingStats] = useState([]);
  const [filters, setFilters] = useState({
    companyId: "",
    startDate: moment().startOf('month').format('YYYY-MM-DD'),
    endDate: moment().endOf('month').format('YYYY-MM-DD'),
  });

  useEffect(() => {
    generateReport();
  }, []);

  const generateReport = async () => {
    try {
      setLoading(true);
      console.log("🔄 Generando reporte de estados de novedades...");

      // Obtener estadísticas por estado
      const [pendingNews, liquidatedNews, excludedNews, trackingStatsData] = await Promise.all([
        employeeNewsApi.getByLiquidationStatus('pending', filters.companyId, filters.startDate, filters.endDate),
        employeeNewsApi.getByLiquidationStatus('liquidated', filters.companyId, filters.startDate, filters.endDate),
        employeeNewsApi.getByLiquidationStatus('excluded', filters.companyId, filters.startDate, filters.endDate),
        liquidationNewsTrackingApi.getStats(filters.companyId, filters.startDate, filters.endDate),
      ]);

      setReportData({
        pending: pendingNews.length,
        liquidated: liquidatedNews.length,
        excluded: excludedNews.length,
        total: pendingNews.length + liquidatedNews.length + excludedNews.length,
      });

      setTrackingStats(trackingStatsData);

      console.log("✅ Reporte generado exitosamente");
    } catch (error) {
      console.error("❌ Error generando reporte:", error);
      toast.error("Error al generar el reporte");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const exportToExcel = () => {
    // Implementar exportación a Excel
    toast.info("Funcionalidad de exportación en desarrollo");
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <Spinner size="lg" color="primary" />
      </Container>
    );
  }

  return (
    <Container fluid>
      <Card>
        <CardBody>
          <Row className="mb-3">
            <Col md="12">
              <div className="d-flex justify-content-between align-items-center">
                <h3>Reporte de Estados de Novedades</h3>
                <div>
                  <Button color="info" onClick={exportToExcel} className="me-2">
                    <i className="fa fa-file-excel-o me-2"></i>
                    Exportar Excel
                  </Button>
                  <Button color="primary" onClick={generateReport}>
                    <i className="fa fa-refresh me-2"></i>
                    Actualizar
                  </Button>
                </div>
              </div>
            </Col>
          </Row>

          {/* Filtros */}
          <Row className="mb-4">
            <Col md="3">
              <FormGroup>
                <Label>Fecha Inicio</Label>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <Label>Fecha Fin</Label>
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>

          {/* Tarjetas de resumen */}
          <Row className="mb-4">
            <Col md="3">
              <Card className="text-center" style={{ backgroundColor: '#fff3cd' }}>
                <CardBody>
                  <h5 className="text-warning">Pendientes</h5>
                  <h2 className="text-warning">{reportData.pending || 0}</h2>
                  <small>Novedades sin liquidar</small>
                </CardBody>
              </Card>
            </Col>
            <Col md="3">
              <Card className="text-center" style={{ backgroundColor: '#d1ecf1' }}>
                <CardBody>
                  <h5 className="text-info">Liquidadas</h5>
                  <h2 className="text-info">{reportData.liquidated || 0}</h2>
                  <small>Ya incluidas en liquidaciones</small>
                </CardBody>
              </Card>
            </Col>
            <Col md="3">
              <Card className="text-center" style={{ backgroundColor: '#f8d7da' }}>
                <CardBody>
                  <h5 className="text-danger">Excluidas</h5>
                  <h2 className="text-danger">{reportData.excluded || 0}</h2>
                  <small>Novedades excluidas</small>
                </CardBody>
              </Card>
            </Col>
            <Col md="3">
              <Card className="text-center" style={{ backgroundColor: '#d4edda' }}>
                <CardBody>
                  <h5 className="text-success">Total</h5>
                  <h2 className="text-success">{reportData.total || 0}</h2>
                  <small>Total de novedades</small>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Estadísticas de trazabilidad */}
          {trackingStats.length > 0 && (
            <Row className="mb-4">
              <Col md="12">
                <Card>
                  <CardBody>
                    <h5>Estadísticas de Trazabilidad</h5>
                    <Table striped hover>
                      <thead>
                        <tr>
                          <th>Estado</th>
                          <th>Cantidad</th>
                          <th>Novedades Únicas</th>
                          <th>Liquidaciones Únicas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trackingStats.map((stat, index) => (
                          <tr key={index}>
                            <td>
                              <Badge color={stat.status === 'included' ? 'success' : 'warning'}>
                                {stat.status === 'included' ? 'Incluidas' : stat.status}
                              </Badge>
                            </td>
                            <td>{stat.count}</td>
                            <td>{stat.unique_news}</td>
                            <td>{stat.unique_liquidations}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}

          {/* Información adicional */}
          <Row>
            <Col md="12">
              <Card>
                <CardBody>
                  <h5>Información del Reporte</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Período:</strong> {moment(filters.startDate).format('DD/MM/YYYY')} - {moment(filters.endDate).format('DD/MM/YYYY')}</p>
                      <p><strong>Fecha de generación:</strong> {moment().format('DD/MM/YYYY HH:mm')}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Estado de novedades:</strong></p>
                      <ul>
                        <li><span className="badge bg-warning me-1">Pendientes</span> Novedades que no han sido incluidas en ninguna liquidación</li>
                        <li><span className="badge bg-info me-1">Liquidadas</span> Novedades que ya fueron incluidas en una liquidación</li>
                        <li><span className="badge bg-danger me-1">Excluidas</span> Novedades que fueron excluidas de liquidaciones</li>
                      </ul>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Container>
  );
};

export default NewsStatusReport;
