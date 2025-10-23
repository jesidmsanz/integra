import { typeNewsApi } from "@/utils/api";
import { createRef, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Col,
  Row,
  FormFeedback,
} from "reactstrap";

// Campos de dinero del empleado que pueden ser afectados por la novedad
const moneyFields = [
  { key: "basicmonthlysalary", label: "Salario Base Mensual" },
  { key: "hourlyrate", label: "Valor Hora" },
  { key: "transportationassistance", label: "Auxilio de Transporte" },
  { key: "mobilityassistance", label: "Auxilio de Movilidad" },
  { key: "discountvalue", label: "Valor de Descuento" },
];

// Opciones de género para el campo "Aplica a"
const genderOptions = [
  { key: "masculino", label: "Masculino" },
  { key: "femenino", label: "Femenino" },
  { key: "ambos", label: "Ambos" },
];

const initialState = {
  name: "",
  code: "",
  duration: "",
  affects: {}, // Ahora será un objeto con los campos seleccionados
  applies_to: {}, // Ahora será un objeto con las opciones de género seleccionadas
  percentage: "",
  active: true,
  notes: "",
  calculateperhour: false,
  isDiscount: false, // Nuevo campo: true = descuenta, false = suma
};

const TypeNewsForm = ({ isOpen, toggle, data, isUpdate, onSuccess }) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  let formRef = createRef();

  useEffect(() => {
    if (isUpdate && data) {
      // Si es actualización, convertir el string affects a objeto si es necesario
      const affectsData =
        typeof data.affects === "string" && data.affects
          ? JSON.parse(data.affects)
          : data.affects || {};

      // Si es actualización, convertir el string applies_to a objeto si es necesario
      const appliesToData =
        typeof data.applies_to === "string" && data.applies_to
          ? JSON.parse(data.applies_to)
          : data.applies_to || {};

      setForm({
        ...data,
        affects: affectsData,
        applies_to: appliesToData,
      });
    } else {
      setForm(initialState);
    }
  }, [isUpdate, data]);

  const handleClose = () => {
    setForm(initialState);
    setErrors({});
    toggle();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Manejar cambios en los checkboxes de campos de dinero
  const handleMoneyFieldChange = (fieldKey, checked) => {
    setForm({
      ...form,
      affects: {
        ...form.affects,
        [fieldKey]: checked,
      },
    });

    if (errors.affects) {
      setErrors({
        ...errors,
        affects: "",
      });
    }
  };

  // Manejar cambios en los checkboxes de género
  const handleGenderChange = (genderKey, checked) => {
    setForm({
      ...form,
      applies_to: {
        ...form.applies_to,
        [genderKey]: checked,
      },
    });

    if (errors.applies_to) {
      setErrors({
        ...errors,
        applies_to: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar campos requeridos específicos
    const requiredFields = ["name", "code", "percentage"];

    requiredFields.forEach((field) => {
      if (!form[field] || form[field].toString().trim() === "") {
        newErrors[field] = "Este campo es requerido";
      }
    });

    // Validar que al menos un campo de dinero esté seleccionado en "affects"
    if (
      Object.keys(form.affects).length === 0 ||
      Object.values(form.affects).every((val) => !val)
    ) {
      newErrors.affects = "Debe seleccionar al menos un campo de dinero";
    }

    // Validar que al menos una opción de género esté seleccionada en "applies_to"
    if (
      Object.keys(form.applies_to).length === 0 ||
      Object.values(form.applies_to).every((val) => !val)
    ) {
      newErrors.applies_to = "Debe seleccionar al menos una opción de género";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    console.log("newErrors", newErrors);
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        // Convertir affects y applies_to a string JSON para enviar al backend
        const formDataToSend = {
          ...form,
          affects: JSON.stringify(form.affects),
          applies_to: JSON.stringify(form.applies_to),
        };

        console.log("form", formDataToSend);
        const save = isUpdate
          ? await typeNewsApi.update(data.id, formDataToSend)
          : await typeNewsApi.create(formDataToSend);
        if (save?.id) {
          setForm(initialState);
          onSuccess();
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
    <Modal centered={true} isOpen={isOpen} toggle={handleClose} size="lg">
      <ModalHeader toggle={handleClose}>
        <h2>
          {isUpdate ? "Actualizar Tipo de Novedad" : "Crear Tipo de Novedad"}
        </h2>
      </ModalHeader>
      <ModalBody>
        <Form
          onSubmit={handleSubmit}
          noValidate={true}
          ref={(ref) => {
            formRef = ref;
          }}
        >
          <Row>
            <Col md="6">
              <FormGroup>
                <Label for="code">Código:</Label>
                <Input
                  type="text"
                  name="code"
                  id="code"
                  placeholder="Código de la novedad"
                  onChange={handleChange}
                  value={form.code}
                  invalid={!!errors.code}
                  required
                />
                {errors.code && <FormFeedback>{errors.code}</FormFeedback>}
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="name">Nombre:</Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Nombre del tipo de novedad"
                  onChange={handleChange}
                  value={form.name}
                  invalid={!!errors.name}
                  required
                />
                {errors.name && <FormFeedback>{errors.name}</FormFeedback>}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <FormGroup>
                <Label for="duration">Duración:</Label>
                <Input
                  type="text"
                  name="duration"
                  id="duration"
                  placeholder="Duración de la novedad"
                  onChange={handleChange}
                  value={form.duration}
                  invalid={!!errors.duration}
                  required={false}
                />
                {errors.duration && (
                  <FormFeedback>{errors.duration}</FormFeedback>
                )}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <FormGroup>
                <Label>Afecta a:</Label>
                <div className="border rounded p-3">
                  <div className="d-flex flex-wrap gap-3">
                    {moneyFields.map((field) => (
                      <FormGroup check key={field.key} className="me-3">
                        <Input
                          type="checkbox"
                          id={`affects_${field.key}`}
                          checked={form.affects[field.key] || false}
                          onChange={(e) =>
                            handleMoneyFieldChange(field.key, e.target.checked)
                          }
                        />
                        <Label check for={`affects_${field.key}`}>
                          {field.label}
                        </Label>
                      </FormGroup>
                    ))}
                  </div>
                  {errors.affects && (
                    <div className="text-danger mt-2 small">
                      {errors.affects}
                    </div>
                  )}
                </div>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <FormGroup>
                <Label>Aplica a:</Label>
                <div className="border rounded p-3">
                  <div className="d-flex flex-wrap gap-3">
                    {genderOptions.map((option) => (
                      <FormGroup check key={option.key} className="me-3">
                        <Input
                          type="checkbox"
                          id={`applies_to_${option.key}`}
                          checked={form.applies_to[option.key] || false}
                          onChange={(e) =>
                            handleGenderChange(option.key, e.target.checked)
                          }
                        />
                        <Label check for={`applies_to_${option.key}`}>
                          {option.label}
                        </Label>
                      </FormGroup>
                    ))}
                  </div>
                  {errors.applies_to && (
                    <div className="text-danger mt-2 small">
                      {errors.applies_to}
                    </div>
                  )}
                </div>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <FormGroup>
                <Label for="percentage">Porcentaje:</Label>
                <Input
                  type="text"
                  name="percentage"
                  id="percentage"
                  placeholder="Porcentaje"
                  onChange={handleChange}
                  value={form.percentage}
                  invalid={!!errors.percentage}
                  required
                />
                {errors.percentage && (
                  <FormFeedback>{errors.percentage}</FormFeedback>
                )}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <FormGroup>
                <div className="border rounded p-3">
                  <div className="d-flex flex-wrap gap-3">
                    <FormGroup check className="me-3">
                      <Input
                        type="checkbox"
                        name="active"
                        id="active"
                        checked={form.active}
                        onChange={handleChange}
                      />
                      <Label check for="active">
                        Activo
                      </Label>
                    </FormGroup>
                    <FormGroup check className="me-3">
                      <Input
                        type="checkbox"
                        name="calculateperhour"
                        id="calculateperhour"
                        checked={form.calculateperhour}
                        onChange={handleChange}
                      />
                      <Label check for="calculateperhour">
                        Calcular por hora
                      </Label>
                    </FormGroup>
                    <FormGroup check className="me-3">
                      <Input
                        type="checkbox"
                        name="isDiscount"
                        id="isDiscount"
                        checked={form.isDiscount}
                        onChange={handleChange}
                      />
                      <Label check for="isDiscount">
                        Es descuento (si está activo, resta; si no, suma)
                      </Label>
                    </FormGroup>
                  </div>
                </div>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <FormGroup>
                <Label for="notes">Notas:</Label>
                <Input
                  type="textarea"
                  name="notes"
                  id="notes"
                  placeholder="Ingrese notas adicionales"
                  onChange={handleChange}
                  value={form.notes}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="12" className="d-flex justify-content-end mt-4">
              <Button
                color="secondary"
                className="rounded-pill dark-toggle-btn mx-2"
                onClick={handleClose}
              >
                Cancelar
              </Button>
              <Button
                color="primary"
                className="rounded-pill dark-toggle-btn"
                type="submit"
              >
                {isUpdate
                  ? `${loading ? "Actualizando..." : "Actualizar"} `
                  : `${loading ? "Guardando..." : "Guardar"}`}
              </Button>
            </Col>
          </Row>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default TypeNewsForm;
