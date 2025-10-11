import React, { useEffect, useState } from "react";
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
import { typeNewsApi } from "@/utils/api";
import { TypeNewsListFilterHeader } from "./TypeNewsListFilterHeader";
import { CollapseFilterData } from "./CollapseFilterData";
import TypeNewsForm from "../TypeNewsForm/TypeNewsForm";

const TypeNewsListContainer = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(Infinity);
  const [viewForm, setViewForm] = useState(false);
  const [dataToUpdate, setDataToUpdate] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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
      console.log("API Response:", response);
      
      // Verificar si la respuesta tiene la estructura esperada
      if (response && response.data && Array.isArray(response.data)) {
        setData(response.data);
        setTotalRows(response.total || 0);
        console.log(`✅ Página ${page}: ${response.data.length} registros de ${response.total} total`);
      } else if (Array.isArray(response)) {
        // Fallback para respuestas sin paginación
        setData(response);
        setTotalRows(response.length);
        console.log(`⚠️ Respuesta sin paginación: ${response.length} registros`);
      } else {
        console.warn("❌ Respuesta inesperada de la API:", response);
        setData([]);
        setTotalRows(0);
      }
    } catch (error) {
      console.error("❌ Error al cargar los datos", error);
      setData([]);
      setTotalRows(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    console.log("🔄 Cambiando a página:", newPage, "desde página actual:", page);
    setPage(newPage);
  };

  const handleRowsPerPageChange = (currentRowsPerPage, currentPage) => {
    console.log("Cambiando filas por página:", currentRowsPerPage, "Página:", currentPage);
    // Si cambia el número de filas por página, volver a la primera página
    setPage(1);
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    if (!searchValue) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter((item) => {
      const name = item.name.toLowerCase();
      const code = item.code?.toLowerCase() || "";

      return name.includes(searchValue) || code.includes(searchValue);
    });

    setFilteredData(filtered);
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
      name: "Acciones",
      cell: (row) => <TypeNewsListTableAction row={row} />,
      width: "100px",
    },
  ];

  useEffect(() => {
    fetchData(page);
  }, [page]);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

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
              <div className="mb-3">
                <InputGroup>
                  <InputGroupText>
                    <i className="fas fa-search"></i>
                  </InputGroupText>
                  <Input
                    type="text"
                    placeholder="Buscar por código o nombre..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </InputGroup>
              </div>
              <div className="table-responsive">
                <DataTable
                  columns={columns}
                  data={filteredData}
                  customStyles={customStyles}
                  pagination
                  paginationServer
                  paginationTotalRows={totalRows}
                  onChangePage={handlePageChange}
                  onChangeRowsPerPage={handleRowsPerPageChange}
                  progressPending={loading}
                  paginationPerPage={rowsPerPage}
                  paginationComponentOptions={{
                    rowsPerPageText: "Filas por página:",
                    rangeSeparatorText: "de",
                    selectAllRowsItem: true,
                    selectAllRowsItemText: "Todos",
                  }}
                  noDataComponent={
                    <div className="text-center py-4">
                      <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                      <p className="text-muted">No hay datos disponibles</p>
                    </div>
                  }
                  progressComponent={
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                      </div>
                      <p className="mt-2">Cargando datos...</p>
                    </div>
                  }
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
