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
  IdentificationNumber: "",
  Phone: "",
  Address: "",
  Email: "",
  Eps: "",
  Arl: "",
  Pension: "",
  Sexo: "",
  NumberOfChildren: "",
  Birthdate: "",
  CompanyId: null,
  Active: true,
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
                    name="CompanyId"
                    id="name"
                    placeholder="Ingresa el nombre"
                    onChange={handleChange}
                    value={form.CompanyId}
                    invalid={!!errors.CompanyId}
                    required
                  >
                    <option value="" selected>
                      Selecciona una opción
                    </option>

                    {companies.map((i) => (
                      <option value={i.id} key={i.id}>
                        {i.CompanyName}
                      </option>
                    ))}
                  </Input>
                  {errors.CompanyId && (
                    <FormFeedback>{errors.CompanyId}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="4">
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
              <Col md="4">
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
              <Col md="4">
                <FormGroup>
                  <Label for="IdentificationNumber">Cédula:</Label>
                  <Input
                    type="number"
                    name="IdentificationNumber"
                    id="IdentificationNumber"
                    placeholder="Ingresa la cédula"
                    onChange={handleChange}
                    value={form.IdentificationNumber}
                    invalid={!!errors.IdentificationNumber}
                    required
                  />
                  {errors.IdentificationNumber && (
                    <FormFeedback>{errors.IdentificationNumber}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="4">
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
              <Col md="4">
                <FormGroup>
                  <Label for="Address">Dirección:</Label>
                  <Input
                    type="text"
                    name="Address"
                    id="Address"
                    placeholder="Ingresa la dirección"
                    onChange={handleChange}
                    value={form.Address?.split("T")[0]}
                    invalid={!!errors.Address}
                    required
                  />
                  {errors.Address && (
                    <FormFeedback>{errors.Address}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label for="Email">Email:</Label>
                  <Input
                    type="email"
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
              <Col md="4">
                <FormGroup>
                  <Label for="name">EPS:</Label>
                  <Input
                    type="select"
                    name="Eps"
                    id="name"
                    placeholder="Ingresa el nombre"
                    onChange={handleChange}
                    value={form.Eps}
                    invalid={!!errors.Eps}
                    required
                  >
                    <option value="" selected>
                      Selecciona una opción
                    </option>

                    <option value="Pendiente">Pendient...</option>
                  </Input>
                  {errors.Eps && <FormFeedback>{errors.Eps}</FormFeedback>}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="name">ARL:</Label>
                  <Input
                    type="select"
                    name="Arl"
                    id="name"
                    placeholder="Ingresa el nombre"
                    onChange={handleChange}
                    value={form.Arl}
                    invalid={!!errors.Arl}
                    required
                  >
                    <option value="" selected>
                      Selecciona una opción
                    </option>

                    <option value="Pendiente">Pendient...</option>
                  </Input>
                  {errors.Arl && <FormFeedback>{errors.Arl}</FormFeedback>}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label for="name">Pensión:</Label>
                  <Input
                    type="select"
                    name="Pension"
                    id="name"
                    placeholder="Ingresa el nombre"
                    onChange={handleChange}
                    value={form.Pension}
                    invalid={!!errors.Pension}
                    required
                  >
                    <option value="" selected>
                      Selecciona una opción
                    </option>

                    <option value="Pendiente">Pendient...</option>
                  </Input>
                  {errors.Pension && (
                    <FormFeedback>{errors.Pension}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="name">Sexo:</Label>
                  <Input
                    type="select"
                    name="Sexo"
                    id="name"
                    placeholder="Ingresa el sexo"
                    onChange={handleChange}
                    value={form.Sexo}
                    invalid={!!errors.Sexo}
                    required
                  >
                    <option value="" selected>
                      Selecciona una opción
                    </option>

                    <option value="Pendiente">Pendient...</option>
                  </Input>
                  {errors.Sexo && <FormFeedback>{errors.Sexo}</FormFeedback>}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="name">Numero de hijos:</Label>
                  <Input
                    type="number"
                    name="NumberOfChildren"
                    id="name"
                    placeholder="Ingresa el numero de hijos"
                    onChange={handleChange}
                    value={form.NumberOfChildren}
                    invalid={!!errors.NumberOfChildren}
                    required
                  />
                  {errors.NumberOfChildren && (
                    <FormFeedback>{errors.NumberOfChildren}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label for="name">Fecha de nacimiento:</Label>
                  <Input
                    type="date"
                    name="Birthdate"
                    id="name"
                    placeholder="Ingresa el numero de hijos"
                    onChange={handleChange}
                    value={form.Birthdate}
                    invalid={!!errors.Birthdate}
                    required
                  />
                  {errors.Birthdate && (
                    <FormFeedback>{errors.Birthdate}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="4">
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
              <Col md="4">
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
              <Col md="4">
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
              <Col md="4">
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
              <Col md="4">
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
              <Col md="4">
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
              <Col md="4">
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
              <Col md="4">
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
                  <Col md="4">
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
