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
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
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

  const handleCreate = () => {
    setIsCreating(true);
    setSelectedUser(null);
    setFormData({
      email: "",
      password: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phone: "",
      roles: [],
      active: true,
    });
    setModalOpen(true);
  };

  const handleEdit = (user) => {
    setIsCreating(false);
    setSelectedUser(user);
    setFormData({
      email: user.email || "",
      password: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone: user.phone || "",
      roles: user.roles || [],
      active: user.active !== undefined ? user.active : true,
    });
    setModalOpen(false);
    setTimeout(() => setModalOpen(true), 100);
  };

  const handleSave = async () => {
    try {
      let result;
      if (isCreating) {
        result = await usersApi.create(formData);
        if (result?.error) {
          toast.error(result.message || "Error al crear el usuario");
          return;
        }
        toast.success("Usuario creado exitosamente");
      } else {
        // Validar cambio de contraseña si se proporcionó
        if (formData.newPassword || formData.currentPassword) {
          if (!formData.currentPassword) {
            toast.error("Debe ingresar la contraseña actual");
            return;
          }
          if (!formData.newPassword) {
            toast.error("Debe ingresar la nueva contraseña");
            return;
          }
          if (formData.newPassword !== formData.confirmPassword) {
            toast.error("Las contraseñas nuevas no coinciden");
            return;
          }
        }
        
        // Preparar datos para actualizar
        const dataToUpdate = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          roles: formData.roles,
          active: formData.active,
        };
        
        // Si hay cambio de contraseña, agregar los campos
        if (formData.newPassword && formData.currentPassword) {
          dataToUpdate.currentPassword = formData.currentPassword;
          dataToUpdate.newPassword = formData.newPassword;
        }
        
        result = await usersApi.update(selectedUser.id, dataToUpdate);
        
        if (result?.error) {
          toast.error(result.message || "Error al actualizar el usuario");
          return;
        }
        toast.success("Usuario actualizado exitosamente");
      }
      setModalOpen(false);
      setSelectedUser(null);
      setIsCreating(false);
      await loadData();
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error(isCreating ? "Error al crear el usuario" : "Error al guardar el usuario");
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
        <Col className="text-end">
          <Button color="primary" onClick={handleCreate}>
            <i className="fa fa-plus me-1"></i>
            Crear Usuario
          </Button>
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

      <Modal isOpen={modalOpen} toggle={() => {
        setModalOpen(false);
        setIsCreating(false);
        setSelectedUser(null);
      }} size="lg">
        <ModalHeader toggle={() => {
          setModalOpen(false);
          setIsCreating(false);
          setSelectedUser(null);
        }}>
          {isCreating ? "Crear Usuario" : "Editar Usuario"}
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
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled={!isCreating}
                    readOnly={!isCreating}
                  />
                </FormGroup>
              </Col>
              {isCreating ? (
                <Col md="6">
                  <FormGroup>
                    <Label>Contraseña</Label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </FormGroup>
                </Col>
              ) : null}
            </Row>
            <Row>
              {isCreating && (
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
              )}
              {!isCreating && (
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
              )}
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
            {!isCreating && (
              <Row>
                <Col md="12">
                  <hr />
                  <h6 className="mb-3">Cambiar Contraseña</h6>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label>Contraseña Actual</Label>
                    <Input
                      type="password"
                      value={formData.currentPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, currentPassword: e.target.value })
                      }
                      placeholder="Ingrese la contraseña actual"
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label>Nueva Contraseña</Label>
                    <Input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, newPassword: e.target.value })
                      }
                      placeholder="Ingrese la nueva contraseña"
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label>Confirmar Nueva Contraseña</Label>
                    <Input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, confirmPassword: e.target.value })
                      }
                      placeholder="Confirme la nueva contraseña"
                    />
                  </FormGroup>
                </Col>
              </Row>
            )}
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
          <Button color="secondary" onClick={() => {
            setModalOpen(false);
            setIsCreating(false);
            setSelectedUser(null);
          }}>
            Cancelar
          </Button>
          <Button color="primary" onClick={handleSave}>
            {isCreating ? "Crear Usuario" : "Guardar Cambios"}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default UsersTab;

