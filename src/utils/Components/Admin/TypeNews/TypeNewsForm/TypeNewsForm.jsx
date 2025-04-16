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
  affects: "",
  percentage: "",
  status: "active",
  category: "",
  active: true,
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
      if (!form[key] && key !== "active") {
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
            <Col md="6">
              <FormGroup>
                <Label for="affects">Afecta:</Label>
                <Input
                  type="select"
                  name="affects"
                  id="affects"
                  onChange={handleChange}
                  value={form.affects}
                  invalid={!!errors.affects}
                  required
                >
                  <option value="">Seleccione una opción</option>
                  <option value="salary">Salario</option>
                  <option value="benefits">Prestaciones</option>
                  <option value="both">Ambos</option>
                  <option value="none">Ninguno</option>
                </Input>
                {errors.affects && (
                  <FormFeedback>{errors.affects}</FormFeedback>
                )}
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
                  placeholder="Ingrese el porcentaje"
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
                  type="select"
                  name="category"
                  id="category"
                  onChange={handleChange}
                  value={form.category}
                  invalid={!!errors.category}
                  required
                >
                  <option value="">Seleccione una categoría</option>
                  <option value="vacation">Vacaciones</option>
                  <option value="disability">Incapacidad</option>
                  <option value="permission">Permiso</option>
                  <option value="license">Licencia</option>
                  <option value="other">Otro</option>
                </Input>
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
                  type="select"
                  name="status"
                  id="status"
                  onChange={handleChange}
                  value={form.status}
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
