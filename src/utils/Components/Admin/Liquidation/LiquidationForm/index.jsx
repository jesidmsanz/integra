import Breadcrumbs from "@/utils/CommonComponent/Breadcrumb";
import SVG from "@/utils/CommonComponent/SVG/Svg";
import { companiesApi, employeesApi, newsApi } from "@/utils/api";
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
};

const LiquidationForm = () => {
  const [form, setForm] = useState(initialState);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [dataTable, setDataTable] = useState([]);
  const [show, setShow] = useState(false);

  let formRef = createRef();

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
  };

  const columns = [
    {
      name: "Nombre",
      selector: (row) => `${row.Name}`,
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Fecha De Inicio De Contrato",
      selector: (row) =>
        row.ContractStartDate?.split("T")[0] || "No disponible",
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Cargo o Area",
      selector: (row) => row.PositionArea || "No disponible",
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
    }
  };

  const loadCompanies = async () => {
    try {
      const response = await companiesApi.list();
      if (response.length) setCompanies(response);
    } catch (error) {
      console.error("Error al cargar los empleados", error);
    }
  };

  useEffect(() => {
    loadEmployees();
    loadCompanies();
  }, []);

  useEffect(() => {
    if (form.companyId) {
      setDataTable(employees.filter((i) => i.companyId == form.companyId));
    } else setDataTable([]);
  }, [form.companyId]);

  return (
    <>
      <Breadcrumbs
        pageTitle="Liquidaciòn"
        parent="Liquidaciòn"
        // title="Todo el Liquidaciòn"
      />
      <Container fluid>
        <Card>
          <CardBody>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label for="name">Empresa:</Label>
                  <Input
                    type="select"
                    name="companyId"
                    id="companyId"
                    onChange={handleChange}
                    value={form.companyId}
                    invalid={!!errors.companyId}
                    required
                  >
                    <option value="">Selecciona un empleado</option>
                    {companies?.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.companyname}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <div className="list-product">
              <div className="table-responsive">
                <DataTable
                  className="custom-scrollbar"
                  customStyles={customStyles}
                  columns={columns}
                  data={dataTable}
                  progressPending={loading}
                  pagination
                  paginationServer
                  paginationTotalRows={10}
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
