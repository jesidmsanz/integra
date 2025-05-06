import React, { useEffect, useState } from "react";
import SVG from "@/CommonComponent/SVG/Svg";
import Breadcrumbs from "@/CommonComponent/Breadcrumb";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import DataTable, { defaultThemes } from "react-data-table-component";
import Link from "next/link";
import { typeNewsApi } from "@/utils/api";
import { TypeNewsListFilterHeader } from "./TypeNewsListFilterHeader";
import { CollapseFilterData } from "./CollapseFilterData";
import TypeNewsForm from "../TypeNewsForm/TypeNewsForm";

const TypeNewsListContainer = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(Infinity);
  const [viewForm, setViewForm] = useState(false);
  const [dataToUpdate, setDataToUpdate] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const rowsPerPage = 30;

  const handleCloseForm = () => {
    setViewForm(false);
    setDataToUpdate(null);
    setIsUpdate(false);
  };

  const fetchData = async (page) => {
    setLoading(true);
    try {
      const response = await typeNewsApi.list(page, rowsPerPage);
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

  const TypeNewsListTableAction = ({ row }) => {
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
      name: "Código",
      selector: (row) => row.code,
      sortable: true,
      width: "100px",
    },
    {
      name: "Nombre",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Duración",
      selector: (row) => row.duration,
      sortable: true,
    },
    {
      name: "Pago",
      selector: (row) => row.payment,
      sortable: true,
    },

    {
      name: "Acciones",
      cell: (row) => <TypeNewsListTableAction row={row} />,
      width: "100px",
    },
  ];

  useEffect(() => {
    fetchData(page);
  }, [page]);

  return (
    <Container fluid>
      <Breadcrumbs mainTitle="Tipos de Novedades" parent="Administración" />
      <Row>
        <Col sm="12">
          <Card>
            <CardBody>
              <div className="list-product-header">
                <TypeNewsListFilterHeader setViewForm={setViewForm} />
              </div>
              <div className="table-responsive">
                <DataTable
                  columns={columns}
                  data={data}
                  customStyles={customStyles}
                  pagination
                  paginationServer
                  paginationTotalRows={totalRows}
                  onChangePage={handlePageChange}
                  progressPending={loading}
                  paginationPerPage={10}
                  paginationComponentOptions={{
                    rowsPerPageText: "Filas por página:",
                    rangeSeparatorText: "de",
                    selectAllRowsItem: true,
                    selectAllRowsItemText: "Todos",
                  }}
                />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      {viewForm && (
        <TypeNewsForm
          isOpen={viewForm}
          toggle={handleCloseForm}
          data={dataToUpdate}
          isUpdate={isUpdate}
          onSuccess={() => {
            handleCloseForm();
            fetchData(page);
          }}
        />
      )}
    </Container>
  );
};

export default TypeNewsListContainer;
