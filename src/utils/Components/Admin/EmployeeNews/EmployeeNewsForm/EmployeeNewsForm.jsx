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
  });

  const [companies, setCompanies] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [typeNews, setTypeNews] = useState([]);
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
      });

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
      });
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

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (
        !formData[key] &&
        key !== "observations" &&
        key !== "startTime" &&
        key !== "endTime"
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

        console.log("Datos a enviar:", formattedData);

        const save = isUpdate
          ? await employeeNewsApi.update(dataToUpdate.id, formattedData)
          : await employeeNewsApi.create(formattedData);

        console.log("save", save);
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
          });
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
          </Row>
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
                });
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
