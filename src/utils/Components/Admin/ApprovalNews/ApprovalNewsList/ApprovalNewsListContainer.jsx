import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { employeeNewsApi, usersApi, typeNewsApi } from "@/utils/api";
import SVG from "@/CommonComponent/SVG/Svg";
import Breadcrumbs from "@/CommonComponent/Breadcrumb";
import { Card, CardBody, Col, Container, Row, Badge, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, FormGroup } from "reactstrap";
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
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [typeNewsList, setTypeNewsList] = useState([]);
  const [newNews, setNewNews] = useState({ typeNewsId: "", startDate: "", startTime: "", endDate: "", endTime: "", approvedBy: "" });
  const [selectedFile, setSelectedFile] = useState(null);
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

  const fetchTypeNews = async () => {
    try {
      const response = await typeNewsApi.list();
      if (Array.isArray(response)) setTypeNewsList(response);
    } catch (e) {
      console.error("Error cargando tipos de novedad", e);
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
    setShowRejectForm(false);
    setNewNews({ typeNewsId: "", startDate: "", startTime: "", endDate: "", endTime: "", approvedBy: "" });
    setSelectedFile(null);
    setModalOpen(true);
    setDetailLoading(false);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedNews(null);
    setShowRejectForm(false);
    setNewNews({ typeNewsId: "", startDate: "", startTime: "", endDate: "", endTime: "", approvedBy: "" });
    setSelectedFile(null);
  };

  const handleApprove = async () => {
    if (window.confirm("¿Estás seguro de que deseas aprobar esta novedad?")) {
      try {
        await employeeNewsApi.update(selectedNews.id, { approved: true });
        toast.success("Novedad aprobada correctamente");
        setData((prev) =>
          prev.map((item) => (item.id === selectedNews.id ? { ...item, approved: true } : item))
        );
        await fetchData(page);
        closeModal();
      } catch (error) {
        toast.error("Error al aprobar la novedad");
      }
    }
  };

  const validateRejectForm = () => {
    const errors = [];
    if (!newNews.typeNewsId) errors.push("Tipo de novedad es obligatorio");
    if (!newNews.startDate) errors.push("Fecha inicio es obligatoria");
    if (!newNews.endDate) errors.push("Fecha fin es obligatoria");
    if (!newNews.approvedBy) errors.push("Aprobado por es obligatorio");
    return errors;
  };

  const handleReject = async () => {
    // Bloquear si ya fue procesada
    if (selectedNews?.approved !== null) {
      toast.info("Esta novedad ya fue procesada y no puede modificarse.");
      return;
    }
    // Primer clic: mostrar el formulario obligatorio
    if (!showRejectForm) {
      try {
        const [users, types] = await Promise.all([usersApi.list(), typeNewsApi.list()]);
        setUsersList(Array.isArray(users) ? users : []);
        setTypeNewsList(Array.isArray(types) ? types : []);
      } catch (e) {
        console.error("Error cargando datos para rechazo", e);
      }
      // Prefijar con datos de la novedad rechazada
      const sd = selectedNews?.startDate ? selectedNews.startDate.split("T")[0] : "";
      const ed = selectedNews?.endDate ? selectedNews.endDate.split("T")[0] : "";
      const st = selectedNews?.startTime ? selectedNews.startTime.slice(0, 5) : "";
      const et = selectedNews?.endTime ? selectedNews.endTime.slice(0, 5) : "";
      setNewNews({
        typeNewsId: selectedNews?.typeNewsId ? String(selectedNews.typeNewsId) : "",
        startDate: sd,
        startTime: st,
        endDate: ed,
        endTime: et,
        approvedBy: selectedNews?.approvedBy ? String(selectedNews.approvedBy) : "",
      });
      setShowRejectForm(true);
      toast.info("Completa los datos para crear la nueva novedad obligatoria.");
      return;
    }

    // Validar
    const errors = validateRejectForm();
    if (errors.length) {
      toast.error(errors[0]);
      return;
    }

    if (!window.confirm("Confirmar rechazo y creación de la nueva novedad")) return;

    try {
      // Construir FormData con los campos requeridos y heredados
      const formDataToSend = new FormData();
      // Heredados de la novedad rechazada
      formDataToSend.append("companyId", String(selectedNews.companyId));
      formDataToSend.append("employeeId", String(selectedNews.employeeId));
      // Tipo de novedad seleccionable
      formDataToSend.append("typeNewsId", String(newNews.typeNewsId));
      formDataToSend.append("status", selectedNews.status || "active");
      // Aprobación automática de la nueva novedad
      formDataToSend.append("approved", "true");
      // Campos del subformulario
      formDataToSend.append("approvedBy", String(newNews.approvedBy));
      formDataToSend.append("startDate", newNews.startDate);
      if (newNews.startTime) formDataToSend.append("startTime", newNews.startTime);
      formDataToSend.append("endDate", newNews.endDate);
      if (newNews.endTime) formDataToSend.append("endTime", newNews.endTime);
      // Documento opcional
      if (selectedFile) formDataToSend.append("document", selectedFile);
      // Observaciones heredadas si existen
      if (selectedNews.observations) formDataToSend.append("observations", selectedNews.observations);

      await employeeNewsApi.create(formDataToSend);

      // Marcar la novedad actual como rechazada
      await employeeNewsApi.update(selectedNews.id, { approved: false });

      toast.success("Novedad rechazada y nueva novedad creada correctamente");
      setData((prev) => prev.map((item) => (item.id === selectedNews.id ? { ...item, approved: false } : item)));
      await fetchData(page);
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error("Error al procesar el rechazo");
    }
  };

  const ViewDetailButton = ({ row }) => {
    return (
      <button
        type="button"
        title="Ver Detalle"
        onClick={(e) => {
          e.stopPropagation();
          openDetailModal(row);
        }}
        style={{ background: "none", border: "none", padding: 0, cursor: "pointer", lineHeight: 1, color: "blue" }}
      >
        <i className="fa fa-eye" />
      </button>
    );
  };

  const customStyles = {
    header: { style: { minHeight: "40px" } },
    headRow: { style: { borderTopStyle: "solid", borderTopWidth: "1px", borderTopColor: defaultThemes.default.divider.default } },
    headCells: {
      style: {
        "&:not(:last-of-type)": { borderRightStyle: "solid", borderRightWidth: "1px", borderRightColor: defaultThemes.default.divider.default },
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
        "&:not(:last-of-type)": { borderRightStyle: "solid", borderRightWidth: "1px", borderRightColor: defaultThemes.default.divider.default },
        whiteSpace: "normal",
        wordWrap: "break-word",
        padding: "8px",
        cursor: "pointer",
      },
    },
    rows: { style: { cursor: "pointer", "&:hover": { backgroundColor: "#f8f9fa" } } },
  };

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true, width: "80px" },
    { name: "Empleado", selector: (row) => row.employee_name, sortable: true },
    { name: "Tipo de Novedad", selector: (row) => row.type_news_name, sortable: true },
    { name: "Fecha Inicio", selector: (row) => `${row.startDate?.split("T")[0]} ${row?.startTime?.slice(0, -3) || ""}`, sortable: true },
    { name: "Fecha Fin", selector: (row) => `${row.endDate?.split("T")[0]} ${row?.endTime?.slice(0, -3) || ""}`, sortable: true },
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
        if (row.approved === true) { badgeColor = "success"; text = "Aprobado"; }
        else if (row.approved === false) { badgeColor = "danger"; text = "Rechazado"; }
        return <Badge color={badgeColor}>{text}</Badge>;
      },
    },
    { name: "Ver Detalle", cell: (row) => <ViewDetailButton row={row} />, width: "100px", center: true },
  ];

  useEffect(() => {
    fetchData(page);
  }, [page]);

  return (
    <>
      <Breadcrumbs pageTitle="Aprobación de Novedades" parent="Aprobación de Novedades" />
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

      <Modal isOpen={modalOpen} toggle={closeModal} size="lg" centered className="modal-dialog-centered">
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
                <p><strong>ID Empleado:</strong> {selectedNews.employeeId}</p>
              </div>
              <div className="col-md-6">
                <h6 className="mb-2">Información de la Novedad</h6>
                <p><strong>Tipo:</strong> {selectedNews.type_news_name}</p>
                <p><strong>Estado:</strong>
                  {(() => {
                    let badgeColor = "warning";
                    let text = "Pendiente";
                    if (selectedNews.approved === true) { badgeColor = "success"; text = "Aprobado"; }
                    else if (selectedNews.approved === false) { badgeColor = "danger"; text = "Rechazado"; }
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
                  <Button color="info" size="sm" onClick={() => window.open(selectedNews.document, '_blank')}>
                    <i className="fa fa-file me-1"></i>
                    Ver Documento
                  </Button>
                ) : (
                  <p className="text-muted">No hay documento adjunto</p>
                )}
              </div>

              {/* Formulario obligatorio al rechazar */}
              {showRejectForm && (
                <div className="col-12 mt-4 text-start">
                  <div className="alert alert-warning">Al rechazar, es obligatorio crear una nueva novedad.</div>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label for="typeNewsId">Tipo de Novedad</Label>
                        <Input
                          id="typeNewsId"
                          type="select"
                          value={newNews.typeNewsId}
                          onChange={(e) => setNewNews((p) => ({ ...p, typeNewsId: e.target.value }))}
                          required
                        >
                          <option value="">Seleccione...</option>
                          {typeNewsList.map((t) => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md="3">
                      <FormGroup>
                        <Label for="startDate">Fecha Inicio</Label>
                        <Input id="startDate" type="date" value={newNews.startDate} onChange={(e) => setNewNews((p) => ({ ...p, startDate: e.target.value }))} required />
                      </FormGroup>
                    </Col>
                    <Col md="3">
                      <FormGroup>
                        <Label for="startTime">Hora Inicio</Label>
                        <Input id="startTime" type="time" value={newNews.startTime} onChange={(e) => setNewNews((p) => ({ ...p, startTime: e.target.value }))} />
                      </FormGroup>
                    </Col>
                    <Col md="3">
                      <FormGroup>
                        <Label for="endDate">Fecha Fin</Label>
                        <Input id="endDate" type="date" value={newNews.endDate} onChange={(e) => setNewNews((p) => ({ ...p, endDate: e.target.value }))} required />
                      </FormGroup>
                    </Col>
                    <Col md="3">
                      <FormGroup>
                        <Label for="endTime">Hora Fin</Label>
                        <Input id="endTime" type="time" value={newNews.endTime} onChange={(e) => setNewNews((p) => ({ ...p, endTime: e.target.value }))} />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label for="approvedBy">Aprobado por</Label>
                        <Input id="approvedBy" type="select" value={newNews.approvedBy} onChange={(e) => setNewNews((p) => ({ ...p, approvedBy: e.target.value }))} required>
                          <option value="">Seleccione un aprobador</option>
                          {usersList.map((u) => (
                            <option key={u.id} value={u.id}>{`${u.firstName} ${u.lastName}`}</option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label for="document">Documento</Label>
                        <Input id="document" type="file" accept="application/pdf,image/jpeg,image/png" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
              )}
            </div>
          ) : null}
        </ModalBody>
        <ModalFooter className="justify-content-center">
          <Button color="secondary" onClick={closeModal}>Cerrar</Button>
          <Button color="success" onClick={handleApprove} disabled={selectedNews?.approved !== null}>
            <i className="fa fa-check me-1"></i>
            Aprobar
          </Button>
          <Button color="danger" onClick={handleReject} disabled={selectedNews?.approved !== null}>
            <i className="fa fa-times me-1"></i>
            {showRejectForm ? "Rechazar y crear novedad" : "Rechazar"}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ApprovalNewsListContainer;