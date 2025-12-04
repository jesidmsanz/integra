import Breadcrumbs from "@/utils/CommonComponent/Breadcrumb";
import SVG from "@/utils/CommonComponent/SVG/Svg";
import {
  companiesApi,
  employeesApi,
  newsApi,
  employeeNewsApi,
  typeNewsApi,
  liquidationsApi,
} from "@/utils/api";
import Link from "next/link";
import { createRef, useEffect, useState } from "react";
import DataTable, { defaultThemes } from "react-data-table-component";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import {
  FormGroup,
  Input,
  Label,
  Col,
  Row,
  Container,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  Table,
  Button,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import AddNews from "./AddNews";
import PeriodValidator from "../PeriodValidator";
import moment from "moment";
import { 
  getHorasBaseMensuales, 
  getNormativaVigente, 
  calcularValorHora 
} from "@/utils/helpers/normativasHelper";
import normativasApi from "@/utils/api/normativasApi";

const initialState = {
  companyId: null,
  startDate: (() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    return `${year}-${String(month).padStart(2, '0')}-01`;
  })(),
  endDate: (() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const lastDay = new Date(year, month, 0).getDate();
    return `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  })(),
  paymentMethod: "Mensual", // Mensual por defecto
  corte1: true, // Corte 1 seleccionado por defecto
  corte2: false,
};

const LiquidationForm = () => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [employeeNews, setEmployeeNews] = useState([]);
  const [filteredEmployeeNews, setFilteredEmployeeNews] = useState([]);
  const [typeNews, setTypeNews] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [show, setShow] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [calculatedValues, setCalculatedValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [periodValidation, setPeriodValidation] = useState({ isValid: true, conflictingPeriods: [] });
  const [showMobilityModal, setShowMobilityModal] = useState(false);
  const [selectedEmployeeForMobility, setSelectedEmployeeForMobility] = useState(null);
  const [mobilityValue, setMobilityValue] = useState("");
  const [horasBaseMensuales, setHorasBaseMensuales] = useState(220); // Valor por defecto
  const [normativasCache, setNormativasCache] = useState({}); // Cache de normativas por ID

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Función helper para calcular base de seguridad social con auxilio de movilidad
  const calculateBaseSeguridadSocial = (salarioBaseCalculado, valorPrestacionales, auxilioMovilidad, salarioBaseCompleto = null) => {
    // Si el salario base es 0 (fue reemplazado por una novedad), no sumar el auxilio de movilidad
    if (salarioBaseCalculado === 0) {
      return valorPrestacionales;
    }
    
    // Usar el salario base completo para calcular el 40% (si está disponible), 
    // de lo contrario usar el salario base calculado (proporcional)
    const salarioParaComparar = salarioBaseCompleto !== null ? salarioBaseCompleto : salarioBaseCalculado;
    const cuarentaPorcientoSalario = salarioParaComparar * 0.4;
    const auxilioExcede40Porciento = auxilioMovilidad > cuarentaPorcientoSalario;
    
    // Si excede el 40%, se suma TODO el auxilio de movilidad a la base de seguridad social
    const valorPrestacionalesConMovilidad = auxilioExcede40Porciento 
      ? valorPrestacionales + auxilioMovilidad 
      : valorPrestacionales;
    
    return salarioBaseCalculado + valorPrestacionalesConMovilidad;
  };

  // Función para validar y ajustar fechas según el corte seleccionado
  const validateAndAdjustDates = (startDate, endDate, corte1, corte2) => {
    if (!startDate || !endDate) return { startDate, endDate };
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const startDay = start.getDate();
    const endDay = end.getDate();
    const startMonth = start.getMonth();
    const startYear = start.getFullYear();
    const endMonth = end.getMonth();
    const endYear = end.getFullYear();
    
    // Si es corte 1 (1-15), ajustar fechas si es necesario
    if (corte1 && !corte2) {
      if (startDay > 15) {
        // Si la fecha de inicio está después del día 15, ajustar al día 1
        start.setDate(1);
      }
      if (endDay > 15) {
        // Si la fecha de fin está después del día 15, ajustar al día 15
        end.setDate(15);
      }
    }
    
    // Si es corte 2 (16-30), ajustar fechas si es necesario
    if (corte2 && !corte1) {
      // Asegurar que ambas fechas estén en el mismo mes
      if (startMonth !== endMonth || startYear !== endYear) {
        // Si las fechas están en meses diferentes, usar el mes de la fecha de inicio
        end.setFullYear(startYear);
        end.setMonth(startMonth);
      }
      
      if (startDay < 16) {
        // Si la fecha de inicio está antes del día 16, ajustar al día 16
        start.setDate(16);
      }
      if (endDay < 16) {
        // Si la fecha de fin está antes del día 16, ajustar al día 16
        end.setDate(16);
      }
      
      // Asegurar que no exceda el último día del mes
      const lastDayOfMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
      if (endDay > lastDayOfMonth) {
        end.setDate(lastDayOfMonth);
      }
      
      // Asegurar que la fecha de fin no sea anterior a la fecha de inicio
      if (end < start) {
        end.setTime(start.getTime());
      }
    }
    
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    };
  };

  // Función para obtener el rango de fechas válido según el corte
  const getValidDateRange = (corte1, corte2, year, month) => {
    if (corte1 && !corte2) {
      return {
        min: `${year}-${String(month).padStart(2, '0')}-01`,
        max: `${year}-${String(month).padStart(2, '0')}-15`
      };
    } else if (corte2 && !corte1) {
      const lastDayOfMonth = new Date(year, month, 0).getDate();
      return {
        min: `${year}-${String(month).padStart(2, '0')}-16`,
        max: `${year}-${String(month).padStart(2, '0')}-${String(lastDayOfMonth).padStart(2, '0')}`
      };
    }
    return null;
  };

  // Función para validar fechas antes de guardar
  const validateDates = (startDate, endDate, paymentMethod, corte1, corte2) => {
    if (!startDate || !endDate) return { isValid: false, message: "Debe seleccionar fecha de inicio y fin" };
    
    // Usar UTC para evitar problemas de zona horaria
    const start = new Date(startDate + 'T00:00:00.000Z');
    const end = new Date(endDate + 'T00:00:00.000Z');
    const startYear = start.getUTCFullYear();
    const startMonth = start.getUTCMonth();
    const startDay = start.getUTCDate();
    const endYear = end.getUTCFullYear();
    const endMonth = end.getUTCMonth();
    const endDay = end.getUTCDate();
    
    // Verificar que estén en el mismo mes
    if (startYear !== endYear || startMonth !== endMonth) {
      return { isValid: false, message: "Seleccione el período correcto - las fechas deben estar en el mismo mes" };
    }
    
    if (paymentMethod === "Mensual") {
      // Mensual: debe ser del 1 al último día del mes
      const lastDayOfMonth = new Date(startYear, startMonth + 1, 0).getUTCDate();
      if (startDay < 1 || startDay > lastDayOfMonth || endDay < 1 || endDay > lastDayOfMonth) {
        return { isValid: false, message: "Período de liquidación: 1 al " + lastDayOfMonth + " del mismo mes" };
      }
    } else if (paymentMethod === "Quincenal") {
      if (corte1 && !corte2) {
        // Corte 1: del 1 al 15
        if (startDay < 1 || startDay > 15 || endDay < 1 || endDay > 15) {
          return { isValid: false, message: "Período de liquidación: 1 al 15 del mismo mes" };
        }
      } else if (corte2 && !corte1) {
        // Corte 2: del 16 al 30 (o último día si es menor a 30)
        const lastDayOfMonth = new Date(startYear, startMonth + 1, 0).getUTCDate();
        const maxDay = Math.min(30, lastDayOfMonth);
        console.log("🔍 Debug Corte 2:", { startDay, endDay, maxDay, lastDayOfMonth, startDate, endDate });
        if (startDay < 16 || startDay > maxDay || endDay < 16 || endDay > maxDay) {
          console.log("❌ Validación falló:", { startDay, endDay, maxDay });
          return { isValid: false, message: "Período de liquidación: 16 al " + maxDay + " del mismo mes" };
        }
      } else {
        return { isValid: false, message: "Debe seleccionar un corte (1-15 o 16-30)" };
      }
    }
    
    return { isValid: true, message: "" };
  };

  // Función para calcular el auxilio de transporte según el método de pago
  const calculateTransportationAssistance = (employee, paymentMethod) => {
    const auxilioBase = Number(employee.transportationassistance) || 0;

    if (!auxilioBase) return 0;

    const metodoPagoEfectivo = paymentMethod || employee.paymentmethod;

    // LÓGICA SIMPLE: Valor del día × días del período
    if (metodoPagoEfectivo === "Quincenal") {
      return auxilioBase * 15; // 15 días
    } else {
      return auxilioBase * 30; // 30 días (mensual o por defecto)
    }
  };

  // Función para determinar si se deben aplicar descuentos de salud y pensión
  const shouldApplyHealthPensionDiscounts = (paymentMethod, isSecondCut) => {
    // Para períodos mensuales: siempre aplicar descuentos
    if (paymentMethod === "Mensual" || !paymentMethod) {
      return true;
    }
    
    // Para períodos quincenales: solo aplicar en el segundo corte (16-30)
    if (paymentMethod === "Quincenal") {
      return isSecondCut; // Solo en el segundo corte
    }
    
    return true; // Por defecto aplicar descuentos
  };

  let formRef = createRef();

  const customStyles = {
    header: {
      style: {
        minHeight: "40px",
      },
    },
    headRow: {
      style: {
        borderTopStyle: "solid",
        borderTopWidth: "1px",
        borderTopColor: defaultThemes.default.divider.default,
      },
    },
    headCells: {
      style: {
        "&:not(:last-of-type)": {
          borderRightStyle: "solid",
          borderRightWidth: "1px",
          borderRightColor: defaultThemes.default.divider.default,
        },
        fontWeight: "bold",
        fontSize: "14px",
        backgroundColor: "#f4f4f4",
        textAlign: "center",
        padding: "8px",
        whiteSpace: "normal",
        wordWrap: "break-word",
      },
    },
    cells: {
      style: {
        "&:not(:last-of-type)": {
          borderRightStyle: "solid",
          borderRightWidth: "1px",
          borderRightColor: defaultThemes.default.divider.default,
        },
        whiteSpace: "normal",
        wordWrap: "break-word",
        padding: "8px",
      },
    },
    rows: {
      style: {
        minHeight: "72px",
        "&:nth-of-type(odd)": {
          backgroundColor: "#f9f9f9",
        },
      },
    },
  };

  const conditionalRowStyles = [
    {
      when: (row) => row.hasNews && row.hasLiquidatedNews,
      style: {
        backgroundColor: "rgba(255, 0, 0, 0.1)", // Rojo para novedades ya liquidadas
        "&:hover": {
          backgroundColor: "rgba(255, 0, 0, 0.2) !important",
        },
      },
    },
    {
      when: (row) => row.hasNews && !row.hasLiquidatedNews,
      style: {
        backgroundColor: "rgba(255, 165, 0, 0.1)", // Naranja para novedades pendientes
        "&:hover": {
          backgroundColor: "rgba(255, 165, 0, 0.2) !important",
        },
      },
    },
    {
      when: (row) => !row.hasNews,
      style: {
        backgroundColor: "rgba(0, 255, 0, 0.1)", // Verde para sin novedades
        "&:hover": {
          backgroundColor: "rgba(0, 255, 0, 0.2) !important",
        },
      },
    },
  ];

  const columns = [
    {
      name: "Documento",
      selector: (row) => `${row.documenttype} ${row.documentnumber}`,
      sortable: true,
      width: "150px",
    },
    {
      name: "Nombre",
      selector: (row) => row.fullname,
      sortable: true,
      width: "150px",
    },
    {
      name: "Cargo",
      selector: (row) => row.position || "No disponible",
      sortable: true,
      width: "150px",
    },
    {
      name: "Tipo de Contrato",
      selector: (row) => row.contracttype || "No disponible",
      sortable: true,
      width: "150px",
    },
    {
      name: "Salario Base",
      selector: (row) => formatCurrency(row.basicmonthlysalary),
      sortable: true,
      width: "150px",
    },
    {
      name: "Salario Base + Conceptos",
      cell: (row) => {
        const salarioBase = Number(row.basicmonthlysalary) || 0;
        const salarioBaseCalculado = form.paymentMethod === "Quincenal" ? salarioBase / 2 : salarioBase;
        
        // Verificar si alguna novedad reemplaza el salario base
        let reemplazaSalarioBase = false;
        let valorPrestacionales = 0;
        let diasAfectadosSalarioBase = 0; // Días totales que afectan el salario base
        const employeeNews = filteredEmployeeNews.filter(news => news.employeeId === row.id);
        
        employeeNews.forEach((news) => {
          const tipoNovedad = typeNews.find(type => type.id === news.typeNewsId);
          if (tipoNovedad) {
            const esDescuento = tipoNovedad.isDiscount === true || tipoNovedad.isDiscount === "true";
            let affectsData = {};
            
            if (tipoNovedad.affects) {
              try {
                affectsData = typeof tipoNovedad.affects === "string" 
                  ? JSON.parse(tipoNovedad.affects) 
                  : tipoNovedad.affects || {};
              } catch (error) {
                affectsData = {};
              }
            }
            
            // Si la novedad afecta salario base, reemplaza el salario base completo
            // Y automáticamente afecta auxilio de transporte y movilidad (el empleado no trabajó)
            if (affectsData.baseSalary === true || affectsData.baseSalary === "true") {
              reemplazaSalarioBase = true;
              // Calcular días desde las fechas
              const fechaInicio = moment.utc(news.startDate);
              const fechaFin = moment.utc(news.endDate);
              const diasNovedad = fechaFin.diff(fechaInicio, "days") + 1;
              diasAfectadosSalarioBase += diasNovedad; // Acumular días afectados
              
              const salarioDiario = salarioBaseCalculado / (form.paymentMethod === "Quincenal" ? 15 : 30);
              const salarioPorDias = salarioDiario * diasNovedad;
              
              const tieneCantidad = tipoNovedad.amount && parseFloat(tipoNovedad.amount) > 0;
              const tienePorcentaje = tipoNovedad.percentage && parseFloat(tipoNovedad.percentage) > 0;
              
              let valorSalario = 0;
              if (tieneCantidad) {
                valorSalario = parseFloat(tipoNovedad.amount);
              } else if (tienePorcentaje) {
                const porcentaje = parseFloat(tipoNovedad.percentage) || 100;
                valorSalario = salarioPorDias * (porcentaje / 100);
              }
              
              valorPrestacionales += valorSalario;
              
              // Si afecta salario base, automáticamente afecta auxilio de transporte y movilidad
              // porque el empleado no trabajó esos días (no se acumulan aquí, se hace en calculateAllValues)
            }
            
            // Si es prestacionales y no es calculada por hora
            if (tipoNovedad.affects && !tipoNovedad.calculateperhour) {
              if (affectsData.prestacionales === true || affectsData.prestacionales === "true") {
                // Solo procesar si NO es baseSalary (ya se procesó arriba)
                if (!(affectsData.baseSalary === true || affectsData.baseSalary === "true")) {
                  // Calcular días desde las fechas
                  const fechaInicio = moment.utc(news.startDate);
                  const fechaFin = moment.utc(news.endDate);
                  const diasNovedad = fechaFin.diff(fechaInicio, "days") + 1;
                  const salarioDiario = salarioBaseCalculado / (form.paymentMethod === "Quincenal" ? 15 : 30);
                  const salarioPorDias = salarioDiario * diasNovedad;
                  
                  const tieneCantidad = tipoNovedad.amount && parseFloat(tipoNovedad.amount) > 0;
                  const tienePorcentaje = tipoNovedad.percentage && parseFloat(tipoNovedad.percentage) > 0;
                  
                  let valorSalario = 0;
                  if (tieneCantidad) {
                    valorSalario = parseFloat(tipoNovedad.amount);
                  } else if (tienePorcentaje) {
                    const porcentaje = parseFloat(tipoNovedad.percentage) || 100;
                    valorSalario = salarioPorDias * (porcentaje / 100);
                  }
                  
                  if (esDescuento) {
                    valorPrestacionales -= valorSalario;
                  } else {
                    valorPrestacionales += valorSalario;
                  }
                }
              }
            } else if (tipoNovedad.calculateperhour) {
              // Si es calculada por hora y afecta prestacionales
              if (affectsData.prestacionales === true || affectsData.prestacionales === "true") {
                const { valorNovedad } = calculateNovedadValue(news, row, tipoNovedad);
                if (esDescuento) {
                  valorPrestacionales -= valorNovedad;
                } else {
                  valorPrestacionales += valorNovedad;
                }
              }
            }
          }
        });
        
        // Calcular salario base proporcional por días trabajados
        let salarioBaseProporcional = 0;
        if (reemplazaSalarioBase) {
          // Si hay novedades que afectan el salario base, calcular proporcional
          const diasPeriodo = form.paymentMethod === "Quincenal" ? 15 : 30;
          const diasTrabajadosSalario = diasPeriodo - diasAfectadosSalarioBase;
          
          if (diasTrabajadosSalario > 0) {
            const salarioDiario = salarioBaseCalculado / diasPeriodo;
            salarioBaseProporcional = salarioDiario * diasTrabajadosSalario;
          }
        } else {
          // Si no hay novedades que afecten el salario base, usar el salario base completo
          salarioBaseProporcional = salarioBaseCalculado;
        }
        
        const employeeValues = calculatedValues[row.id] || {};
        // Usar el auxilio de movilidad calculado (ya incluye el cálculo proporcional)
        let auxilioMovilidad = employeeValues.mobility_assistance_final !== undefined 
          ? employeeValues.mobility_assistance_final 
          : 0;
        
        // Calcular base de seguridad social: salario base proporcional + valor prestacionales + auxilio movilidad (si excede 40%)
        // El salario base proporcional ya incluye solo los días trabajados
        // El auxilio de movilidad ya está calculado proporcionalmente en calculateAllValues
        // Pasar el salario base completo para calcular correctamente el 40%
        const baseSeguridadSocial = calculateBaseSeguridadSocial(
          salarioBaseProporcional, 
          valorPrestacionales, 
          auxilioMovilidad,
          salarioBaseCalculado // Pasar el salario base completo para comparar el 40%
        );
        
        // Debug temporal
        if (row.id === 1042439932 || row.documentnumber === "1042439932") {
          console.log("🔍 Debug Salario Base + Conceptos:", {
            empleado: row.fullname,
            salarioBase: salarioBase,
            salarioBaseCalculado: salarioBaseCalculado,
            reemplazaSalarioBase: reemplazaSalarioBase,
            diasAfectadosSalarioBase: diasAfectadosSalarioBase,
            salarioBaseProporcional: salarioBaseProporcional,
            valorPrestacionales: valorPrestacionales,
            auxilioMovilidad: auxilioMovilidad,
            baseSeguridadSocial: baseSeguridadSocial,
            novedades: employeeNews.map(n => ({
              id: n.id,
              tipo: typeNews.find(t => t.id === n.typeNewsId)?.name,
              startDate: n.startDate,
              endDate: n.endDate,
              affects: typeNews.find(t => t.id === n.typeNewsId)?.affects
            }))
          });
        }
        
        return formatCurrency(baseSeguridadSocial);
      },
      sortable: true,
      width: "200px",
    },
    {
      name: "Auxilio de Transporte",
      cell: (row) => {
        const employeeValues = calculatedValues[row.id] || {};
        const auxilioCalculado = calculateTransportationAssistance(
          row,
          form.paymentMethod
        );
        const descuento = employeeValues.transportation_assistance_discount || 0;
        const auxilioFinal = employeeValues.transportation_assistance_final !== undefined 
          ? employeeValues.transportation_assistance_final 
          : auxilioCalculado;
        
        if (auxilioFinal <= 0) {
          return "No aplica";
        }
        
        if (descuento > 0) {
          return (
            <div>
              <div>{formatCurrency(auxilioFinal)}</div>
              <small className="text-danger">(-{formatCurrency(descuento)})</small>
            </div>
          );
        }
        
        return formatCurrency(auxilioFinal);
      },
      sortable: true,
      width: "150px",
    },
    {
      name: "Auxilio de Movilidad",
      cell: (row) => {
        const employeeValues = calculatedValues[row.id] || {};
        const auxilio = employeeValues.mobility_assistance_final !== undefined 
          ? employeeValues.mobility_assistance_final 
          : 0;
        
        return (
          <span
            style={{ cursor: "pointer", color: "#007bff", textDecoration: "underline" }}
            onClick={() => {
              setSelectedEmployeeForMobility(row);
              setMobilityValue(auxilio.toString());
              setShowMobilityModal(true);
            }}
          >
            {auxilio > 0 ? formatCurrency(auxilio) : "No aplica"}
          </span>
        );
      },
      sortable: true,
      width: "150px",
    },
    {
      name: "Salud (4%)",
      cell: (row) => {
        // Usar los valores ya calculados de calculatedValues para ser consistente
        const employeeValues = calculatedValues[row.id] || {};
        const descuentoSalud = employeeValues.health_discount || 0;
        
        // Determinar si es el segundo corte para quincenales
        const isSecondCut = form.paymentMethod === "Quincenal" && form.corte2 && !form.corte1;
        
        // Aplicar lógica de descuentos
        const shouldApply = shouldApplyHealthPensionDiscounts(form.paymentMethod, isSecondCut);
        
        return shouldApply ? formatCurrency(descuentoSalud) : "No aplica este corte";
      },
      sortable: true,
      width: "150px",
    },
    {
      name: "Pensión (4%)",
      cell: (row) => {
        // Usar los valores ya calculados de calculatedValues para ser consistente con Salud (4%)
        const employeeValues = calculatedValues[row.id] || {};
        const descuentoPension = employeeValues.pension_discount || 0;
        
        // Determinar si es el segundo corte para quincenales
        const isSecondCut = form.paymentMethod === "Quincenal" && form.corte2 && !form.corte1;
        
        // Aplicar lógica de descuentos
        const shouldApply = shouldApplyHealthPensionDiscounts(form.paymentMethod, isSecondCut);
        
        return shouldApply ? formatCurrency(descuentoPension) : "No aplica este corte";
      },
      sortable: true,
      width: "150px",
    },
    {
      name: "Valor por hora",
      selector: (row) => formatCurrency(row.hourlyrate),
      sortable: true,
      width: "150px",
    },
    {
      name: "Frecuencia de pago",
      selector: (row) => row.paymentmethod || "No disponible",
      sortable: true,
      width: "150px",
    },
    ...typeNews.map((type) => ({
      name: type.code,
      cell: (row) => {
        // Filtrar novedades que:
        // 1. Pertenezcan al empleado actual
        // 2. Sean del tipo de novedad que estamos calculando
        const novedadesDelEmpleado = filteredEmployeeNews.filter((novedad) => {
          const esDelEmpleado = novedad.employeeId === row.id;
          const esDelTipoNovedad = novedad.typeNewsId === type.id;
          return esDelEmpleado && esDelTipoNovedad;
        });

        // Sumar los valores de todas las novedades filtradas
        const totalTipo = novedadesDelEmpleado.reduce((sum, novedad) => {
          const { valorNovedad } = calculateNovedadValue(novedad, row, type);
          return sum + valorNovedad;
        }, 0);
        
        // Redondear a 2 decimales para coincidir con el backend
        const totalTipoRedondeado = Math.round(totalTipo * 100) / 100;

        return totalTipoRedondeado ? formatCurrency(totalTipoRedondeado) : "";
      },
      sortable: true,
      width: "100px",
    })),
    {
      name: "Total",
      cell: (row) => {
        const employeeValues = calculatedValues[row.id];
        return formatCurrency(employeeValues?.total || 0);
      },
      sortable: true,
      width: "150px",
    },
    {
      name: "Estado Novedades",
      cell: (row) => {
        if (!row.hasNews) {
          return <span className="badge bg-success">Sin novedades</span>;
        }
        
        if (row.hasLiquidatedNews && row.hasPendingNews) {
          return (
            <div>
              <span className="badge bg-warning me-1">{row.pendingNewsCount} pendientes</span>
              <span className="badge bg-danger">{row.liquidatedNewsCount} liquidadas</span>
            </div>
          );
        }
        
        if (row.hasLiquidatedNews) {
          return <span className="badge bg-danger">Ya liquidadas</span>;
        }
        
        if (row.hasPendingNews) {
          return <span className="badge bg-warning">{row.pendingNewsCount} pendientes</span>;
        }
        
        return <span className="badge bg-secondary">Sin estado</span>;
      },
      width: "150px",
    },
    {
      name: "Acción",
      cell: (row) => <LiquidationListTableAction row={row} />,
      width: "100px",
    },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setForm((prevForm) => {
      const newForm = {
        ...prevForm,
        [name]: type === "checkbox" ? checked : value,
      };
      
      // Si se está cambiando un corte, limpiar el otro
      if (name === "corte1" && checked) {
        newForm.corte2 = false;
      } else if (name === "corte2" && checked) {
        newForm.corte1 = false;
      }
      
      return newForm;
    });
  };

  const loadEmployees = async () => {
    try {
      const response = await employeesApi.listActive();
      if (response.length) {
        setEmployees(response);
      }
    } catch (error) {
      console.error("Error al cargar los empleados para liquidación:", error);
      toast.error("Error al cargar la lista de empleados");
    }
  };

  const loadCompanies = async () => {
    try {
      const response = await companiesApi.list();
      if (response.length) {
        setCompanies(response);
      }
    } catch (error) {
      console.error("Error al cargar las empresas para liquidación:", error);
      toast.error("Error al cargar la lista de empresas");
    }
  };

  const loadEmployeeNews = async () => {
    try {
      // Solo cargar novedades pendientes de liquidación para el período seleccionado
      if (form.startDate && form.endDate && form.companyId) {
        let startDate = form.startDate;
        let endDate = form.endDate;

        // Si es quincenal y es corte 2: cargar todas las novedades del mes completo (1-30)
        if (form.paymentMethod === "Quincenal" && form.corte2 && !form.corte1) {
          const monthStart = moment.utc(form.startDate).startOf('month');
          const monthEnd = moment.utc(form.startDate).endOf('month');
          startDate = monthStart.format('YYYY-MM-DD');
          endDate = monthEnd.format('YYYY-MM-DD');
        }

        const response = await employeeNewsApi.getPendingByPeriod(
          startDate,
          endDate,
          form.companyId
        );

        if (response && response.length) {
          setEmployeeNews(response);
        } else {
          setEmployeeNews([]);
        }
      } else {
        setEmployeeNews([]);
      }
    } catch (error) {
      console.error(
        "❌ Error al cargar las novedades para liquidación:",
        error
      );
      toast.error("Error al cargar la lista de novedades");
      setEmployeeNews([]);
    }
  };

  const loadTypeNews = async () => {
    try {
      const response = await typeNewsApi.list(1, 1000); // Cargar todos los tipos

      if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
        setTypeNews(response.data);
      } else {
        console.log("⚠️ No se encontraron tipos de novedades");
        setTypeNews([]);
      }
    } catch (error) {
      console.error(
        "❌ Error al cargar los tipos de novedades para liquidación:",
        error
      );
      toast.error("Error al cargar la lista de tipos de novedades");
      setTypeNews([]);
    }
  };

  useEffect(() => {
    // Cargar datos en secuencia para evitar problemas de sincronización
    const loadDataSequentially = async () => {
      try {
        await loadCompanies();
        await loadTypeNews();
        await loadEmployees();
        // Cargar horas base mensuales vigentes
        const horasBase = await getHorasBaseMensuales(form.startDate || new Date());
        setHorasBaseMensuales(horasBase);
        // No cargar novedades aquí - se cargarán cuando se seleccione una empresa
      } catch (error) {
        console.error("Error en carga secuencial de liquidación:", error);
      }
    };

    loadDataSequentially();
  }, []);

  // Cargar horas base cuando cambie la fecha
  useEffect(() => {
    const loadHorasBase = async () => {
      if (form.startDate) {
        try {
          const horasBase = await getHorasBaseMensuales(form.startDate);
          setHorasBaseMensuales(horasBase);
        } catch (error) {
          console.error("Error cargando horas base:", error);
        }
      }
    };
    loadHorasBase();
  }, [form.startDate]);

  useEffect(() => {
    if (form.companyId) {
      let filteredEmployees = employees.filter(
        (emp) => emp.companyid == form.companyId
      );

      // Filtrar por método de pago
      if (form.paymentMethod) {
        filteredEmployees = filteredEmployees.filter(
          (emp) => emp.paymentmethod === form.paymentMethod
        );
      }

      // Agregar información de novedades a cada empleado
      const employeesWithNews = filteredEmployees.map((emp) => {
        const employeeNewsList = employeeNews.filter((news) => {
          return (
            news.employeeId === emp.id &&
            news.active === true &&
            news.approved === true &&
            isInRange(news)
          );
        });

        const hasNews = employeeNewsList.length > 0;
        const hasLiquidatedNews = employeeNewsList.some((news) => news.liquidation_status === 'liquidated');
        const hasPendingNews = employeeNewsList.some((news) => news.liquidation_status === 'pending');

        return {
          ...emp,
          hasNews,
          hasLiquidatedNews,
          hasPendingNews,
          newsCount: employeeNewsList.length,
          pendingNewsCount: employeeNewsList.filter(news => news.liquidation_status === 'pending').length,
          liquidatedNewsCount: employeeNewsList.filter(news => news.liquidation_status === 'liquidated').length,
        };
      });

      // Filtrar por estado de novedades
      let finalEmployees = employeesWithNews;
      if (form.newsStatus) {
        finalEmployees = employeesWithNews.filter((emp) => {
          switch (form.newsStatus) {
            case 'pending':
              return emp.hasPendingNews && !emp.hasLiquidatedNews;
            case 'liquidated':
              return emp.hasLiquidatedNews && !emp.hasPendingNews;
            case 'mixed':
              return emp.hasPendingNews && emp.hasLiquidatedNews;
            case 'none':
              return !emp.hasNews;
            default:
              return true;
          }
        });
      }

      setDataTable(finalEmployees);
    } else {
      setDataTable([]);
    }
  }, [
    form.companyId,
    form.startDate,
    form.endDate,
    form.paymentMethod,
    form.newsStatus,
    form.corte1,
    form.corte2,
    employees,
    employeeNews,
  ]);

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    if (!searchValue) {
      setFilteredData(dataTable);
      return;
    }

    const filtered = dataTable.filter((item) => {
      const documentInfo =
        `${item.documenttype} ${item.documentnumber}`.toLowerCase();
      const fullName = item.fullname.toLowerCase();
      const position = (item.position || "").toLowerCase();
      const status = !item.hasNews
        ? "normal"
        : employeeNews
            .filter((news) => news.employeeId === item.id)
            .filter((news) => news.approved === true)
            .map((news) => news.type_news_name.toLowerCase())
            .join(" ");

      return (
        documentInfo.includes(searchValue) ||
        fullName.includes(searchValue) ||
        position.includes(searchValue) ||
        status.includes(searchValue)
      );
    });

    setFilteredData(filtered);
  };

  useEffect(() => {
    setFilteredData(dataTable);
  }, [dataTable]);

  // Recargar novedades cuando cambien las fechas o la empresa
  useEffect(() => {
    if (form.startDate && form.endDate && form.companyId) {
      loadEmployeeNews();
    }
  }, [form.startDate, form.endDate, form.companyId, form.paymentMethod, form.corte1, form.corte2]);

  // Precargar normativas de tipos de horas para el cache
  useEffect(() => {
    const precargarNormativas = async () => {
      try {
        const response = await normativasApi.list({
          tipo: 'tipo_hora_laboral',
          activa: 'true'
        });
        
        // La respuesta viene como { data: { error: '', body: [...] } } según response.js
        let tiposHoras = [];
        
        if (response && response.data && response.data.body && Array.isArray(response.data.body)) {
          tiposHoras = response.data.body;
        } else if (response && response.body && Array.isArray(response.body)) {
          tiposHoras = response.body;
        } else if (Array.isArray(response)) {
          tiposHoras = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          tiposHoras = response.data;
        }
        
        if (tiposHoras && tiposHoras.length > 0) {
          const cache = {};
          tiposHoras.forEach(normativa => {
            if (normativa && normativa.id) {
              cache[normativa.id] = normativa;
            }
          });
          setNormativasCache(cache);
          console.log(`✅ Precargadas ${Object.keys(cache).length} normativas de tipos de horas`);
        }
      } catch (error) {
        console.error("Error precargando normativas:", error);
        setNormativasCache({});
      }
    };
    
    precargarNormativas();
  }, [form.startDate]);

  const LiquidationListTableAction = ({ row }) => {
    return (
      <div className="product-action">
        <Link
          href=""
          onClick={(e) => {
            e.preventDefault();
            setSelectedEmployee(row);
            setShowDetails(true);
          }}
        >
          <SVG iconId="eye" />
        </Link>
      </div>
    );
  };

  const exportToExcel = () => {
    if (!filteredData.length) {
      toast.warning("No hay datos para exportar");
      return;
    }

    // Asegurar que los valores estén calculados antes de exportar
    calculateAllValues();

    // Crear un libro de Excel
    const wb = XLSX.utils.book_new();

    // Preparar los datos para exportar
    const dataToExport = filteredData.map((employee) => {
      const employeeValues = calculatedValues[employee.id] || { total: 0 };

      // Objeto base con las columnas fijas
      const baseData = {
        Documento: `${employee.documenttype} ${employee.documentnumber}`,
        Nombre: employee.fullname,
        Cargo: employee.position || "No disponible",
        "Tipo de Contrato": employee.contracttype || "No disponible",
        "Salario Base": formatCurrency(employee.basicmonthlysalary),
        "Auxilio de Transporte": (() => {
          const employeeValues = valoresCalculados[employee.id] || {};
          const auxilioCalculado = calculateTransportationAssistance(
            employee,
            form.paymentMethod
          );
          const descuento = employeeValues.transportation_assistance_discount || 0;
          const auxilioFinal = employeeValues.transportation_assistance_final !== undefined 
            ? employeeValues.transportation_assistance_final 
            : auxilioCalculado;
          
          if (auxilioFinal <= 0) {
            return "No aplica";
          }
          
          if (descuento > 0) {
            return `${formatCurrency(auxilioFinal)} (Descuento: ${formatCurrency(descuento)})`;
          }
          
          return formatCurrency(auxilioFinal);
        })(),
        "Auxilio de Movilidad": (() => {
          const employeeValues = valoresCalculados[employee.id] || {};
          const auxilio = employeeValues.mobility_assistance_final !== undefined 
            ? employeeValues.mobility_assistance_final 
            : 0;
          return auxilio > 0 ? formatCurrency(auxilio) : "No aplica";
        })(),
        "Descuento Salud (4%)": "", // Se actualizará más abajo con el valor de calculatedValues
        "Descuento Pensión (4%)": "", // Se actualizará más abajo con el valor de calculatedValues
        "Valor por hora": formatCurrency(employee.hourlyrate),
        "Frecuencia de pago": employee.paymentmethod || "No disponible",
      };

      // Usar los valores ya calculados de calculatedValues para ser consistente con la tabla
      // Agregar columnas dinámicas de tipos de novedad
      typeNews.forEach((type) => {
        const novedadData = employeeValues.novedades?.[type.id];
        const valorNovedad = novedadData?.valor || 0;
        baseData[type.code] = valorNovedad > 0 ? formatCurrency(valorNovedad) : "";
      });

      // Usar los valores calculados directamente de calculatedValues
      const healthDiscount = employeeValues.health_discount || 0;
      const pensionDiscount = employeeValues.pension_discount || 0;
      const absenceDiscounts = employeeValues.absence_discounts || 0;
      
      // Actualizar los descuentos en baseData usando los valores calculados
      baseData["Descuento Salud (4%)"] = healthDiscount > 0 
        ? formatCurrency(healthDiscount) 
        : "No aplica este corte";
      baseData["Descuento Pensión (4%)"] = pensionDiscount > 0 
        ? formatCurrency(pensionDiscount) 
        : "No aplica este corte";
      
      // Usar el total ya calculado de calculatedValues
      baseData["Total"] = formatCurrency(employeeValues.total || 0);

      return baseData;
    });

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    XLSX.utils.book_append_sheet(wb, ws, "Liquidación");

    // Generar nombre del archivo con fecha actual
    const fileName = `Liquidacion_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;

    XLSX.writeFile(wb, fileName);
    toast.success("Archivo exportado exitosamente");
  };

  const checkExistingLiquidation = async (companyId, startDate, endDate) => {
    try {
      console.log("🔄 Verificando si el período ya está liquidado...");
      console.log("📊 Parámetros:", { companyId, startDate, endDate });
      
      // Verificar si hay liquidaciones en el período seleccionado
      const liquidations = await liquidationsApi.list(1, 100);
      const liquidationsList = liquidations.body || liquidations.data || [];

      const periodExists = liquidationsList.some((liquidation) => {
        if (liquidation.company_id !== companyId) return false;
        
        // Convertir fechas para comparación
        const liquidationStart = liquidation.period_start || (liquidation.period + '-01');
        const liquidationEnd = liquidation.period_end || (liquidation.period + '-31');
        
        // Verificar solapamiento de períodos
        return (
          (startDate <= liquidationEnd && endDate >= liquidationStart) &&
          liquidation.status !== 'cancelled'
        );
      });

      console.log("📋 Período ya liquidado:", periodExists);
      return periodExists;
    } catch (error) {
      console.error("Error verificando liquidaciones existentes:", error);
      return false;
    }
  };

  const saveLiquidation = async () => {
    if (!filteredData.length) {
      toast.warning("No hay datos para guardar");
      return;
    }

    if (!form.companyId) {
      toast.error("Debe seleccionar una empresa");
      return;
    }

    if (!form.startDate || !form.endDate) {
      toast.error("Debe seleccionar las fechas del período");
      return;
    }

    // Validar fechas según la frecuencia
    const validation = validateDates(form.startDate, form.endDate, form.paymentMethod, form.corte1, form.corte2);
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    // Verificar si el período ya está liquidado
    const isPeriodLiquidated = await checkExistingLiquidation(
      form.companyId,
      form.startDate,
      form.endDate
    );

    if (isPeriodLiquidated) {
      setErrorMessage(
        "El período seleccionado ya ha sido liquidado para esta empresa. Por favor, seleccione un período diferente."
      );
      setShowErrorModal(true);
      return;
    }

    try {
      setSaving(true);

      // Preparar los datos de empleados para la liquidación
      const employees_data = filteredData.map((employee) => {
        const employeeValues = calculatedValues[employee.id] || { total: 0 };

        // Convertir a números para evitar concatenación de strings
        const basicSalary = Number(employee.basicmonthlysalary) || 0;
        const basicSalaryForPeriod =
          form.paymentMethod === "Quincenal" ? basicSalary / 2 : basicSalary;

        // Calcular auxilio de transporte
        const transportationAssistance = calculateTransportationAssistance(
          employee,
          form.paymentMethod
        );

        // Calcular novedades del empleado
        const employeeNews = filteredEmployeeNews.filter(
          (news) => news.employeeId === employee.id
        );

        const news_data = employeeNews.map((news) => {
          const tipoNovedad = typeNews.find(
            (type) => type.id === news.typeNewsId
          );
          const { valorNovedad, totalHoras, totalDias } = calculateNovedadValue(
            news,
            employee,
            tipoNovedad
          );

          return {
            employee_news_id: news.id,
            type_news_id: news.typeNewsId,
            hours: totalHoras,
            days: totalDias,
            amount: valorNovedad,
          };
        });

        // Calcular totales de novedades y descuentos proporcionales
        let totalNovedades = 0;
        let descuentosProporcionales = 0;
        let valorPrestacionales = 0; // Suma de novedades que afectan prestacionales

        news_data.forEach((news) => {
          const tipoNovedad = typeNews.find(type => type.id === news.type_news_id);
          
          if (tipoNovedad) {
            const esDescuento = tipoNovedad.isDiscount === true || tipoNovedad.isDiscount === "true";
            
            // Si tiene affects configurado, usar lógica específica
            if (tipoNovedad.affects && !tipoNovedad.calculateperhour) {
              let affectsData;
              try {
                affectsData = typeof tipoNovedad.affects === "string" 
                  ? JSON.parse(tipoNovedad.affects) 
                  : tipoNovedad.affects || {};
              } catch (error) {
                affectsData = {};
              }

              const diasNovedad = news.days || 1;
              const basicSalaryForPeriod = form.paymentMethod === "Quincenal" ? basicSalary / 2 : basicSalary;

              // AUXILIO DE TRANSPORTE
              if (affectsData.transportationassistance === true || affectsData.transportationassistance === "true") {
                const auxilioPeriodo = calculateTransportationAssistance(employee, form.paymentMethod);
                // Calcular días del período según método de pago
                const diasPeriodo = form.paymentMethod === "Quincenal" ? 15 : 30;
                const auxilioDiario = auxilioPeriodo / diasPeriodo; // Calcular auxilio diario según período
                const valorAuxilio = auxilioDiario * diasNovedad; // Descontar solo los días de la novedad
                
                if (esDescuento) {
                  descuentosProporcionales += valorAuxilio;
                } else {
                  totalNovedades += valorAuxilio;
                }
              }

              // AUXILIO DE MOVILIDAD
              if (affectsData.mobilityassistance === true || affectsData.mobilityassistance === "true") {
                const auxilioMovilidad = Number(employee.mobilityassistance) || 0;
                if (auxilioMovilidad > 0) {
                  if (esDescuento) {
                    descuentosProporcionales += auxilioMovilidad;
                  } else {
                    totalNovedades += auxilioMovilidad;
                  }
                }
              }

              // PRESTACIONALES
              if (affectsData.prestacionales === true || affectsData.prestacionales === "true") {
                const salarioDiario = basicSalaryForPeriod / (form.paymentMethod === "Quincenal" ? 15 : 30);
                const salarioPorDias = salarioDiario * diasNovedad;
                
                // Determinar si se usa cantidad o porcentaje
                const tieneCantidad = tipoNovedad.amount && parseFloat(tipoNovedad.amount) > 0;
                const tienePorcentaje = tipoNovedad.percentage && parseFloat(tipoNovedad.percentage) > 0;
                
                let valorSalario = 0;
                if (tieneCantidad) {
                  const cantidadFija = parseFloat(tipoNovedad.amount);
                  valorSalario = cantidadFija;
                } else if (tienePorcentaje) {
                  const porcentaje = parseFloat(tipoNovedad.percentage) || 100;
                  valorSalario = salarioPorDias * (porcentaje / 100);
                }
                
                if (esDescuento) {
                  descuentosProporcionales += valorSalario;
                  valorPrestacionales -= valorSalario;
                } else {
                  totalNovedades += valorSalario;
                  valorPrestacionales += valorSalario;
                }
              }
            } else if (tipoNovedad.calculateperhour) {
              // Si es calculada por hora, verificar si afecta prestacionales
              let affectsData = {};
              if (tipoNovedad.affects) {
                try {
                  affectsData = typeof tipoNovedad.affects === "string" 
                    ? JSON.parse(tipoNovedad.affects) 
                    : tipoNovedad.affects || {};
                } catch (error) {
                  console.error("Error parseando affects:", error);
                  affectsData = {};
                }
              }

              console.log("🔍 Novedad calculada por hora:", {
                tipoNovedad: tipoNovedad.name,
                affects: tipoNovedad.affects,
                affectsData,
                prestacionales: affectsData.prestacionales,
                newsAmount: news.amount,
                esDescuento
              });

              // Si afecta prestacionales, sumar el valor a la base de seguridad social
              if (affectsData.prestacionales === true || affectsData.prestacionales === "true") {
                console.log("✅ Sumando a prestacionales:", news.amount);
                if (esDescuento) {
                  valorPrestacionales -= news.amount;
                } else {
                  valorPrestacionales += news.amount;
                }
              } else {
                console.log("❌ NO afecta prestacionales o no está marcado");
              }

              // Sumar/restar a totalNovedades normalmente
              if (esDescuento) {
                descuentosProporcionales += news.amount;
              } else {
                totalNovedades += news.amount;
              }
            } else {
              // Si no tiene affects, usar lógica simple
              if (esDescuento) {
                descuentosProporcionales += news.amount;
              } else {
                totalNovedades += news.amount;
              }
            }
          }
        });

        // Calcular descuentos por ausentismo
        const absenceDiscounts = calculateAbsenceDiscounts(
          employee,
          form.startDate,
          form.endDate
        );

        // Obtener auxilio de movilidad
        const mobilityAssistance = employeeValues.mobility_assistance_final !== undefined 
          ? employeeValues.mobility_assistance_final 
          : 0;

        // Calcular base de seguridad social: salario base + novedades prestacionales + auxilio movilidad (si excede 40%)
        const baseSeguridadSocial = calculateBaseSeguridadSocial(
          basicSalaryForPeriod, 
          valorPrestacionales, 
          mobilityAssistance
        );

        // Calcular si el auxilio de movilidad excede el 40% del salario base
        const cuarentaPorcientoSalario = basicSalaryForPeriod * 0.4;
        const auxilioExcede40Porciento = mobilityAssistance > cuarentaPorcientoSalario;

        // Calcular descuentos de salud y pensión (4% cada uno de la base de seguridad social)
        const isSecondCut = form.paymentMethod === "Quincenal" && form.corte2 && !form.corte1;
        const shouldApply = shouldApplyHealthPensionDiscounts(form.paymentMethod, isSecondCut);
        const healthDiscount = shouldApply ? baseSeguridadSocial * 0.04 : 0;
        const pensionDiscount = shouldApply ? baseSeguridadSocial * 0.04 : 0;
        const socialSecurityDiscounts = healthDiscount + pensionDiscount;
        
        console.log("🔍 Debug descuentos:", {
          employee: employee.fullname,
          paymentMethod: form.paymentMethod,
          corte1: form.corte1,
          corte2: form.corte2,
          isSecondCut,
          shouldApply,
          basicSalaryForPeriod,
          valorPrestacionales,
          baseSeguridadSocial,
          healthDiscount,
          pensionDiscount,
          totalNovedades
        });

        const totalDiscounts = absenceDiscounts + descuentosProporcionales + socialSecurityDiscounts;

        // Si el auxilio de movilidad NO excede el 40%, se suma al devengado
        // Si excede el 40%, ya está incluido en la base de seguridad social
        const auxilioMovilidadEnDevengado = auxilioExcede40Porciento ? 0 : mobilityAssistance;

        const netAmount =
          basicSalaryForPeriod +
          transportationAssistance +
          totalNovedades +
          auxilioMovilidadEnDevengado -
          totalDiscounts;

        return {
          employee_id: employee.id,
          basic_salary: basicSalaryForPeriod,
          base_security_social: baseSeguridadSocial,
          transportation_assistance: transportationAssistance,
          mobility_assistance: mobilityAssistance,
          total_novedades: totalNovedades,
          total_discounts: totalDiscounts,
          health_discount: healthDiscount,
          pension_discount: pensionDiscount,
          social_security_discounts: socialSecurityDiscounts,
          absence_discounts: absenceDiscounts,
          proportional_discounts: descuentosProporcionales,
          net_amount: netAmount,
          news_data: news_data,
        };
      });

      // Crear la liquidación
      const liquidationData = {
        company_id: form.companyId,
        startDate: form.startDate,
        endDate: form.endDate,
        payment_frequency: form.paymentMethod || "Mensual",
        cut_number: form.corte1 ? 1 : form.corte2 ? 2 : null,
        employees_data: employees_data,
      };

      const result = await liquidationsApi.create(liquidationData);

      toast.success("Liquidación guardada exitosamente");

      // Redirigir al dashboard de liquidaciones guardadas
      setTimeout(() => {
        window.location.href = "/admin/liquidaciones_guardadas";
      }, 1500);
    } catch (error) {
      console.error("Error al guardar liquidación:", error);

      // Obtener el mensaje de error del response
      const errorMessage = error.message || error.toString();

      // Verificar si es error de período duplicado
      if (
        errorMessage.includes(
          "llave duplicada viola restricción de unicidad"
        ) ||
        errorMessage.includes("liquidations_company_id_period")
      ) {
        setErrorMessage(
          "El período seleccionado ya ha sido liquidado para esta empresa. Por favor, seleccione un período diferente."
        );
        setShowErrorModal(true);
      } else {
        setErrorMessage("Error al guardar la liquidación: " + errorMessage);
        setShowErrorModal(true);
      }
    } finally {
      setSaving(false);
    }
  };

  function toDateString(date) {
    const d = new Date(date);
    return isNaN(d) ? "No disponible" : d.toISOString().split("T")[0];
  }

  const isInRange = (news) => {
    const newsStart = new Date(news.startDate);
    const newsEnd = new Date(news.endDate);
    const filterStart = new Date(form.startDate);
    const filterEnd = new Date(form.endDate);

    // Primero verificamos si la novedad está dentro del rango general de fechas
    if (newsStart > filterEnd || newsEnd < filterStart) {
      return false;
    }

    // Si es quincenal y se seleccionó un corte, verificamos los días
    if (form.paymentMethod === "Quincenal" && (form.corte1 || form.corte2)) {
      // Función auxiliar para verificar si una fecha cae en el corte seleccionado
      const isDateInCut = (date) => {
        const day = date.getDate();
        if (form.corte1 && !form.corte2) {
          return day >= 1 && day <= 15;
        } else if (!form.corte1 && form.corte2) {
          return day >= 16 && day <= 31;
        }
        return true; // Si ambos cortes están seleccionados o ninguno
      };

      // Verificamos cada día de la novedad
      let currentDate = new Date(newsStart);
      let hasValidDay = false;

      while (currentDate <= newsEnd) {
        // Solo verificamos si el día está dentro del rango de filtro
        if (currentDate >= filterStart && currentDate <= filterEnd) {
          if (isDateInCut(currentDate)) {
            hasValidDay = true;
            break;
          }
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return hasValidDay;
    }

    // Si no es quincenal o no hay cortes seleccionados, retornamos true
    return true;
  };

  // Función para generar datos de novedades filtrados
  const generateFilteredNews = () => {
    const filtered = employeeNews.filter((news) => {
      // Verificar si la novedad está activa y aprobada
      if (news.status !== "active") return false;
      if (news.approved !== true) return false;

      const newsStart = moment.utc(news.startDate);
      const newsEnd = moment.utc(news.endDate);
      let filterStart = moment.utc(form.startDate);
      let filterEnd = moment.utc(form.endDate);

      // Si es quincenal y es corte 1: NO se liquidan novedades
      if (form.paymentMethod === "Quincenal" && form.corte1 && !form.corte2) {
        return false;
      }

      // Si es quincenal y es corte 2: incluir todas las novedades del mes completo (1-30)
      if (form.paymentMethod === "Quincenal" && form.corte2 && !form.corte1) {
        filterStart = moment.utc(form.startDate).startOf('month');
        filterEnd = moment.utc(form.startDate).endOf('month');
      }

      // Verificar si está dentro del rango de fechas
      const isInDateRange =
        (newsStart.isSameOrAfter(filterStart) &&
          newsStart.isSameOrBefore(filterEnd)) ||
        (newsEnd.isSameOrAfter(filterStart) &&
          newsEnd.isSameOrBefore(filterEnd)) ||
        (newsStart.isSameOrBefore(filterStart) &&
          newsEnd.isSameOrAfter(filterEnd));

      return isInDateRange;
    });
    setFilteredEmployeeNews(filtered);
  };

  // Efecto para actualizar las novedades filtradas cuando cambien los filtros
  useEffect(() => {
    generateFilteredNews();
  }, [form, employeeNews]);

  // useEffect simplificado para cálculos
  useEffect(() => {
    if (typeNews.length > 0 && employees.length > 0) {
      calculateAllValues();
    }
  }, [typeNews, employees, filteredEmployeeNews, form.companyId, form.startDate, form.endDate, form.paymentMethod]);

  // Función para calcular el valor de una novedad
  const calculateNovedadValue = (novedad, employee, tipoNovedad) => {
    // Verificar que tipoNovedad esté definido
    if (!tipoNovedad) {
      return { valorNovedad: 0, totalHoras: 0 };
    }

    let valorNovedad = 0;
    let totalHoras = 0;

    const fechaInicio = moment.utc(novedad.startDate);
    const fechaFin = moment.utc(novedad.endDate);

    // Determinar si se usa cantidad o porcentaje
    const tieneCantidad = tipoNovedad.amount && parseFloat(tipoNovedad.amount) > 0;
    const tienePorcentaje = tipoNovedad.percentage && parseFloat(tipoNovedad.percentage) > 0;

    // LÓGICA SIMPLIFICADA: Si la novedad tiene "affects" y NO se calcula por hora
    if (tipoNovedad.affects && !tipoNovedad.calculateperhour) {
      let affectsData;
      try {
        affectsData = typeof tipoNovedad.affects === "string" 
          ? JSON.parse(tipoNovedad.affects) 
          : tipoNovedad.affects || {};
      } catch (error) {
        affectsData = {};
      }

      // Si afecta al salario base y el porcentaje es 100%, retornar 0 para display
      if (tienePorcentaje) {
        const percentage = parseFloat(tipoNovedad.percentage);
        if (
          (affectsData.prestacionales === true || affectsData.prestacionales === "true") &&
          percentage === 100
        ) {
          return { valorNovedad: 0, totalHoras: 0 };
        }
      }
    }

    // NUEVA LÓGICA: Usar el campo isDiscount para determinar si suma o resta
    const esDescuento = tipoNovedad.isDiscount === true || tipoNovedad.isDiscount === "true";

    if (tipoNovedad.calculateperhour) {
      // Si la novedad es del mismo día
      if (fechaInicio.format("YYYY-MM-DD") === fechaFin.format("YYYY-MM-DD")) {
        const [startHour, startMinute] = novedad?.startTime
          ? novedad?.startTime?.split(":").map(Number)
          : [0, 0];
        const [endHour, endMinute] = novedad?.endTime
          ? novedad?.endTime?.split(":").map(Number)
          : [0, 0];

        let horasPorDia =
          endHour + endMinute / 60 - (startHour + startMinute / 60);
        if (horasPorDia < 0) {
          horasPorDia += 24;
        }
        totalHoras = Math.ceil(horasPorDia);
      } else {
        // Si la novedad cruza días
        const [startHour, startMinute] = novedad?.startTime
          ? novedad?.startTime?.split(":").map(Number)
          : [0, 0];
        const [endHour, endMinute] = novedad?.endTime
          ? novedad?.endTime?.split(":").map(Number)
          : [0, 0];

        // Calcular horas del primer día (desde hora inicio hasta medianoche)
        const horasPrimerDia = 24 - (startHour + startMinute / 60);

        // Calcular horas del último día (desde medianoche hasta hora fin)
        const horasUltimoDia = endHour + endMinute / 60;

        // Calcular días completos entre medio (si los hay)
        const diasCompletos = fechaFin.diff(fechaInicio, "days") - 1;
        const horasDiasCompletos = diasCompletos > 0 ? diasCompletos * 24 : 0;

        // Sumar todas las horas
        totalHoras = Math.ceil(
          horasPrimerDia + horasUltimoDia + horasDiasCompletos
        );
      }

      // NUEVA LÓGICA PARAMETRIZADA: Si la novedad tiene hour_type_id, usar normativas
      if (novedad.hourTypeId || novedad.hour_type_id) {
        const hourTypeId = novedad.hourTypeId || novedad.hour_type_id;
        
        // Obtener normativa del tipo de hora desde cache
        const tipoHoraNormativa = normativasCache[hourTypeId];
        
        if (tipoHoraNormativa && tipoHoraNormativa.multiplicador) {
          // Usar la nueva fórmula parametrizada: (salario * multiplicador) / horas_base * horas
          const salarioMensual = Number(employee.basicmonthlysalary) || 0;
          const multiplicador = parseFloat(tipoHoraNormativa.multiplicador) || 1;
          const valorHora = (salarioMensual * multiplicador) / horasBaseMensuales;
          valorNovedad = totalHoras * valorHora;
          // Redondear a 2 decimales para coincidir con el backend
          valorNovedad = Math.round(valorNovedad * 100) / 100;
        } else {
          // Fallback: usar lógica antigua si no hay normativa en cache
          if (tieneCantidad) {
            const cantidadPorHora = parseFloat(tipoNovedad.amount);
            valorNovedad = totalHoras * cantidadPorHora;
            // Redondear a 2 decimales para coincidir con el backend
            valorNovedad = Math.round(valorNovedad * 100) / 100;
          } else if (tienePorcentaje) {
            const valorHoraExtra =
              Number(employee.hourlyrate) * (Number(tipoNovedad.percentage) / 100);
            valorNovedad = totalHoras * valorHoraExtra;
            // Redondear a 2 decimales para coincidir con el backend
            valorNovedad = Math.round(valorNovedad * 100) / 100;
          }
        }
      } else {
        // LÓGICA ANTIGUA: Si no tiene hour_type_id, usar lógica tradicional
        if (tieneCantidad) {
          const cantidadPorHora = parseFloat(tipoNovedad.amount);
          valorNovedad = totalHoras * cantidadPorHora;
          // Redondear a 2 decimales para coincidir con el backend
          valorNovedad = Math.round(valorNovedad * 100) / 100;
        } else if (tienePorcentaje) {
          const valorHoraExtra =
            Number(employee.hourlyrate) * (Number(tipoNovedad.percentage) / 100);
          valorNovedad = totalHoras * valorHoraExtra;
          // Redondear a 2 decimales para coincidir con el backend
          valorNovedad = Math.round(valorNovedad * 100) / 100;
        }
      }
      
      // Aplicar lógica de descuento: si es descuento, el valor será negativo
      if (esDescuento) {
        valorNovedad = -Math.abs(valorNovedad);
      }
      // Si NO es descuento, mantener el valor positivo (suma)
    } else {
      const dias = fechaFin.diff(fechaInicio, "days") + 1;
      
      // Si tiene cantidad, usar cantidad directamente (valor total, no por día); si no, usar porcentaje
      if (tieneCantidad) {
        const cantidadFija = parseFloat(tipoNovedad.amount);
        valorNovedad = cantidadFija; // Valor total, no multiplicar por días
        // Redondear a 2 decimales para coincidir con el backend
        valorNovedad = Math.round(valorNovedad * 100) / 100;
      } else if (tienePorcentaje) {
        const valorDia = Number(employee.basicmonthlysalary) / 30;
        valorNovedad = dias * valorDia * (Number(tipoNovedad.percentage) / 100);
        // Redondear a 2 decimales para coincidir con el backend
        valorNovedad = Math.round(valorNovedad * 100) / 100;
      }
      
      // Aplicar lógica de descuento: si es descuento, el valor será negativo
      if (esDescuento) {
        valorNovedad = -Math.abs(valorNovedad);
      }
      // Si NO es descuento, mantener el valor positivo (suma)
    }
    
    // Asegurar redondeo final a 2 decimales (por si acaso)
    valorNovedad = Math.round(valorNovedad * 100) / 100;
    
    return { valorNovedad, totalHoras };
  };

  // Función para calcular descuentos por ausentismo (días de descanso)
  const calculateAbsenceDiscounts = (employee, periodStart, periodEnd) => {
    // Buscar novedades de ausentismo del empleado en el período
    const ausentismoNews = filteredEmployeeNews.filter(
      (news) =>
        news.employeeId === employee.id &&
        news.typeNewsId === 26 && // ID del tipo de novedad Ausentismo
        moment(news.startDate).isBetween(periodStart, periodEnd, null, "[]")
    );

    if (ausentismoNews.length === 0) {
      return 0;
    }

    let totalDiscountAmount = 0;
    const dailySalary = Number(employee.basicmonthlysalary) / 30;

    ausentismoNews.forEach((absence) => {
      const absenceDate = moment(absence.startDate);
      const endDate = absence.endDate ? moment(absence.endDate) : absenceDate;

      // Calcular días de ausencia
      const absenceDays = endDate.diff(absenceDate, "days") + 1;

      // Para cada día de ausencia, calcular el descuento de días de descanso
      for (let i = 0; i < absenceDays; i++) {
        const currentAbsenceDate = absenceDate.clone().add(i, "days");

        // Lógica semanal: si falta un día, descuenta el siguiente domingo
        const nextSunday = currentAbsenceDate.clone().day(0); // Domingo = 0
        if (nextSunday.isSameOrBefore(currentAbsenceDate)) {
          nextSunday.add(1, "week");
        }

        // Verificar si el domingo a descontar está dentro del período de liquidación
        if (nextSunday.isBetween(periodStart, periodEnd, null, "[]")) {
          totalDiscountAmount += dailySalary;
        }
      }
    });

    return totalDiscountAmount;
  };

  // Función optimizada para calcular todos los valores
  const calculateAllValues = (preservedMobilityValues = null) => {
    const newCalculatedValues = {};

    employees.forEach((employee) => {
      newCalculatedValues[employee.id] = {
        novedades: {},
        total: 0,
      };

      // Agregar el salario base según el método de pago
      const salarioBase = Number(employee.basicmonthlysalary);
      const metodoPagoEfectivo =
        form.paymentMethod && form.paymentMethod !== ""
          ? form.paymentMethod
          : employee.paymentmethod;

      let salarioBaseCalculado = 0;
      if (metodoPagoEfectivo === "Quincenal") {
        salarioBaseCalculado = salarioBase / 2;
      } else if (metodoPagoEfectivo === "Mensual") {
        salarioBaseCalculado = salarioBase;
      }

      // Inicializar descuento del auxilio de transporte
      let descuentoAuxilioTransporte = 0;

      // Procesar novedades del empleado
      const employeeNews = filteredEmployeeNews.filter(news => news.employeeId === employee.id);
      let valorPrestacionales = 0; // Suma de novedades que afectan prestacionales
      let diasAfectadosAuxilioMovilidad = 0; // Días totales que afectan auxilio de movilidad
      let diasAfectadosAuxilioTransporte = 0; // Días totales que afectan auxilio de transporte
      let diasAfectadosSalarioBase = 0; // Días totales que afectan el salario base (para calcular proporcional)
      let reemplazaSalarioBase = false; // Flag para indicar si alguna novedad reemplaza el salario base
      
      if (employeeNews.length > 0) {
        employeeNews.forEach(news => {
          const type = typeNews.find(t => t.id === news.typeNewsId);
          if (!type) return;

          const { valorNovedad, totalHoras } = calculateNovedadValue(news, employee, type);
          
          // Guardar en novedades por tipo
          if (!newCalculatedValues[employee.id].novedades[type.id]) {
            newCalculatedValues[employee.id].novedades[type.id] = {
              valor: 0,
              horas: 0,
              novedades: []
            };
          }
          
          newCalculatedValues[employee.id].novedades[type.id].valor += valorNovedad;
          // Redondear el valor acumulado de novedades a 2 decimales
          newCalculatedValues[employee.id].novedades[type.id].valor = Math.round(newCalculatedValues[employee.id].novedades[type.id].valor * 100) / 100;
          newCalculatedValues[employee.id].novedades[type.id].horas += totalHoras;
          newCalculatedValues[employee.id].novedades[type.id].novedades.push(news);

          // LÓGICA HÍBRIDA: Usar isDiscount + affects para casos específicos
          if (type.affects && !type.calculateperhour) {
            // Si tiene affects configurado, aplicar lógica específica
            const affectsData = typeof type.affects === "string" 
              ? JSON.parse(type.affects) 
              : type.affects || {};

            const diasNovedad = moment.utc(news.endDate).diff(moment.utc(news.startDate), "days") + 1;
            const esDescuento = type.isDiscount === true || type.isDiscount === "true";

            // SALARIO BASE: Si está marcado, la novedad reemplaza el salario base
            if (affectsData.baseSalary === true || affectsData.baseSalary === "true") {
              reemplazaSalarioBase = true; // Marcar que hay una novedad que reemplaza el salario base
              // Acumular días afectados del salario base
              diasAfectadosSalarioBase += diasNovedad;
              
              const salarioDiario = salarioBaseCalculado / (form.paymentMethod === "Quincenal" ? 15 : 30);
              const salarioPorDias = salarioDiario * diasNovedad;
              
              // Determinar si se usa cantidad o porcentaje
              const tieneCantidad = type.amount && parseFloat(type.amount) > 0;
              const tienePorcentaje = type.percentage && parseFloat(type.percentage) > 0;
              
              let valorSalario = 0;
              if (tieneCantidad) {
                const cantidadFija = parseFloat(type.amount);
                valorSalario = cantidadFija;
              } else if (tienePorcentaje) {
                const porcentaje = parseFloat(type.percentage) || 100;
                valorSalario = salarioPorDias * (porcentaje / 100);
              }
              
              // Sumar el valor de la novedad (reemplaza el salario base por esos días)
              newCalculatedValues[employee.id].total += valorSalario;
              valorPrestacionales += valorSalario;
              
              // Si afecta salario base, el empleado NO trabajó, por lo tanto NO tiene auxilio de movilidad ni transporte
              // Afectar automáticamente los días de auxilio de movilidad y transporte
              diasAfectadosAuxilioMovilidad += diasNovedad;
              diasAfectadosAuxilioTransporte += diasNovedad;
            }

            // AUXILIO DE TRANSPORTE
            // Si NO afecta baseSalary (ya se procesó arriba), procesar normalmente
            if (!(affectsData.baseSalary === true || affectsData.baseSalary === "true")) {
              if (affectsData.transportationassistance === true || affectsData.transportationassistance === "true") {
                // Acumular días afectados (no importa si es descuento o aumento)
                diasAfectadosAuxilioTransporte += diasNovedad;
              }

              // AUXILIO DE MOVILIDAD
              if (affectsData.mobilityassistance === true || affectsData.mobilityassistance === "true") {
                // Acumular días afectados (no importa si es descuento o aumento)
                diasAfectadosAuxilioMovilidad += diasNovedad;
              }
            }

            // PRESTACIONALES
            if (affectsData.prestacionales === true || affectsData.prestacionales === "true") {
              // Solo procesar si NO es baseSalary (ya se procesó arriba)
              if (!(affectsData.baseSalary === true || affectsData.baseSalary === "true")) {
                const salarioDiario = salarioBaseCalculado / (form.paymentMethod === "Quincenal" ? 15 : 30);
                const salarioPorDias = salarioDiario * diasNovedad;
                
                // Determinar si se usa cantidad o porcentaje
                const tieneCantidad = type.amount && parseFloat(type.amount) > 0;
                const tienePorcentaje = type.percentage && parseFloat(type.percentage) > 0;
                
                let valorSalario = 0;
                if (tieneCantidad) {
                  const cantidadFija = parseFloat(type.amount);
                  valorSalario = cantidadFija;
                } else if (tienePorcentaje) {
                  const porcentaje = parseFloat(type.percentage) || 100;
                  valorSalario = salarioPorDias * (porcentaje / 100);
                }
                
                if (esDescuento) {
                  newCalculatedValues[employee.id].total -= valorSalario;
                  valorPrestacionales -= valorSalario;
                } else {
                  newCalculatedValues[employee.id].total += valorSalario;
                  valorPrestacionales += valorSalario;
                }
              }
            }
          } else if (type.calculateperhour) {
            // Si es calculada por hora, verificar si afecta prestacionales
            const esDescuento = type.isDiscount === true || type.isDiscount === "true";
            let affectsData;
            try {
              affectsData = typeof type.affects === "string" 
                ? JSON.parse(type.affects) 
                : type.affects || {};
            } catch (error) {
              affectsData = {};
            }

            // Si afecta prestacionales, sumar el valor a la base de seguridad social
            if (affectsData.prestacionales === true || affectsData.prestacionales === "true") {
              if (esDescuento) {
                valorPrestacionales -= valorNovedad;
              } else {
                valorPrestacionales += valorNovedad;
              }
            }

            // Sumar/restar al total normalmente
            newCalculatedValues[employee.id].total += valorNovedad;
          } else {
            // Si no tiene affects, usar lógica simple con isDiscount
            newCalculatedValues[employee.id].total += valorNovedad;
          }
        });
      }

      // Calcular y sumar el salario base proporcional a los días trabajados
      const diasPeriodo = form.paymentMethod === "Quincenal" ? 15 : 30;
      const diasTrabajadosSalario = diasPeriodo - diasAfectadosSalarioBase;
      
      let salarioBaseProporcional = 0;
      if (diasTrabajadosSalario > 0) {
        // Calcular salario base proporcional a los días trabajados
        const salarioDiario = salarioBaseCalculado / diasPeriodo;
        salarioBaseProporcional = salarioDiario * diasTrabajadosSalario;
        newCalculatedValues[employee.id].total += salarioBaseProporcional;
      } else if (!reemplazaSalarioBase) {
        // Si no hay días afectados y no hay novedad que reemplace el salario base, usar el salario base completo
        salarioBaseProporcional = salarioBaseCalculado;
      }

      // CALCULAR DESCUENTOS POR AUSENTISMO (días de descanso)
      const absenceDiscounts = calculateAbsenceDiscounts(
        employee,
        form.startDate,
        form.endDate
      );

      // Calcular auxilio de movilidad proporcional a los días trabajados
      // Si hay un valor preservado (modificado desde el modal), usar ese valor como base mensual
      const employeeValues = preservedMobilityValues?.[employee.id] || {};
      let auxilioMovilidad = 0;
      
      // Determinar el valor base: si hay valor preservado, usar ese; si no, usar el del empleado
      const auxilioMovilidadBase = employeeValues.mobility_assistance_final !== undefined
        ? Number(employeeValues.mobility_assistance_final) || 0  // Valor modificado desde el modal (base mensual)
        : Number(employee.mobilityassistance) || 0;  // Valor original del empleado
      
      if (auxilioMovilidadBase > 0) {
        const diasPeriodo = form.paymentMethod === "Quincenal" ? 15 : 30;
        const diasTrabajados = diasPeriodo - diasAfectadosAuxilioMovilidad;
        
        // Solo calcular si hay días trabajados (si todos los días están afectados, no hay auxilio)
        if (diasTrabajados > 0) {
          // Calcular auxilio proporcional: (auxilio mensual base / 30) * días trabajados
          const auxilioDiario = auxilioMovilidadBase / 30;
          auxilioMovilidad = auxilioDiario * diasTrabajados;
          auxilioMovilidad = Math.round(auxilioMovilidad * 100) / 100;
        }
      }
      
      // Guardar el auxilio de movilidad calculado
      newCalculatedValues[employee.id].mobility_assistance_final = auxilioMovilidad;

      // Calcular auxilio de transporte proporcional a los días trabajados
      const auxilioTransporteBase = Number(employee.transportationassistance) || 0;
      let auxilioTransporte = 0;
      
      if (auxilioTransporteBase > 0) {
        const diasPeriodo = form.paymentMethod === "Quincenal" ? 15 : 30;
        const diasTrabajados = diasPeriodo - diasAfectadosAuxilioTransporte;
        
        // Solo calcular si hay días trabajados (si todos los días están afectados, no hay auxilio)
        if (diasTrabajados > 0) {
          // Calcular auxilio proporcional: (auxilio diario) * días trabajados
          auxilioTransporte = auxilioTransporteBase * diasTrabajados;
          auxilioTransporte = Math.round(auxilioTransporte * 100) / 100;
        }
      }
      
      // Agregar el auxilio de transporte al total
      if (auxilioTransporte > 0) {
        newCalculatedValues[employee.id].total += auxilioTransporte;
      }
      
      // Guardar el auxilio de transporte calculado
      newCalculatedValues[employee.id].transportation_assistance_final = auxilioTransporte;

      // Calcular base de seguridad social: salario base proporcional + novedades prestacionales + auxilio movilidad (si excede 40%)
      // El salario base proporcional ya incluye solo los días trabajados
      // Pasar el salario base completo para calcular correctamente el 40%
      const baseSeguridadSocial = calculateBaseSeguridadSocial(
        salarioBaseProporcional, 
        valorPrestacionales, 
        auxilioMovilidad,
        salarioBaseCalculado // Pasar el salario base completo para comparar el 40%
      );

      // Guardar la base de seguridad social calculada para uso en otras partes
      newCalculatedValues[employee.id].base_security_social = baseSeguridadSocial;

      // Calcular si el auxilio de movilidad excede el 40% del salario base
      const cuarentaPorcientoSalario = salarioBaseCalculado * 0.4;
      const auxilioExcede40Porciento = auxilioMovilidad > cuarentaPorcientoSalario;

      // El auxilio de movilidad SIEMPRE se suma al devengado (el empleado lo recibe)
      // Si excede el 40%, también afecta la base de seguridad social (ya calculado arriba)
      if (auxilioMovilidad > 0) {
        newCalculatedValues[employee.id].total += auxilioMovilidad;
      }

      // CALCULAR DESCUENTOS DE SALUD Y PENSIÓN (4% cada uno de la base de seguridad social)
      const isSecondCut = form.paymentMethod === "Quincenal" && form.corte2 && !form.corte1;
      const shouldApply = shouldApplyHealthPensionDiscounts(form.paymentMethod, isSecondCut);
      const healthDiscount = shouldApply ? baseSeguridadSocial * 0.04 : 0;
      const pensionDiscount = shouldApply ? baseSeguridadSocial * 0.04 : 0;
      const socialSecurityDiscounts = healthDiscount + pensionDiscount;

      // Aplicar todos los descuentos
      newCalculatedValues[employee.id].total -= (absenceDiscounts + socialSecurityDiscounts);
      
      // Guardar descuentos por separado para mostrar en la interfaz
      newCalculatedValues[employee.id].health_discount = healthDiscount;
      newCalculatedValues[employee.id].pension_discount = pensionDiscount;
      newCalculatedValues[employee.id].social_security_discounts = socialSecurityDiscounts;
      newCalculatedValues[employee.id].absence_discounts = absenceDiscounts;
      newCalculatedValues[employee.id].transportation_assistance_discount = Math.round(descuentoAuxilioTransporte * 100) / 100;
      newCalculatedValues[employee.id].total_discounts = absenceDiscounts + socialSecurityDiscounts;
      
      // Redondear totales a 2 decimales para coincidir con el backend
      newCalculatedValues[employee.id].total = Math.round(newCalculatedValues[employee.id].total * 100) / 100;
      newCalculatedValues[employee.id].total_discounts = Math.round(newCalculatedValues[employee.id].total_discounts * 100) / 100;
      newCalculatedValues[employee.id].health_discount = Math.round(newCalculatedValues[employee.id].health_discount * 100) / 100;
      newCalculatedValues[employee.id].pension_discount = Math.round(newCalculatedValues[employee.id].pension_discount * 100) / 100;
      newCalculatedValues[employee.id].social_security_discounts = Math.round(newCalculatedValues[employee.id].social_security_discounts * 100) / 100;
      newCalculatedValues[employee.id].absence_discounts = Math.round(newCalculatedValues[employee.id].absence_discounts * 100) / 100;
      
    });
    
    setCalculatedValues(newCalculatedValues);
  };

  // Efecto para recalcular valores cuando cambien las novedades filtradas
  // useEffect(() => {
  //   calculateAllValues();
  // }, [filteredEmployeeNews, employees, typeNews]);

  // Función para calcular el total en el modal de detalles
  const calcularTotalNovedades = (novedades, employee) => {
    return novedades.reduce((total, novedad) => {
      const tipoNovedad = typeNews.find((t) => t.id === novedad.typeNewsId);
      if (!tipoNovedad) return total;
      const { valorNovedad } = calculateNovedadValue(
        novedad,
        employee,
        tipoNovedad
      );
      return total + valorNovedad;
    }, 0);
  };

  return (
    <>
      <Breadcrumbs pageTitle="Liquidación" parent="Liquidación" />
      <Container fluid>
        <Card>
          <CardBody>
            <Row className="mb-3">
              <Col md="3">
                <FormGroup>
                  <Label for="companyId">Empresa:</Label>
                  <Input
                    type="select"
                    name="companyId"
                    id="companyId"
                    onChange={handleChange}
                    value={form.companyId}
                    invalid={!!errors.companyId}
                    required
                  >
                    <option value="">Selecciona una empresa</option>
                    {companies?.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.companyname}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md="2">
                <FormGroup>
                  <Label for="paymentMethod">Frecuencia:</Label>
                  <Input
                    type="select"
                    name="paymentMethod"
                    id="paymentMethod"
                    onChange={handleChange}
                    value={form.paymentMethod}
                  >
                    <option value="">Todos</option>
                    <option value="Mensual">Mensual</option>
                    <option value="Quincenal">Quincenal</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="2">
                <FormGroup>
                  <Label for="startDate">Fecha Inicio:</Label>
                  <Input
                    type="date"
                    name="startDate"
                    id="startDate"
                    onChange={handleChange}
                    value={form.startDate}
                  />
                  {form.paymentMethod === "Mensual" && (
                    <small className="text-muted">Período: 1 al 30 del mismo mes</small>
                  )}
                  {form.paymentMethod === "Quincenal" && form.corte1 && !form.corte2 && (
                    <small className="text-muted">Período: 1 al 15 del mismo mes</small>
                  )}
                  {form.paymentMethod === "Quincenal" && form.corte2 && !form.corte1 && (() => {
                    const baseDate = form.startDate || form.endDate || new Date();
                    const year = new Date(baseDate).getFullYear();
                    const month = new Date(baseDate).getMonth() + 1;
                    const lastDayOfMonth = new Date(year, month, 0).getDate();
                    const maxDay = Math.min(30, lastDayOfMonth);
                    return (
                      <small className="text-muted">Período: 16 al {maxDay} del mismo mes</small>
                    );
                  })()}
                </FormGroup>
              </Col>
              <Col md="2">
                <FormGroup>
                  <Label for="endDate">Fecha Fin:</Label>
                  <Input
                    type="date"
                    name="endDate"
                    id="endDate"
                    onChange={handleChange}
                    value={form.endDate}
                  />
                  {form.paymentMethod === "Mensual" && (
                    <small className="text-muted">Período: 1 al 30 del mismo mes</small>
                  )}
                  {form.paymentMethod === "Quincenal" && form.corte1 && !form.corte2 && (
                    <small className="text-muted">Período: 1 al 15 del mismo mes</small>
                  )}
                  {form.paymentMethod === "Quincenal" && form.corte2 && !form.corte1 && (() => {
                    const baseDate = form.startDate || form.endDate || new Date();
                    const year = new Date(baseDate).getFullYear();
                    const month = new Date(baseDate).getMonth() + 1;
                    const lastDayOfMonth = new Date(year, month, 0).getDate();
                    const maxDay = Math.min(30, lastDayOfMonth);
                    return (
                      <small className="text-muted">Período: 16 al {maxDay} del mismo mes</small>
                    );
                  })()}
                </FormGroup>
              </Col>
       
              {/* <Col md="2">
                <FormGroup>
                  <Label for="newsStatus">Estado Novedades:</Label>
                  <Input
                    type="select"
                    name="newsStatus"
                    id="newsStatus"
                    onChange={handleChange}
                    value={form.newsStatus}
                  >
                    <option value="">Todos</option>
                    <option value="pending">Solo Pendientes</option>
                    <option value="liquidated">Solo Liquidadas</option>
                    <option value="mixed">Mixtas</option>
                    <option value="none">Sin Novedades</option>
                  </Input>
                </FormGroup>
              </Col> */}
              {form.paymentMethod === "Quincenal" && (
                <Col md="1">
                  <FormGroup>
                    <Label style={{ fontSize: "0.9rem" }}>Corte:</Label>
                    <div>
                      <Input
                        type="checkbox"
                        name="corte1"
                        id="corte1"
                        onChange={handleChange}
                        checked={form.corte1}
                      />
                      <Label for="corte1" style={{ fontSize: "0.8rem" }}>
                        1-15
                      </Label>
                    </div>
                    <div>
                      <Input
                        type="checkbox"
                        name="corte2"
                        id="corte2"
                        onChange={handleChange}
                        checked={form.corte2}
                      />
                      <Label for="corte2" style={{ fontSize: "0.8rem" }}>
                        16-30
                      </Label>
                    </div>
                  </FormGroup>
                </Col>
              )}
            </Row>

            {/* Validador de períodos */}
            {form.companyId && form.startDate && form.endDate && (
              <Row className="mb-2">
                <Col md="12">
                  <PeriodValidator
                    companyId={form.companyId}
                    startDate={form.startDate}
                    endDate={form.endDate}
                    corte1={form.corte1}
                    corte2={form.corte2}
                    paymentMethod={form.paymentMethod}
                    onValidationChange={(isValid, conflictingPeriods) => {
                      setPeriodValidation({ isValid, conflictingPeriods });
                    }}
                  />
                </Col>
              </Row>
            )}

            <Row className="mb-3">
              <Col md="6">
                <InputGroup>
                  <InputGroupText>
                    <i className="fas fa-search"></i>
                  </InputGroupText>
                  <Input
                    type="text"
                    placeholder="Buscar por documento, nombre, cargo o estado..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </InputGroup>
              </Col>
              <Col md="6">
                <div className="d-flex gap-2 justify-content-end">
                  <Button
                    color="success"
                    onClick={exportToExcel}
                    disabled={!filteredData.length}
                    size="sm"
                  >
                    <i className="fa fa-file-excel-o me-1"></i>
                    Exportar Excel
                  </Button>
                  <Button
                    color="primary"
                    onClick={saveLiquidation}
                    disabled={!filteredData.length || saving || !periodValidation.isValid}
                    size="sm"
                  >
                    {saving ? (
                      <>
                        <i className="fa fa-spinner fa-spin me-1"></i>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <i className="fa fa-save me-1"></i>
                        Guardar
                      </>
                    )}
                  </Button>
                  <Button
                    color="info"
                    onClick={() =>
                      (window.location.href = "/admin/liquidaciones_guardadas")
                    }
                    size="sm"
                  >
                    <i className="fa fa-list me-1"></i>
                    Ver Guardadas
                  </Button>
                </div>
              </Col>
            </Row>
            <div className="list-product">
              <div className="table-responsive">
                <DataTable
                  className="custom-scrollbar"
                  customStyles={customStyles}
                  conditionalRowStyles={conditionalRowStyles}
                  columns={columns}
                  data={filteredData}
                  progressPending={loading}
                  pagination
                  paginationServer
                  paginationTotalRows={filteredData.length}
                  paginationDefaultPage={1}
                  onChangePage={() => {}}
                  paginationPerPage={10}
                  striped
                  highlightOnHover
                  subHeader
                  dense
                  responsive
                  noDataComponent="No hay datos disponibles"
                  paginationComponentOptions={{
                    rowsPerPageText: "Filas por página:",
                    rangeSeparatorText: "de",
                    selectAllRowsItem: true,
                    selectAllRowsItemText: "Todos",
                  }}
                />
              </div>
            </div>
          </CardBody>
        </Card>
      </Container>
      <AddNews show={show} />
      {selectedEmployee && (
        <Modal
          isOpen={showDetails}
          toggle={() => setShowDetails(false)}
          size="xl"
          centered
        >
          <ModalHeader toggle={() => setShowDetails(false)}>
            <h2 className="mb-0">Detalles del Trabajador</h2>
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col md="6">
                <h4 className="mb-3">Información Personal</h4>
                <div className="mb-3">
                  <strong>Nombre Completo:</strong> {selectedEmployee.fullname}
                </div>
                <div className="mb-3">
                  <strong>Documento:</strong> {selectedEmployee.documenttype}{" "}
                  {selectedEmployee.documentnumber}
                </div>
                <div className="mb-3">
                  <strong>Cargo:</strong> {selectedEmployee.position}
                </div>
                <div className="mb-3">
                  <strong>Fecha de Inicio de Contrato:</strong>{" "}
                  {selectedEmployee.contractstartdate?.split("T")[0]}
                </div>
                <div className="mb-3">
                  <strong>Fecha de Finalización de Contrato:</strong>{" "}
                  {selectedEmployee.contractenddate?.split("T")[0]}
                </div>
              </Col>
              <Col md="6">
                <h4 className="mb-3">Información Laboral</h4>
                <div className="mb-3">
                  <strong>Tipo de Contrato:</strong>{" "}
                  {selectedEmployee.contracttype}
                </div>
                <div className="mb-3">
                  <strong>Jornada:</strong> {selectedEmployee.workday}
                </div>
                <div className="mb-3">
                  <strong>Salario Base:</strong>{" "}
                  {formatCurrency(selectedEmployee.basicmonthlysalary)}
                </div>
                <div className="mb-3">
                  <strong>Salario {form.paymentMethod}:</strong>{" "}
                  {formatCurrency(
                    form.paymentMethod === "Quincenal"
                      ? selectedEmployee.basicmonthlysalary / 2
                      : selectedEmployee.basicmonthlysalary
                  )}
                </div>
                <div className="mb-3">
                  <strong>Auxilio de Transporte:</strong>{" "}
                  {(() => {
                    const employeeValues = calculatedValues[selectedEmployee.id] || {};
                    const auxilioCalculado = calculateTransportationAssistance(
                      selectedEmployee,
                      form.paymentMethod
                    );
                    const descuento = employeeValues.transportation_assistance_discount || 0;
                    const auxilioFinal = employeeValues.transportation_assistance_final !== undefined 
                      ? employeeValues.transportation_assistance_final 
                      : auxilioCalculado;
                    
                    if (auxilioFinal <= 0) {
                      return "No aplica";
                    }
                    
                    if (descuento > 0) {
                      return (
                        <div>
                          <div>{formatCurrency(auxilioFinal)}</div>
                          <small className="text-danger">
                            (Auxilio: {formatCurrency(auxilioCalculado)} - Descuento: {formatCurrency(descuento)})
                          </small>
                        </div>
                      );
                    }
                    
                    return formatCurrency(auxilioFinal);
                  })()}
                </div>
                <div className="mb-3">
                  <strong>Auxilio de Movilidad:</strong>{" "}
                  {(() => {
                    const employeeValues = calculatedValues[selectedEmployee.id] || {};
                    const auxilio = employeeValues.mobility_assistance_final !== undefined 
                      ? employeeValues.mobility_assistance_final 
                      : 0;
                    return auxilio > 0 ? formatCurrency(auxilio) : "No aplica";
                  })()}
                </div>
                <div className="mb-3">
                  <strong>Descuento Salud (4%):</strong>{" "}
                  {(() => {
                    const employeeValues = calculatedValues[selectedEmployee.id] || {};
                    return formatCurrency(employeeValues.health_discount || 0);
                  })()}
                </div>
                <div className="mb-3">
                  <strong>Descuento Pensión (4%):</strong>{" "}
                  {(() => {
                    const employeeValues = calculatedValues[selectedEmployee.id] || {};
                    return formatCurrency(employeeValues.pension_discount || 0);
                  })()}
                </div>
                <div className="mb-3">
                  <strong>Total Descuentos Seguridad Social:</strong>{" "}
                  {(() => {
                    const employeeValues = calculatedValues[selectedEmployee.id] || {};
                    return formatCurrency(employeeValues.social_security_discounts || 0);
                  })()}
                </div>
                <div className="mb-3">
                  <strong>Valor por hora:</strong>{" "}
                  {formatCurrency(selectedEmployee.hourlyrate)}
                </div>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col md="12">
                <h4 className="mb-3">Novedades</h4>
                <div className="table-responsive">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Tipo de Novedad</th>
                        <th>Fecha Inicio</th>
                        <th>Hora Inicio</th>
                        <th>Fecha Fin</th>
                        <th>Hora Fin</th>
                        <th># Horas</th>
                        <th>Estado</th>
                        <th>Valor de la Novedad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployeeNews
                        .filter(
                          (news) => news.employeeId === selectedEmployee.id
                        )
                        .map((news) => {
                          const tipoNovedad = typeNews.find(
                            (type) => type.id === news.typeNewsId
                          );

                          // Calcular el valor de la novedad directamente
                          const { valorNovedad, totalHoras } =
                            calculateNovedadValue(
                              news,
                              selectedEmployee,
                              tipoNovedad
                            );

                          return (
                            <tr key={news.id}>
                              <td>{news.id}</td>
                              <td>{news.type_news_name}</td>
                              <td>
                                {moment
                                  .utc(news.startDate)
                                  .format("YYYY-MM-DD")}
                              </td>
                              <td>
                                {news.startTime
                                  ? news.startTime.slice(0, -3)
                                  : ""}
                              </td>
                              <td>
                                {moment.utc(news.endDate).format("YYYY-MM-DD")}
                              </td>
                              <td>
                                {news.endTime ? news.endTime.slice(0, -3) : ""}
                              </td>
                              <td>{totalHoras}</td>
                              <td>
                                {news.status === "active"
                                  ? "Activo"
                                  : "Inactivo"}
                              </td>
                              <td>{formatCurrency(valorNovedad)}</td>
                            </tr>
                          );
                        })}
                      {/* Fila de total de novedades */}
                      <tr>
                        <td
                          colSpan={8}
                          style={{ textAlign: "right", fontWeight: "bold" }}
                        >
                          Total Novedades:
                        </td>
                        <td style={{ fontWeight: "bold" }}>
                          {formatCurrency(
                            calcularTotalNovedades(
                              filteredEmployeeNews.filter(
                                (news) =>
                                  news.employeeId === selectedEmployee.id
                              ),
                              selectedEmployee
                            )
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
      )}

      {/* Modal de Error */}
      <Modal
        isOpen={showErrorModal}
        toggle={() => setShowErrorModal(false)}
        centered
      >
        <ModalHeader toggle={() => setShowErrorModal(false)}>
          <div className="d-flex align-items-center">
            <i className="fa fa-exclamation-triangle text-danger me-2"></i>
            Error de Liquidación
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="text-center">
            <i
              className="fa fa-times-circle text-danger"
              style={{ fontSize: "3rem" }}
            ></i>
            <p className="mt-3 mb-0">{errorMessage}</p>
          </div>
          <div className="text-center mt-3">
            <Button color="primary" onClick={() => setShowErrorModal(false)}>
              Entendido
            </Button>
          </div>
        </ModalBody>
      </Modal>

      {/* Modal para editar Auxilio de Movilidad */}
      <Modal
        isOpen={showMobilityModal}
        toggle={() => {
          setShowMobilityModal(false);
          setSelectedEmployeeForMobility(null);
          setMobilityValue("");
        }}
        centered
      >
        <ModalHeader toggle={() => {
          setShowMobilityModal(false);
          setSelectedEmployeeForMobility(null);
          setMobilityValue("");
        }}>
          Editar Auxilio de Movilidad
        </ModalHeader>
        <ModalBody>
          {selectedEmployeeForMobility && (
            <>
              <FormGroup>
                <Label>Trabajador</Label>
                <div
                  style={{
                    padding: "0.5rem 0.75rem",
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #ced4da",
                    borderRadius: "0.25rem",
                    color: "#212529",
                    fontWeight: "500"
                  }}
                >
                  {selectedEmployeeForMobility.fullname}
                </div>
              </FormGroup>
              <FormGroup>
                <Label>Valor del Auxilio de Movilidad</Label>
                <InputGroup>
                  <InputGroupText>$</InputGroupText>
                  <Input
                    type="number"
                    value={mobilityValue}
                    onChange={(e) => setMobilityValue(e.target.value)}
                    placeholder="0"
                    min="0"
                    step="1"
                  />
                </InputGroup>
              </FormGroup>
            </>
          )}
        </ModalBody>
        <div className="modal-footer" style={{ padding: "1rem", borderTop: "1px solid #dee2e6" }}>
          <Button
            color="secondary"
            onClick={() => {
              setShowMobilityModal(false);
              setSelectedEmployeeForMobility(null);
              setMobilityValue("");
            }}
          >
            Cancelar
          </Button>
          <Button
            color="primary"
            onClick={() => {
              if (selectedEmployeeForMobility) {
                const value = parseFloat(mobilityValue) || 0;
                // Crear objeto con el valor preservado para pasar a calculateAllValues
                const preservedMobilityValues = {
                  [selectedEmployeeForMobility.id]: {
                    mobility_assistance_final: value,
                  },
                };
                
                // Actualizar calculatedValues y recalcular todo
                setCalculatedValues((prev) => {
                  const updated = {
                    ...prev,
                    [selectedEmployeeForMobility.id]: {
                      ...prev[selectedEmployeeForMobility.id],
                      mobility_assistance_final: value,
                    },
                  };
                  // Recalcular pasando los valores preservados
                  setTimeout(() => {
                    calculateAllValues(preservedMobilityValues);
                  }, 0);
                  return updated;
                });
                setShowMobilityModal(false);
                setSelectedEmployeeForMobility(null);
                setMobilityValue("");
                toast.success("Auxilio de movilidad actualizado");
              }
            }}
          >
            Guardar
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default LiquidationForm;
