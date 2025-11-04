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
  Form,
} from "reactstrap";
import { toast } from "react-toastify";
import usersApi from "@/utils/api/usersApi";
import rolesApi from "@/utils/api/rolesApi";

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    roles: [],
    active: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, rolesData] = await Promise.all([
        usersApi.list(),
        rolesApi.list(),
      ]);
      setUsers(Array.isArray(usersData) ? usersData : []);
      setRoles(Array.isArray(rolesData) ? rolesData : []);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      email: user.email || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone: user.phone || "",
      roles: user.roles || [],
      active: user.active !== undefined ? user.active : true,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (selectedUser) {
        await usersApi.update(selectedUser.id, formData);
        toast.success("Usuario actualizado exitosamente");
      }
      setModalOpen(false);
      setSelectedUser(null);
      loadData();
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("Error al guardar el usuario");
    }
  };

  const toggleRole = (roleName) => {
    setFormData((prev) => {
      const currentRoles = prev.roles || [];
      const hasRole = currentRoles.includes(roleName);
      return {
        ...prev,
        roles: hasRole
          ? currentRoles.filter((r) => r !== roleName)
          : [...currentRoles, roleName],
      };
    });
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
          <h5>Gestión de Usuarios</h5>
          <p className="text-muted">Administra los usuarios del sistema y sus roles asignados</p>
        </Col>
      </Row>

      <Table striped hover responsive>
        <thead>
          <tr>
            <th style={{ cursor: "default" }}>ID</th>
            <th style={{ cursor: "default" }}>Email</th>
            <th style={{ cursor: "default" }}>Nombre</th>
            <th style={{ cursor: "default" }}>Teléfono</th>
            <th style={{ cursor: "default" }}>Roles</th>
            <th style={{ cursor: "default" }}>Estado</th>
            <th style={{ cursor: "default" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{`${user.firstName || ""} ${user.lastName || ""}`.trim() || "N/A"}</td>
              <td>{user.phone || "N/A"}</td>
              <td>
                {user.roles && user.roles.length > 0 ? (
                  user.roles.map((role, idx) => (
                    <Badge key={idx} color="primary" className="me-1">
                      {role}
                    </Badge>
                  ))
                ) : (
                  <Badge color="secondary">Sin roles</Badge>
                )}
              </td>
              <td>
                <Badge color={user.active ? "success" : "danger"}>
                  {user.active ? "Activo" : "Inactivo"}
                </Badge>
              </td>
              <td>
                <Button
                  color="primary"
                  size="sm"
                  onClick={() => handleEdit(user)}
                >
                  <i className="fa fa-edit me-1"></i>
                  Editar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} size="lg">
        <ModalHeader toggle={() => setModalOpen(false)}>
          Editar Usuario
        </ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    disabled
                    readOnly
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label>Teléfono</Label>
                  <Input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label>Nombre</Label>
                  <Input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label>Apellido</Label>
                  <Input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <FormGroup>
                  <Label>Roles Asignados</Label>
                  <div className="border p-3 rounded" style={{ maxHeight: "200px", overflowY: "auto" }}>
                    {roles.map((role) => (
                      <div key={role.id} className="form-check mb-2">
                        <Input
                          type="checkbox"
                          className="form-check-input"
                          id={`role-${role.id}`}
                          checked={formData.roles?.includes(role.name)}
                          onChange={() => toggleRole(role.name)}
                          style={{ cursor: "pointer" }}
                        />
                        <Label 
                          className="form-check-label" 
                          for={`role-${role.id}`}
                          style={{ cursor: "pointer" }}
                        >
                          {role.name} {role.description && `- ${role.description}`}
                        </Label>
                      </div>
                    ))}
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="12">
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
                    Usuario Activo
                  </Label>
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            Cancelar
          </Button>
          <Button color="primary" onClick={handleSave}>
            Guardar Cambios
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default UsersTab;

