import Breadcrumbs from "@/utils/CommonComponent/Breadcrumb";
import SVG from "@/utils/CommonComponent/SVG/Svg";
import {
  companiesApi,
  employeesApi,
  newsApi,
  employeeNewsApi,
  typeNewsApi,
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


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
      name: "Valor por hora",
      selector: (row) => formatCurrency(row.hourlyrate),
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Metodo de pago",
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
      const response = await employeesApi.list();
      if (response.length) setEmployees(response);
    } catch (error) {
      console.error("Error al cargar los empleados", error);
      toast.error("Error al cargar los empleados");
    }
  };

  const loadCompanies = async () => {
    try {
      const response = await companiesApi.list();
      if (response.length) setCompanies(response);
    } catch (error) {
      console.error("Error al cargar las empresas", error);
      toast.error("Error al cargar las empresas");
    }
  };

  const loadEmployeeNews = async () => {
    try {
      const response = await employeeNewsApi.list();
      if (response.length) setEmployeeNews(response);
    } catch (error) {
      console.error("Error al cargar las novedades", error);
      toast.error("Error al cargar las novedades");
    }
  };

  const loadTypeNews = async () => {
    try {
      const response = await typeNewsApi.list();
      if (response.length) setTypeNews(response);
    } catch (error) {
      console.error("Error al cargar los tipos de novedades", error);
      toast.error("Error al cargar los tipos de novedades");
    }
  };

  useEffect(() => {
    loadEmployees();
    loadCompanies();
    loadEmployeeNews();
    loadTypeNews();
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
        "Valor por hora": formatCurrency(employee.hourlyrate),
        "Metodo de pago": employee.paymentmethod || "No disponible",
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
      // Verificar si la novedad está activa
      if (news.status !== "active") return false;

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

    console.log("Novedades filtradas:", filtered.length);
    setFilteredEmployeeNews(filtered);
  };

  // Efecto para actualizar las novedades filtradas cuando cambien los filtros
  useEffect(() => {
    generateFilteredNews();
  }, [form, employeeNews]);

  // Función para calcular el valor de una novedad
  const calculateNovedadValue = (novedad, employee, tipoNovedad) => {
    let valorNovedad = 0;
    let totalHoras = 0;

    const fechaInicio = moment.utc(novedad.startDate);
    const fechaFin = moment.utc(novedad.endDate);

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

      const valorHoraExtra =
        Number(employee.hourlyrate) * (Number(tipoNovedad.percentage) / 100);
      valorNovedad = totalHoras * valorHoraExtra;
    } else {
      const dias = fechaFin.diff(fechaInicio, "days") + 1;
      const valorDia = Number(employee.basicmonthlysalary) / 30;
      valorNovedad = dias * valorDia * (Number(tipoNovedad.percentage) / 100);
    }

    return { valorNovedad, totalHoras };
  };

  // Función para calcular todos los valores
  const calculateAllValues = () => {
    const newCalculatedValues = {};

    employees.forEach((employee) => {
      newCalculatedValues[employee.id] = {
        novedades: {},
        total: 0,
      };

      // Agregar el salario base según el método de pago
      const salarioBase = Number(employee.basicmonthlysalary);
      if (form.paymentMethod === "Quincenal") {
        newCalculatedValues[employee.id].total += salarioBase / 2;
      } else if (form.paymentMethod === "Mensual") {
        newCalculatedValues[employee.id].total += salarioBase;
      }

      typeNews.forEach((type) => {
        // Obtener todas las novedades del mismo tipo para el empleado
        const novedadesDelTipo = filteredEmployeeNews.filter(
          (news) =>
            news.employeeId === employee.id && news.typeNewsId === type.id
        );

        if (novedadesDelTipo.length > 0) {
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
          newCalculatedValues[employee.id].total += valorTotal;
        }
      });
    });

    setCalculatedValues(newCalculatedValues);
  };

  // Efecto para recalcular valores cuando cambien las novedades filtradas
  useEffect(() => {
    calculateAllValues();
  }, [filteredEmployeeNews, employees, typeNews]);

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
                  <Label for="paymentMethod">Método de Pago:</Label>
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
              <Col>
                <Button
                  color="success"
                  onClick={exportToExcel}
                  disabled={!filteredData.length}
                >
                  <i className="fa fa-file-excel-o me-2"></i>
                  Exportar a Excel
                </Button>
              </Col>
            </Row>
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
