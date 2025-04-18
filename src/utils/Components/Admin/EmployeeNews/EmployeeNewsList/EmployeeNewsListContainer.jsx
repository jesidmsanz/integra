import React, { useEffect, useState } from "react";
import { employeeNewsApi } from "@/utils/api";
import SVG from "@/CommonComponent/SVG/Svg";
import Breadcrumbs from "@/CommonComponent/Breadcrumb";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import DataTable, { defaultThemes } from "react-data-table-component";
import Link from "next/link";
import { EmployeeNewsListFilterHeader } from "./EmployeeNewsListFilterHeader";
import EmployeeNewsForm from "../EmployeeNewsForm/EmployeeNewsForm";
import { CollapseFilterData } from "./CollapseFilterData";

const EmployeeNewsListContainer = () => {
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
      const response = await employeeNewsApi.list(page, rowsPerPage);
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

  const EmployeeNewsListTableAction = ({ row }) => {
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
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      width: "80px",
    },
    {
      name: "Empleado",
      selector: (row) => row.employee_name,
      sortable: true,
    },
    {
      name: "Tipo de Novedad",
      selector: (row) => row.type_news_name,
      sortable: true,
    },
    {
      name: "Fecha Inicio",
      selector: (row) => row.startDate?.split(" ")[0],
      sortable: true,
    },
    {
      name: "Fecha Fin",
      selector: (row) => row.endDate?.split(" ")[0],
      sortable: true,
    },
    {
      name: "Estado",
      selector: (row) => (row.status === "active" ? "Activo" : "Inactivo"),
      sortable: true,
    },
    {
      name: "Aprobado por",
      selector: (row) => row.approved_by_name,
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row) => <EmployeeNewsListTableAction row={row} />,
      width: "100px",
    },
  ];

  useEffect(() => {
    fetchData(page);
  }, [page]);

  return (
    <>
      <Breadcrumbs
        pageTitle="Novedades de Empleados"
        parent="Novedades de Empleados"
      />
      <Container fluid>
        <Row>
          <Col sm="12">
            <Card>
              <CardBody>
                <>
                  <div className="list-product-header">
                    <EmployeeNewsListFilterHeader setViewForm={setViewForm} />
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
                      <EmployeeNewsForm
                        isOpen={viewForm}
                        title={
                          isUpdate
                            ? "Actualizar Novedad Empleado"
                            : "Crear Novedad Empleado"
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

export default EmployeeNewsListContainer;
