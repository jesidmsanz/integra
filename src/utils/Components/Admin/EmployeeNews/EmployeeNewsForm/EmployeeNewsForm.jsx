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
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [existingDocument, setExistingDocument] = useState(null);

  useEffect(() => {
    loadCompanies();
    loadTypeNews();
    loadUsers();
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

  const loadCompanies = async () => {
    try {
      const response = await companiesApi.list();
      if (response.length) setCompanies(response);
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
        } else {
          setFilteredEmployees([]);
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
      if (response.length) setTypeNews(response);
    } catch (error) {
      console.error("Error al cargar los tipos de novedades", error);
      toast.error("Error al cargar la lista de tipos de novedades");
    }
  };

  const loadUsers = async () => {
    try {
      const response = await usersApi.list();
      if (response.length) setUsers(response);
    } catch (error) {
      console.error("Error al cargar los usuarios", error);
      toast.error("Error al cargar la lista de usuarios");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "companyId") {
      loadEmployees(value);
      setFormData((prev) => ({
        ...prev,
        employeeId: "", // Reset employee selection when company changes
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

        // Si hay un archivo seleccionado, crear FormData
        let save;
        if (selectedFile) {
          const formDataToSend = new FormData();
          Object.keys(formattedData).forEach(key => {
            if (key === 'document') {
              formDataToSend.append('document', selectedFile);
            } else {
              formDataToSend.append(key, formattedData[key]);
            }
          });

          save = isUpdate
            ? await employeeNewsApi.update(dataToUpdate.id, formDataToSend)
            : await employeeNewsApi.create(formDataToSend);
        } else {
          // Sin archivo, enviar datos normales
          save = isUpdate
            ? await employeeNewsApi.update(dataToUpdate.id, formattedData)
            : await employeeNewsApi.create(formattedData);
        }

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
                >
                  <option value="">Seleccione un tipo de novedad</option>
                  {typeNews.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </Input>
                {errors.typeNewsId && (
                  <FormFeedback>{errors.typeNewsId}</FormFeedback>
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
                  invalid={!!errors.startDate}
                  required
                />
                {errors.startDate && (
                  <FormFeedback>{errors.startDate}</FormFeedback>
                )}
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
                  invalid={!!errors.startTime}
                />
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
                  invalid={!!errors.endDate}
                  required
                />
                {errors.endDate && (
                  <FormFeedback>{errors.endDate}</FormFeedback>
                )}
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
                  invalid={!!errors.endTime}
                />
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
                  Formatos permitidos: PDF, JPG, JPEG, PNG. Máximo 5MB.
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
                  rows="3"
                  placeholder="Ingrese las observaciones"
                  invalid={!!errors.observations}
                />
                {errors.observations && (
                  <FormFeedback>{errors.observations}</FormFeedback>
                )}
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
