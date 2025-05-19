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
  const [typeNews, setTypeNews] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [show, setShow] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

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
      name: "Fecha De Inicio De Contrato",
      selector: (row) =>
        row.contractstartdate?.split("T")[0] || "No disponible",
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
    ...typeNews.map((type) => ({
      name: type.code,
      cell: (row) => {
        const hasNews = employeeNews.some(
          (news) =>
            news.employeeId === row.id &&
            news.typeNewsId === type.id &&
            news.status === "active" &&
            toDateString(news.startDate) <= toDateString(form.endDate) &&
            toDateString(news.endDate) >= toDateString(form.startDate)
        );
        return hasNews ? "✓" : "";
      },
      sortable: true,
      minWidth: "100px",
    })),
    {
      name: "Total",
      cell: (row) => {
        // 1. Filtrar novedades activas para este empleado en el rango de fechas
        const novedadesEmpleado = employeeNews.filter(
          (news) =>
            news.employeeId === row.id &&
            news.status === "active" &&
            toDateString(news.startDate) <= toDateString(form.endDate) &&
            toDateString(news.endDate) >= toDateString(form.startDate)
        );

        // 2. Calcular el total según el tipo de novedad
        let total = parseFloat(row.basicmonthlysalary);
        let valorNovedades = 0;

        novedadesEmpleado.forEach((news) => {
          console.log("news", news);
          // Buscar el tipo de novedad correspondiente
          const tipoNovedad = typeNews.find(
            (type) => type.id === news.typeNewsId
          );

          console.log("tipoNovedad", tipoNovedad);

          if (!tipoNovedad) return;

          if (tipoNovedad.noaplicaauxiliotransporte) {
            // Si no aplica auxilio de transporte, calcular el valor de la novedad
            const valorNovedad =
              row.basicmonthlysalary *
              (parseFloat(tipoNovedad.percentage) / 100);
            valorNovedades += valorNovedad;
          } else if (tipoNovedad.calculateperhour) {
            // Extrae solo la parte de la fecha usando UTC
            const fechaInicio = moment.utc(news.startDate).startOf("day");
            const fechaFin = moment.utc(news.endDate).startOf("day");

            // Calcular el número de días (ambos inclusive)
            const dias = fechaFin.diff(fechaInicio, "days") + 1;

            // Calcular el número de horas entre startTime y endTime
            const [startHour, startMinute] = news.startTime
              .split(":")
              .map(Number);
            const [endHour, endMinute] = news.endTime.split(":").map(Number);
            let horasPorDia = Math.ceil(
              endHour + endMinute / 60 - (startHour + startMinute / 60)
            );
            if (horasPorDia < 0) horasPorDia = 0; // Evitar negativos
            const totalHoras = horasPorDia * dias;

            // Calcular el valor de las horas extras
            const porcentaje = parseFloat(tipoNovedad.percentage) || 0;
            const valorHoraExtra =
              parseFloat(row.hourlyrate) * (porcentaje / 100);
            const valorHorasExtras = totalHoras * valorHoraExtra;

            // Sumar al valor de novedades
            valorNovedades += valorHorasExtras;
          }
        });

        // Sumar el total de novedades al salario base
        total += valorNovedades;

        return formatCurrency(total);
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
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
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
      const filteredEmployees = employees.filter(
        (emp) => emp.companyid == form.companyId
      );

      // Agregar información de novedades a cada empleado
      const employeesWithNews = filteredEmployees.map((emp) => {
        const hasNews = employeeNews.some((news) => {
          const newsStartDate = new Date(news.startDate);
          const newsEndDate = new Date(news.endDate);
          const filterStartDate = new Date(form.startDate);
          const filterEndDate = new Date(form.endDate);

          return (
            news.employeeId === emp.id &&
            news.status === "active" &&
            newsStartDate <= filterEndDate &&
            newsEndDate >= filterStartDate
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
  }, [form.companyId, form.startDate, form.endDate, employees, employeeNews]);

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
    if (!dataTable.length) {
      toast.warning("No hay datos para exportar");
      return;
    }

    // Crear un libro de Excel
    const wb = XLSX.utils.book_new();

    // Hoja de empleados
    const dataToExport = dataTable.map((employee) => {
      const employeeNewsList = employeeNews.filter(
        (news) => news.employeeId === employee.id
      );
      const novedades = employeeNewsList
        .map((news) => news.type_news_name)
        .join(", ");

      return {
        Documento: `${employee.documenttype} ${employee.documentnumber}`,
        "Nombre Completo": employee.fullname,
        "Fecha Inicio Contrato":
          employee.contractstartdate?.split("T")[0] || "No disponible",
        Cargo: employee.position || "No disponible",
        Estado: employee.hasNews ? "Con Novedad" : "Normal",
        "Tipo de Novedad": novedades || "Sin novedades",
        "Tipo de Contrato": employee.contracttype || "No disponible",
        Jornada: employee.workday || "No disponible",
        "Salario Base": formatCurrency(employee.basicmonthlysalary),
        EPS: employee.eps || "No disponible",
        ARL: employee.arl || "No disponible",
        Pensión: employee.pension || "No disponible",
        "Fondo de Cesantías": employee.severancefund || "No disponible",
        "Caja de Compensación": employee.compensationfund || "No disponible",
      };
    });

    const wsEmployees = XLSX.utils.json_to_sheet(dataToExport);
    XLSX.utils.book_append_sheet(wb, wsEmployees, "Empleados");

    // Hoja de novedades
    const newsToExport = dataTable.flatMap((employee) => {
      const employeeNewsList = employeeNews.filter(
        (news) => news.employeeId === employee.id
      );

      return employeeNewsList.map((news) => ({
        "Documento Empleado": `${employee.documenttype} ${employee.documentnumber}`,
        "Nombre Empleado": employee.fullname,
        Cargo: employee.position || "No disponible",
        "Tipo de Contrato": employee.contracttype || "No disponible",
        "Salario Base": formatCurrency(employee.basicmonthlysalary),
        "Tipo de Novedad": news.type_news_name,
        "Fecha Inicio": news.startDate?.split("T")[0] || "No disponible",
        "Fecha Fin": news.endDate?.split("T")[0] || "No disponible",
        Estado: news.status === "active" ? "Activo" : "Inactivo",
        Observaciones: news.observations || "Sin observaciones",
        "Aprobado por": news.approved_by_name || "No disponible",
        "Fecha de Aprobación":
          news.approved_date?.split("T")[0] || "No disponible",
        "Valor de la Novedad": news.value
          ? formatCurrency(news.value)
          : "No aplica",
        "Días Afectados": news.affected_days || "No aplica",
        "Horas Afectadas": news.affected_hours || "No aplica",
        "Porcentaje Afectado": news.affected_percentage
          ? `${news.affected_percentage}%`
          : "No aplica",
      }));
    });

    if (newsToExport.length > 0) {
      const wsNews = XLSX.utils.json_to_sheet(newsToExport);
      XLSX.utils.book_append_sheet(wb, wsNews, "Novedades");
    }

    // Generar nombre del archivo con fecha actual
    const fileName = `Liquidacion_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;

    XLSX.writeFile(wb, fileName);
    toast.success("Archivo exportado exitosamente");
  };

  function toDateString(date) {
    return new Date(date).toISOString().split("T")[0];
  }

  const calculateEmployeeTotals = (employee) => {
    const employeeNewsList = employeeNews.filter(
      (news) => news.employeeId === employee.id
    );

    let descuentos = 0;
    let aumentos = 0;

    employeeNewsList.forEach((news) => {
      if (news.value) {
        if (news.type_news_code.startsWith("D")) {
          descuentos += Number(news.value);
        } else if (news.type_news_code.startsWith("A")) {
          aumentos += Number(news.value);
        }
      }
    });

    const total = employee.basicmonthlysalary + aumentos - descuentos;

    return {
      descuentos,
      aumentos,
      total,
    };
  };

  console.log("filteredData", filteredData);

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
              <Col>
                <Button
                  color="success"
                  onClick={exportToExcel}
                  disabled={!dataTable.length}
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
              </Col>
            </Row>
            <Row className="mt-4">
              <Col md="12">
                <h4 className="mb-3">Novedades</h4>
                <div className="table-responsive">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Tipo de Novedad</th>
                        <th>Fecha Inicio</th>
                        <th>Fecha Fin</th>
                        <th>Estado</th>
                        <th>Observaciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employeeNews
                        .filter(
                          (news) => news.employeeId === selectedEmployee.id
                        )
                        .map((news) => (
                          <tr key={news.id}>
                            <td>{news.type_news_name}</td>
                            <td>{news.startDate?.split("T")[0]}</td>
                            <td>{news.endDate?.split("T")[0]}</td>
                            <td>
                              {news.status === "active" ? "Activo" : "Inactivo"}
                            </td>
                            <td>{news.observations}</td>
                          </tr>
                        ))}
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
