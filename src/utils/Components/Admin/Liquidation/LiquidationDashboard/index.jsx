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
import liquidationNewsTrackingApi from "@/utils/api/liquidationNewsTrackingApi";
// import ReLiquidationModal from "../ReLiquidationModal";

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
  const [trackingData, setTrackingData] = useState(null);
  // const [reLiquidationModalOpen, setReLiquidationModalOpen] = useState(false);
  // const [selectedLiquidationForReLiquidation, setSelectedLiquidationForReLiquidation] = useState(null);

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
      setLiquidations(liquidationsData.body || liquidationsData.data || []);

      // Cargar empresas (igual que en liquidación)
      const companiesResponse = await companiesApi.list();
      if (companiesResponse.length) {
        setCompanies(companiesResponse);
      }

      // Cargar tipos de novedades
      const typeNewsResponse = await typeNewsApi.list(1, 1000); // Cargar todos los tipos
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
      const details = await liquidationsApi.getById(liquidation.id);
      setSelectedLiquidation(details.body || details.data);
      
      // Cargar datos de trazabilidad
      try {
        const tracking = await liquidationNewsTrackingApi.getByLiquidationId(liquidation.id);
        setTrackingData(tracking);
      } catch (trackingError) {
        console.warn("No se pudieron cargar los datos de trazabilidad:", trackingError);
        setTrackingData(null);
      }
      
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

  // const handleReLiquidation = async (liquidation) => {
  //   try {
  //     // Cargar detalles completos de la liquidación
  //     const details = await liquidationsApi.getById(liquidation.id);
  //     setSelectedLiquidationForReLiquidation(details.body || details.data);
  //     setReLiquidationModalOpen(true);
  //   } catch (error) {
  //     console.error("Error al cargar liquidación para re-liquidación:", error);
  //     toast.error("Error al cargar los detalles de la liquidación");
  //   }
  // };

  // const handleConfirmReLiquidation = async (reLiquidationData) => {
  //   try {
  //     console.log("🔄 Procesando re-liquidación:", reLiquidationData);
      
  //     // Aquí implementarías la lógica de re-liquidación
  //     // Por ahora, solo mostramos un mensaje de éxito
  //     toast.success(`Re-liquidación solicitada para ${reLiquidationData.selectedNewsIds.length} novedades`);
      
  //     // Recargar datos
  //     loadData();
  //   } catch (error) {
  //     console.error("Error en re-liquidación:", error);
  //     toast.error("Error al procesar la re-liquidación");
  //     throw error;
  //   }
  // };

  const handleGenerateExcel = async (liquidation) => {
    try {
      setActionLoading(true);

      // Obtener detalles de la liquidación
      const details = await liquidationsApi.getById(liquidation.id);
      const liquidationData = details.body || details.data;
      console.log("🔍 EXPORT EXCEL DASHBOARD - LIQUIDACIÓN DATA:", liquidationData);
      if (liquidationData && liquidationData.liquidation_details) {
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
          { key: 'salario_base_conceptos', width: 20 },
          { key: 'auxilio_transporte', width: 18 },
          { key: 'auxilio_movilidad', width: 18 },
          { key: 'valor_hora', width: 18 },
          { key: 'frecuencia_pago', width: 18 }
        ];

        // Agregar columnas de novedades
        const newsColumns = typeNews.map(type => ({
          key: `novedad_${type.id}`,
          width: 15
        }));

        // Agregar columnas de descuentos
        const discountColumns = [
          { key: 'salud', width: 15 },
          { key: 'pension', width: 15 },
          { key: 'ausentismo', width: 15 }
        ];

        const finalColumns = [
          ...baseColumns,
          ...newsColumns,
          ...discountColumns,
          { key: 'total_devengado', width: 20 },
          { key: 'total_deducciones', width: 20 },
          { key: 'total', width: 25 }
        ];

        worksheet.columns = finalColumns;
        
        
        const totalColumns = 10 + typeNews.length + 3 + 3; // base (10) + novedades + descuentos (3) + devengado + deducciones + total
        
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
          `Empresa: ${liquidationData.companyname || `Empresa ${liquidationData.company_id}`}`,
          `Período: ${liquidationData.period} | Fecha: ${moment().format('DD/MM/YYYY HH:mm')} | Empleados: ${liquidationData.total_employees} | Total: ${formatCurrency(liquidationData.total_net_amount)}`
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
          'SALARIO BASE + CONCEPTOS',
          'AUXILIO DE TRANSPORTE',
          'AUXILIO DE MOVILIDAD',
          'VALOR POR HORA',
          'FRECUENCIA DE PAGO',
          ...typeNews.map(type => type.code || type.name),
          'SALUD (4%)',
          'PENSIÓN (4%)',
          'AUSENTISMO',
          'TOTAL DEVENGADO',
          'TOTAL DEDUCCIONES',
          'TOTAL'
        ];
        
        columnTitles.forEach((title, index) => {
          const cell = headerRow.getCell(index + 1);
          cell.value = title;
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
        liquidationData.liquidation_details.forEach((detail, index) => {
          const row = worksheet.getRow(dataStartRow + 1 + index);
          row.height = 22;
          
          const isEven = index % 2 === 0;
          
          // Columnas base - COINCIDIR CON LIQUIDACIÓN
          row.getCell(1).value = detail.employee_document; // DOCUMENTO
          row.getCell(2).value = detail.employee_name; // NOMBRE
          row.getCell(3).value = detail.employee_position; // CARGO
          row.getCell(4).value = detail.contract_type || "No disponible"; // TIPO DE CONTRATO
          row.getCell(5).value = detail.basic_salary; // SALARIO BASE
          
          // Usar los valores guardados directamente (ya calculados correctamente en LiquidationForm)
          const salarioBase = Number(detail.basic_salary) || 0;
          
          // USAR DIRECTAMENTE EL VALOR GUARDADO - NO RECALCULAR
          // El valor base_security_social ya se guarda correctamente en LiquidationForm
          const baseSeguridadSocial = Number(detail.base_security_social) || salarioBase;
          
          const auxilioTransporteFinal = Number(detail.transportation_assistance) || 0;
          const auxilioMovilidadFinal = Number(detail.mobility_assistance) || 0;
          
          row.getCell(6).value = baseSeguridadSocial; // SALARIO BASE + CONCEPTOS
          row.getCell(7).value = auxilioTransporteFinal; // AUXILIO DE TRANSPORTE (ya calculado proporcionalmente)
          row.getCell(8).value = auxilioMovilidadFinal; // AUXILIO DE MOVILIDAD (ya calculado proporcionalmente)
          row.getCell(9).value = detail.hourly_rate || 0; // VALOR POR HORA
          row.getCell(10).value = detail.payment_method || "No disponible"; // FRECUENCIA DE PAGO

          // Agregar datos de novedades - SUMAR TODAS LAS NOVEDADES DEL MISMO TIPO
          let currentCol = 11;
          typeNews.forEach((type) => {
            // Sumar TODAS las novedades del mismo tipo, no solo la primera
            const novedadesDelTipo = detail.novedades?.filter(n => n.type_news_id === type.id) || [];
            const totalAmount = novedadesDelTipo.reduce((sum, novedad) => sum + (Number(novedad.amount) || 0), 0);
            row.getCell(currentCol).value = totalAmount;
            currentCol++;
          });

          // Usar los descuentos guardados directamente (ya calculados correctamente)
          const healthDiscount = Number(detail.health_discount) || 0;
          const pensionDiscount = Number(detail.pension_discount) || 0;
          const absenceDiscounts = Number(detail.absence_discounts) || 0;
          
          // Agregar datos de descuentos
          const saludCol = 10 + typeNews.length + 1;
          const pensionCol = 10 + typeNews.length + 2;
          const ausentismoCol = 10 + typeNews.length + 3;
          
          row.getCell(saludCol).value = healthDiscount;
          row.getCell(pensionCol).value = pensionDiscount;
          row.getCell(ausentismoCol).value = absenceDiscounts;

          // Columnas para totales
          const devengadoCol = 10 + typeNews.length + 4;
          const deduccionesCol = 10 + typeNews.length + 5;
          const totalCol = 10 + typeNews.length + 6;
          
          // USAR DIRECTAMENTE LOS VALORES GUARDADOS (ya calculados correctamente al guardar)
          // Estos valores ya fueron calculados exactamente igual que en la tabla
          // Si no están guardados (liquidaciones antiguas), calcularlos
          let totalDevengado = Number(detail.total_earnings) || 0;
          let totalDeducciones = Number(detail.total_discounts) || 0;
          let totalFinal = Number(detail.net_amount) || 0;
          
          // Fallback para liquidaciones antiguas que no tienen total_earnings
          if (!totalDevengado || !totalDeducciones) {
            // Calcular desde las novedades
            let totalNovedadesPositivas = 0;
            let totalNovedadesNegativas = 0;
            if (detail.novedades) {
              detail.novedades.forEach(novedad => {
                const amount = Number(novedad.amount) || 0;
                if (amount >= 0) totalNovedadesPositivas += amount;
                if (amount < 0) totalNovedadesNegativas += amount;
              });
            }
            const socialSecurityDiscounts = healthDiscount + pensionDiscount;
            totalDevengado = salarioBase + auxilioTransporteFinal + auxilioMovilidadFinal + totalNovedadesPositivas;
            totalDeducciones = (socialSecurityDiscounts + absenceDiscounts) + Math.abs(totalNovedadesNegativas);
            totalFinal = totalDevengado - totalDeducciones;
          }
          
          // Asignar columnas de totales
          row.getCell(devengadoCol).value = totalDevengado;
          row.getCell(deduccionesCol).value = totalDeducciones;
          row.getCell(totalCol).value = totalFinal;

          // Aplicar estilos a toda la fila COMPACTOS
          const totalCols = 10 + typeNews.length + 3 + 3; // base (10) + novedades + descuentos (3) + devengado + deducciones + total
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
            if (col >= 5 && col <= 6) { // SALARIO BASE y SALARIO BASE + CONCEPTOS
              cell.numFmt = '"$"#,##0';
            } else if (col >= 7 && col <= 8) { // AUXILIO DE TRANSPORTE y AUXILIO DE MOVILIDAD
              cell.numFmt = '"$"#,##0';
            } else if (col === 9) { // VALOR POR HORA
              cell.numFmt = '"$"#,##0';
            } else if (col >= 11 && col <= 10 + typeNews.length) { // NOVEDADES
              cell.numFmt = '"$"#,##0';
            } else if (col >= 10 + typeNews.length + 1 && col <= 10 + typeNews.length + 3) { // DESCUENTOS (SALUD, PENSIÓN, AUSENTISMO)
              cell.numFmt = '"$"#,##0';
            } else if (col === 10 + typeNews.length + 4) { // DEVENGADO
              cell.numFmt = '"$"#,##0';
            } else if (col === 10 + typeNews.length + 5) { // DEDUCCIONES
              cell.numFmt = '"$"#,##0';
            } else if (col === 10 + typeNews.length + 6) { // TOTAL
              cell.numFmt = '"$"#,##0';
            }
          }
        });

        // 5. FILA DE TOTALES COMPACTA - COINCIDIR CON LIQUIDACIÓN
        const totalRow = dataStartRow + liquidationData.liquidation_details.length + 1;
        const totalRowObj = worksheet.getRow(totalRow);
        totalRowObj.height = 25;
        
        totalRowObj.getCell(4).value = 'TOTAL GENERAL:';
        
        // Calcular totales manualmente (SIN FÓRMULAS)
        let totalSalario = 0;
        let totalTransporte = 0;
        let totalMovilidad = 0;
        let totalDevengadoGeneral = 0;
        let totalDeduccionesGeneral = 0;
        let totalNeto = 0;
        let totalSalud = 0;
        let totalPension = 0;
        let totalAusentismo = 0;
        
        liquidationData.liquidation_details.forEach(detail => {
          totalSalario += detail.basic_salary || 0;
          
          // Usar los valores guardados que ya están calculados proporcionalmente
          const auxilioTransporteFinal = Number(detail.transportation_assistance) || 0;
          const auxilioMovilidadFinal = Number(detail.mobility_assistance) || 0;
          
          totalTransporte += auxilioTransporteFinal;
          totalMovilidad += auxilioMovilidadFinal;
          
          // Usar los valores guardados directamente (ya calculados correctamente)
          const salarioBase = Number(detail.basic_salary) || 0;
          const auxilioTransporte = Number(detail.transportation_assistance) || 0;
          const auxilioMovilidad = Number(detail.mobility_assistance) || 0;
          const healthDiscount = Number(detail.health_discount) || 0;
          const pensionDiscount = Number(detail.pension_discount) || 0;
          const absenceDiscounts = Number(detail.absence_discounts) || 0;
          
          // Acumular descuentos (usar valores guardados)
          totalSalud += healthDiscount;
          totalPension += pensionDiscount;
          totalAusentismo += absenceDiscounts;
          
          // Calcular total de novedades positivas y negativas
          let totalNovedadesPositivas = 0;
          let totalNovedadesNegativas = 0;
          if (detail.novedades) {
            detail.novedades.forEach(novedad => {
              const amount = Number(novedad.amount) || 0;
              if (amount >= 0) totalNovedadesPositivas += amount;
              if (amount < 0) totalNovedadesNegativas += amount;
            });
          }
          
          // Calcular descuentos de seguridad social
          const socialSecurityDiscounts = healthDiscount + pensionDiscount;
          
          // Totales: Devengado, Deducciones y Neto (EXACTAMENTE IGUAL QUE EN LA TABLA DEL DASHBOARD)
          // En la tabla se calcula: totalDevengado = salarioBase + auxilioTransporte + auxilioMovilidad + totalNovedadesPositivas
          // Y totalDeducciones = (socialSecurityDiscounts + absenceDiscounts) + Math.abs(totalNovedadesNegativas)
          // Y totalFinal = totalDevengado - totalDeducciones (SIEMPRE CALCULADO, NO USAR detail.net_amount)
          const totalDevengado = salarioBase + auxilioTransporte + auxilioMovilidad + totalNovedadesPositivas;
          const totalDeducciones = (socialSecurityDiscounts + absenceDiscounts) + Math.abs(totalNovedadesNegativas);
          const totalFinal = totalDevengado - totalDeducciones;
          
          totalDevengadoGeneral += totalDevengado;
          totalDeduccionesGeneral += totalDeducciones;
          totalNeto += totalFinal;
        });
        
        totalRowObj.getCell(5).value = totalSalario; // SALARIO BASE
        
        // Calcular total Salario Base + Conceptos (suma de todas las bases de seguridad social guardadas)
        let totalBaseConceptos = 0;
        liquidationData.liquidation_details.forEach(detail => {
          // USAR DIRECTAMENTE EL VALOR GUARDADO - NO RECALCULAR
          const baseSegSocial = Number(detail.base_security_social) || Number(detail.basic_salary) || 0;
          totalBaseConceptos += baseSegSocial;
        });
        totalRowObj.getCell(6).value = totalBaseConceptos; // SALARIO BASE + CONCEPTOS
        
        totalRowObj.getCell(7).value = totalTransporte; // AUXILIO DE TRANSPORTE
        totalRowObj.getCell(8).value = totalMovilidad; // AUXILIO DE MOVILIDAD
        // Columnas 9 y 10 (VALOR POR HORA y FRECUENCIA DE PAGO) no tienen totales
        
        // Totales de novedades (SIN FÓRMULAS) - SUMAR TODAS LAS NOVEDADES DEL MISMO TIPO
        let currentCol = 11;
        typeNews.forEach((type) => {
          let totalNovedad = 0;
          liquidationData.liquidation_details.forEach(detail => {
            // Sumar TODAS las novedades del mismo tipo, no solo la primera
            const novedadesDelTipo = detail.novedades?.filter(n => n.type_news_id === type.id) || [];
          totalNovedad += novedadesDelTipo.reduce((sum, novedad) => sum + (Number(novedad.amount) || 0), 0);
          });
          totalRowObj.getCell(currentCol).value = totalNovedad;
          currentCol++;
        });
        
        // Totales de descuentos (SIN FÓRMULAS)
        const saludColTotal = 10 + typeNews.length + 1;
        const pensionColTotal = 10 + typeNews.length + 2;
        const ausentismoColTotal = 10 + typeNews.length + 3;
        totalRowObj.getCell(saludColTotal).value = totalSalud;
        totalRowObj.getCell(pensionColTotal).value = totalPension;
        totalRowObj.getCell(ausentismoColTotal).value = totalAusentismo;
        
        // Totales Devengado, Deducciones y Neto (SIN FÓRMULAS)
        const devengadoCol = 10 + typeNews.length + 4;
        const deduccionesCol = 10 + typeNews.length + 5;
        const totalCol = 10 + typeNews.length + 6;
        totalRowObj.getCell(devengadoCol).value = totalDevengadoGeneral;
        totalRowObj.getCell(deduccionesCol).value = totalDeduccionesGeneral;
        totalRowObj.getCell(totalCol).value = totalNeto;

        // Estilo de la fila de totales COMPACTA
        const totalCols = 10 + typeNews.length + 3 + 3; // base (10) + novedades + descuentos (3) + devengado + deducciones + total
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
          if (col >= 5 && col <= 6) { // SALARIO BASE y SALARIO BASE + CONCEPTOS
            cell.numFmt = '"$"#,##0';
          } else if (col >= 7 && col <= 8) { // AUXILIO DE TRANSPORTE y AUXILIO DE MOVILIDAD
            cell.numFmt = '"$"#,##0';
          } else if (col === 9) { // VALOR POR HORA
            cell.numFmt = '"$"#,##0';
          } else if (col >= 11 && col <= 10 + typeNews.length) { // NOVEDADES
            cell.numFmt = '"$"#,##0';
          } else if (col >= 10 + typeNews.length + 1 && col <= 10 + typeNews.length + 3) { // DESCUENTOS (SALUD, PENSIÓN, AUSENTISMO)
            cell.numFmt = '"$"#,##0';
          } else if (col === 10 + typeNews.length + 4) { // DEVENGADO
            cell.numFmt = '"$"#,##0';
          } else if (col === 10 + typeNews.length + 5) { // DEDUCCIONES
            cell.numFmt = '"$"#,##0';
          } else if (col === 10 + typeNews.length + 6) { // TOTAL
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
  // const canReLiquidation = (liquidation) => liquidation.status === "approved";

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
                  <div className="d-flex gap-2">
                    <Button
                      color="primary"
                      onClick={() => router.push("/admin/liquidacion")}
                    >
                      Nueva Liquidación
                    </Button>
                    {/* <Button
                      color="info"
                      onClick={() => router.push("/admin/reporte_novedades")}
                    >
                      <i className="fa fa-chart-bar me-2"></i>
                      Reporte Novedades
                    </Button> */}
                  </div>
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
                          <td>
                            {liquidation.start_date && liquidation.end_date 
                              ? `${moment(liquidation.start_date).format('DD/MM')} - ${moment(liquidation.end_date).format('DD/MM/YYYY')}`
                              : liquidation.period
                            }
                          </td>
                          <td>
                            {liquidation.payment_frequency || 'Mensual'}
                            {liquidation.cut_number && ` (Corte ${liquidation.cut_number})`}
                          </td>
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
                              {/* {canReLiquidation(liquidation) && (
                                <Button
                                  size="sm"
                                  color="warning"
                                  onClick={() => handleReLiquidation(liquidation)}
                                  disabled={actionLoading}
                                  className="px-3"
                                >
                                  Re-liquidar
                                </Button>
                              )} */}
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
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} size="xl" style={{ maxWidth: '95%' }}>
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
                    {selectedLiquidation.start_date && selectedLiquidation.end_date 
                      ? `${moment(selectedLiquidation.start_date).format('DD/MM')} - ${moment(selectedLiquidation.end_date).format('DD/MM/YYYY')}`
                      : selectedLiquidation.period
                    }
                    <br />
                    <small className="text-muted">
                      {selectedLiquidation.payment_frequency || 'Mensual'}
                      {selectedLiquidation.cut_number && ` (Corte ${selectedLiquidation.cut_number})`}
                    </small>
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
                              Auxilio Movilidad
                            </th>
                            <th style={{ fontSize: "1rem", padding: "0.5rem" }}>
                              Total Novedades
                            </th>
                            <th style={{ fontSize: "1rem", padding: "0.5rem" }}>
                              Total Devengado
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
                                  {formatCurrency(
                                    Number(detail.mobility_assistance) || 0
                                  )}
                                </td>
                                <td
                                  style={{
                                    fontSize: "1rem",
                                    padding: "0.5rem",
                                  }}
                                >
                                  {(() => {
                                    // CALCULAR TOTAL NOVEDADES EXACTAMENTE IGUAL QUE EN LIQUIDACIÓN PRINCIPAL
                                    let totalNovedades = 0;
                                    if (detail.novedades) {
                                      detail.novedades.forEach(novedad => {
                                        totalNovedades += Number(novedad.amount) || 0;
                                      });
                                    }
                                    return formatCurrency(totalNovedades);
                                  })()}
                                </td>
                                <td
                                  style={{
                                    fontSize: "1rem",
                                    padding: "0.5rem",
                                  }}
                                >
                                  {(() => {
                                    // DEVENGADO = SALARIO + TRANSPORTE + AUXILIO MOVILIDAD + NOVEDADES POSITIVAS
                                    const salarioBase = Number(detail.basic_salary) || 0;
                                    const auxilioTransporte = Number(detail.transportation_assistance) || 0;
                                    const auxilioMovilidad = Number(detail.mobility_assistance) || 0;
                                    let novedadesPositivas = 0;
                                    if (detail.novedades) {
                                      detail.novedades.forEach(novedad => {
                                        const amount = Number(novedad.amount) || 0;
                                        if (amount >= 0) novedadesPositivas += amount;
                                      });
                                    }
                                    const devengado = salarioBase + auxilioTransporte + auxilioMovilidad + novedadesPositivas;
                                    return formatCurrency(devengado);
                                  })()}
                                </td>
                                <td
                                  style={{
                                    fontSize: "1rem",
                                    padding: "0.5rem",
                                  }}
                                >
                                  {(() => {
                                    // CALCULAR DESCUENTOS EXACTAMENTE IGUAL QUE EN LIQUIDACIÓN PRINCIPAL
                                    const healthDiscount = Number(detail.health_discount) || 0;
                                    const pensionDiscount = Number(detail.pension_discount) || 0;
                                    const absenceDiscounts = Number(detail.absence_discounts) || 0;
                                    const totalDescuentos = healthDiscount + pensionDiscount + absenceDiscounts;
                                    return formatCurrency(totalDescuentos);
                                  })()}
                                </td>
                                <td
                                  style={{
                                    fontSize: "1rem",
                                    padding: "0.5rem",
                                  }}
                                >
                                  <strong>
                                    {(() => {
                                      // CALCULAR NETO EXACTAMENTE IGUAL QUE EN LIQUIDACIÓN PRINCIPAL
                                      // detail.basic_salary ahora es el salario mensual completo (como se muestra en la tabla)
                                      // Pero para calcular el devengado, necesitamos el salario proporcional
                                      // Usar base_security_social para inferir el salario proporcional, o calcular desde las novedades
                                      const salarioBaseMensual = Number(detail.basic_salary) || 0;
                                      
                                      // Calcular salario proporcional desde base_security_social
                                      // base_security_social = salario_proporcional + conceptos
                                      // Si no hay conceptos adicionales, base_security_social ≈ salario_proporcional
                                      // Para simplificar, usar el salario mensual completo (ya que las novedades se suman por separado)
                                      const salarioBaseParaDevengado = salarioBaseMensual;
                                      
                                      const auxilioTransporte = Number(detail.transportation_assistance) || 0;
                                      const auxilioMovilidad = Number(detail.mobility_assistance) || 0;
                                      
                                      // Calcular total de novedades
                                      let totalNovedades = 0;
                                      let totalNovedadesPositivas = 0;
                                      let totalNovedadesNegativas = 0;
                                      if (detail.novedades) {
                                        detail.novedades.forEach(novedad => {
                                          const amount = Number(novedad.amount) || 0;
                                          totalNovedades += amount;
                                          if (amount >= 0) totalNovedadesPositivas += amount;
                                          if (amount < 0) totalNovedadesNegativas += amount;
                                        });
                                      }
                                      
                                      // Calcular descuentos de seguridad social
                                      const healthDiscount = Number(detail.health_discount) || 0;
                                      const pensionDiscount = Number(detail.pension_discount) || 0;
                                      const socialSecurityDiscounts = healthDiscount + pensionDiscount;
                                      
                                      // Calcular descuentos por ausentismo
                                      const absenceDiscounts = Number(detail.absence_discounts) || 0;
                                      
                                      // Total final: Salario Base + Auxilio Transporte + Auxilio Movilidad + Novedades Positivas - (Descuentos + Novedades Negativas)
                                      // NOTA: El salario base aquí debe ser el proporcional, pero como las novedades ya incluyen los ajustes,
                                      // usamos el salario mensual completo y las novedades se encargan del ajuste
                                      const totalDevengado = salarioBaseParaDevengado + auxilioTransporte + auxilioMovilidad + totalNovedadesPositivas;
                                      const totalDeducciones = (socialSecurityDiscounts + absenceDiscounts) + Math.abs(totalNovedadesNegativas);
                                      const totalFinal = totalDevengado - totalDeducciones;
                                      
                                      return formatCurrency(totalFinal);
                                    })()}
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

              {/* Sección de Trazabilidad */}
              {trackingData && trackingData.length > 0 && (
                <div className="mt-4">
                  <h5>Trazabilidad de Novedades</h5>
                  <div className="table-responsive">
                    <Table size="sm" className="mb-0">
                      <thead>
                        <tr>
                          <th style={{ fontSize: "0.9rem", padding: "0.4rem" }}>
                            Empleado
                          </th>
                          <th style={{ fontSize: "0.9rem", padding: "0.4rem" }}>
                            Tipo de Novedad
                          </th>
                          <th style={{ fontSize: "0.9rem", padding: "0.4rem" }}>
                            Período
                          </th>
                          <th style={{ fontSize: "0.9rem", padding: "0.4rem" }}>
                            Estado
                          </th>
                          <th style={{ fontSize: "0.9rem", padding: "0.4rem" }}>
                            Fecha Inclusión
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {trackingData.map((track) => (
                          <tr key={track.id}>
                            <td style={{ fontSize: "0.9rem", padding: "0.4rem" }}>
                              {track.employee_name} ({track.employee_document})
                            </td>
                            <td style={{ fontSize: "0.9rem", padding: "0.4rem" }}>
                              {track.type_news_name}
                            </td>
                            <td style={{ fontSize: "0.9rem", padding: "0.4rem" }}>
                              {moment(track.startDate).format('DD/MM/YYYY')} - {moment(track.endDate).format('DD/MM/YYYY')}
                            </td>
                            <td style={{ fontSize: "0.9rem", padding: "0.4rem" }}>
                              <Badge color={track.status === 'included' ? 'success' : 'warning'}>
                                {track.status === 'included' ? 'Incluida' : track.status}
                              </Badge>
                            </td>
                            <td style={{ fontSize: "0.9rem", padding: "0.4rem" }}>
                              {moment(track.created_at).format('DD/MM/YYYY HH:mm')}
                            </td>
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

      {/* Modal de Re-liquidación - COMENTADO TEMPORALMENTE */}
      {/* <ReLiquidationModal
        isOpen={reLiquidationModalOpen}
        toggle={() => setReLiquidationModalOpen(false)}
        liquidation={selectedLiquidationForReLiquidation}
        onConfirm={handleConfirmReLiquidation}
      /> */}
    </>
  );
};

export default LiquidationsDashboard;
