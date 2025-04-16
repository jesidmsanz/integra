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
    employeeId: "",
    typeNewsId: "",
    startDate: "",
    endDate: "",
    status: "active",
    approvedBy: "",
    observations: "",
  });

  const [employees, setEmployees] = useState([]);
  const [typeNews, setTypeNews] = useState([]);
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEmployees();
    loadTypeNews();
    loadUsers();
    if (isUpdate && dataToUpdate) {
      console.log("Datos recibidos:", dataToUpdate);
      const startDateFormatted = dataToUpdate.startDate
        ? new Date(dataToUpdate.startDate).toISOString().split("T")[0]
        : "";
      const endDateFormatted = dataToUpdate.endDate
        ? new Date(dataToUpdate.endDate).toISOString().split("T")[0]
        : "";

      console.log("Fechas formateadas:", {
        startDateFormatted,
        endDateFormatted,
      });

      setFormData({
        employeeId: dataToUpdate.employeeId || "",
        typeNewsId: dataToUpdate.typeNewsId || "",
        startDate: startDateFormatted,
        endDate: endDateFormatted,
        status: dataToUpdate.status || "active",
        approvedBy: dataToUpdate.approvedBy || "",
        observations: dataToUpdate.observations || "",
      });
    } else {
      setFormData({
        employeeId: "",
        typeNewsId: "",
        startDate: "",
        endDate: "",
        status: "active",
        approvedBy: "",
        observations: "",
      });
    }
  }, [isUpdate, dataToUpdate]);

  const loadEmployees = async () => {
    try {
      const response = await employeesApi.list();
      if (response.length) setEmployees(response);
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
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key] && key !== "observations") {
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
          startDate: formData.startDate
            ? `${formData.startDate} 19:00:00-05`
            : "",
          endDate: formData.endDate ? `${formData.endDate} 19:00:00-05` : "",
        };

        console.log("Datos a enviar:", formattedData);

        const save = isUpdate
          ? await employeeNewsApi.update(dataToUpdate.id, formattedData)
          : await employeeNewsApi.create(formattedData);

        console.log("save", save);
        if (save?.id ) {
          setFormData({
            employeeId: "",
            typeNewsId: "",
            startDate: "",
            endDate: "",
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
                <Label for="employeeId">Empleado</Label>
                <Input
                  type="select"
                  name="employeeId"
                  id="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  invalid={!!errors.employeeId}
                  required
                >
                  <option value="">Seleccione un empleado</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name}
                    </option>
                  ))}
                </Input>
                {errors.employeeId && (
                  <FormFeedback>{errors.employeeId}</FormFeedback>
                )}
              </FormGroup>
            </Col>
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
          </Row>
          <Row>
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
                  employeeId: "",
                  typeNewsId: "",
                  startDate: "",
                  endDate: "",
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
