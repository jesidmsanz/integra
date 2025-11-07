import React, { useEffect, useState } from "react";
import { employeesApi } from "@/utils/api";
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Card,
  CardBody,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import DataTable from "react-data-table-component";
import Breadcrumbs from "@/utils/CommonComponent/Breadcrumb";
import { toast } from "react-toastify";

const ContractExpirationContainer = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newEndDate, setNewEndDate] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await employeesApi.list();
      if (Array.isArray(response)) {
        setEmployees(response);
      }
    } catch (error) {
      console.error("Error al cargar empleados", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Obtener el primer y último día del mes actual
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  lastDayOfMonth.setHours(23, 59, 59, 999);

  // Próximos a vencer: solo los del mes actual
  const getEmployeesAboutToExpire = () => {
    return employees.filter((emp) => {
      if (!emp.contractenddate) return false;
      const endDate = new Date(emp.contractenddate + "T00:00:00");
      return endDate >= today && endDate <= lastDayOfMonth;
    });
  };

  // Vencidos: todos los que ya pasaron
  const getEmployeesExpired = () => {
    return employees.filter((emp) => {
      if (!emp.contractenddate) return false;
      const endDate = new Date(emp.contractenddate + "T00:00:00");
      return endDate < today;
    });
  };

  const formatDateForInput = (dateValue) => {
    if (!dateValue) return "";
    const date = new Date(dateValue+"T00:00:00");
    if (isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setNewEndDate(formatDateForInput(employee.contractenddate));
    setShowModal(true);
  };

  const handleUpdateDate = async () => {
    if (!selectedEmployee || !newEndDate) return;

    setSaving(true);
    try {
      const updatedEmployee = {
        ...selectedEmployee,
        contractenddate: newEndDate,
      };

      await employeesApi.update(selectedEmployee.id, updatedEmployee);
      toast.success("Fecha de finalización actualizada exitosamente");
      setShowModal(false);
      fetchData();
    } catch (error) {
      toast.error("Error al actualizar la fecha");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const baseColumns = [
    {
      name: "Nombre",
      selector: (row) => row.fullname,
      sortable: true,
    },
    {
      name: "Documento",
      selector: (row) => row.documentnumber,
      sortable: true,
    },
    {
      name: "Fecha Inicio",
      selector: (row) => {
        if (!row.contractstartdate) return "-";
        return new Date(row.contractstartdate + "T00:00:00").toLocaleDateString("es-CO");
      },
    },
    {
      name: "Fecha Fin",
      selector: (row) => {
        if (!row.contractenddate) return "-";
        return new Date(row.contractenddate + "T00:00:00").toLocaleDateString("es-CO");
      },
    },
  ];

  const columnsWithActions = [
    ...baseColumns,
    {
      name: "Acciones",
      cell: (row) => (
        <Button
          color="primary"
          size="sm"
          className="btn-sm"
          onClick={() => handleEditClick(row)}
        >
          Editar
        </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "100px",
    },
  ];

  const aboutToExpire = getEmployeesAboutToExpire();
  const expired = getEmployeesExpired();

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <>
      <Breadcrumbs
        pageTitle="Contratos"
        parent="Contratos"
      />
      <Container fluid>
        <Card>
          <CardBody>
            <Nav tabs className="border-tab">
              <NavItem>
                <NavLink
                  className={activeTab === "1" ? "active" : ""}
                  onClick={() => toggle("1")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="icofont icofont-calendar me-2"></i>
                  Próximos a Vencer ({aboutToExpire.length})
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === "2" ? "active" : ""}
                  onClick={() => toggle("2")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="icofont icofont-close-circled me-2"></i>
                  Vencidos ({expired.length})
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab} className="tab-content">
              <TabPane tabId="1">
                <div className="table-responsive">
                  <DataTable
                    columns={columnsWithActions}
                    data={aboutToExpire}
                    progressPending={loading}
                    pagination
                    paginationPerPage={10}
                    paginationRowsPerPageOptions={[10, 20, 30, 50]}
                    noDataComponent="No hay empleados próximos a vencer en el mes actual"
                    striped
                    highlightOnHover
                    dense
                    responsive
                  />
                </div>
              </TabPane>
              <TabPane tabId="2">
                <div className="table-responsive">
                  <DataTable
                    columns={baseColumns}
                    data={expired}
                    progressPending={loading}
                    pagination
                    paginationPerPage={10}
                    paginationRowsPerPageOptions={[10, 20, 30, 50]}
                    noDataComponent="No hay empleados con contrato vencido"
                    striped
                    highlightOnHover
                    dense
                    responsive
                  />
                </div>
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </Container>

      <Modal isOpen={showModal} toggle={() => setShowModal(false)}>
        <ModalHeader toggle={() => setShowModal(false)}>
          Actualizar Fecha de Finalización
        </ModalHeader>
        <ModalBody>
          {selectedEmployee && (
            <Form>
              <FormGroup>
                <Label>Empleado:</Label>
                <p className="mb-2">{selectedEmployee.fullname}</p>
              </FormGroup>
              <FormGroup>
                <Label>Fecha de Finalización:</Label>
                <Input
                  type="date"
                  value={newEndDate}
                  onChange={(e) => setNewEndDate(e.target.value)}
                />
              </FormGroup>
              <div className="d-flex justify-content-end gap-2">
                <Button color="secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  onClick={handleUpdateDate}
                  disabled={saving}
                >
                  {saving ? "Guardando..." : "Guardar"}
                </Button>
              </div>
            </Form>
          )}
        </ModalBody>
      </Modal>
    </>
  );
};

export default ContractExpirationContainer;
