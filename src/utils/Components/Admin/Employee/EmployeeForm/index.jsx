import { companiesApi, employeesApi } from "@/utils/api";
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
  contractType: "",
  name: "",
  contractStartDate: "",
  positionArea: "",
  basicMonthlySalary: "",
  shiftValuePerHour: "",
  transportationAssistance: "",
  mobilityAssistance: "",
  healthAndPensionDiscount: true,
  hasAdditionalDiscount: false,
  discountValue: 0,
  additionalDiscountComment: "",
  identificationNumber: "",
  phone: "",
  address: "",
  email: "",
  eps: "",
  arl: "",
  pension: "",
  sex: "",
  numberOfChildren: "",
  birthdate: "",
  companyId: null,
  active: true,
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
  const [companies, setCompanies] = useState([]);
  let formRef = createRef();

  const loadCompanies = async () => {
    try {
      const loadData = await companiesApi.list();
      setCompanies(loadData);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    loadCompanies();
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
      <Modal centered={true} isOpen={isOpen} size="xl">
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
              <Col md="4">
                <FormGroup>
                  <Label for="name">Empresa:</Label>
                  <Input
                    type="select"
                    name="companyId"
                    id="name"
                    placeholder="Ingresa el nombre"
                    onChange={handleChange}
                    value={form.companyId}
                    invalid={!!errors.companyId}
                    required
                  >
                    <option value="" selected>
                      Selecciona una opción
                    </option>

                    {companies.map((i) => (
                      <option value={i.id} key={i.id}>
                          {i.companyName}
                      </option>
                    ))}
                  </Input>
                  {errors.companyId && (
                    <FormFeedback>{errors.companyId}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="name">Tipo de contrato:</Label>
                  <Input
                    type="select"
                    name="contractType"
                    id="name"
                    placeholder="Ingresa el nombre"
                    onChange={handleChange}
                    value={form.contractType}
                    invalid={!!errors.contractType}
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
                  {errors.contractType && (
                    <FormFeedback>{errors.contractType}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="name">Nombres:</Label>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Ingresa el nombre"
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
              <Col md="4">
                <FormGroup>
                  <Label for="identificationNumber">Cédula:</Label>
                  <Input
                    type="number"
                    name="identificationNumber"
                    id="identificationNumber"
                    placeholder="Ingresa la cédula"
                    onChange={handleChange}
                    value={form.identificationNumber}
                    invalid={!!errors.identificationNumber}
                    required
                  />
                  {errors.identificationNumber && (
                    <FormFeedback>{errors.identificationNumber}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="name">Telefono:</Label>
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
              <Col md="4">
                <FormGroup>
                  <Label for="address">Dirección:</Label>
                  <Input
                    type="text"
                    name="address"
                    id="address"
                    placeholder="Ingresa la dirección"
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
            </Row>
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label for="email">Email:</Label>
                  <Input
                    type="email"
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
              <Col md="4">
                <FormGroup>
                  <Label for="eps">EPS:</Label>
                  <Input
                    type="select"
                    name="eps"
                    id="name"
                    placeholder="Ingresa el nombre"
                    onChange={handleChange}
                    value={form.eps}
                    invalid={!!errors.eps}
                    required
                  >
                    <option value="" selected>
                      Selecciona una opción
                    </option>

                    <option value="Pendiente">Pendient...</option>
                  </Input>
                  {errors.eps && <FormFeedback>{errors.eps}</FormFeedback>}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="arl">ARL:</Label>
                  <Input
                    type="select"
                    name="arl"
                    id="name"
                    placeholder="Ingresa el nombre"
                    onChange={handleChange}
                    value={form.arl}
                    invalid={!!errors.arl}
                    required
                  >
                    <option value="" selected>
                      Selecciona una opción
                    </option>

                    <option value="Pendiente">Pendient...</option>
                  </Input>
                  {errors.arl && <FormFeedback>{errors.arl}</FormFeedback>}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label for="pension">Pensión:</Label>
                  <Input
                    type="select"
                    name="pension"
                    id="name"
                    placeholder="Ingresa el nombre"
                    onChange={handleChange}
                    value={form.pension}
                    invalid={!!errors.pension}
                    required
                  >
                    <option value="" selected>
                      Selecciona una opción
                    </option>

                    <option value="Pendiente">Pendient...</option>
                  </Input>
                  {errors.pension && (
                    <FormFeedback>{errors.pension}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="sex">Sexo:</Label>
                  <Input
                    type="select"
                    name="sex"
                    id="name"
                    placeholder="Ingresa el sexo"
                    onChange={handleChange}
                    value={form.sex}
                    invalid={!!errors.sex}
                    required
                  >
                    <option value="" selected>
                      Selecciona una opción
                    </option>

                    <option value="Pendiente">Pendient...</option>
                  </Input>
                  {errors.sex && <FormFeedback>{errors.sex}</FormFeedback>}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="numberOfChildren">Numero de hijos:</Label>
                  <Input
                    type="number"
                    name="numberOfChildren"
                    id="numberOfChildren"
                    placeholder="Ingresa el numero de hijos"
                    onChange={handleChange}
                    value={form.numberOfChildren}
                    invalid={!!errors.numberOfChildren}
                    required
                  />
                  {errors.numberOfChildren && (
                    <FormFeedback>{errors.numberOfChildren}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label for="birthdate">Fecha de nacimiento:</Label>
                  <Input
                    type="date"
                    name="birthdate"
                    id="birthdate"
                    placeholder="Ingresa el numero de hijos"
                    onChange={handleChange}
                    value={form.birthdate}
                    invalid={!!errors.birthdate}
                    required
                  />
                  {errors.birthdate && (
                    <FormFeedback>{errors.birthdate}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="contractStartDate">
                    Fecha de inicio del contrato:
                  </Label>
                  <Input
                    type="date"
                    name="contractStartDate"
                    id="contractStartDate"
                    onChange={handleChange}
                    value={form.contractStartDate?.split("T")[0]}
                    invalid={!!errors.contractStartDate}
                    required
                  />
                  {errors.contractStartDate && (
                    <FormFeedback>{errors.contractStartDate}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="positionArea">Área/Posición:</Label>
                  <Input
                    type="text"
                    name="positionArea"
                    id="positionArea"
                    placeholder="Ingresa el área o posición"
                    onChange={handleChange}
                    value={form.positionArea}
                    invalid={!!errors.positionArea}
                    required
                  />
                  {errors.positionArea && (
                    <FormFeedback>{errors.positionArea}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label for="basicMonthlySalary">Salario base mensual:</Label>
                  <Input
                    type="number"
                    name="basicMonthlySalary"
                    id="basicMonthlySalary"
                    placeholder="Ingresa el salario base mensual"
                    onChange={handleChange}
                    value={form.basicMonthlySalary}
                    invalid={!!errors.basicMonthlySalary}
                    required
                  />
                  {errors.basicMonthlySalary && (
                    <FormFeedback>{errors.basicMonthlySalary}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="shiftValuePerHour">
                    Valor del turno por hora:
                  </Label>
                  <Input
                    type="number"
                    name="shiftValuePerHour"
                    id="shiftValuePerHour"
                    placeholder="Ingresa el valor del turno por hora"
                    onChange={handleChange}
                    value={form.shiftValuePerHour}
                    invalid={!!errors.shiftValuePerHour}
                    required
                  />
                  {errors.shiftValuePerHour && (
                    <FormFeedback>{errors.shiftValuePerHour}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="transportationAssistance">
                    Auxilio de transporte:
                  </Label>
                  <Input
                    type="number"
                    name="transportationAssistance"
                    id="transportationAssistance"
                    placeholder="Ingresa la auxilio de transporte"
                    onChange={handleChange}
                    value={form.transportationAssistance}
                    invalid={!!errors.transportationAssistance}
                    required
                  />
                  {errors.transportationAssistance && (
                    <FormFeedback>
                      {errors.transportationAssistance}
                    </FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="mobilityAssistance">Auxilio de movilidad:</Label>
                  <Input
                    type="number"
                    name="mobilityAssistance"
                    id="mobilityAssistance"
                    placeholder="Ingresa la auxilio de movilidad"
                    onChange={handleChange}
                    value={form.mobilityAssistance}
                    invalid={!!errors.mobilityAssistance}
                    required
                  />
                  {errors.mobilityAssistance && (
                    <FormFeedback>{errors.mobilityAssistance}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md="4">
                <FormGroup check inline>
                  <Input
                    type="checkbox"
                    id="healthAndPensionDiscount"
                    checked={form.healthAndPensionDiscount}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        healthAndPensionDiscount: e.target.checked,
                      })
                    }
                  />
                  <Label check for="healthAndPensionDiscount">
                    Descuento salud y pension
                  </Label>
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup check inline>
                  <Input
                    type="checkbox"
                    id="hasAdditionalDiscount"
                    checked={form.hasAdditionalDiscount}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        hasAdditionalDiscount: e.target.checked,
                      })
                    }
                  />
                  <Label check for="hasAdditionalDiscount">
                    Descuento adicional
                  </Label>
                </FormGroup>
              </Col>
            </Row>
            {form.hasAdditionalDiscount && (
              <>
                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Label for="discountValue">Valor de descuento:</Label>
                      <Input
                        type="number"
                        name="discountValue"
                        id="discountValue"
                        placeholder="Ingresa el Valor de descuento"
                        onChange={handleChange}
                        value={form.discountValue}
                        invalid={!!errors.discountValue}
                        required={form.hasAdditionalDiscount}
                      />
                      {errors.discountValue && (
                        <FormFeedback>{errors.discountValue}</FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <Label for="additionalDiscountComment">
                        Comentario por Descuento adicional:
                      </Label>
                      <Input
                        type="textarea"
                        name="additionalDiscountComment"
                        id="additionalDiscountComment"
                        placeholder="Ingresa Comentario por Descuento adicional"
                        onChange={handleChange}
                        value={form.additionalDiscountComment}
                        invalid={!!errors.additionalDiscountComment}
                        required={form.hasAdditionalDiscount}
                      />
                      {errors.additionalDiscountComment && (
                        <FormFeedback>
                          {errors.additionalDiscountComment}
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
