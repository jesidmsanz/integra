import { employeesApi } from "@/utils/api";
import { use } from "passport";
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
  ContractType: "",
  Name: "",
  ContractStartDate: "",
  PositionArea: "",
  BasicMonthlySalary: "",
  ShiftValuePerHour: "",
  TransportationAssistance: "",
  MobilityAssistance: "",
  HealthAndPensionDiscount: true,
  HasAdditionalDiscount: false,
  DiscountValue: 0,
  AdditionalDiscountComment: "",
};

const EmployeeForm = ({
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
          ? await employeesApi.update(dataToUpdate.id, form)
          : await employeesApi.create(form);
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
        console.log("save :>> ", save);
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
                  <Label for="name">Tipo de contrato:</Label>
                  <Input
                    type="select"
                    name="ContractType"
                    id="name"
                    placeholder="Ingresa el nombre"
                    onChange={handleChange}
                    value={form.ContractType}
                    invalid={!!errors.ContractType}
                    required
                  >
                    <option value="" selected>
                      Selecciona una opción
                    </option>

                    <option value="Contrato a término fijo">
                      Contrato a término fijo
                    </option>
                    <option value="Contrato a término indefinido">
                      Contrato a término indefinido
                    </option>
                    <option value="Contrato de obra o labor">
                      Contrato de obra o labor
                    </option>
                    <option value="Contrato de aprendizaje">
                      Contrato de aprendizaje
                    </option>
                    <option value="Contrato civil por prestación de servicios">
                      Contrato civil por prestación de servicios
                    </option>
                    <option value="Contrato ocasional de trabajo">
                      Contrato ocasional de trabajo
                    </option>
                  </Input>
                  {errors.ContractType && (
                    <FormFeedback>{errors.ContractType}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="name">Nombres:</Label>
                  <Input
                    type="text"
                    name="Name"
                    id="name"
                    placeholder="Ingresa el nombre"
                    onChange={handleChange}
                    value={form.Name}
                    invalid={!!errors.Name}
                    required
                  />
                  {errors.Name && <FormFeedback>{errors.Name}</FormFeedback>}
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md="6">
                <FormGroup>
                  <Label for="ContractStartDate">
                    Fecha de inicio del contrato:
                  </Label>
                  <Input
                    type="date"
                    name="ContractStartDate"
                    id="ContractStartDate"
                    onChange={handleChange}
                    value={form.ContractStartDate?.split("T")[0]}
                    invalid={!!errors.ContractStartDate}
                    required
                  />
                  {errors.ContractStartDate && (
                    <FormFeedback>{errors.ContractStartDate}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="PositionArea">Área/Posición:</Label>
                  <Input
                    type="text"
                    name="PositionArea"
                    id="PositionArea"
                    placeholder="Ingresa el área o posición"
                    onChange={handleChange}
                    value={form.PositionArea}
                    invalid={!!errors.PositionArea}
                    required
                  />
                  {errors.PositionArea && (
                    <FormFeedback>{errors.PositionArea}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md="6">
                <FormGroup>
                  <Label for="BasicMonthlySalary">Salario base mensual:</Label>
                  <Input
                    type="number"
                    name="BasicMonthlySalary"
                    id="BasicMonthlySalary"
                    placeholder="Ingresa el salario base mensual"
                    onChange={handleChange}
                    value={form.BasicMonthlySalary}
                    invalid={!!errors.BasicMonthlySalary}
                    required
                  />
                  {errors.BasicMonthlySalary && (
                    <FormFeedback>{errors.BasicMonthlySalary}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="ShiftValuePerHour">
                    Valor del turno por hora:
                  </Label>
                  <Input
                    type="number"
                    name="ShiftValuePerHour"
                    id="ShiftValuePerHour"
                    placeholder="Ingresa el valor del turno por hora"
                    onChange={handleChange}
                    value={form.ShiftValuePerHour}
                    invalid={!!errors.ShiftValuePerHour}
                    required
                  />
                  {errors.ShiftValuePerHour && (
                    <FormFeedback>{errors.ShiftValuePerHour}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md="6">
                <FormGroup>
                  <Label for="TransportationAssistance">
                    Auxilio de transporte:
                  </Label>
                  <Input
                    type="number"
                    name="TransportationAssistance"
                    id="TransportationAssistance"
                    placeholder="Ingresa la auxilio de transporte"
                    onChange={handleChange}
                    value={form.TransportationAssistance}
                    invalid={!!errors.TransportationAssistance}
                    required
                  />
                  {errors.TransportationAssistance && (
                    <FormFeedback>
                      {errors.TransportationAssistance}
                    </FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="MobilityAssistance">Auxilio de movilidad:</Label>
                  <Input
                    type="number"
                    name="MobilityAssistance"
                    id="MobilityAssistance"
                    placeholder="Ingresa la auxilio de movilidad"
                    onChange={handleChange}
                    value={form.MobilityAssistance}
                    invalid={!!errors.MobilityAssistance}
                    required
                  />
                  {errors.MobilityAssistance && (
                    <FormFeedback>{errors.MobilityAssistance}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md="6">
                <FormGroup check inline>
                  <Input
                    type="checkbox"
                    id="HealthAndPensionDiscount"
                    checked={form.HealthAndPensionDiscount}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        HealthAndPensionDiscount: e.target.checked,
                      })
                    }
                  />
                  <Label check for="HealthAndPensionDiscount">
                    Descuento salud y pension
                  </Label>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup check inline>
                  <Input
                    type="checkbox"
                    id="HasAdditionalDiscount"
                    checked={form.HasAdditionalDiscount}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        HasAdditionalDiscount: e.target.checked,
                      })
                    }
                  />
                  <Label check for="HasAdditionalDiscount">
                    Descuento adicional
                  </Label>
                </FormGroup>
              </Col>
            </Row>
            {form.HasAdditionalDiscount && (
              <>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label for="DiscountValue">Valor de descuento:</Label>
                      <Input
                        type="number"
                        name="DiscountValue"
                        id="DiscountValue"
                        placeholder="Ingresa el Valor de descuento"
                        onChange={handleChange}
                        value={form.DiscountValue}
                        invalid={!!errors.DiscountValue}
                        required
                      />
                      {errors.DiscountValue && (
                        <FormFeedback>{errors.DiscountValue}</FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <Label for="AdditionalDiscountComment">
                        Comentario por Descuento adicional:
                      </Label>
                      <Input
                        type="textarea"
                        name="AdditionalDiscountComment"
                        id="AdditionalDiscountComment"
                        placeholder="Ingresa Comentario por Descuento adicional"
                        onChange={handleChange}
                        value={form.AdditionalDiscountComment}
                        invalid={!!errors.AdditionalDiscountComment}
                        required
                      />
                      {errors.AdditionalDiscountComment && (
                        <FormFeedback>
                          {errors.AdditionalDiscountComment}
                        </FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
              </>
            )}
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
export default EmployeeForm;
