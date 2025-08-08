import React, { useEffect, useState } from "react";
import { employeeNewsApi } from "@/utils/api";
import SVG from "@/CommonComponent/SVG/Svg";
import Breadcrumbs from "@/CommonComponent/Breadcrumb";
import { Card, CardBody, Col, Container, Row, Button } from "reactstrap";
import DataTable, { defaultThemes } from "react-data-table-component";
import Link from "next/link";
import { EmployeeNewsListFilterHeader } from "./EmployeeNewsListFilterHeader";
import EmployeeNewsForm from "../EmployeeNewsForm/EmployeeNewsForm";
import { CollapseFilterData } from "./CollapseFilterData";
import { toast } from "react-toastify";

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

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta novedad?")) {
      try {
        await employeeNewsApi.delete(id);
        toast.success("Novedad eliminada correctamente");
        setData((prev) => prev.filter((item) => item.id !== id));
      } catch (error) {
        toast.error("Error al eliminar la novedad");
      }
    }
  };

  const EmployeeNewsListTableAction = ({ row }) => {
    return (
      <div className="product-action d-flex align-items-center">
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
        <button
          type="button"
          title="Eliminar"
          onClick={() => handleDelete(row.id)}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            marginLeft: 8,
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          <SVG iconId="Delete" />
        </button>
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
      selector: (row) =>
        `${row.startDate?.split("T")[0]} ${row?.startTime?.slice(0, -3) || ""}`,
      sortable: true,
    },
    {
      name: "Fecha Fin",
      selector: (row) =>
        `${row.endDate?.split("T")[0]} ${row?.endTime?.slice(0, -3) || ""}`,
      sortable: true,
    },
    {
      name: "Estado",
      selector: (row) => (row.status === "active" ? "Activo" : "Inactivo"),
      sortable: true,
    },
    {
      name: "Documento",
      cell: (row) => (
        <div>
          {row.document ? (
            <button
              type="button"
              title="Ver Documento"
              onClick={() => window.open(row.document, '_blank')}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                lineHeight: 1,
                color: "#007bff",
              }}
            >
              <i className="fa fa-file-pdf-o" style={{ fontSize: '16px' }}></i>
              <span className="ms-1">Ver</span>
            </button>
          ) : (
            <span className="text-muted">Sin documento</span>
          )}
        </div>
      ),
      width: "120px",
    },
    {
      name: "Acciones",
      cell: (row) => <EmployeeNewsListTableAction row={row} />,
      width: "140px",
    },
  ];

  useEffect(() => {
    fetchData(page);
  }, [page]);

  console.log(data);

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
