import { companiesApi } from "@/utils/api";
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
  CompanyName: "",
  Nit: "",
  Address: "",
  Phone: "",
  Email: "",
};

const CompanyForm = ({
  title,
  isOpen,
  setViewForm,
  fetchData,
  dataToUpdate,
  isUpdate,
  setIsUpdate,
}) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  let formRef = createRef();

  useEffect(() => {
    if (isUpdate && dataToUpdate) {
      setForm(dataToUpdate);
    } else {
      setForm(initialState);
    }
  }, [isUpdate, dataToUpdate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
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
      if (!form[key]) {
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
          ? await companiesApi.update(dataToUpdate.id, form)
          : await companiesApi.create(form);
        console.log("save :>> ", save);
        if (save?.id) {
          setForm(initialState);
          setViewForm(false);
          setIsUpdate(false);
          fetchData(1);
          isUpdate
            ? toast.success("El registro se actualizo exitosamente", {
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
    <>
      <Modal centered={true} isOpen={isOpen} size="lg">
        <ModalHeader>
          <h2>{title}</h2>
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
                  <Label for="name">Razón Social:</Label>
                  <Input
                    type="text"
                    name="CompanyName"
                    id="CompanyName"
                    placeholder="Razón Social"
                    onChange={handleChange}
                    value={form.CompanyName}
                    invalid={!!errors.CompanyName}
                    required
                  />
                  {errors.CompanyName && (
                    <FormFeedback>{errors.CompanyName}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="name">NIT:</Label>
                  <Input
                    type="text"
                    name="Nit"
                    id="Nit"
                    placeholder="Ingresa el nit"
                    onChange={handleChange}
                    value={form.Nit}
                    invalid={!!errors.Nit}
                    required
                  />
                  {errors.Nit && <FormFeedback>{errors.Nit}</FormFeedback>}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label for="name">Direcciòn:</Label>
                  <Input
                    type="text"
                    name="Address"
                    id="Address"
                    placeholder="Ingresa el direcciòn"
                    onChange={handleChange}
                    value={form.Address}
                    invalid={!!errors.Address}
                    required
                  />
                  {errors.Address && (
                    <FormFeedback>{errors.Address}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="name">Telefono:</Label>
                  <Input
                    type="number"
                    name="Phone"
                    id="Phone"
                    placeholder="Ingresa el telefono"
                    onChange={handleChange}
                    value={form.Phone}
                    invalid={!!errors.Phone}
                    required
                  />
                  {errors.Phone && <FormFeedback>{errors.Phone}</FormFeedback>}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label for="name">Email:</Label>
                  <Input
                    type="text"
                    name="Email"
                    id="Email"
                    placeholder="Ingresa el email"
                    onChange={handleChange}
                    value={form.Email}
                    invalid={!!errors.Email}
                    required
                  />
                  {errors.Email && <FormFeedback>{errors.Email}</FormFeedback>}
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md="12" className="d-flex justify-content-end mt-4">
                <Button
                  color="secondary"
                  className="rounded-pill dark-toggle-btn mx-2"
                  onClick={() => {
                    setForm(initialState);
                    setIsUpdate(false);
                    setViewForm(false);
                  }}
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
    </>
  );
};
export default CompanyForm;
