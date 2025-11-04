import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Table,
  Button,
  Input,
  FormGroup,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Badge,
  Spinner,
} from "reactstrap";
import { toast } from "react-toastify";
import rolesApi from "@/utils/api/rolesApi";

const RolesTab = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    active: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const rolesData = await rolesApi.list();
      setRoles(Array.isArray(rolesData) ? rolesData : []);
    } catch (error) {
      console.error("Error loading roles:", error);
      toast.error("Error al cargar los roles");
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    setSelectedRole(null);
    setFormData({
      name: "",
      description: "",
      active: true,
    });
    setModalOpen(true);
  };

  const handleEdit = (role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name || "",
      description: role.description || "",
      active: role.active !== undefined ? role.active : true,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (selectedRole) {
        await rolesApi.update(selectedRole.id, formData);
        toast.success("Rol actualizado exitosamente");
      } else {
        await rolesApi.create(formData);
        toast.success("Rol creado exitosamente");
      }
      setModalOpen(false);
      setSelectedRole(null);
      loadData();
    } catch (error) {
      console.error("Error saving role:", error);
      toast.error("Error al guardar el rol");
    }
  };

  const handleDelete = async (role) => {
    if (!window.confirm(`¿Está seguro de eliminar el rol "${role.name}"?`)) {
      return;
    }
    try {
      await rolesApi.remove(role.id);
      toast.success("Rol eliminado exitosamente");
      loadData();
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error("Error al eliminar el rol");
    }
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner color="primary" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <Row className="mb-3">
        <Col>
          <h5>Gestión de Roles</h5>
          <p className="text-muted">Crea y administra los roles del sistema</p>
        </Col>
        <Col className="text-end">
          <Button color="primary" onClick={handleNew}>
            <i className="fa fa-plus me-1"></i>
            Nuevo Rol
          </Button>
        </Col>
      </Row>

      <Table striped hover responsive>
        <thead>
          <tr>
            <th style={{ cursor: "default" }}>ID</th>
            <th style={{ cursor: "default" }}>Nombre</th>
            <th style={{ cursor: "default" }}>Descripción</th>
            <th style={{ cursor: "default" }}>Estado</th>
            <th style={{ cursor: "default" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td>{role.id}</td>
              <td>
                <strong>{role.name}</strong>
              </td>
              <td>{role.description || "Sin descripción"}</td>
              <td>
                <Badge color={role.active ? "success" : "danger"}>
                  {role.active ? "Activo" : "Inactivo"}
                </Badge>
              </td>
              <td>
                <Button
                  color="primary"
                  size="sm"
                  className="me-1"
                  onClick={() => handleEdit(role)}
                >
                  <i className="fa fa-edit me-1"></i>
                  Editar
                </Button>
                <Button
                  color="danger"
                  size="sm"
                  onClick={() => handleDelete(role)}
                >
                  <i className="fa fa-trash me-1"></i>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)}>
        <ModalHeader toggle={() => setModalOpen(false)}>
          {selectedRole ? "Editar Rol" : "Nuevo Rol"}
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>Nombre del Rol</Label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ej: admin, payroll_manager"
            />
          </FormGroup>
          <FormGroup>
            <Label>Descripción</Label>
            <Input
              type="textarea"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Descripción del rol"
              rows="3"
            />
          </FormGroup>
          <FormGroup check>
            <Input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) =>
                setFormData({ ...formData, active: e.target.checked })
              }
            />
            <Label check for="active">
              Rol Activo
            </Label>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            Cancelar
          </Button>
          <Button color="primary" onClick={handleSave}>
            Guardar
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default RolesTab;

