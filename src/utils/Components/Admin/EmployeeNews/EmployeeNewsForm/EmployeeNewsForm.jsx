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
import { getTiposHorasLaborales } from "@/utils/helpers/normativasHelper";

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
    hourTypeId: "",
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
  const [isApproved, setIsApproved] = useState(false);
  const [tiposHorasLaborales, setTiposHorasLaborales] = useState([]);
  const [selectedTypeNews, setSelectedTypeNews] = useState(null);

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
      console.log("🔍 Datos recibidos para edición:", dataToUpdate);
      console.log("📅 Fecha inicio original:", dataToUpdate.startDate);
      console.log("📅 Fecha fin original:", dataToUpdate.endDate);
      console.log("🕐 Hora inicio original:", dataToUpdate.startTime);
      console.log("🕐 Hora fin original:", dataToUpdate.endTime);
      console.log("✅ Aprobada:", dataToUpdate.approved);
      
      // Verificar si la novedad está aprobada
      const approved = dataToUpdate.approved === true || dataToUpdate.approved === 'true';
      setIsApproved(approved);
      console.log("🔒 Novedad aprobada, edición deshabilitada:", approved);
      
      // Función para formatear fechas de manera más robusta (sin problemas de zona horaria)
      const formatDate = (dateString) => {
        if (!dateString) return "";
        try {
          // Si ya está en formato YYYY-MM-DD, devolverlo directamente
          if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}/.test(dateString)) {
            return dateString.substring(0, 10);
          }
          
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return "";
          
          // Usar UTC para evitar problemas de zona horaria
          const year = date.getUTCFullYear();
          const month = String(date.getUTCMonth() + 1).padStart(2, '0');
          const day = String(date.getUTCDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        } catch (error) {
          console.error("Error formateando fecha:", error);
          return "";
        }
      };

      // Función para formatear horas de manera más robusta
      const formatTime = (timeString) => {
        if (!timeString) return "";
        try {
          // Si ya está en formato HH:MM, devolverlo
          if (typeof timeString === 'string' && timeString.includes(':')) {
            return timeString.substring(0, 5);
          }
          return "";
        } catch (error) {
          console.error("Error formateando hora:", error);
          return "";
        }
      };

      const startDateFormatted = formatDate(dataToUpdate.startDate);
      const startTimeFormatted = formatTime(dataToUpdate.startTime);
      const endDateFormatted = formatDate(dataToUpdate.endDate);
      const endTimeFormatted = formatTime(dataToUpdate.endTime);

      console.log("✅ Fechas formateadas:", {
        startDateFormatted,
        startTimeFormatted,
        endDateFormatted,
        endTimeFormatted,
      });

      setFormData({
        companyId: dataToUpdate.companyId || "",
        employeeId: dataToUpdate.employeeId || "",
        typeNewsId: dataToUpdate.typeNewsId || "",
        hourTypeId: dataToUpdate.hourTypeId || dataToUpdate.hour_type_id || "",
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
        hourTypeId: "",
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
      setIsApproved(false);
      setSelectedTypeNews(null);
    }
  }, [isUpdate, dataToUpdate]);

  // useEffect adicional para debuggear cambios en formData
  useEffect(() => {
    if (isUpdate && formData.startDate) {
      console.log("🔄 FormData actualizado:", {
        startDate: formData.startDate,
        startTime: formData.startTime,
        endDate: formData.endDate,
        endTime: formData.endTime
      });
    }
  }, [formData, isUpdate]);

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
          // Ordenar alfabéticamente por nombre completo
          const sorted = filtered.sort((a, b) => {
            const nameA = (a.fullname || '').toLowerCase();
            const nameB = (b.fullname || '').toLowerCase();
            return nameA.localeCompare(nameB);
          });
          setFilteredEmployees(sorted);
          
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
      // Cargar TODOS los tipos de novedades sin paginación
      const response = await typeNewsApi.list(1, 1000); // Usar un límite alto para obtener todos
      
      console.log(`📊 loadTypeNews - Total tipos cargados: ${response?.data?.length || 0}`);
      
      if (response && response.data && response.data.length) {
        setTypeNews(response.data);
        // No resetear filteredTypeNews aquí, se filtrará cuando se seleccione empleado
      } else if (response && response.data && Array.isArray(response.data)) {
        setTypeNews(response.data);
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
    
    // Si el empleado no tiene género asignado, NO mostrar ninguna novedad
    if (!employeeGender) {
      console.log("⚠️ Empleado sin género asignado, no se muestran tipos de novedades");
      setFilteredTypeNews([]);
      // Resetear el tipo de novedad seleccionado si había uno
      if (formData.typeNewsId) {
        setFormData(prev => ({ ...prev, typeNewsId: "" }));
      }
      return;
    }

    // Filtrar según el género del empleado
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
        
        // Si no hay configuración de género en el tipo de novedad, no mostrarlo (ser más restrictivo)
        if (!normalizedAppliesTo.masculino && !normalizedAppliesTo.femenino && !normalizedAppliesTo.ambos) {
          return false;
        }
        
        // Si el empleado es femenino, mostrar novedades que apliquen a femenino o ambos
        if (employeeGender === 'femenino') {
          return normalizedAppliesTo.femenino || normalizedAppliesTo.ambos;
        }
        // Si el empleado es masculino, mostrar novedades que apliquen a masculino o ambos
        else if (employeeGender === 'masculino') {
          return normalizedAppliesTo.masculino || normalizedAppliesTo.ambos;
        }
        
        // Si no se puede determinar el género, no mostrar
        return false;
      } catch (error) {
        console.error('❌ Error al parsear applies_to para tipo de novedad:', type.id, error);
        // En caso de error, no mostrar
        return false;
      }
    });

    console.log(`🔍 Filtro de género aplicado: ${filtered.length} tipos de novedades disponibles para empleado ${employeeGender}`);
    console.log(`📋 Tipos disponibles:`, filtered.map(t => t.name));
    setFilteredTypeNews(filtered);
    
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

  // Cargar tipos de horas laborales cuando cambia el tipo de novedad
  useEffect(() => {
    const loadTiposHoras = async () => {
      if (formData.typeNewsId) {
        const selectedType = typeNews.find(t => t.id === parseInt(formData.typeNewsId));
        setSelectedTypeNews(selectedType);
        
        if (selectedType && selectedType.calculateperhour) {
          try {
            const tipos = await getTiposHorasLaborales(formData.startDate || new Date());
            setTiposHorasLaborales(tipos);
          } catch (error) {
            console.error("Error cargando tipos de horas laborales:", error);
            setTiposHorasLaborales([]);
          }
        } else {
          setTiposHorasLaborales([]);
          setFormData(prev => ({ ...prev, hourTypeId: "" }));
        }
      } else {
        setSelectedTypeNews(null);
        setTiposHorasLaborales([]);
      }
    };
    
    loadTiposHoras();
  }, [formData.typeNewsId, typeNews]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "companyId") {
      loadEmployees(value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        employeeId: "", // Reset employee selection when company changes
        typeNewsId: "", // Reset type news selection when company changes
        hourTypeId: "", // Reset hour type selection
      }));
      // Reset filtered type news when company changes
      setFilteredTypeNews([]);
      setSelectedTypeNews(null);
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
        hourTypeId: "", // Reset hour type selection
      }));
      setSelectedTypeNews(null);
    } else if (name === "typeNewsId") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        hourTypeId: "", // Reset hour type when type news changes
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
        key !== "document" &&
        key !== "hourTypeId" // Validar por separado
      ) {
        newErrors[key] = "Este campo es requerido";
      }
    });
    
    // Validar hourTypeId solo si el tipo de novedad requiere cálculo por hora
    if (selectedTypeNews && selectedTypeNews.calculateperhour && !formData.hourTypeId) {
      newErrors.hourTypeId = "Debe seleccionar un tipo de hora laboral";
    }
    
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
          startTime: formData.startTime,
          endDate: formData.endDate ? formData.endDate : null,
          endTime: formData.endTime,
        };

        // Siempre crear FormData para mantener consistencia
        const formDataToSend = new FormData();
        Object.keys(formattedData).forEach(key => {
          if (key === 'document' && selectedFile) {
            formDataToSend.append('document', selectedFile);
          } else if (key === 'hourTypeId' && formattedData[key]) {
            formDataToSend.append('hourTypeId', formattedData[key]);
          } else if (formattedData[key] !== null && formattedData[key] !== undefined && key !== 'hourTypeId') {
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
            hourTypeId: "",
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
                  disabled={isApproved}
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
                  disabled={!formData.companyId || isApproved}
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
                  disabled={!formData.employeeId || isApproved}
                >
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
                {formData.employeeId && (() => {
                  const selectedEmployee = employees.find(emp => emp.id === parseInt(formData.employeeId));
                  const hasGender = selectedEmployee?.sex?.toLowerCase();
                  
                  if (!hasGender) {
                    return (
                      <small className="text-danger">
                        <i className="fas fa-exclamation-triangle me-1"></i>
                        Asigne sexo al empleado para poder seleccionar tipos de novedad.
                      </small>
                    );
                  }
                  
                  if (filteredTypeNews.length === 0) {
                    return (
                      <small className="text-danger">
                        <i className="fas fa-exclamation-triangle me-1"></i>
                        Asigne sexo al empleado para poder seleccionar tipos de novedad.
                      </small>
                    );
                  }
                  
                  return (
                    <small className="text-muted">
                      <i className="fas fa-check-circle me-1"></i>
                      {filteredTypeNews.length} tipo{filteredTypeNews.length !== 1 ? 's' : ''} de novedad disponible{filteredTypeNews.length !== 1 ? 's' : ''} para este empleado.
                    </small>
                  );
                })()}
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
                  disabled={isApproved}
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
          
          {/* Selector de tipo de hora laboral - Solo si el tipo de novedad calcula por hora */}
          {selectedTypeNews && selectedTypeNews.calculateperhour && (
            <Row>
              <Col md="12">
                <FormGroup>
                  <Label for="hourTypeId">Tipo de Hora Laboral *</Label>
                  <Input
                    type="select"
                    name="hourTypeId"
                    id="hourTypeId"
                    value={formData.hourTypeId}
                    onChange={handleChange}
                    invalid={!!errors.hourTypeId}
                    required
                    disabled={isApproved}
                  >
                    <option value="">
                      {tiposHorasLaborales.length === 0
                        ? "Cargando tipos de horas..."
                        : "Seleccione un tipo de hora laboral"
                      }
                    </option>
                    {tiposHorasLaborales.map((tipoHora) => {
                      // Formatear multiplicador de forma más legible
                      let multiplicadorTexto = "";
                      if (tipoHora.multiplicador) {
                        const mult = parseFloat(tipoHora.multiplicador);
                        if (mult === 1.0) {
                          multiplicadorTexto = " (Sin recargo)";
                        } else if (mult > 1.0) {
                          const porcentaje = ((mult - 1) * 100).toFixed(0);
                          multiplicadorTexto = ` (+${porcentaje}%)`;
                        } else {
                          const porcentaje = (mult * 100).toFixed(0);
                          multiplicadorTexto = ` (Recargo ${porcentaje}%)`;
                        }
                      }
                      
                      return (
                        <option key={tipoHora.id} value={tipoHora.id}>
                          {tipoHora.codigo ? `[${tipoHora.codigo}] ` : ""}
                          {tipoHora.nombre}
                          {multiplicadorTexto}
                        </option>
                      );
                    })}
                  </Input>
                  {errors.hourTypeId && (
                    <FormFeedback>{errors.hourTypeId}</FormFeedback>
                  )}
                  <small className="text-muted">
                    <i className="fas fa-info-circle me-1"></i>
                    Seleccione el tipo de hora laboral según la normativa vigente. El porcentaje indica el recargo aplicado sobre el salario base.
                  </small>
                  {tiposHorasLaborales.length === 0 && selectedTypeNews && selectedTypeNews.calculateperhour && (
                    <small className="text-warning d-block mt-1">
                      <i className="fas fa-exclamation-triangle me-1"></i>
                      No hay tipos de horas laborales configurados. Configure las normativas de tipo "tipo_hora_laboral" en el módulo de Normativas.
                    </small>
                  )}
                </FormGroup>
              </Col>
            </Row>
          )}
          
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
                  disabled={isApproved}
                  max={new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                />
                {errors.startDate && (
                  <FormFeedback>{errors.startDate}</FormFeedback>
                )}
                <small className="text-muted">
                  <i className="fas fa-info-circle me-1"></i>
                  Fecha de inicio de la novedad. Solo se pueden seleccionar fechas pasadas (hasta ayer).
                </small>
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="startTime">Hora Inicio *</Label>
                <Input
                  type="time"
                  name="startTime"
                  id="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  invalid={!!errors.startTime}
                  required
                  disabled={isApproved}
                />
                <FormFeedback>{errors.startTime}</FormFeedback>
                <small className="text-muted">
                  <i className="fas fa-info-circle me-1"></i>
                  Hora de inicio de la novedad.
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
                  disabled={isApproved}
                  max={new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  min={formData.startDate || undefined}
                />
                {errors.endDate && (
                  <FormFeedback>{errors.endDate}</FormFeedback>
                )}
                <small className="text-muted">
                  <i className="fas fa-info-circle me-1"></i>
                  Fecha de fin de la novedad. Solo se pueden seleccionar fechas pasadas (hasta ayer). Debe ser igual o posterior a la fecha de inicio.
                </small>
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="endTime">Hora Fin *</Label>
                <Input
                  type="time"
                  name="endTime"
                  id="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  invalid={!!errors.endTime}
                  required
                  disabled={isApproved}
                />
                <FormFeedback>{errors.endTime}</FormFeedback>
                <small className="text-muted">
                  <i className="fas fa-info-circle me-1"></i>
                  Hora de fin de la novedad.
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
                  disabled={isApproved}
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
                  disabled={isApproved}
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
                  disabled={isApproved}
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
                  hourTypeId: "",
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
                setSelectedTypeNews(null);
                setTiposHorasLaborales([]);
              }}
              className="rounded-pill dark-toggle-btn mx-2"
            >
              Cancelar
            </Button>
            <Button
              color="primary"
              type="submit"
              className="rounded-pill dark-toggle-btn"
              disabled={isApproved}
            >
              {isApproved 
                ? "No se puede editar - Novedad aprobada"
                : isUpdate
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
