import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { employeeNewsApi } from "@/utils/api";
import SVG from "@/CommonComponent/SVG/Svg";
import Breadcrumbs from "@/CommonComponent/Breadcrumb";
import { Card, CardBody, Col, Container, Row, Badge, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import DataTable, { defaultThemes } from "react-data-table-component";
import { ApprovalNewsListFilterHeader } from "./ApprovalNewsListFilterHeader";
import { toast } from "react-toastify";

const ApprovalNewsListContainer = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(Infinity);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
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

  const handleRowClick = (row) => {
    openDetailModal(row);
  };

  const openDetailModal = async (row) => {
    setDetailLoading(true);
    setSelectedNews(row);
    setModalOpen(true);
    setDetailLoading(false);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedNews(null);
  };

  const handleApprove = async () => {
    if (window.confirm("¿Estás seguro de que deseas aprobar esta novedad?")) {
      try {
        await employeeNewsApi.update(selectedNews.id, { approved: true });
        toast.success("Novedad aprobada correctamente");
        setData((prev) => 
          prev.map((item) => 
            item.id === selectedNews.id 
              ? { ...item, approved: true }
              : item
          )
        );
        closeModal();
      } catch (error) {
        toast.error("Error al aprobar la novedad");
      }
    }
  };

  const handleReject = async () => {
    if (window.confirm("¿Estás seguro de que deseas rechazar esta novedad?")) {
      try {
        await employeeNewsApi.update(selectedNews.id, { approved: false });
        toast.success("Novedad rechazada correctamente");
        setData((prev) => 
          prev.map((item) => 
            item.id === selectedNews.id 
              ? { ...item, approved: false }
              : item
          )
        );
        closeModal();
      } catch (error) {
        toast.error("Error al rechazar la novedad");
      }
    }
  };

  const ViewDetailButton = ({ row }) => {
    return (
      <button
        type="button"
        title="Ver Detalle"
        onClick={(e) => {
          e.stopPropagation(); // Evita que se active el handleRowClick
          openDetailModal(row);
        }}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          lineHeight: 1,
          color: "blue",
        }}
      >
        <i className="fa fa-eye" />
      </button>
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
        cursor: "pointer",
      },
    },
    rows: {
      style: {
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "#f8f9fa",
        },
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
      selector: (row) => {
        if (row.approved === true) return "Aprobado";
        if (row.approved === false) return "Rechazado";
        return "Pendiente";
      },
      sortable: true,
      cell: (row) => {
        let badgeColor = "warning";
        let text = "Pendiente";
        
        if (row.approved === true) {
          badgeColor = "success";
          text = "Aprobado";
        } else if (row.approved === false) {
          badgeColor = "danger";
          text = "Rechazado";
        }
        
        return <Badge color={badgeColor}>{text}</Badge>;
      },
    },
    {
      name: "Ver Detalle",
      cell: (row) => <ViewDetailButton row={row} />,
      width: "100px",
      center: true,
    },
  ];

  useEffect(() => {
    fetchData(page);
  }, [page]);

  return (
    <>
      <Breadcrumbs
        pageTitle="Aprobación de Novedades"
        parent="Aprobación de Novedades"
      />
      <Container fluid>
        <Row>
          <Col sm="12">
            <Card>
              <CardBody>
                <>
                  <div className="list-product-header">
                    <ApprovalNewsListFilterHeader />
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
                        onRowClicked={handleRowClick}
                        pointerOnHover
                      />
                    </div>
                  </div>
                </>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal de Detalle */}
      <Modal 
        isOpen={modalOpen} 
        toggle={closeModal} 
        size="lg"
        centered
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={closeModal} className="text-center">
          <div className="w-100">
            <h5 className="mb-0">Detalle de Novedad - ID: {selectedNews?.id}</h5>
          </div>
        </ModalHeader>
        <ModalBody className="text-center">
          {detailLoading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="sr-only">Cargando...</span>
              </div>
            </div>
          ) : selectedNews ? (
            <div className="row justify-content-center">
              <div className="col-md-6">
                <h6 className="mb-2">Información del Empleado</h6>
                <p><strong>Nombre:</strong> {selectedNews.employee_name}</p>
                <p><strong>ID Empleado:</strong> {selectedNews.employee_id}</p>
              </div>
              <div className="col-md-6">
                <h6 className="mb-2">Información de la Novedad</h6>
                <p><strong>Tipo:</strong> {selectedNews.type_news_name}</p>
                <p><strong>Estado:</strong> 
                  {(() => {
                    let badgeColor = "warning";
                    let text = "Pendiente";
                    
                    if (selectedNews.approved === true) {
                      badgeColor = "success";
                      text = "Aprobado";
                    } else if (selectedNews.approved === false) {
                      badgeColor = "danger";
                      text = "Rechazado";
                    }
                    
                    return <Badge color={badgeColor} className="ms-2">{text}</Badge>;
                  })()}
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="mb-2">Fechas</h6>
                <p><strong>Fecha Inicio:</strong> {selectedNews.startDate?.split("T")[0]} {selectedNews.startTime?.slice(0, -3)}</p>
                <p><strong>Fecha Fin:</strong> {selectedNews.endDate?.split("T")[0]} {selectedNews.endTime?.slice(0, -3)}</p>
              </div>
              <div className="col-md-6">
                <h6 className="mb-2">Documento</h6>
                {selectedNews.document ? (
                  <Button 
                    color="info" 
                    size="sm"
                    onClick={() => window.open(selectedNews.document, '_blank')}
                  >
                    <i className="fa fa-file me-1"></i>
                    Ver Documento
                  </Button>
                ) : (
                  <p className="text-muted">No hay documento adjunto</p>
                )}
              </div>
              {selectedNews.description && (
                <div className="col-12">
                  <h6 className="mb-2">Descripción</h6>
                  <p>{selectedNews.description}</p>
                </div>
              )}
              {selectedNews.observations && (
                <div className="col-12">
                  <h6 className="mb-2">Observaciones</h6>
                  <p className="text-muted">{selectedNews.observations}</p>
                </div>
              )}
              {selectedNews?.approved !== null && (
                <div className="col-12">
                  <div className="alert alert-info text-center">
                    <i className="fa fa-info-circle me-2"></i>
                    Esta novedad ya ha sido procesada y no puede ser modificada.
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </ModalBody>
        <ModalFooter className="justify-content-center">
          <Button color="secondary" onClick={closeModal}>
            Cerrar
          </Button>
          <Button 
            color="success" 
            onClick={handleApprove}
            disabled={selectedNews?.approved !== null}
          >
            <i className="fa fa-check me-1"></i>
            Aprobar
          </Button>
          <Button 
            color="danger" 
            onClick={handleReject}
            disabled={selectedNews?.approved !== null}
          >
            <i className="fa fa-times me-1"></i>
            Rechazar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ApprovalNewsListContainer;