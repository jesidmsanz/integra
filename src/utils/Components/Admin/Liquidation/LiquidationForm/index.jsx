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

import {
  FormGroup,
  Input,
  Label,
  Col,
  Row,
  Container,
  Card,
  CardBody,
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
      selector: (row) => (row.hasNews ? "Con Novedad" : "Normal"),
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
            setShow(!show);
          }}
        >
          <SVG iconId="edit-content" />
        </Link>
      </div>
    );
  };

  return (
    <>
      <Breadcrumbs pageTitle="Liquidación" parent="Liquidación" />
      <Container fluid>
        <Card>
          <CardBody>
            <Row>
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
                />
              </div>
            </div>
          </CardBody>
        </Card>
      </Container>
      <AddNews show={show} />
    </>
  );
};

export default LiquidationForm;
