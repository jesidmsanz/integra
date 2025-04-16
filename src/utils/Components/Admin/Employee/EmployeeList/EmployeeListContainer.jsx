import React, { useEffect, useState } from "react";
import { employeesApi } from "@/utils/api";
import SVG from "@/CommonComponent/SVG/Svg";
import Breadcrumbs from "@/CommonComponent/Breadcrumb";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import DataTable, { defaultThemes } from "react-data-table-component";
import Link from "next/link";
import EmployeeForm from "../EmployeeForm";
import { CollapseFilterData } from "./CollapseFilterData";
import { EmployeeListFilterHeader } from "./EmployeeListFilterHeader";

const EmployeeListContainer = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(Infinity);
  const [viewForm, setViewForm] = useState(false);
  const [dataToUpdate, setDataToUpdate] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const rowsPerPage = 30;

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
      name: "Nombre",
      selector: (row) => `${row.name}`,
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Fecha De Inicio De Contrato",
      selector: (row) =>
        row.contractStartDate?.split("T")[0] || "No disponible",
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Cargo o Area",
      selector: (row) => row.positionArea || "No disponible",
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Salario Mensual Básico",
      selector: (row) => row.basicMonthlySalary,
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Valor Del Turno Por Hora",
      selector: (row) => row.shiftValuePerHour,
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Auxilio De Transporte",
      selector: (row) => row.transportationAssistance,
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Auxilio De Movilidad",
      selector: (row) => row.mobilityAssistance,
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Acción",
      cell: (row) => <DirectoryListTableAction row={row} />,
      minWidth: "100px",
    },
  ];

  useEffect(() => {
    fetchData(page);
  }, [page]);

  return (
    <>
      <Breadcrumbs
        pageTitle="Empleados"
        parent="Empleados"
        // title="Todo el Empleados"
      />
      <Container fluid>
        <Row>
          <Col sm="12">
            <Card>
              <CardBody>
                <>
                  <div className="list-product-header">
                    <EmployeeListFilterHeader setViewForm={setViewForm} />
                    <CollapseFilterData />
                  </div>
                  <div className="list-product">
                    <div className="table-responsive">
                      <DataTable
                        className="custom-scrollbar"
                        customStyles={customStyles}
                        columns={columns}
                        data={data}
                        progressPending={loading}
                        pagination
                        paginationServer
                        paginationTotalRows={totalRows}
                        paginationDefaultPage={page}
                        onChangePage={handlePageChange}
                        paginationPerPage={rowsPerPage}
                        striped
                        highlightOnHover
                        subHeader
                        dense
                        responsive
                      />
                      <EmployeeForm
                        isOpen={viewForm}
                        title={
                          isUpdate ? "Actualizar Empleado" : "Crear Empleado"
                        }
                        setViewForm={setViewForm}
                        fetchData={fetchData}
                        dataToUpdate={dataToUpdate}
                        isUpdate={isUpdate}
                        setIsUpdate={setIsUpdate}
                      />
                    </div>
                  </div>
                </>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default EmployeeListContainer;
