import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Input,
  FormGroup,
  Label,
  Button,
  Spinner,
  Badge,
} from "reactstrap";
import { toast } from "react-toastify";
import rolesApi from "@/utils/api/rolesApi";
import rolePermissionsApi from "@/utils/api/rolePermissionsApi";

// Permisos hardcodeados - Acceso a cada módulo del sistema
const SYSTEM_PERMISSIONS = [
  // Liquidaciones
  {
    key: "liquidation.create",
    name: "Crear Liquidación",
    description: "Acceso para crear nuevas liquidaciones de nómina",
    category: "Liquidaciones",
  },
  {
    key: "liquidation.view",
    name: "Ver Liquidaciones",
    description: "Acceso para ver liquidaciones guardadas",
    category: "Liquidaciones",
  },
  {
    key: "liquidation.approve",
    name: "Aprobar Liquidaciones",
    description: "Acceso para aprobar liquidaciones",
    category: "Liquidaciones",
  },
  {
    key: "liquidation.pay",
    name: "Pagar Liquidaciones",
    description: "Acceso para marcar liquidaciones como pagadas",
    category: "Liquidaciones",
  },
  {
    key: "liquidation.export",
    name: "Exportar Liquidaciones",
    description: "Acceso para exportar liquidaciones a Excel/PDF",
    category: "Liquidaciones",
  },
  {
    key: "payslip.view",
    name: "Ver Volantes de Pago",
    description: "Acceso para ver y generar volantes de pago",
    category: "Liquidaciones",
  },
  
  // Empleados
  {
    key: "employee.view",
    name: "Ver Empleados",
    description: "Acceso para ver la lista de empleados",
    category: "Empleados",
  },
  {
    key: "employee.create",
    name: "Crear Empleados",
    description: "Acceso para crear nuevos empleados",
    category: "Empleados",
  },
  {
    key: "employee.update",
    name: "Actualizar Empleados",
    description: "Acceso para editar información de empleados",
    category: "Empleados",
  },
  {
    key: "employee.delete",
    name: "Eliminar Empleados",
    description: "Acceso para eliminar empleados",
    category: "Empleados",
  },
  
  // Empresas
  {
    key: "company.view",
    name: "Ver Empresas",
    description: "Acceso para ver la lista de empresas",
    category: "Empresas",
  },
  {
    key: "company.create",
    name: "Crear Empresas",
    description: "Acceso para crear nuevas empresas",
    category: "Empresas",
  },
  {
    key: "company.update",
    name: "Actualizar Empresas",
    description: "Acceso para editar información de empresas",
    category: "Empresas",
  },
  {
    key: "company.delete",
    name: "Eliminar Empresas",
    description: "Acceso para eliminar empresas",
    category: "Empresas",
  },
  
  // Novedades
  {
    key: "news.view",
    name: "Ver Tipos de Novedades",
    description: "Acceso para ver los tipos de novedades",
    category: "Novedades",
  },
  {
    key: "news.create",
    name: "Crear Tipos de Novedades",
    description: "Acceso para crear tipos de novedades",
    category: "Novedades",
  },
  {
    key: "news.register",
    name: "Registrar Novedades",
    description: "Acceso para registrar novedades de empleados",
    category: "Novedades",
  },
  {
    key: "news.approve",
    name: "Aprobar Novedades",
    description: "Acceso para aprobar novedades de empleados",
    category: "Novedades",
  },
  
  // Normativas
  {
    key: "normative.view",
    name: "Ver Normativas",
    description: "Acceso para ver las normativas laborales",
    category: "Normativas",
  },
  {
    key: "normative.create",
    name: "Crear Normativas",
    description: "Acceso para crear nuevas normativas",
    category: "Normativas",
  },
  {
    key: "normative.update",
    name: "Actualizar Normativas",
    description: "Acceso para editar normativas",
    category: "Normativas",
  },
  {
    key: "normative.delete",
    name: "Eliminar Normativas",
    description: "Acceso para eliminar normativas",
    category: "Normativas",
  },
  
  // Reportes
  {
    key: "report.view",
    name: "Ver Reportes",
    description: "Acceso para ver reportes del sistema",
    category: "Reportes",
  },
  {
    key: "report.export",
    name: "Exportar Reportes",
    description: "Acceso para exportar reportes",
    category: "Reportes",
  },
  
  // Configuración
  {
    key: "config.users",
    name: "Gestionar Usuarios",
    description: "Acceso al módulo de gestión de usuarios",
    category: "Configuración",
  },
  {
    key: "config.roles",
    name: "Gestionar Roles",
    description: "Acceso al módulo de gestión de roles",
    category: "Configuración",
  },
  {
    key: "config.permissions",
    name: "Gestionar Permisos",
    description: "Acceso para asignar permisos a roles",
    category: "Configuración",
  },
];

