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
import moment from "moment";

const initialState = {
  companyId: null,
  startDate: new Date(new Date().setMonth(new Date().getMonth() - 1))
    .toISOString()
    .split("T")[0],
  endDate: new Date().toISOString().split("T")[0],
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
      when: (row) => row.hasNews,
      style: {
        backgroundColor: "rgba(255, 165, 0, 0.1)",
        "&:hover": {
          backgroundColor: "rgba(255, 165, 0, 0.2) !important",
        },
      },
    },
    {
      when: (row) => !row.hasNews,
      style: {
        backgroundColor: "rgba(0, 255, 0, 0.1)",
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
      minWidth: "150px",
    },
    {
      name: "Nombre",
      selector: (row) => row.fullname,
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Cargo",
      selector: (row) => row.position || "No disponible",
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Tipo de Contrato",
      selector: (row) => row.contracttype || "No disponible",
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Salario Base",
      selector: (row) => formatCurrency(row.basicmonthlysalary),
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Auxilio de Transporte",
      cell: (row) => {
        const auxilioCalculado = calculateTransportationAssistance(
          row,
          form.paymentMethod
        );
        return auxilioCalculado > 0
          ? formatCurrency(auxilioCalculado)
          : "No aplica";
      },
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Valor por hora",
      selector: (row) => formatCurrency(row.hourlyrate),
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Frecuencia de pago",
      selector: (row) => row.paymentmethod || "No disponible",
      sortable: true,
      minWidth: "150px",
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

        if (row.id === 6) {
          console.log("novedadesDelEmpleado", novedadesDelEmpleado);
          console.log("totalTipo", totalTipo);
        }

        return totalTipo ? formatCurrency(totalTipo) : "";
      },
      sortable: true,
      minWidth: "100px",
    })),
    {
      name: "Total",
      cell: (row) => {
        const employeeValues = calculatedValues[row.id];
        return formatCurrency(employeeValues?.total || 0);
      },
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Acción",
      cell: (row) => <LiquidationListTableAction row={row} />,
      minWidth: "100px",
    },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const loadEmployees = async () => {
    try {
      console.log("🔄 loadEmployees ejecutándose para liquidación...");
      const response = await employeesApi.list();
      if (response.length) {
        console.log(
          `✅ ${response.length} empleados cargados para liquidación`
        );
        setEmployees(response);
      }
    } catch (error) {
      console.error(
        "❌ Error al cargar los empleados para liquidación:",
        error
      );
      toast.error("Error al cargar la lista de empleados");
    }
  };

  const loadCompanies = async () => {
    try {
      console.log("🏢 loadCompanies ejecutándose para liquidación...");
      const response = await companiesApi.list();
      if (response.length) {
        console.log(`✅ ${response.length} empresas cargadas para liquidación`);
        setCompanies(response);
      }
    } catch (error) {
      console.error("❌ Error al cargar las empresas para liquidación:", error);
      toast.error("Error al cargar la lista de empresas");
    }
  };

  const loadEmployeeNews = async () => {
    try {
      console.log("📰 loadEmployeeNews ejecutándose para liquidación...");
      const response = await employeeNewsApi.list();
      if (response.length) {
        console.log(
          `✅ ${response.length} novedades de empleados cargadas para liquidación`
        );
        setEmployeeNews(response);
      }
    } catch (error) {
      console.error(
        "❌ Error al cargar las novedades para liquidación:",
        error
      );
      toast.error("Error al cargar la lista de novedades");
    }
  };

  const loadTypeNews = async () => {
    try {
      console.log("🔄 loadTypeNews ejecutándose para liquidación...");
      const response = await typeNewsApi.list();
      console.log(
        "📊 Respuesta de tipos de novedad para liquidación:",
        response
      );

      if (response && response.data && response.data.length) {
        console.log(
          `✅ ${response.data.length} tipos de novedad cargados para liquidación`
        );
        setTypeNews(response.data);
      } else if (response && Array.isArray(response)) {
        console.log(
          `✅ ${response.length} tipos de novedad cargados para liquidación (array directo)`
        );
        setTypeNews(response);
      } else {
        console.log(
          "⚠️ Respuesta inesperada de tipos de novedad para liquidación:",
          response
        );
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
    console.log(
      "🚀 useEffect ejecutándose - Cargando datos iniciales para liquidación"
    );

    // Cargar datos en secuencia para evitar problemas de sincronización
    const loadDataSequentially = async () => {
      try {
        // 1. Primero cargar empresas
        console.log("🏢 Cargando empresas...");
        await loadCompanies();

        // 2. Luego cargar tipos de novedad
        console.log("📋 Cargando tipos de novedad...");
        await loadTypeNews();

        // 3. Luego cargar empleados
        console.log("👤 Cargando empleados...");
        await loadEmployees();

        // 4. Finalmente cargar novedades de empleados
        console.log("📰 Cargando novedades de empleados...");
        await loadEmployeeNews();

        console.log("✅ Carga secuencial completada para liquidación");
      } catch (error) {
        console.error("❌ Error en carga secuencial de liquidación:", error);
      }
    };

    loadDataSequentially();
  }, []);

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
        const hasNews = employeeNews.some((news) => {
          return (
            news.employeeId === emp.id &&
            news.status === "active" &&
            news.approved === true &&
            isInRange(news)
          );
        });

        return {
          ...emp,
          hasNews,
        };
      });

      setDataTable(employeesWithNews);
    } else {
      setDataTable([]);
    }
  }, [
    form.companyId,
    form.startDate,
    form.endDate,
    form.paymentMethod,
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
          const auxilioCalculado = calculateTransportationAssistance(
            employee,
            form.paymentMethod
          );
          return auxilioCalculado > 0
            ? formatCurrency(auxilioCalculado)
            : "No aplica";
        })(),
        "Valor por hora": formatCurrency(employee.hourlyrate),
        "Frecuencia de pago": employee.paymentmethod || "No disponible",
      };

      // Agregar columnas dinámicas de tipos de novedad
      typeNews.forEach((type) => {
        const novedadesDelEmpleado = filteredEmployeeNews.filter((novedad) => {
          const esDelEmpleado = novedad.employeeId === employee.id;
          const esDelTipoNovedad = novedad.typeNewsId === type.id;
          return esDelEmpleado && esDelTipoNovedad;
        });

        const totalTipo = novedadesDelEmpleado.reduce((sum, novedad) => {
          const { valorNovedad } = calculateNovedadValue(
            novedad,
            employee,
            type
          );
          return sum + valorNovedad;
        }, 0);

        baseData[type.code] = totalTipo ? formatCurrency(totalTipo) : "";
      });

      // Agregar el total
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

    try {
      setSaving(true);

      // Preparar los datos de empleados para la liquidación
      const employees_data = filteredData.map((employee) => {
        const employeeValues = calculatedValues[employee.id] || { total: 0 };

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

        // Calcular totales
        const totalNovedades = news_data.reduce(
          (sum, news) => sum + news.amount,
          0
        );
        
        // Calcular descuentos por ausentismo
        const absenceDiscounts = calculateAbsenceDiscounts(
          employee,
          form.startDate,
          form.endDate
        );
        const totalDiscounts = absenceDiscounts;

        // Convertir a números para evitar concatenación de strings
        const basicSalary = Number(employee.basicmonthlysalary) || 0;
        const basicSalaryForPeriod =
          form.paymentMethod === "Quincenal" ? basicSalary / 2 : basicSalary;

        const netAmount =
          basicSalaryForPeriod +
          transportationAssistance +
          totalNovedades -
          totalDiscounts;

        return {
          employee_id: employee.id,
          basic_salary: basicSalaryForPeriod,
          transportation_assistance: transportationAssistance,
          mobility_assistance: 0, // Por ahora no hay auxilio de movilidad
          total_novedades: totalNovedades,
          total_discounts: totalDiscounts,
          net_amount: netAmount,
          news_data: news_data,
        };
      });

      // Crear la liquidación
      const liquidationData = {
        company_id: form.companyId,
        period_start: form.startDate,
        period_end: form.endDate,
        payment_frequency: form.paymentMethod || "Mensual",
        cut_number: form.corte1 ? 1 : form.corte2 ? 2 : null,
        employees_data: employees_data,
      };

      const result = await liquidationsApi.create(liquidationData);

      toast.success("Liquidación guardada exitosamente");

      // Redirigir al dashboard de liquidaciones guardadas
      setTimeout(() => {
        window.location.href = '/admin/liquidaciones_guardadas';
      }, 1500);
    } catch (error) {
      console.error("Error al guardar liquidación:", error);
      toast.error(
        "Error al guardar la liquidación: " +
          (error.message || "Error desconocido")
      );
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
    console.log("🔄 generateFilteredNews ejecutándose...");
    console.log("📰 Novedades totales disponibles:", employeeNews.length);
    console.log("📅 Filtros de fecha:", {
      startDate: form.startDate,
      endDate: form.endDate,
    });
    console.log("💳 Método de pago:", form.paymentMethod);

    const filtered = employeeNews.filter((news) => {
      // Verificar si la novedad está activa y aprobada
      if (news.status !== "active") return false;
      if (news.approved !== true) return false;

      const newsStart = moment.utc(news.startDate);
      const newsEnd = moment.utc(news.endDate);
      const filterStart = moment.utc(form.startDate);
      const filterEnd = moment.utc(form.endDate);

      // Verificar si está dentro del rango de fechas general
      const isInDateRange =
        (newsStart.isSameOrAfter(filterStart) &&
          newsStart.isSameOrBefore(filterEnd)) ||
        (newsEnd.isSameOrAfter(filterStart) &&
          newsEnd.isSameOrBefore(filterEnd)) ||
        (newsStart.isSameOrBefore(filterStart) &&
          newsEnd.isSameOrAfter(filterEnd));

      if (!isInDateRange) return false;

      // Si es quincenal y hay cortes seleccionados
      if (form.paymentMethod === "Quincenal" && (form.corte1 || form.corte2)) {
        const diaInicio = newsStart.date();

        // Para corte 2 (16-31)
        if (!form.corte1 && form.corte2) {
          return diaInicio >= 16;
        }

        // Para corte 1 (1-15)
        if (form.corte1 && !form.corte2) {
          return diaInicio <= 15;
        }
      }

      return true;
    });

    console.log("✅ Novedades filtradas:", filtered.length);
    console.log(
      "📊 Novedades filtradas:",
      filtered.map((n) => ({
        id: n.id,
        employeeId: n.employeeId,
        typeNewsId: n.typeNewsId,
        status: n.status,
        approved: n.approved,
      }))
    );
    setFilteredEmployeeNews(filtered);
  };

  // Efecto para actualizar las novedades filtradas cuando cambien los filtros
  useEffect(() => {
    generateFilteredNews();
  }, [form, employeeNews]);

  // useEffect adicional para asegurar que los cálculos se ejecuten solo cuando todos los datos estén disponibles
  useEffect(() => {
    if (
      typeNews.length > 0 &&
      employees.length > 0 &&
      filteredEmployeeNews.length >= 0
    ) {
      console.log("🔄 Todos los datos disponibles, ejecutando cálculos...");
      calculateAllValues();
    } else {
      console.log("⏳ Esperando que todos los datos estén disponibles...", {
        typeNews: typeNews.length,
        employees: employees.length,
        filteredEmployeeNews: filteredEmployeeNews.length,
      });
    }
  }, [typeNews, employees, filteredEmployeeNews]);

  // Función para calcular el valor de una novedad
  const calculateNovedadValue = (novedad, employee, tipoNovedad) => {
    console.log("🔍 calculateNovedadValue ejecutándose con:", {
      novedadId: novedad.id,
      employeeId: employee.id,
      tipoNovedadId: tipoNovedad?.id,
      tipoNovedadName: tipoNovedad?.name,
    });

    // Verificar que tipoNovedad esté definido
    if (!tipoNovedad) {
      console.error("❌ tipoNovedad es undefined para novedad:", novedad.id);
      console.error("📊 typeNews disponibles:", typeNews.length);
      console.error(
        "📊 typeNews:",
        typeNews.map((t) => ({ id: t.id, name: t.name }))
      );
      return { valorNovedad: 0, totalHoras: 0 };
    }

    let valorNovedad = 0;
    let totalHoras = 0;

    const fechaInicio = moment.utc(novedad.startDate);
    const fechaFin = moment.utc(novedad.endDate);

    if (tipoNovedad.calculateperhour) {
      console.log(`⏰ Calculando por hora para tipo: ${tipoNovedad.name}`);
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

      const valorHoraExtra =
        Number(employee.hourlyrate) * (Number(tipoNovedad.percentage) / 100);
      valorNovedad = totalHoras * valorHoraExtra;
    } else {
      console.log(`📅 Calculando por día para tipo: ${tipoNovedad.name}`);
      const dias = fechaFin.diff(fechaInicio, "days") + 1;
      const valorDia = Number(employee.basicmonthlysalary) / 30;
      valorNovedad = dias * valorDia * (Number(tipoNovedad.percentage) / 100);
    }

    console.log(
      `💰 Resultado cálculo: valorNovedad = ${valorNovedad}, totalHoras = ${totalHoras}`
    );
    return { valorNovedad, totalHoras };
  };

  // Función para calcular descuentos por ausentismo (días de descanso)
  const calculateAbsenceDiscounts = (employee, periodStart, periodEnd) => {
    // Buscar novedades de ausentismo del empleado en el período
    const ausentismoNews = filteredEmployeeNews.filter(
      (news) =>
        news.employeeId === employee.id &&
        news.typeNewsId === 26 && // ID del tipo de novedad Ausentismo
        moment(news.startDate).isBetween(periodStart, periodEnd, null, '[]')
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
      const absenceDays = endDate.diff(absenceDate, 'days') + 1;
      
      // Para cada día de ausencia, calcular el descuento de días de descanso
      for (let i = 0; i < absenceDays; i++) {
        const currentAbsenceDate = absenceDate.clone().add(i, 'days');
        
        // Lógica semanal: si falta un día, descuenta el siguiente domingo
        const nextSunday = currentAbsenceDate.clone().day(0); // Domingo = 0
        if (nextSunday.isSameOrBefore(currentAbsenceDate)) {
          nextSunday.add(1, 'week');
        }
        
        // Verificar si el domingo a descontar está dentro del período de liquidación
        if (nextSunday.isBetween(periodStart, periodEnd, null, '[]')) {
          totalDiscountAmount += dailySalary;
          console.log(
            `📅 Ausentismo ${currentAbsenceDate.format('YYYY-MM-DD')} → Descuenta domingo ${nextSunday.format('YYYY-MM-DD')}: $${dailySalary}`
          );
        }
      }
    });

    return totalDiscountAmount;
  };

  // Función para calcular todos los valores
  const calculateAllValues = () => {
    console.log("🔢 calculateAllValues ejecutándose...");
    console.log("👥 Empleados disponibles:", employees.length);
    console.log("📋 Tipos de novedad disponibles:", typeNews.length);
    console.log(
      "📰 Novedades filtradas disponibles:",
      filteredEmployeeNews.length
    );

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

      newCalculatedValues[employee.id].total += salarioBaseCalculado;
      console.log(
        `💰 Salario base agregado para ${employee.fullname}: $${salarioBaseCalculado}`
      );

      // Agregar el auxilio de transporte según el método de pago
      const auxilioTransporte = calculateTransportationAssistance(
        employee,
        form.paymentMethod
      );
      if (auxilioTransporte > 0) {
        newCalculatedValues[employee.id].total += auxilioTransporte;
        console.log(
          `🚌 Auxilio de transporte agregado para ${employee.fullname}: $${auxilioTransporte}`
        );
      }

      typeNews.forEach((type) => {
        console.log(
          `🔍 Procesando tipo de novedad: ${type.name} (ID: ${type.id}) para empleado: ${employee.fullname}`
        );

        // Obtener todas las novedades del mismo tipo para el empleado
        const novedadesDelTipo = filteredEmployeeNews.filter(
          (news) =>
            news.employeeId === employee.id && news.typeNewsId === type.id
        );

        if (novedadesDelTipo.length > 0) {
          console.log(
            `📊 ${novedadesDelTipo.length} novedades encontradas del tipo ${type.name} para ${employee.fullname}`
          );
          let valorTotal = 0;
          let horasTotal = 0;

          // Sumar todas las novedades del mismo tipo
          novedadesDelTipo.forEach((novedad) => {
            const { valorNovedad, totalHoras } = calculateNovedadValue(
              novedad,
              employee,
              type
            );
            valorTotal += valorNovedad;
            horasTotal += totalHoras;
          });

          newCalculatedValues[employee.id].novedades[type.id] = {
            valor: valorTotal,
            horas: horasTotal,
            novedades: novedadesDelTipo,
          };

          // LÓGICA DE DESCUENTOS: Si la novedad afecta a ciertos campos, se descuentan del total
          if (type.affects) {
            let affectsData;
            try {
              // Parsear el campo affects que es un JSON string
              affectsData =
                typeof type.affects === "string" && type.affects
                  ? JSON.parse(type.affects)
                  : type.affects || {};
            } catch (error) {
              console.error(
                "❌ Error al parsear affects para tipo de novedad:",
                type.id,
                error
              );
              affectsData = {};
            }

            console.log(
              `🔍 Tipo de novedad ${type.name} afecta a:`,
              affectsData
            );

            // Si afecta al salario base, descontar el salario base
            if (
              affectsData.basicmonthlysalary === true ||
              affectsData.basicmonthlysalary === "true"
            ) {
              newCalculatedValues[employee.id].total -= salarioBaseCalculado;
              console.log(
                `💸 Descontando salario base para ${employee.fullname}: -$${salarioBaseCalculado}`
              );
            }

            // Si afecta al auxilio de transporte, descontar el auxilio de transporte
            if (
              affectsData.transportationassistance === true ||
              affectsData.transportationassistance === "true"
            ) {
              newCalculatedValues[employee.id].total -= auxilioTransporte;
              console.log(
                `💸 Descontando auxilio de transporte para ${employee.fullname}: -$${auxilioTransporte}`
              );
            }

            // Si afecta a otros campos, también descontarlos
            if (
              affectsData.hourlyrate === true ||
              affectsData.hourlyrate === "true"
            ) {
              const valorHora = Number(employee.hourlyrate) || 0;
              newCalculatedValues[employee.id].total -= valorHora;
              console.log(
                `💸 Descontando valor por hora para ${employee.fullname}: -$${valorHora}`
              );
            }

            if (
              affectsData.mobilityassistance === true ||
              affectsData.mobilityassistance === "true"
            ) {
              const auxilioMovilidad = Number(employee.mobilityassistance) || 0;
              newCalculatedValues[employee.id].total -= auxilioMovilidad;
              console.log(
                `💸 Descontando auxilio de movilidad para ${employee.fullname}: -$${auxilioMovilidad}`
              );
            }

            if (
              affectsData.discountvalue === true ||
              affectsData.discountvalue === "true"
            ) {
              const valorDescuento = Number(employee.discountvalue) || 0;
              newCalculatedValues[employee.id].total -= valorDescuento;
              console.log(
                `💸 Descontando valor de descuento para ${employee.fullname}: -$${valorDescuento}`
              );
            }
          }

          // Agregar el valor de la novedad al total
          newCalculatedValues[employee.id].total += valorTotal;

          console.log(
            `💰 Total para tipo ${type.name}: $${valorTotal}, horas: ${horasTotal}`
          );
        } else {
          console.log(
            `📭 No hay novedades del tipo ${type.name} para ${employee.fullname}`
          );
        }
      });

      // CALCULAR DESCUENTOS POR AUSENTISMO (días de descanso)
      const absenceDiscounts = calculateAbsenceDiscounts(
        employee,
        form.startDate,
        form.endDate
      );
      
      if (absenceDiscounts > 0) {
        newCalculatedValues[employee.id].total -= absenceDiscounts;
        newCalculatedValues[employee.id].total_discounts = absenceDiscounts;
        console.log(
          `📅 Descuentos por ausentismo para ${employee.fullname}: -$${absenceDiscounts}`
        );
      }
    });

    console.log("✅ calculateAllValues completado:", newCalculatedValues);
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
              <Col md="4">
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
              <Col md="4">
                <FormGroup>
                  <Label for="startDate">Fecha Inicio:</Label>
                  <Input
                    type="date"
                    name="startDate"
                    id="startDate"
                    onChange={handleChange}
                    value={form.startDate}
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="endDate">Fecha Fin:</Label>
                  <Input
                    type="date"
                    name="endDate"
                    id="endDate"
                    onChange={handleChange}
                    value={form.endDate}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md="4">
                <FormGroup>
                  <Label for="paymentMethod">Frecuencia de Pago:</Label>
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
              {form.paymentMethod === "Quincenal" && (
                <Col md="4">
                  <FormGroup>
                    <Label>Corte:</Label>
                    <div>
                      <Input
                        type="checkbox"
                        name="corte1"
                        id="corte1"
                        onChange={handleChange}
                        checked={form.corte1}
                      />
                      <Label for="corte1" className="ms-2">
                        Corte 1 (01-15)
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
                      <Label for="corte2" className="ms-2">
                        Corte 2 (16-30)
                      </Label>
                    </div>
                  </FormGroup>
                </Col>
              )}
            </Row>

            <Row className="mb-3">
              <Col md="4">
                <div className="mb-3">
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
                </div>
              </Col>
              <Col md="3">
                <Button
                  color="success"
                  onClick={exportToExcel}
                  disabled={!filteredData.length}
                >
                  <i className="fa fa-file-excel-o me-2"></i>
                  Exportar a Excel
                </Button>
              </Col>
              <Col md="3">
                <Button
                  color="primary"
                  onClick={saveLiquidation}
                  disabled={!filteredData.length || saving}
                >
                  {saving ? (
                    <>
                      <i className="fa fa-spinner fa-spin me-2"></i>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <i className="fa fa-save me-2"></i>
                      Guardar Liquidación
                    </>
                  )}
                </Button>
              </Col>
              <Col md="3">
                <Button
                  color="info"
                  onClick={() => window.location.href = '/admin/liquidaciones_guardadas'}
                  className="ms-2"
                >
                  <i className="fa fa-list me-2"></i>
                  Ver Liquidaciones Guardadas
                </Button>
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
                    const auxilioCalculado = calculateTransportationAssistance(
                      selectedEmployee,
                      form.paymentMethod
                    );
                    return auxilioCalculado > 0
                      ? formatCurrency(auxilioCalculado)
                      : "No aplica";
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
    </>
  );
};

export default LiquidationForm;
