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
  companyName: "",
  nit: "",
  address: "",
  phone: "",
  email: "",
  active: true,
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
                  <Label for="companyName">Razón Social:</Label>
                  <Input
                    type="text"
                    name="companyName"
                    id="companyName"
                    placeholder="Razón Social"
                    onChange={handleChange}
                    value={form.companyName}
                    invalid={!!errors.companyName}
                    required
                  />
                  {errors.companyName && (
                    <FormFeedback>{errors.companyName}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="nit">NIT:</Label>
                  <Input
                    type="text"
                    name="nit"
                    id="nit"
                    placeholder="Ingresa el nit"
                    onChange={handleChange}
                    value={form.nit}
                    invalid={!!errors.nit}
                    required
                  />
                  {errors.nit && <FormFeedback>{errors.nit}</FormFeedback>}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label for="address">Direcciòn:</Label>
                  <Input
                    type="text"
                    name="address"
                    id="address"
                    placeholder="Ingresa el direcciòn"
                    onChange={handleChange}
                    value={form.address}
                    invalid={!!errors.address}
                    required
                  />
                  {errors.address && (
                    <FormFeedback>{errors.address}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="phone">Telefono:</Label>
                  <Input
                    type="number"
                    name="phone"
                    id="phone"
                    placeholder="Ingresa el telefono"
                    onChange={handleChange}
                    value={form.phone}
                    invalid={!!errors.phone}
                    required
                  />
                  {errors.phone && <FormFeedback>{errors.phone}</FormFeedback>}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label for="email">Email:</Label>
                  <Input
                    type="text"
                    name="email"
                    id="email"
                    placeholder="Ingresa el email"
                    onChange={handleChange}
                    value={form.email}
                    invalid={!!errors.email}
                    required
                  />
                  {errors.email && <FormFeedback>{errors.email}</FormFeedback>}
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
                      onChange={(e) => {
                        const { name, checked } = e.target;
                        setForm({
                          ...form,
                          [name]: checked,
                        });
                      }}
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
