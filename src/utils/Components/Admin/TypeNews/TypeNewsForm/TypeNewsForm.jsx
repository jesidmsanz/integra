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

const initialState = {
  name: "",
  code: "",
  duration: "",
  payment: "",
  affects: "",
  applies_to: "",
  percentage: "",
  status: "active",
  category: "",
  active: true,
  notes: "",
  noaplicaauxiliotransporte: false,
  calculateperhour: false,
};

const TypeNewsForm = ({ isOpen, toggle, data, isUpdate, onSuccess }) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  let formRef = createRef();

  useEffect(() => {
    if (isUpdate && data) {
      setForm(data);
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

  const validateForm = () => {
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      if (
        !form[key] &&
        key !== "active" &&
        key !== "notes" &&
        key !== "createdAt" &&
        key !== "updatedAt" &&
        key !== "noaplicaauxiliotransporte" &&
        key !== "calculateperhour"
      ) {
        newErrors[key] = "Este campo es requerido";
      }
    });
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    console.log("newErrors", newErrors);
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        console.log("form", form);
        const save = isUpdate
          ? await typeNewsApi.update(data.id, form)
          : await typeNewsApi.create(form);
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
            <Col md="6">
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
                  required
                />
                {errors.duration && (
                  <FormFeedback>{errors.duration}</FormFeedback>
                )}
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="payment">Pago:</Label>
                <Input
                  type="text"
                  name="payment"
                  id="payment"
                  placeholder="Pago de la novedad"
                  onChange={handleChange}
                  value={form.payment}
                  invalid={!!errors.payment}
                  required
                />
                {errors.payment && (
                  <FormFeedback>{errors.payment}</FormFeedback>
                )}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="6">
              <FormGroup>
                <Label for="affects">Afecta:</Label>
                <Input
                  type="text"
                  name="affects"
                  id="affects"
                  placeholder="Afecta"
                  onChange={handleChange}
                  value={form.affects}
                  invalid={!!errors.affects}
                  required
                />
                {errors.affects && (
                  <FormFeedback>{errors.affects}</FormFeedback>
                )}
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="applies_to">Aplica a:</Label>
                <Input
                  type="text"
                  name="applies_to"
                  id="applies_to"
                  placeholder="Aplica a"
                  onChange={handleChange}
                  value={form.applies_to}
                  invalid={!!errors.applies_to}
                  required
                />
                {errors.applies_to && (
                  <FormFeedback>{errors.applies_to}</FormFeedback>
                )}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="6">
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
            <Col md="6">
              <FormGroup>
                <Label for="category">Categoría:</Label>
                <Input
                  type="text"
                  name="category"
                  id="category"
                  placeholder="Categoría"
                  onChange={handleChange}
                  value={form.category}
                  invalid={!!errors.category}
                  required
                />
                {errors.category && (
                  <FormFeedback>{errors.category}</FormFeedback>
                )}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="6">
              <FormGroup>
                <Label for="status">Estado:</Label>
                <Input
                  type="text"
                  name="status"
                  id="status"
                  placeholder="Estado"
                  onChange={handleChange}
                  value={form.status}
                  invalid={!!errors.status}
                  required
                />
                {errors.status && <FormFeedback>{errors.status}</FormFeedback>}
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="active">Activo</Label>
                <div>
                  <Input
                    type="checkbox"
                    name="active"
                    id="active"
                    checked={form.active}
                    onChange={handleChange}
                  />
                </div>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="6">
              <FormGroup>
                <Label for="noaplicaauxiliotransporte">
                  No aplica auxilio de transporte
                </Label>
                <div>
                  <Input
                    type="checkbox"
                    name="noaplicaauxiliotransporte"
                    id="noaplicaauxiliotransporte"
                    checked={form.noaplicaauxiliotransporte}
                    onChange={handleChange}
                  />
                </div>
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="calculateperhour">Calcular por hora</Label>
                <div>
                  <Input
                    type="checkbox"
                    name="calculateperhour"
                    id="calculateperhour"
                    checked={form.calculateperhour}
                    onChange={handleChange}
                  />
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