const PermissionsTab = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Usar permisos hardcodeados del sistema
  const permissions = SYSTEM_PERMISSIONS;

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedRole) {
      loadRolePermissions();
    }
  }, [selectedRole]);

  const loadData = async () => {
    try {
      setLoading(true);
      const rolesData = await rolesApi.list();
      
      // Verificar si hay error en la respuesta
      if (rolesData && rolesData.error) {
        console.error("Error en API:", rolesData.message);
        toast.error(rolesData.message || "Error al cargar los roles");
        setRoles([]);
        return;
      }
      
      // Verificar que sea un array
      const rolesArray = Array.isArray(rolesData) ? rolesData : [];
      console.log("Roles cargados:", rolesArray.length, rolesArray);
      setRoles(rolesArray);
      
      // Auto-seleccionar el primer rol si existe
      if (rolesArray.length > 0 && !selectedRole) {
        console.log("Auto-seleccionando primer rol:", rolesArray[0]);
        setSelectedRole(rolesArray[0]);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Error al cargar los datos: " + (error.message || "Error desconocido"));
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const loadRolePermissions = async () => {
    if (!selectedRole) return;
    try {
      // Obtener los permisos asignados al rol desde la BD
      const permissionIds = await rolePermissionsApi.getRolePermissions(selectedRole.id);
      // Convertir IDs a keys de permisos, o usar keys directamente si vienen de BD
      // Por ahora, asumimos que viene un array de keys de permisos
      setRolePermissions(Array.isArray(permissionIds) ? permissionIds : []);
    } catch (error) {
      console.error("Error loading role permissions:", error);
      // Si no hay permisos en BD, inicializar vacío
      setRolePermissions([]);
    }
  };

  const handlePermissionToggle = (permissionKey) => {
    setRolePermissions((prev) => {
      const isSelected = prev.includes(permissionKey);
      if (isSelected) {
        return prev.filter((key) => key !== permissionKey);
      } else {
        return [...prev, permissionKey];
      }
    });
  };

  const handleSave = async () => {
    if (!selectedRole) return;
    try {
      setSaving(true);
      // Guardar usando las keys de permisos
      await rolePermissionsApi.updateRolePermissions(selectedRole.id, rolePermissions);
      toast.success("Permisos actualizados exitosamente");
      loadRolePermissions();
    } catch (error) {
      console.error("Error saving permissions:", error);
      toast.error("Error al guardar los permisos");
    } finally {
      setSaving(false);
    }
  };

  const groupPermissionsByCategory = () => {
    const grouped = {};
    if (!permissions || permissions.length === 0) {
      console.warn("⚠️ No hay permisos definidos en SYSTEM_PERMISSIONS");
      return {};
    }
    permissions.forEach((permission) => {
      const category = permission.category || "Otros";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(permission);
    });
    return grouped;
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner color="primary" />
      </div>
    );
  }

  const groupedPermissions = groupPermissionsByCategory();
  
  // Debug: Verificar que los permisos se están cargando
  console.log("📋 Permisos disponibles:", permissions.length);
  console.log("📋 Categorías agrupadas:", Object.keys(groupedPermissions).length);

  return (
    <div className="p-4">
      <Row className="mb-4">
        <Col>
          <h5>Asignación de Permisos por Rol</h5>
          <p className="text-muted">
            Selecciona un rol y marca los permisos que deseas asignarle
          </p>
        </Col>
      </Row>

      <Row>
        <Col md="3">
          <Card>
            <CardHeader>
              <h6>Seleccionar Rol</h6>
            </CardHeader>
            <CardBody>
              {roles.length > 0 ? (
                <div className="list-group">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      className={`list-group-item list-group-item-action ${
                        selectedRole?.id === role.id ? "active" : ""
                      }`}
                      onClick={() => setSelectedRole(role)}
                      style={{ 
                        cursor: "pointer",
                        backgroundColor: selectedRole?.id === role.id ? "#007bff" : "transparent",
                        color: selectedRole?.id === role.id ? "#ffffff" : "#000000",
                        border: selectedRole?.id === role.id ? "1px solid #007bff" : "1px solid #dee2e6"
                      }}
                    >
                      <strong style={{ color: selectedRole?.id === role.id ? "#ffffff" : "#000000" }}>
                        {role.name}
                      </strong>
                      {role.description && (
                        <div 
                          className="small" 
                          style={{ 
                            color: selectedRole?.id === role.id ? "rgba(255, 255, 255, 0.9)" : "#6c757d",
                            marginTop: "4px"
                          }}
                        >
                          {role.description}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted p-3">
                  <p className="mb-2">No hay roles creados</p>
                  <small>Ve a la pestaña "Roles" para crear uno</small>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>

        <Col md="9">
          {selectedRole ? (
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center">
                <div>
                  <h6>Permisos para: <strong>{selectedRole.name}</strong></h6>
                  <small className="text-muted">
                    {selectedRole.description || "Sin descripción"}
                  </small>
                </div>
                <Button
                  color="primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Spinner size="sm" className="me-1" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <i className="fa fa-save me-1"></i>
                      Guardar Cambios
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardBody style={{ maxHeight: "600px", overflowY: "auto" }}>
                {permissions && permissions.length > 0 ? (
                  Object.keys(groupedPermissions).map((category) => (
                    <div key={category} className="mb-4">
                      <h6 className="text-primary border-bottom pb-2 mb-3">
                        <i className="fa fa-folder me-2"></i>
                        {category}
                      </h6>
                      <Row>
                        {groupedPermissions[category].map((permission) => {
                          const isChecked = rolePermissions.includes(permission.key);
                          return (
                            <Col md="6" key={permission.key} className="mb-3">
                              <FormGroup check>
                                <Input
                                  type="checkbox"
                                  id={`perm-${permission.key}`}
                                  checked={isChecked}
                                  onChange={() =>
                                    handlePermissionToggle(permission.key)
                                  }
                                  className="form-check-input"
                                  style={{ cursor: "pointer" }}
                                />
                                <Label
                                  check
                                  htmlFor={`perm-${permission.key}`}
                                  className="form-check-label d-flex justify-content-between align-items-center"
                                  style={{ cursor: "pointer" }}
                                >
                                  <div>
                                    <strong>{permission.name}</strong>
                                    {permission.description && (
                                      <div className="small text-muted">
                                        {permission.description}
                                      </div>
                                    )}
                                    <Badge
                                      color="secondary"
                                      className="ms-2"
                                      style={{ fontSize: "0.7rem" }}
                                    >
                                      {permission.key}
                                    </Badge>
                                  </div>
                                  {isChecked && (
                                    <i className="fa fa-check text-success ms-2"></i>
                                  )}
                                </Label>
                              </FormGroup>
                            </Col>
                          );
                        })}
                      </Row>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted p-4">
                    <i className="fa fa-exclamation-triangle fa-3x mb-3"></i>
                    <p>Error: No se pudieron cargar los permisos del sistema</p>
                  </div>
                )}
              </CardBody>
            </Card>
          ) : roles.length === 0 ? (
            <Card>
              <CardBody className="text-center text-muted p-5">
                <i className="fa fa-user-plus fa-3x mb-3"></i>
                <h6>Primero debes crear roles</h6>
                <p className="mb-3">No hay roles en el sistema. Ve a la pestaña <strong>"Roles"</strong> para crear uno.</p>
                <p className="small">Una vez creados los roles, podrás asignarles permisos aquí.</p>
              </CardBody>
            </Card>
          ) : (
            <Card>
              <CardBody className="text-center text-muted p-5">
                <i className="fa fa-hand-pointer fa-3x mb-3"></i>
                <h6>Selecciona un rol</h6>
                <p>Selecciona un rol del panel izquierdo para ver y asignar permisos</p>
                <p className="small text-info mt-3">
                  <strong>Nota:</strong> Los permisos están predefinidos y representan el acceso a cada módulo del sistema.
                </p>
              </CardBody>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default PermissionsTab;

