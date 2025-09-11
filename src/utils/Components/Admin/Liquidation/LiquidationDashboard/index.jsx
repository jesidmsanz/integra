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
import ExcelJS from 'exceljs';
import liquidationsApi from "@/utils/api/liquidationsApi";
import companiesApi from "@/utils/api/companiesApi";
import typeNewsApi from "@/utils/api/typeNewsApi";

const LiquidationsDashboard = () => {
  const router = useRouter();
  const [liquidations, setLiquidations] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [typeNews, setTypeNews] = useState([]);
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

      // Cargar tipos de novedades
      const typeNewsResponse = await typeNewsApi.list();
      if (typeNewsResponse && typeNewsResponse.data && typeNewsResponse.data.length) {
        setTypeNews(typeNewsResponse.data);
      } else if (typeNewsResponse && Array.isArray(typeNewsResponse)) {
        setTypeNews(typeNewsResponse);
      } else {
        setTypeNews([]);
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

  const handleGenerateExcel = async (liquidation) => {
    try {
      setActionLoading(true);
      console.log("🔍 Generando Excel CORPORATIVO PREMIUM para liquidación:", liquidation.id);

      // Obtener detalles de la liquidación
      const details = await liquidationsApi.getById(liquidation.id);
      
      if (details.data && details.data.liquidation_details) {
        // Crear libro de trabajo con ExcelJS
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Liquidación');

        // Configurar anchos de columna - COINCIDIR CON LIQUIDACIÓN
        const baseColumns = [
          { key: 'documento', width: 18 },
          { key: 'nombre', width: 20 },
          { key: 'cargo', width: 18 },
          { key: 'tipo_contrato', width: 18 },
          { key: 'salario_base', width: 18 },
          { key: 'auxilio_transporte', width: 18 },
          { key: 'valor_hora', width: 18 },
          { key: 'frecuencia_pago', width: 18 }
        ];

        // Agregar columnas de novedades
        const newsColumns = typeNews.map(type => ({
          key: `novedad_${type.id}`,
          width: 15
        }));

        const finalColumns = [
          ...baseColumns,
          ...newsColumns,
          { key: 'total', width: 25 }
        ];

        worksheet.columns = finalColumns;
        
        console.log("🔍 Columnas definidas:", finalColumns.length);
        console.log("🔍 Detalles de columnas:", finalColumns.map(col => ({ key: col.key, width: col.width })));

        // === DISEÑO CORPORATIVO PREMIUM ===

        // 1. ENCABEZADO CORPORATIVO COMPACTO
        const totalColumns = 8 + typeNews.length + 1; // base + novedades + final
        console.log("🔍 Total de columnas para merge:", totalColumns);
        
        // Función para obtener letra de columna
        const getColumnLetter = (num) => {
          let result = '';
          while (num > 0) {
            num--;
            result = String.fromCharCode(65 + (num % 26)) + result;
            num = Math.floor(num / 26);
          }
          return result;
        };
        
        const lastColumn = getColumnLetter(totalColumns);
        console.log("🔍 Rango de merge:", `A1:${lastColumn}1`);
        
        // COMBINAR CELDAS PRIMERO
        worksheet.mergeCells(`A1:${lastColumn}1`);
        
        const headerRow1 = worksheet.getRow(1);
        headerRow1.height = 30;
        headerRow1.getCell(1).value = 'INTEGRA - SISTEMA DE GESTIÓN DE NÓMINA';
        headerRow1.getCell(1).font = {
          name: 'Arial',
          size: 16,
          bold: true,
          color: { argb: 'FFFFFFFF' }
        };
        headerRow1.getCell(1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF1F4E79' }
        };
        headerRow1.getCell(1).alignment = {
          horizontal: 'left',
          vertical: 'middle'
        };

        // 2. TÍTULO DEL REPORTE COMPACTO
        // COMBINAR CELDAS PRIMERO
        worksheet.mergeCells(`A2:${lastColumn}2`);
        
        const titleRow = worksheet.getRow(2);
        titleRow.height = 25;
        titleRow.getCell(1).value = 'LIQUIDACIÓN DE NÓMINA';
        titleRow.getCell(1).font = {
          name: 'Arial',
          size: 14,
          bold: true,
          color: { argb: 'FF1F4E79' }
        };
        titleRow.getCell(1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE6F3FF' }
        };
        titleRow.getCell(1).alignment = {
          horizontal: 'left',
          vertical: 'middle'
        };
        titleRow.getCell(1).border = {
          top: { style: 'medium', color: { argb: 'FF1F4E79' } },
          bottom: { style: 'medium', color: { argb: 'FF1F4E79' } },
          left: { style: 'medium', color: { argb: 'FF1F4E79' } },
          right: { style: 'medium', color: { argb: 'FF1F4E79' } }
        };

        // 3. INFORMACIÓN DE LA EMPRESA COMPACTA
        const infoStartRow = 4;
        
        // COMBINAR CELDAS PRIMERO
        worksheet.mergeCells(`A${infoStartRow}:${lastColumn}${infoStartRow}`);
        
        const infoHeaderRow = worksheet.getRow(infoStartRow);
        infoHeaderRow.height = 22;
        infoHeaderRow.getCell(1).value = 'INFORMACIÓN DE LA EMPRESA';
        infoHeaderRow.getCell(1).font = {
          name: 'Arial',
          size: 12,
          bold: true,
          color: { argb: 'FFFFFFFF' }
        };
        infoHeaderRow.getCell(1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF4472C4' }
        };
        infoHeaderRow.getCell(1).alignment = {
          horizontal: 'left',
          vertical: 'middle'
        };

        // Datos de la empresa COMPACTOS
        const companyData = [
          `Empresa: ${details.data.companyname || `Empresa ${details.data.company_id}`}`,
          `Período: ${details.data.period} | Fecha: ${moment().format('DD/MM/YYYY HH:mm')} | Empleados: ${details.data.total_employees} | Total: ${formatCurrency(details.data.total_net_amount)}`
        ];

        companyData.forEach((data, index) => {
          // COMBINAR CELDAS PRIMERO
          worksheet.mergeCells(`A${infoStartRow + 1 + index}:${lastColumn}${infoStartRow + 1 + index}`);
          
          const row = worksheet.getRow(infoStartRow + 1 + index);
          row.height = 18;
          row.getCell(1).value = data;
          row.getCell(1).font = {
            name: 'Arial',
            size: 10,
            bold: true,
            color: { argb: 'FF2F2F2F' }
          };
          row.getCell(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF8F9FA' }
          };
          row.getCell(1).alignment = {
            horizontal: 'left',
            vertical: 'middle'
          };
          row.getCell(1).border = {
            bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } }
          };
        });

        // 4. TABLA DE EMPLEADOS COMPACTA
        const dataStartRow = infoStartRow + 4;
        
        // Encabezados de la tabla COMPACTOS - MANUAL
        const headerRow = worksheet.getRow(dataStartRow);
        headerRow.height = 25;
        
        // Títulos de columnas - COINCIDIR CON LIQUIDACIÓN
        const columnTitles = [
          'DOCUMENTO',
          'NOMBRE',
          'CARGO',
          'TIPO DE CONTRATO',
          'SALARIO BASE',
          'AUXILIO DE TRANSPORTE',
          'VALOR POR HORA',
          'FRECUENCIA DE PAGO',
          ...typeNews.map(type => type.code || type.name),
          'TOTAL'
        ];
        console.log("🔍 Títulos de columnas generados:", columnTitles);
        console.log("🔍 Total de columnas:", columnTitles.length);
        console.log("🔍 Últimas 3 columnas:", columnTitles.slice(-3));
        
        columnTitles.forEach((title, index) => {
          const cell = headerRow.getCell(index + 1);
          cell.value = title;
          console.log(`🔍 Columna ${index + 1}: "${title}"`);
          cell.font = {
            name: 'Arial',
            size: 9,
            bold: true,
            color: { argb: 'FFFFFFFF' }
          };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF2E75B6' }
          };
          cell.alignment = {
            horizontal: 'center',
            vertical: 'middle'
          };
          cell.border = {
            top: { style: 'medium', color: { argb: 'FF1F4E79' } },
            bottom: { style: 'medium', color: { argb: 'FF1F4E79' } },
            left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
            right: { style: 'thin', color: { argb: 'FFFFFFFF' } }
          };
        });

        // Datos de empleados COMPACTOS - COINCIDIR CON LIQUIDACIÓN
        details.data.liquidation_details.forEach((detail, index) => {
          const row = worksheet.getRow(dataStartRow + 1 + index);
          row.height = 22;
          
          const isEven = index % 2 === 0;
          
          // Columnas base - COINCIDIR CON LIQUIDACIÓN
          row.getCell(1).value = detail.employee_document; // DOCUMENTO
          row.getCell(2).value = detail.employee_name; // NOMBRE
          row.getCell(3).value = detail.employee_position; // CARGO
          row.getCell(4).value = detail.contract_type || "No disponible"; // TIPO DE CONTRATO
          row.getCell(5).value = detail.basic_salary; // SALARIO BASE
          row.getCell(6).value = detail.transportation_assistance; // AUXILIO DE TRANSPORTE
          row.getCell(7).value = detail.hourly_rate || 0; // VALOR POR HORA
          row.getCell(8).value = detail.payment_method || "No disponible"; // FRECUENCIA DE PAGO

          // Agregar datos de novedades - LLENAR CON 0 SI NO HAY
          let currentCol = 9;
          typeNews.forEach((type) => {
            const novedad = detail.novedades?.find(n => n.type_news_id === type.id);
            const amount = novedad ? novedad.total_amount : 0;
            row.getCell(currentCol).value = amount;
            currentCol++;
          });

          // Columna final - TOTAL
          const totalCol = 8 + typeNews.length + 1;
          row.getCell(totalCol).value = detail.net_amount;

          // Aplicar estilos a toda la fila COMPACTOS
          const totalCols = 8 + typeNews.length + 1; // base + novedades + final
          for (let col = 1; col <= totalCols; col++) {
            const cell = row.getCell(col);
            cell.font = {
              name: 'Arial',
              size: 9,
              color: { argb: isEven ? 'FF2F2F2F' : 'FF1F1F1F' }
            };
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: isEven ? 'FFFFFFFF' : 'FFF8F9FA' }
            };
            cell.alignment = {
              horizontal: col <= 4 ? 'left' : 'right',
              vertical: 'middle'
            };
            cell.border = {
              top: { style: 'thin', color: { argb: 'FFE0E0E0' } },
              bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
              left: { style: 'thin', color: { argb: 'FFE0E0E0' } },
              right: { style: 'thin', color: { argb: 'FFE0E0E0' } }
            };

            // Formato de moneda para columnas numéricas
            if (col >= 5 && col <= 6) { // SALARIO BASE y AUXILIO DE TRANSPORTE
              cell.numFmt = '"$"#,##0';
            } else if (col >= 9 && col <= 8 + typeNews.length) { // NOVEDADES
              cell.numFmt = '"$"#,##0';
            } else if (col === 8 + typeNews.length + 1) { // TOTAL
              cell.numFmt = '"$"#,##0';
            }
          }
        });

        // 5. FILA DE TOTALES COMPACTA - COINCIDIR CON LIQUIDACIÓN
        const totalRow = dataStartRow + details.data.liquidation_details.length + 1;
        const totalRowObj = worksheet.getRow(totalRow);
        totalRowObj.height = 25;
        
        totalRowObj.getCell(4).value = 'TOTAL GENERAL:';
        
        // Calcular totales manualmente (SIN FÓRMULAS)
        let totalSalario = 0;
        let totalTransporte = 0;
        let totalNeto = 0;
        
        details.data.liquidation_details.forEach(detail => {
          totalSalario += detail.basic_salary || 0;
          totalTransporte += detail.transportation_assistance || 0;
          totalNeto += detail.net_amount || 0;
        });
        
        totalRowObj.getCell(5).value = totalSalario; // SALARIO BASE
        totalRowObj.getCell(6).value = totalTransporte; // AUXILIO DE TRANSPORTE
        // Columnas 7 y 8 (VALOR POR HORA y FRECUENCIA DE PAGO) no tienen totales
        
        // Totales de novedades (SIN FÓRMULAS)
        let currentCol = 9;
        typeNews.forEach((type) => {
          let totalNovedad = 0;
          details.data.liquidation_details.forEach(detail => {
            const novedad = detail.novedades?.find(n => n.type_news_id === type.id);
            totalNovedad += novedad ? (novedad.total_amount || 0) : 0;
          });
          totalRowObj.getCell(currentCol).value = totalNovedad;
          currentCol++;
        });
        
        // Total final (SIN FÓRMULAS)
        const totalCol = 8 + typeNews.length + 1;
        totalRowObj.getCell(totalCol).value = totalNeto;

        // Estilo de la fila de totales COMPACTA
        const totalCols = 8 + typeNews.length + 1; // base + novedades + final
        for (let col = 1; col <= totalCols; col++) {
          const cell = totalRowObj.getCell(col);
          cell.font = {
            name: 'Arial',
            size: 10,
            bold: true,
            color: { argb: 'FFFFFFFF' }
          };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF1F4E79' }
          };
          cell.alignment = {
            horizontal: col <= 4 ? 'left' : 'right',
            vertical: 'middle'
          };
          cell.border = {
            top: { style: 'thick', color: { argb: 'FF1F4E79' } },
            bottom: { style: 'thick', color: { argb: 'FF1F4E79' } },
            left: { style: 'thin', color: { argb: 'FF1F4E79' } },
            right: { style: 'thin', color: { argb: 'FF1F4E79' } }
          };

          // Formato de moneda para columnas numéricas en totales
          if (col >= 5 && col <= 6) { // SALARIO BASE y AUXILIO DE TRANSPORTE
            cell.numFmt = '"$"#,##0';
          } else if (col >= 9 && col <= 8 + typeNews.length) { // NOVEDADES
            cell.numFmt = '"$"#,##0';
          } else if (col === 8 + typeNews.length + 1) { // TOTAL
            cell.numFmt = '"$"#,##0';
          }
        }

        // 6. PIE DE PÁGINA COMPACTO
        const footerStartRow = totalRow + 2;
        const footerData = [
          `Este reporte fue generado automáticamente por el Sistema Integra | Fecha: ${moment().format('DD/MM/YYYY HH:mm')} | © 2025 Integra - Todos los derechos reservados`
        ];

        footerData.forEach((text, index) => {
          const row = worksheet.getRow(footerStartRow + index);
          row.height = 16;
          row.getCell(1).value = text;
          row.getCell(1).font = {
            name: 'Arial',
            size: 8,
            italic: true,
            color: { argb: 'FF666666' }
          };
          row.getCell(1).alignment = {
            horizontal: 'center',
            vertical: 'middle'
          };
          worksheet.mergeCells(`A${footerStartRow + index}:${lastColumn}${footerStartRow + index}`);
        });

        // Generar y descargar archivo
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `LIQUIDACION_${liquidation.id}_${liquidation.period.replace(/[^a-zA-Z0-9]/g, '_')}_${moment().format('YYYYMMDD_HHmm')}.xlsx`;
        link.click();
        window.URL.revokeObjectURL(url);

        toast.success("Excel CORPORATIVO PREMIUM generado exitosamente");
      } else {
        toast.error("No se encontraron datos para exportar");
      }
    } catch (error) {
      console.error("Error al generar Excel:", error);
      toast.error("Error al generar el Excel");
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
                                onClick={() => handleGenerateExcel(liquidation)}
                                disabled={actionLoading}
                                className="px-3"
                              >
                                Excel
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
