import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
  FormFeedback,
} from "reactstrap";
import {
  employeeNewsApi,
  employeesApi,
  typeNewsApi,
  usersApi,
  companiesApi,
} from "@/utils/api";
import { toast } from "react-toastify";

const EmployeeNewsForm = ({
  isOpen,
  title,
  setViewForm,
  fetchData,
  dataToUpdate,
  isUpdate,
  setIsUpdate,
}) => {
  const [formData, setFormData] = useState({
    companyId: "",
    employeeId: "",
    typeNewsId: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    status: "active",
    approvedBy: "",
    observations: "",
    document: null,
  });

  const [companies, setCompanies] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [typeNews, setTypeNews] = useState([]);
  const [filteredTypeNews, setFilteredTypeNews] = useState([]);
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [existingDocument, setExistingDocument] = useState(null);

  useEffect(() => {
    
    // Cargar datos en secuencia para evitar problemas de sincronización
    const loadDataSequentially = async () => {
      try {
        // 1. Primero cargar empresas
        await loadCompanies();
        
        // 2. Luego cargar tipos de novedad
        await loadTypeNews();
        
        // 3. Luego cargar usuarios
        await loadUsers();
        
        // 4. Finalmente cargar empleados si hay empresa seleccionada
        if (formData.companyId) {
          await loadEmployees(formData.companyId);
        }
        
      } catch (error) {
        console.error("❌ Error en carga secuencial:", error);
      }
    };
    
    loadDataSequentially();
    
    if (isUpdate && dataToUpdate) {
      console.log("Datos recibidos:", dataToUpdate);
      const startDateFormatted = dataToUpdate.startDate
        ? new Date(dataToUpdate.startDate).toLocaleDateString("en-CA")
        : "";
      const startTimeFormatted = dataToUpdate.startTime
        ? dataToUpdate.startTime.substring(0, 5)
        : "";
      const endDateFormatted = dataToUpdate.endDate
        ? new Date(dataToUpdate.endDate).toLocaleDateString("en-CA")
        : "";
      const endTimeFormatted = dataToUpdate.endTime
        ? dataToUpdate.endTime.substring(0, 5)
        : "";

      console.log("Fechas formateadas:", {
        startDateFormatted,
        startTimeFormatted,
        endDateFormatted,
        endTimeFormatted,
      });

      setFormData({
        companyId: dataToUpdate.companyId || "",
        employeeId: dataToUpdate.employeeId || "",
        typeNewsId: dataToUpdate.typeNewsId || "",
        startDate: startDateFormatted,
        startTime: startTimeFormatted,
        endDate: endDateFormatted,
        endTime: endTimeFormatted,
        status: dataToUpdate.status || "active",
        approvedBy: dataToUpdate.approvedBy || "",
        observations: dataToUpdate.observations || "",
        document: null,
      });

      // Si hay un documento existente
      if (dataToUpdate.document) {
        setExistingDocument(dataToUpdate.document);
      }

      // Cargar empleados de la empresa seleccionada
      if (dataToUpdate.companyId) {
        loadEmployees(dataToUpdate.companyId);
      }
    } else {
      setFormData({
        companyId: "",
        employeeId: "",
        typeNewsId: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        status: "active",
        approvedBy: "",
        observations: "",
        document: null,
      });
      setSelectedFile(null);
      setExistingDocument(null);
    }
  }, [isUpdate, dataToUpdate]);

  // useEffect adicional para aplicar filtrado cuando se carguen los tipos de novedad
  useEffect(() => {
    if (typeNews.length > 0 && employees.length > 0 && formData.employeeId) {
      filterTypeNewsByEmployeeGender(formData.employeeId);
    }
  }, [typeNews, employees, formData.employeeId]);

  // useEffect para monitorear cambios en formData (solo para debugging)
  useEffect(() => {
  }, [formData]);

  const loadCompanies = async () => {
    try {
      console.log("🏢 loadCompanies ejecutándose...");
      const response = await companiesApi.list();
      if (response.length) {
        setCompanies(response);
      }
    } catch (error) {
      console.error("Error al cargar las empresas", error);
      toast.error("Error al cargar la lista de empresas");
    }
  };

  const loadEmployees = async (companyId) => {
    try {
      const response = await employeesApi.list();
      if (response.length) {
        setEmployees(response);
        if (companyId) {
          const filtered = response.filter(
            (emp) => emp.companyid === parseInt(companyId)
          );
          setFilteredEmployees(filtered);
          
          // Si hay un empleado seleccionado, filtrar los tipos de novedad
          if (formData.employeeId) {
            filterTypeNewsByEmployeeGender(formData.employeeId);
          }
        } else {
          setFilteredEmployees([]);
          // Reset filtered type news when no company is selected
          setFilteredTypeNews([]);
        }
      }
    } catch (error) {
      console.error("Error al cargar los empleados", error);
      toast.error("Error al cargar la lista de empleados");
    }
  };

  const loadTypeNews = async () => {
    try {
      const response = await typeNewsApi.list();
      
      if (response && response.data && response.data.length) {
        setTypeNews(response.data);
        // No resetear filteredTypeNews aquí, se filtrará cuando se seleccione empleado
      } else if (response && Array.isArray(response)) {
        setTypeNews(response);
        // No resetear filteredTypeNews aquí, se filtrará cuando se seleccione empleado
      } else {
        setTypeNews([]);
        setFilteredTypeNews([]);
      }
    } catch (error) {
      console.error("❌ Error al cargar los tipos de novedades:", error);
      toast.error("Error al cargar la lista de tipos de novedades");
      setTypeNews([]);
      setFilteredTypeNews([]);
    }
  };

  // Función para filtrar tipos de novedad según el género del empleado
  const filterTypeNewsByEmployeeGender = (employeeId) => {
    
    if (!employeeId) {
      setFilteredTypeNews([]);
      return;
    }
    
    if (!typeNews.length) {
      return;
    }
    
    if (!employees.length) {
      return;
    }

    const selectedEmployee = employees.find(emp => emp.id === parseInt(employeeId));
    if (!selectedEmployee) {
      setFilteredTypeNews([]);
      return;
    }


    const employeeGender = selectedEmployee.sex?.toLowerCase();
    if (!employeeGender) {
      setFilteredTypeNews(typeNews);
      return;
    }


    const filtered = typeNews.filter(type => {
      try {
        
        // Parsear el campo applies_to que es un JSON string
        const appliesTo = typeof type.applies_to === 'string' && type.applies_to
          ? JSON.parse(type.applies_to) 
          : type.applies_to || {};
        
        
        // Normalizar las claves del objeto applies_to
        const normalizedAppliesTo = {
          masculino: appliesTo.masculino === true || appliesTo.masculino === 'true',
          femenino: appliesTo.femenino === true || appliesTo.femenino === 'true',
          ambos: appliesTo.ambos === true || appliesTo.ambos === 'true'
        };
        
        
        // Si el empleado es femenino, mostrar novedades que apliquen a femenino o ambos
        if (employeeGender === 'femenino') {
          const shouldShow = normalizedAppliesTo.femenino || normalizedAppliesTo.ambos;
          return shouldShow;
        }
        // Si el empleado es masculino, mostrar novedades que apliquen a masculino o ambos
        else if (employeeGender === 'masculino') {
          const shouldShow = normalizedAppliesTo.masculino || normalizedAppliesTo.ambos;
          return shouldShow;
        }
        
        // Si no se puede determinar el género, mostrar todas
        return true;
      } catch (error) {
        console.error('❌ Error al parsear applies_to para tipo de novedad:', type.id, error);
        // En caso de error, mostrar todas las novedades
        return true;
      }
    });

    setFilteredTypeNews(filtered);
    
    // Log para debugging
    
    // Si el tipo de novedad seleccionado no está en los filtrados, resetearlo
    if (formData.typeNewsId && !filtered.find(t => t.id === parseInt(formData.typeNewsId))) {
      setFormData(prev => ({ ...prev, typeNewsId: "" }));
    }
  };

  const loadUsers = async () => {
    try {
      const response = await usersApi.list();
      if (response.length) {
        setUsers(response);
      }
    } catch (error) {
      console.error("Error al cargar los usuarios", error);
      toast.error("Error al cargar la lista de usuarios");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "companyId") {
      loadEmployees(value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        employeeId: "", // Reset employee selection when company changes
        typeNewsId: "", // Reset type news selection when company changes
      }));
      // Reset filtered type news when company changes
      setFilteredTypeNews([]);
    } else if (name === "employeeId") {
      
      // Verificar que tanto typeNews como employees estén disponibles antes de filtrar
      if (typeNews.length > 0 && employees.length > 0) {
        filterTypeNewsByEmployeeGender(value);
      } else {
        // El filtrado se aplicará automáticamente cuando los datos estén disponibles
        // gracias al useEffect adicional
      }
      
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        typeNewsId: "", // Reset type news selection when employee changes
      }));
    } else {
      // Para todos los demás campos, actualizar normalmente
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Asegurar que el valor se mantenga en el estado
    if (value !== formData[name]) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Solo se permiten archivos PDF, JPG, JPEG o PNG");
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("El archivo no puede ser mayor a 5MB");
        return;
      }

      setSelectedFile(file);
      setFormData((prev) => ({
        ...prev,
        document: file,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (
        !formData[key] &&
        key !== "observations" &&
        key !== "startTime" &&
        key !== "endTime" &&
        key !== "document"
      ) {
        newErrors[key] = "Este campo es requerido";
      }
    });
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        const formattedData = {
          ...formData,
          startDate: formData.startDate ? formData.startDate : null,
          startTime: formData.startTime || null,
          endDate: formData.endDate ? formData.endDate : null,
          endTime: formData.endTime || null,
        };

        // Siempre crear FormData para mantener consistencia
        const formDataToSend = new FormData();
        Object.keys(formattedData).forEach(key => {
          if (key === 'document' && selectedFile) {
            formDataToSend.append('document', selectedFile);
          } else if (formattedData[key] !== null && formattedData[key] !== undefined) {
            formDataToSend.append(key, formattedData[key]);
          }
        });

        console.log("FormData creado:", formDataToSend);
        console.log("Archivo seleccionado:", selectedFile);
        console.log("Datos formateados:", formattedData);

        // Debug: mostrar contenido del FormData
        for (let [key, value] of formDataToSend.entries()) {
          console.log(`FormData - ${key}:`, value);
        }

        const save = isUpdate
          ? await employeeNewsApi.update(dataToUpdate.id, formDataToSend)
          : await employeeNewsApi.create(formDataToSend);

        if (save?.id) {
          setFormData({
            companyId: "",
            employeeId: "",
            typeNewsId: "",
            startDate: "",
            startTime: "",
            endDate: "",
            endTime: "",
            status: "active",
            approvedBy: "",
            observations: "",
            document: null,
          });
          setSelectedFile(null);
          setExistingDocument(null);
          setViewForm(false);
          setIsUpdate(false);
          fetchData(1);
          isUpdate
            ? toast.success("El registro se actualizó exitosamente", {
                position: "top-center",
              })
            : toast.success("El registro se guardó exitosamente", {
                position: "top-center",
              });
        }
      } catch (error) {
        toast.error("Hubo un error al guardar el registro");
        console.error("Error al guardar el registro", error);
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleViewDocument = (documentUrl) => {
    window.open(documentUrl, '_blank');
  };

  return (
    <Modal isOpen={isOpen} toggle={() => setViewForm(false)} size="lg">
      <ModalHeader toggle={() => setViewForm(false)}>{title}</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md="6">
              <FormGroup>
                <Label for="companyId">Empresa</Label>
                <Input
                  type="select"
                  name="companyId"
                  id="companyId"
                  value={formData.companyId}
                  onChange={handleChange}
                  invalid={!!errors.companyId}
                  required
                >
                  <option value="">Seleccione una empresa</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.companyname}
                    </option>
                  ))}
                </Input>
                {errors.companyId && (
                  <FormFeedback>{errors.companyId}</FormFeedback>
                )}
                <small className="text-muted">
                  <i className="fas fa-info-circle me-1"></i>
                  Seleccione una empresa para cargar la lista de empleados.
                </small>
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="employeeId">Empleado</Label>
                <Input
                  type="select"
                  name="employeeId"
                  id="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  invalid={!!errors.employeeId}
                  required
                  disabled={!formData.companyId}
                >
                  <option value="">Seleccione un empleado</option>
                  {filteredEmployees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.fullname}
                    </option>
                  ))}
                </Input>
                {errors.employeeId && (
                  <FormFeedback>{errors.employeeId}</FormFeedback>
                )}
                {!formData.employeeId && (
                  <small className="text-muted">
                    <i className="fas fa-info-circle me-1"></i>
                    Seleccione un empleado para ver solo los tipos de novedad que aplican a su género.
                  </small>
                )}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="6">
              <FormGroup>
                <Label for="typeNewsId">Tipo de Novedad</Label>
                <Input
                  type="select"
                  name="typeNewsId"
                  id="typeNewsId"
                  value={formData.typeNewsId}
                  onChange={handleChange}
                  invalid={!!errors.typeNewsId}
                  required
                  disabled={!formData.employeeId}
                >
                  {console.log("🔒 Campo Tipo de Novedad - disabled:", !formData.employeeId, "employeeId:", formData.employeeId)}
                  <option value="">
                    {!formData.employeeId 
                      ? "Primero seleccione un empleado" 
                      : filteredTypeNews.length === 0
                      ? "No hay tipos de novedad disponibles"
                      : "Seleccione un tipo de novedad"
                    }
                  </option>
                  {filteredTypeNews.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </Input>
                {errors.typeNewsId && (
                  <FormFeedback>{errors.typeNewsId}</FormFeedback>
                )}
                {!formData.employeeId && (
                  <small className="text-muted">
                    <i className="fas fa-info-circle me-1"></i>
                    Seleccione un empleado para ver los tipos de novedad disponibles según su género.
                  </small>
                )}
                {formData.employeeId && filteredTypeNews.length === 0 && (
                  <small className="text-warning">
                    <i className="fas fa-exclamation-triangle me-1"></i>
                    No hay tipos de novedad disponibles para este empleado. Verifique la configuración de géneros en los tipos de novedad.
                  </small>
                )}
                {formData.employeeId && filteredTypeNews.length > 0 && (
                  <small className="text-muted">
                    <i className="fas fa-check-circle me-1"></i>
                    {filteredTypeNews.length} tipo{filteredTypeNews.length !== 1 ? 's' : ''} de novedad disponible{filteredTypeNews.length !== 1 ? 's' : ''} para este empleado.
                  </small>
                )}
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="status">Estado</Label>
                <Input
                  type="select"
                  name="status"
                  id="status"
                  value={formData.status}
                  onChange={handleChange}
                  invalid={!!errors.status}
                  required
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </Input>
                {errors.status && <FormFeedback>{errors.status}</FormFeedback>}
                <small className="text-muted">
                  <i className="fas fa-info-circle me-1"></i>
                  Estado inicial de la novedad.
                </small>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="6">
              <FormGroup>
                <Label for="startDate">Fecha Inicio</Label>
                <Input
                  type="date"
                  name="startDate"
                  id="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  invalid={!!errors.startDate}
                  required
                />
                {errors.startDate && (
                  <FormFeedback>{errors.startDate}</FormFeedback>
                )}
                <small className="text-muted">
                  <i className="fas fa-info-circle me-1"></i>
                  Fecha de inicio de la novedad.
                </small>
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="startTime">Hora Inicio</Label>
                <Input
                  type="time"
                  name="startTime"
                  id="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  invalid={!!errors.startTime}
                />
                <small className="text-muted">
                  <i className="fas fa-info-circle me-1"></i>
                  Hora de inicio (opcional).
                </small>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="6">
              <FormGroup>
                <Label for="endDate">Fecha Fin</Label>
                <Input
                  type="date"
                  name="endDate"
                  id="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  invalid={!!errors.endDate}
                  required
                />
                {errors.endDate && (
                  <FormFeedback>{errors.endDate}</FormFeedback>
                )}
                <small className="text-muted">
                  <i className="fas fa-info-circle me-1"></i>
                  Fecha de fin de la novedad.
                </small>
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="endTime">Hora Fin</Label>
                <Input
                  type="time"
                  name="endTime"
                  id="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  invalid={!!errors.endTime}
                />
                <small className="text-muted">
                  <i className="fas fa-info-circle me-1"></i>
                  Hora de fin (opcional).
                </small>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="6">
              <FormGroup>
                <Label for="approvedBy">Aprobado por</Label>
                <Input
                  type="select"
                  name="approvedBy"
                  id="approvedBy"
                  value={formData.approvedBy}
                  onChange={handleChange}
                  invalid={!!errors.approvedBy}
                  required
                >
                  <option value="">Seleccione un aprobador</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {`${user.firstName} ${user.lastName}`}
                    </option>
                  ))}
                </Input>
                {errors.approvedBy && (
                  <FormFeedback>{errors.approvedBy}</FormFeedback>
                )}
                <small className="text-muted">
                  <i className="fas fa-info-circle me-1"></i>
                  Seleccione quién aprobará esta novedad.
                </small>
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="document">Documento</Label>
                <Input
                  type="file"
                  name="document"
                  id="document"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <small className="text-muted">
                  <i className="fas fa-info-circle me-1"></i>
                  Formatos permitidos: PDF, JPG, JPEG, PNG. Máximo 5MB. Campo opcional.
                </small>
              </FormGroup>
            </Col>
          </Row>
          {existingDocument && (
            <Row>
              <Col md="12">
                <FormGroup>
                  <Label>Documento Actual</Label>
                  <div className="d-flex align-items-center">
                    <i className="fa fa-file-pdf-o me-2" style={{ fontSize: '20px', color: '#dc3545' }}></i>
                    <span className="me-3">{existingDocument.split('/').pop()}</span>
                    <Button
                      color="info"
                      size="sm"
                      onClick={() => handleViewDocument(existingDocument)}
                    >
                      <i className="fa fa-eye me-1" />
                      Ver Documento
                    </Button>
                  </div>
                </FormGroup>
              </Col>
            </Row>
          )}
          {selectedFile && (
            <Row>
              <Col md="12">
                <FormGroup>
                  <Label>Nuevo Documento Seleccionado</Label>
                  <div className="d-flex align-items-center">
                    <i className="fa fa-file-o me-2" style={{ fontSize: '20px', color: '#007bff' }}></i>
                    <span>{selectedFile.name}</span>
                    <small className="text-muted ms-2">
                      ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </small>
                  </div>
                </FormGroup>
              </Col>
            </Row>
          )}
          <Row>
            <Col md="12">
              <FormGroup>
                <Label for="observations">Observaciones</Label>
                <Input
                  type="textarea"
                  name="observations"
                  id="observations"
                  value={formData.observations}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows="3"
                  placeholder="Ingrese las observaciones"
                  invalid={!!errors.observations}
                />
                {errors.observations && (
                  <FormFeedback>{errors.observations}</FormFeedback>
                )}
                <small className="text-muted">
                  <i className="fas fa-info-circle me-1"></i>
                  Campo opcional para agregar comentarios o detalles adicionales.
                </small>
              </FormGroup>
            </Col>
          </Row>
          <div className="text-end mt-3">
            <Button
              color="secondary"
              onClick={() => {
                setFormData({
                  companyId: "",
                  employeeId: "",
                  typeNewsId: "",
                  startDate: "",
                  startTime: "",
                  endDate: "",
                  endTime: "",
                  status: "active",
                  approvedBy: "",
                  observations: "",
                  document: null,
                });
                setSelectedFile(null);
                setExistingDocument(null);
                setIsUpdate(false);
                setViewForm(false);
              }}
              className="rounded-pill dark-toggle-btn mx-2"
            >
              Cancelar
            </Button>
            <Button
              color="primary"
              type="submit"
              className="rounded-pill dark-toggle-btn"
            >
              {isUpdate
                ? `${loading ? "Actualizando..." : "Actualizar"} `
                : `${loading ? "Guardando..." : "Guardar"}`}
            </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default EmployeeNewsForm;
