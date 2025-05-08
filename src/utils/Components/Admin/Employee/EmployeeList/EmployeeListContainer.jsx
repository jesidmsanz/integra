import React, { useEffect, useState } from "react";
import { employeesApi, companiesApi } from "@/utils/api";
import SVG from "@/CommonComponent/SVG/Svg";
import Breadcrumbs from "@/CommonComponent/Breadcrumb";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Input,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import DataTable, { defaultThemes } from "react-data-table-component";
import Link from "next/link";
import EmployeeForm from "../EmployeeForm";
import { CollapseFilterData } from "./CollapseFilterData";
import { EmployeeListFilterHeader } from "./EmployeeListFilterHeader";

const EmployeeListContainer = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(Infinity);
  const [viewForm, setViewForm] = useState(false);
  const [dataToUpdate, setDataToUpdate] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const rowsPerPage = 30;

  const fetchCompanies = async () => {
    try {
      const response = await companiesApi.list();
      setCompanies(response);
    } catch (error) {
      console.error("Error al cargar las empresas", error);
    }
  };

  const getCompanyName = (companyId) => {
    const company = companies.find((comp) => comp.id === companyId);
    return company ? company.companyname : "No asignada";
  };

  const fetchData = async (page) => {
    setLoading(true);
    try {
      const response = await employeesApi.list(page, rowsPerPage);
      console.log("response :>> ", response);
      if (response.length) setData(response);
    } catch (error) {
      console.error("Error al cargar los datos", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const DirectoryListTableAction = ({ row }) => {
    return (
      <div className="product-action">
        <Link
          href=""
          onClick={() => {
            setIsUpdate(true);
            setDataToUpdate(row);
            setViewForm(true);
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
      name: "Empresa",
      selector: (row) => getCompanyName(row.companyid),
      sortable: true,
      minWidth: "150px",
    },
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
      minWidth: "200px",
    },
    {
      name: "Tipo de Contrato",
      selector: (row) => row.contracttype,
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Cargo",
      selector: (row) => row.position,
      sortable: true,
      minWidth: "150px",
    },
    // {
    //   name: "Jornada",
    //   selector: (row) => row.workday,
    //   sortable: true,
    //   minWidth: "100px",
    // },
    // {
    //   name: "EPS",
    //   selector: (row) => row.eps,
    //   sortable: true,
    //   minWidth: "150px",
    // },
    // {
    //   name: "ARL",
    //   selector: (row) => row.arl,
    //   sortable: true,
    //   minWidth: "150px",
    // },
    // {
    //   name: "Pensión",
    //   selector: (row) => row.pension,
    //   sortable: true,
    //   minWidth: "150px",
    // },
    // {
    //   name: "Salario Base",
    //   selector: (row) => row.basicmonthlysalary,
    //   sortable: true,
    //   minWidth: "150px",
    // },
    {
      name: "Acción",
      cell: (row) => <DirectoryListTableAction row={row} />,
      minWidth: "100px",
    },
  ];

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    if (!searchValue) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter((item) => {
      const companyName = getCompanyName(item.companyid).toLowerCase();
      const documentInfo =
        `${item.documenttype} ${item.documentnumber}`.toLowerCase();
      const fullName = item.fullname.toLowerCase();
      const contractType = item.contracttype.toLowerCase();
      const position = item.position.toLowerCase();

      return (
        companyName.includes(searchValue) ||
        documentInfo.includes(searchValue) ||
        fullName.includes(searchValue) ||
        contractType.includes(searchValue) ||
        position.includes(searchValue)
      );
    });

    setFilteredData(filtered);
  };

  useEffect(() => {
    fetchCompanies();
    fetchData(page);
  }, [page]);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Lista de Empleados</h3>
              <div className="card-tools">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setDataToUpdate(null);
                    setIsUpdate(false);
                    setViewForm(true);
                  }}
                >
                  <i className="fas fa-plus"></i> Nuevo Empleado
                </button>
              </div>
            </div>
            <div className="card-body">
              {viewForm ? (
                <EmployeeForm
                  isOpen={viewForm}
                  title={isUpdate ? "Actualizar Empleado" : "Crear Empleado"}
                  setViewForm={setViewForm}
                  fetchData={fetchData}
                  dataToUpdate={dataToUpdate}
                  isUpdate={isUpdate}
                  setIsUpdate={setIsUpdate}
                />
              ) : (
                <>
                  <div className="mb-3">
                    <InputGroup>
                      <InputGroupText>
                        <i className="fas fa-search"></i>
                      </InputGroupText>
                      <Input
                        type="text"
                        placeholder="Buscar por empresa, documento, nombre, tipo de contrato o cargo..."
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                    </InputGroup>
                  </div>
                  <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                    paginationServer
                    paginationTotalRows={totalRows}
                    onChangePage={handlePageChange}
                    onChangeRowsPerPage={handlePageChange}
                    progressPending={loading}
                    noDataComponent="No hay empleados registrados"
                    customStyles={customStyles}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeListContainer;
