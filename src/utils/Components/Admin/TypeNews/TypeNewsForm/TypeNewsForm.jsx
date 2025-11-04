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
  Alert,
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
  amount: "", // Nuevo campo: cantidad fija
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
    const requiredFields = ["name", "code"];

    requiredFields.forEach((field) => {
      if (!form[field] || form[field].toString().trim() === "") {
        newErrors[field] = "Este campo es requerido";
      }
    });

    // Validar que porcentaje o cantidad tengan valor (mutuamente excluyentes)
    const percentageValue = form.percentage ? form.percentage.toString().trim() : "";
    const amountValue = form.amount ? form.amount.toString().trim() : "";
    
    if (!percentageValue && !amountValue) {
      newErrors.percentage = "Debe ingresar un porcentaje o una cantidad";
      newErrors.amount = "Debe ingresar un porcentaje o una cantidad";
    } else if (percentageValue && amountValue) {
      newErrors.percentage = "Solo puede ingresar porcentaje O cantidad, no ambos";
      newErrors.amount = "Solo puede ingresar porcentaje O cantidad, no ambos";
    }

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
          // Convertir amount vacío a null y percentage vacío a null
          amount: form.amount && form.amount.toString().trim() !== "" ? parseFloat(form.amount) : null,
          percentage: form.percentage && form.percentage.toString().trim() !== "" ? form.percentage : null,
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
            <Col md="6">
              <FormGroup>
                <Label for="percentage">Porcentaje:</Label>
                <Input
                  type="number"
                  name="percentage"
                  id="percentage"
                  placeholder="Ej: 50"
                  onChange={(e) => {
                    // Si se ingresa porcentaje, limpiar cantidad
                    const value = e.target.value;
                    const tieneCantidad = form.amount && form.amount.toString().trim() !== "";
                    
                    // Mostrar alerta si ya hay cantidad y se está ingresando porcentaje
                    if (value && tieneCantidad) {
                      toast.warning("Se limpiará el campo Cantidad porque solo puede usar Porcentaje O Cantidad", {
                        position: "top-center",
                        autoClose: 3000,
                      });
                    }
                    
                    setForm({
                      ...form,
                      percentage: value,
                      amount: value ? "" : form.amount, // Limpiar cantidad si se ingresa porcentaje
                    });
                    if (errors.percentage) {
                      setErrors({
                        ...errors,
                        percentage: "",
                        amount: "",
                      });
                    }
                  }}
                  value={form.percentage}
                  invalid={!!errors.percentage}
                />
                {errors.percentage && (
                  <FormFeedback>{errors.percentage}</FormFeedback>
                )}
                <small className="text-muted">Ingrese el porcentaje (ej: 50 para 50%)</small>
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="amount">Cantidad:</Label>
                <Input
                  type="number"
                  name="amount"
                  id="amount"
                  placeholder="Ej: 100000"
                  step="1"
                  min="0"
                  onChange={(e) => {
                    // Si se ingresa cantidad, limpiar porcentaje
                    const value = e.target.value;
                    const tienePorcentaje = form.percentage && form.percentage.toString().trim() !== "";
                    
                    // Mostrar alerta si ya hay porcentaje y se está ingresando cantidad
                    if (value && tienePorcentaje) {
                      toast.warning("Se limpiará el campo Porcentaje porque solo puede usar Porcentaje O Cantidad", {
                        position: "top-center",
                        autoClose: 3000,
                      });
                    }
                    
                    setForm({
                      ...form,
                      amount: value,
                      percentage: value ? "" : form.percentage, // Limpiar porcentaje si se ingresa cantidad
                    });
                    if (errors.amount) {
                      setErrors({
                        ...errors,
                        percentage: "",
                        amount: "",
                      });
                    }
                  }}
                  value={form.amount}
                  invalid={!!errors.amount}
                />
                {errors.amount && (
                  <FormFeedback>{errors.amount}</FormFeedback>
                )}
                <small className="text-muted">Ingrese la cantidad fija (ej: 100000)</small>
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
