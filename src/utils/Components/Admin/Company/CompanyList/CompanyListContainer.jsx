import React, { useEffect, useState } from "react";
import { companiesApi } from "@/utils/api";
import SVG from "@/CommonComponent/SVG/Svg";
import Breadcrumbs from "@/CommonComponent/Breadcrumb";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { CompanyListFilterHeader } from "./CompanyListFilterHeader";
import DataTable, { defaultThemes } from "react-data-table-component";
import Link from "next/link";
import CompanyForm from "../CompanyForm";
// import { CollapseFilterData } from "./CollapseFilterData";

const CompanyListContainer = () => {
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
      const response = await companiesApi.list(page, rowsPerPage);
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

  const CompanyListTableAction = ({ row }) => {
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
      name: "Razón Social",
      selector: (row) => `${row.companyname}`,
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Nit",
      selector: (row) => `${row.nit}`,
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Direcciòn",
      selector: (row) => `${row.address}`,
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Telefono",
      selector: (row) => `${row.phone}`,
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Email",
      selector: (row) => `${row.email}`,
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Estado",
      selector: (row) => `${row.active ? "Activa" : "Inactiva"}`,
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Acción",
      cell: (row) => <CompanyListTableAction row={row} />,
      minWidth: "100px",
    },
  ];

  useEffect(() => {
    fetchData(page);
  }, [page]);

  return (
    <>
      <Breadcrumbs
        pageTitle="Empresas"
        parent="Empresas"
        // title="Todo el Empresas"
      />
      <Container fluid>
        <Row>
          <Col sm="12">
            <Card>
              <CardBody>
                <>
                  <div className="list-product-header">
                    <CompanyListFilterHeader setViewForm={setViewForm} />
                    {/* <CollapseFilterData /> */}
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
                      <CompanyForm
                        isOpen={viewForm}
                        title={
                          isUpdate ? "Actualizar Empresa" : "Crear Empresa"
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

export default CompanyListContainer;
