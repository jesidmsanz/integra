import Breadcrumbs from "@/utils/CommonComponent/Breadcrumb";
import SVG from "@/utils/CommonComponent/SVG/Svg";
import {
  companiesApi,
  employeesApi,
  newsApi,
  employeeNewsApi,
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
} from "reactstrap";
import AddNews from "./AddNews";

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
  const [dataTable, setDataTable] = useState([]);
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
      name: "Estado",
      cell: (row) => {
        if (!row.hasNews) return "Normal";
        const employeeNewsList = employeeNews.filter(
          (news) => news.employeeId === row.id
        );
        return employeeNewsList.map((news) => news.type_news_name).join(", ");
      },
      sortable: true,
      minWidth: "200px",
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

  useEffect(() => {
    loadEmployees();
    loadCompanies();
    loadEmployeeNews();
  }, []);

  useEffect(() => {
    if (form.companyId) {
      const filteredEmployees = employees.filter(
        (emp) => emp.companyid == form.companyId
      );

      // Agregar información de novedades a cada empleado
      const employeesWithNews = filteredEmployees.map((emp) => {
        const hasNews = employeeNews.some((news) => {
          // Convertir las fechas a objetos Date para comparación
          const newsStartDate = new Date(news.startDate);
          const newsEndDate = new Date(news.endDate);
          const filterStartDate = new Date(form.startDate);
          const filterEndDate = new Date(form.endDate);

          // Verificar si el empleado tiene la novedad y si está dentro del rango de fechas
          return (
            news.employeeId === emp.id &&
            news.active === true &&
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
            <div className="list-product">
              <div className="table-responsive">
                <DataTable
                  className="custom-scrollbar"
                  customStyles={customStyles}
                  conditionalRowStyles={conditionalRowStyles}
                  columns={columns}
                  data={dataTable}
                  progressPending={loading}
                  pagination
                  paginationServer
                  paginationTotalRows={dataTable.length}
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
