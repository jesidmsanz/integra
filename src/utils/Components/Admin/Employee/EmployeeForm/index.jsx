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
  documenttype: "",
  documentnumber: "",
  fullname: "",
  contracttype: "",
  position: "",
  workday: "",
  maritalstatus: "",
  educationlevel: "",
  bloodtype: "",
  phone: "",
  address: "",
  email: "",
  contributortype: "",
  contributorsubtype: "",
  eps: "",
  arl: "",
  arlrisklevel: "",
  arlriskpercentage: "",
  pension: "",
  compensationfund: "",
  severancefund: "",
  sex: "",
  birthdate: "",
  contractstartdate: "",
  contractenddate: "",
  payrolltype: "",
  costcenter: "",
  basicmonthlysalary: "",
  hourlyrate: "",
  transportationassistance: "",
  mobilityassistance: "",
  accounttype: "",
  bank: "",
  accountnumber: "",
  paymentmethod: "",
  workcity: "",
  hasadditionaldiscount: false,
  discountvalue: 0,
  additionaldiscountcomment: "",
  shirtsize: "",
  pantssize: "",
  shoesize: "",
  // Campos sociodemográficos
  dependents_count: 0,
  children_count: 0,
  is_head_of_family: false,
  housing_type: "",
  ethnic_group: "",
  socioeconomic_stratum: "",
  residence_place: "",
  has_disability: false,
  disability_type: "",
  companyid: null,
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

  const selectOptions = {
    arl: ["Positiva Compañía de Seguros"],
    eps: [
      "Sanitas",
      "EPS Sura",
      "Salud Total",
      "Cajacopi",
      "Mutualser",
      "Nueva EPS",
      "Coosalud",
      "Famisanar",
    ],
    paymentmethod: ["Quincenal", "Mensual"],
    documenttype: ["CC", "PPT", "CE"],
    contracttype: [
      "Obra o labor",
      "Fijo",
      "Indefinido",
      "Prestacion de servicio",
    ],
    position: [
      "Auxiliar de Servicios Generales",
      "GERENTE OPERATIVO",
      "Conserje",
      "Supervisor Operativo",
      "Todero/Piscinero",
      "Todero ",
      "Todero/Salvavidas",
      "Auxiliar de Cocina",
      "Operaria de Aseo",
      "Operario de Aseo",
      "Psicóloga",
      "Salvavidas",
      "Jardinero",
      "Supervisor De Aseo",
      "Todero",
      "Coordinador Talento Humano",
      "Ejecutiva Comercial",
      "Contador",
      "Gerente Comercial",
      "ORIENTADOR",
    ],
    maritalstatus: [
      "Soltera",
      "Soltero",
      "Unión Libre",
      "Casada",
      "soltera",
      "Casado",
      "Union Libre",
      "casado",
      "union libre",
      "Viuda",
    ],
    educationlevel: [
      "Técnico",
      "Especialista",
      "Bachiller",
      "Profesional",
      "Tecnico",
      "Tegnologo",
      "Primaria",
    ],
    bloodtype: ["O+", "B+", "A+"],
    contributortype: ["Dependiente", "INDEPENDIENTE"],
    arlrisklevel: [
      "Riesgo II",
      "Riesgo I ",
      "Riesgo IV",
      "Riesgo I",
      "Riesgo II ",
    ],
    pension: [
      "Porvenir",
      "Colfondos",
      "Protección",
      "Colpensiones",
      "colpensiones",
    ],
    compensationfund: ["Comfamiliar", "comfamiliar", "Cajamag"],
    severancefund: ["Protección"],
    sex: ["Masculino", "Femenino"],
    payrolltype: ["Operativa", "Administrativa", "OPS"],
    costcenter: [
      "Clinica Santa Ana de Dios",
      "Administración",
      "El Parador de Santa Marta",
      "Villas del puerto II",
      "Parque Central Hayuelos",
      "Parque Industrial Claveria",
      "Torres de Montreal",
      "Palmas Mall",
      "Producción",
      "Instituto San Luis Beltran",
      "Edificio Bruxxel",
      "Edificio Colibrí",
      "Firenze",
      "Edificio Colibri",
      "Mystic Park",
      "Bahia de Cadiz",
      "Carniceria Don Pedro",
      "Mistic Park",
      "Parques de Bolivar II",
      "SeppsaFumiespecial",
      "Carnicería Don pedro",
      "Boracay",
      "Punta Gaira",
      "Conjunto Ruiseñor",
      "clinica Santa Ana de Dios",
      "Carniceria Alameda del Rio",
      "Lagos Caujaral",
      "Torres del sol",
      "IPS Vihonco",
      "SUPERNUMERARIO",
    ],
    bank: ["Bancolombia", "BBVA", "Banco Davivienda S.A.", "0"],
    accounttype: ["Ahorro", "DAVIPLATA", "NEQUI", "Efectivo"],
    workcity: ["Barranquilla", "Santa Marta"],
    shirtsize: ["XS", "S", "M", "L", "XL", "XXL"],
    pantssize: ["28", "30", "32", "34", "36", "38", "40", "42"],
    shoesize: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
    active: ["SI", "NO"],
    // Opciones sociodemográficas
    housing_type: [
      "Propia urbana",
      "Arriendo urbano", 
      "Familiar urbano",
      "Familiar rural",
      "Propia rural",
      "Arriendo rural"
    ],
    ethnic_group: [
      "Gitano",
      "Raizal del archipiélago de San Andrés y Providencia",
      "Indígena",
      "Negro",
      "Mulato",
      "Afrocolombiano",
      "Blanco",
      "Ninguna de las anteriores"
    ],
    socioeconomic_stratum: [
      "1",
      "2", 
      "3",
      "4",
      "5",
      "6",
      "Finca o vereda",
      "No reportan"
    ],
    disability_type: [
      "Sin discapacidad",
      "Discapacidad visual",
      "Discapacidad auditiva", 
      "Discapacidad física",
      "Discapacidad múltiple"
    ],
  };

  const formatCurrency = (value) => {
    if (!value || value === "" || value === "0") return "";
    
    // Si ya está formateado como moneda, retornarlo tal como está
    if (typeof value === 'string' && value.includes('$')) {
      return value;
    }
    
    const number = parseFloat(value);
    
    // Verificar que sea un número válido
    if (isNaN(number) || number === 0) {
      return "";
    }
    
    // Formatear manualmente para evitar problemas con el símbolo de moneda
    return `$${number.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const unformatCurrency = (value) => {
    if (!value) return "";
    // Remover todos los caracteres que no sean números, incluyendo puntos y comas
    const cleaned = value.toString().replace(/[^0-9]/g, "");
    return cleaned || "0";
  };

  const handleCurrencyChange = (e) => {
    const { name, value } = e.target;
    console.log(`💸 handleCurrencyChange - Campo: ${name}, Valor: ${value}`);
    
    // Limpiar el valor (solo números)
    const cleanValue = value.replace(/[^0-9]/g, '');
    
    // Actualizar el estado con el valor limpio
    setForm(prev => ({
      ...prev,
      [name]: cleanValue,
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }
  };


  const loadCompanies = async () => {
    try {
      const loadData = await companiesApi.list();
      setCompanies(loadData);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Normalizar el valor para que no sea sensible a mayúsculas/minúsculas
    const normalizedValue = value.toLowerCase().trim();
    const matchingOption = selectOptions[name]?.find(
      (option) => option.toLowerCase().trim() === normalizedValue
    );

    setForm({
      ...form,
      [name]: matchingOption || value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  useEffect(() => {
    loadCompanies();
    if (isUpdate && dataToUpdate) {
      console.log("🔍 dataToUpdate:", dataToUpdate);
      const formattedData = {
        ...dataToUpdate,
        basicmonthlysalary: dataToUpdate.basicmonthlysalary || "",
        hourlyrate: dataToUpdate.hourlyrate || "",
        transportationassistance: dataToUpdate.transportationassistance || "",
        mobilityassistance: dataToUpdate.mobilityassistance || "",
        discountvalue: dataToUpdate.discountvalue || 0,
        // Normalizar los valores de los selects
        ...Object.keys(selectOptions).reduce((acc, key) => {
          if (dataToUpdate[key]) {
            const value = dataToUpdate[key];
            // Solo procesar si es string
            if (typeof value === 'string') {
              const normalizedValue = value.toLowerCase().trim();
              const matchingOption = selectOptions[key].find(
                (option) => option.toLowerCase().trim() === normalizedValue
              );
              if (matchingOption) {
                acc[key] = matchingOption;
              }
            }
          }
          return acc;
        }, {}),
      };
      setForm(formattedData);
    } else {
      setForm(initialState);
    }
  }, [isUpdate, dataToUpdate]);

  // useEffect para manejar la lógica del campo de discapacidad
  useEffect(() => {
    if (form.has_disability === false || form.has_disability === "false") {
      setForm(prev => ({
        ...prev,
        disability_type: ""
      }));
    }
  }, [form.has_disability]);

  const validateForm = () => {
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      // Excluir campos que no son requeridos
      const nonRequiredFields = [
        'dependents_count', 
        'children_count', 
        'is_head_of_family', 
        'housing_type', 
        'ethnic_group', 
        'socioeconomic_stratum', 
        'residence_place',
        'disability_type', // No requerido si has_disability es false
        'transportationassistance', // Auxilio de Transporte - opcional
        'hasadditionaldiscount', // Descuento Adicional - opcional
        'shirtsize', // Talla de Camisa - opcional
        'pantssize', // Talla de Pantalón - opcional
        'shoesize', // Talla de Zapatos - opcional
        'has_disability', // Persona en condición de discapacidad - opcional
        'discountvalue' // Valor del Descuento - opcional
      ];
      // Si el campo no está en la lista de no requeridos y está vacío, es requerido
      if (!nonRequiredFields.includes(key) && !form[key]) {
        newErrors[key] = "Este campo es requerido";
      }
      
      // Validación especial para disability_type: solo es requerido si has_disability es true
      if (key === 'disability_type' && form.has_disability === true && !form[key]) {
        newErrors[key] = "Este campo es requerido";
      }
    });
    console.log('newErrors', newErrors)
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        const dataToSend = {
          ...form,
          basicmonthlysalary: form.basicmonthlysalary || 0,
          hourlyrate: form.hourlyrate || 0,
          transportationassistance: form.transportationassistance || 0,
          mobilityassistance: form.mobilityassistance || 0,
          discountvalue: form.discountvalue || 0,
        };
        const save = isUpdate
          ? await employeesApi.update(dataToUpdate.id, dataToSend)
          : await employeesApi.create(dataToSend);
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
        <ModalHeader toggle={() => setViewForm(false)}>
          <h2 className="mb-0">{title}</h2>
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={handleSubmit}
            noValidate={true}
            ref={(ref) => {
              formRef = ref;
            }}
          >
            <h4 className="mb-3">Información Personal</h4>
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label for="documenttype">Tipo de documento:</Label>
                  <Input
                    type="select"
                    name="documenttype"
                    id="documenttype"
                    onChange={handleChange}
                    value={form.documenttype}
                    invalid={!!errors.documenttype}
                    required
                  >
                    <option value="">Selecciona una opción</option>
                    {selectOptions.documenttype.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Input>
                  {errors.documenttype && (
                    <FormFeedback>{errors.documenttype}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="documentnumber">Número de documento:</Label>
                  <Input
                    type="text"
                    name="documentnumber"
                    id="documentnumber"
                    placeholder="Ingresa el número de documento"
                    onChange={handleChange}
                    value={form.documentnumber}
                    invalid={!!errors.documentnumber}
                    required
                  />
                  {errors.documentnumber && (
                    <FormFeedback>{errors.documentnumber}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="fullname">Nombre completo:</Label>
                  <Input
                    type="text"
                    name="fullname"
                    id="fullname"
                    placeholder="Ingresa el nombre completo"
                    onChange={handleChange}
                    value={form.fullname}
                    invalid={!!errors.fullname}
                    required
                  />
                  {errors.fullname && (
                    <FormFeedback>{errors.fullname}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label for="sex">Sexo:</Label>
                  <Input
                    type="select"
                    name="sex"
                    id="sex"
                    onChange={handleChange}
                    value={form.sex}
                    invalid={!!errors.sex}
                    required
                  >
                    <option value="">Selecciona una opción</option>
                    {selectOptions.sex.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Input>
                  {errors.sex && <FormFeedback>{errors.sex}</FormFeedback>}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="birthdate">Fecha de nacimiento:</Label>
                  <Input
                    type="date"
                    name="birthdate"
                    id="birthdate"
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
                  <Label for="maritalstatus">Estado Civil:</Label>
                  <Input
                    type="select"
                    name="maritalstatus"
                    id="maritalstatus"
                    onChange={handleChange}
                    value={form.maritalstatus}
                    invalid={!!errors.maritalstatus}
                    required
                  >
                    <option value="">Selecciona una opción</option>
                    {selectOptions.maritalstatus.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Input>
                  {errors.maritalstatus && (
                    <FormFeedback>{errors.maritalstatus}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label for="bloodtype">Tipo de sangre:</Label>
                  <Input
                    type="select"
                    name="bloodtype"
                    id="bloodtype"
                    onChange={handleChange}
                    value={form.bloodtype}
                    invalid={!!errors.bloodtype}
                    required
                  >
                    <option value="">Selecciona una opción</option>
                    {selectOptions.bloodtype.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Input>
                  {errors.bloodtype && (
                    <FormFeedback>{errors.bloodtype}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="phone">Teléfono:</Label>
                  <Input
                    type="text"
                    name="phone"
                    id="phone"
                    placeholder="Ingresa el teléfono"
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
                  <Label for="email">Correo electrónico:</Label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Ingresa el correo electrónico"
                    onChange={handleChange}
                    value={form.email}
                    invalid={!!errors.email}
                    required
                  />
                  {errors.email && <FormFeedback>{errors.email}</FormFeedback>}
                </FormGroup>
              </Col>
            </Row>
            <Row>
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
            <h4 className="mt-4 mb-3">Información Laboral</h4>
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label for="companyid">Empresa:</Label>
                  <Input
                    type="select"
                    name="companyid"
                    id="companyid"
                    onChange={handleChange}
                    value={form.companyid}
                    invalid={!!errors.companyid}
                    required
                    disabled={isUpdate}
                  >
                    <option value="">Selecciona una opción</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.companyname}
                      </option>
                    ))}
                  </Input>
                  {errors.companyid && (
                    <FormFeedback>{errors.companyid}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="position">Cargo:</Label>
                  <Input
                    type="select"
                    name="position"
                    id="position"
                    onChange={handleChange}
                    value={form.position}
                    invalid={!!errors.position}
                    required
                  >
                    <option value="">Selecciona una opción</option>
                    {selectOptions.position.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Input>
                  {errors.position && (
                    <FormFeedback>{errors.position}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="costcenter">Centro de costos:</Label>
                  <Input
                    type="select"
                    name="costcenter"
                    id="costcenter"
                    onChange={handleChange}
                    value={form.costcenter}
                    invalid={!!errors.costcenter}
                    required
                  >
                    <option value="">Selecciona una opción</option>
                    {selectOptions.costcenter.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Input>
                  {errors.costcenter && (
                    <FormFeedback>{errors.costcenter}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label for="contracttype">Tipo de contrato:</Label>
                  <Input
                    type="select"
                    name="contracttype"
                    id="contracttype"
                    onChange={handleChange}
                    value={form.contracttype}
                    invalid={!!errors.contracttype}
                    required
                  >
                    <option value="">Selecciona una opción</option>
                    {selectOptions.contracttype.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Input>
                  {errors.contracttype && (
                    <FormFeedback>{errors.contracttype}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="contractstartdate">Fecha de inicio:</Label>
                  <Input
                    type="date"
                    name="contractstartdate"
                    id="contractstartdate"
                    onChange={handleChange}
                    value={form.contractstartdate}
                    invalid={!!errors.contractstartdate}
                    required
                  />
                  {errors.contractstartdate && (
                    <FormFeedback>{errors.contractstartdate}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="contractenddate">Fecha de finalización:</Label>
                  <Input
                    type="date"
                    name="contractenddate"
                    id="contractenddate"
                    onChange={handleChange}
                    value={form.contractenddate}
                    invalid={!!errors.contractenddate}
                    required
                  />
                  {errors.contractenddate && (
                    <FormFeedback>{errors.contractenddate}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label for="workday">Jornada:</Label>
                  <Input
                    type="text"
                    name="workday"
                    id="workday"
                    onChange={handleChange}
                    value={form.workday}
                    invalid={!!errors.workday}
                    required
                  />
                  {errors.workday && (
                    <FormFeedback>{errors.workday}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="workcity">Ciudad de trabajo:</Label>
                  <Input
                    type="select"
                    name="workcity"
                    id="workcity"
                    onChange={handleChange}
                    value={form.workcity}
                    invalid={!!errors.workcity}
                    required
                  >
                    <option value="">Selecciona una opción</option>
                    {selectOptions.workcity.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Input>
                  {errors.workcity && (
                    <FormFeedback>{errors.workcity}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="payrolltype">Tipo de nómina:</Label>
                  <Input
                    type="select"
                    name="payrolltype"
                    id="payrolltype"
                    onChange={handleChange}
                    value={form.payrolltype}
                    invalid={!!errors.payrolltype}
                    required
                  >
                    <option value="">Selecciona una opción</option>
                    {selectOptions.payrolltype.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Input>
                  {errors.payrolltype && (
                    <FormFeedback>{errors.payrolltype}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label for="paymentmethod">Frecuencia de pago:</Label>
                  <Input
                    type="select"
                    name="paymentmethod"
                    id="paymentmethod"
                    onChange={handleChange}
                    value={form.paymentmethod}
                    invalid={!!errors.paymentmethod}
                    required
                  >
                    <option value="">Selecciona una opción</option>
                    {selectOptions.paymentmethod.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Input>
                  {errors.paymentmethod && (
                    <FormFeedback>{errors.paymentmethod}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="eps">EPS:</Label>
                  <Input
                    type="select"
                    name="eps"
                    id="eps"
                    onChange={handleChange}
                    value={form.eps}
                    invalid={!!errors.eps}
                    required
                  >
                    <option value="">Selecciona una opción</option>
                    {selectOptions.eps.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
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
                    id="arl"
                    onChange={handleChange}
                    value={form.arl}
                    invalid={!!errors.arl}
                    required
                  >
                    <option value="">Selecciona una opción</option>
                    {selectOptions.arl.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Input>
                  {errors.arl && <FormFeedback>{errors.arl}</FormFeedback>}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label for="arlrisklevel">Nivel de riesgo ARL:</Label>
                  <Input
                    type="select"
                    name="arlrisklevel"
                    id="arlrisklevel"
                    onChange={handleChange}
                    value={form.arlrisklevel}
                    invalid={!!errors.arlrisklevel}
                    required
                  >
                    <option value="">Selecciona una opción</option>
                    {selectOptions.arlrisklevel.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Input>
                  {errors.arlrisklevel && (
                    <FormFeedback>{errors.arlrisklevel}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="arlriskpercentage">
                    Porcentaje de riesgo ARL:
                  </Label>
                  <Input
                    type="number"
                    name="arlriskpercentage"
                    id="arlriskpercentage"
                    placeholder="Ingresa el porcentaje"
                    onChange={handleChange}
                    value={form.arlriskpercentage}
                    invalid={!!errors.arlriskpercentage}
                    required
                  />
                  {errors.arlriskpercentage && (
                    <FormFeedback>{errors.arlriskpercentage}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="pension">Pensión:</Label>
                  <Input
                    type="select"
                    name="pension"
                    id="pension"
                    onChange={handleChange}
                    value={form.pension}
                    invalid={!!errors.pension}
                    required
                  >
                    <option value="">Selecciona una opción</option>
                    {selectOptions.pension.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Input>
                  {errors.pension && (
                    <FormFeedback>{errors.pension}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="compensationfund">Caja de compensación:</Label>
                  <Input
                    type="select"
                    name="compensationfund"
                    id="compensationfund"
                    onChange={handleChange}
                    value={form.compensationfund}
                    invalid={!!errors.compensationfund}
                    required
                  >
                    <option value="">Selecciona una opción</option>
                    {selectOptions.compensationfund.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Input>
                  {errors.compensationfund && (
                    <FormFeedback>{errors.compensationfund}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <h4 className="mt-4 mb-3">Información Salarial</h4>
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label for="basicmonthlysalary">Salario Base Mensual:</Label>
                  <Input
                    type="text"
                    name="basicmonthlysalary"
                    id="basicmonthlysalary"
                    placeholder="Ingresa el salario base"
                    onChange={handleCurrencyChange}
                    value={form.basicmonthlysalary ? formatCurrency(form.basicmonthlysalary) : ""}
                    invalid={!!errors.basicmonthlysalary}
                    required
                  />
                  {errors.basicmonthlysalary && (
                    <FormFeedback>{errors.basicmonthlysalary}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="hourlyrate">Valor Hora:</Label>
                  <Input
                    type="text"
                    name="hourlyrate"
                    id="hourlyrate"
                    placeholder="Ingresa el valor por hora"
                    onChange={handleCurrencyChange}
                    value={form.hourlyrate ? formatCurrency(form.hourlyrate) : ""}
                    invalid={!!errors.hourlyrate}
                    required
                  />
                  {errors.hourlyrate && (
                    <FormFeedback>{errors.hourlyrate}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="transportationassistance">
                    Auxilio de Transporte:
                  </Label>
                  <Input
                    type="text"
                    name="transportationassistance"
                    id="transportationassistance"
                    placeholder="Ingresa el auxilio de transporte"
                    onChange={handleCurrencyChange}
                    value={form.transportationassistance ? formatCurrency(form.transportationassistance) : ""}
                    invalid={!!errors.transportationassistance}
                  />
                  {errors.transportationassistance && (
                    <FormFeedback>
                      {errors.transportationassistance}
                    </FormFeedback>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label for="mobilityassistance">Auxilio de Movilidad:</Label>
                  <Input
                    type="text"
                    name="mobilityassistance"
                    id="mobilityassistance"
                    placeholder="Ingresa el auxilio de movilidad"
                    onChange={handleCurrencyChange}
                    value={form.mobilityassistance ? formatCurrency(form.mobilityassistance) : ""}
                    invalid={!!errors.mobilityassistance}
                    required
                  />
                  {errors.mobilityassistance && (
                    <FormFeedback>{errors.mobilityassistance}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="hasadditionaldiscount">
                    Descuento Adicional:
                  </Label>
                  <Input
                    type="select"
                    name="hasadditionaldiscount"
                    id="hasadditionaldiscount"
                    onChange={handleChange}
                    value={form.hasadditionaldiscount}
                    invalid={!!errors.hasadditionaldiscount}
                  >
                    <option value="">Selecciona una opción</option>
                    <option value={true}>Sí</option>
                    <option value={false}>No</option>
                  </Input>
                  {errors.hasadditionaldiscount && (
                    <FormFeedback>{errors.hasadditionaldiscount}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              {form.hasadditionaldiscount && (
                <Col md="4">
                  <FormGroup>
                    <Label for="discountvalue">Valor del Descuento:</Label>
                    <Input
                      type="text"
                      name="discountvalue"
                      id="discountvalue"
                      placeholder="Ingresa el valor del descuento"
                      onChange={handleCurrencyChange}
                      value={form.discountvalue ? formatCurrency(form.discountvalue) : ""}
                      invalid={!!errors.discountvalue}
                    />
                    {errors.discountvalue && (
                      <FormFeedback>{errors.discountvalue}</FormFeedback>
                    )}
                  </FormGroup>
                </Col>
              )}
            </Row>
            {form.hasadditionaldiscount && (
              <Row>
                <Col md="12">
                  <FormGroup>
                    <Label for="additionaldiscountcomment">
                      Comentario del Descuento:
                    </Label>
                    <Input
                      type="textarea"
                      name="additionaldiscountcomment"
                      id="additionaldiscountcomment"
                      placeholder="Ingresa el comentario del descuento"
                      onChange={handleChange}
                      value={form.additionaldiscountcomment}
                      invalid={!!errors.additionaldiscountcomment}
                      required
                    />
                    {errors.additionaldiscountcomment && (
                      <FormFeedback>
                        {errors.additionaldiscountcomment}
                      </FormFeedback>
                    )}
                  </FormGroup>
                </Col>
              </Row>
            )}

            <h4 className="mt-4 mb-3">Información Bancaria</h4>
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label for="accounttype">Tipo de Cuenta:</Label>
                  <Input
                    type="select"
                    name="accounttype"
                    id="accounttype"
                    onChange={handleChange}
                    value={form.accounttype}
                    invalid={!!errors.accounttype}
                    required
                  >
                    <option value="">Selecciona una opción</option>
                    {selectOptions.accounttype.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Input>
                  {errors.accounttype && (
                    <FormFeedback>{errors.accounttype}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="bank">Banco:</Label>
                  <Input
                    type="select"
                    name="bank"
                    id="bank"
                    onChange={handleChange}
                    value={form.bank}
                    invalid={!!errors.bank}
                    required
                  >
                    <option value="">Selecciona una opción</option>
                    {selectOptions.bank.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Input>
                  {errors.bank && <FormFeedback>{errors.bank}</FormFeedback>}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="accountnumber">Número de Cuenta:</Label>
                  <Input
                    type="text"
                    name="accountnumber"
                    id="accountnumber"
                    placeholder="Ingresa el número de cuenta"
                    onChange={handleChange}
                    value={form.accountnumber}
                    invalid={!!errors.accountnumber}
                    required
                  />
                  {errors.accountnumber && (
                    <FormFeedback>{errors.accountnumber}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
            </Row>

            <h4 className="mt-4 mb-3">Información Adicional</h4>
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label for="educationlevel">Nivel de Educación:</Label>
                  <Input
                    type="select"
                    name="educationlevel"
                    id="educationlevel"
                    onChange={handleChange}
                    value={form.educationlevel}
                    invalid={!!errors.educationlevel}
                    required
                  >
                    <option value="">Selecciona una opción</option>
                    {selectOptions.educationlevel.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Input>
                  {errors.educationlevel && (
                    <FormFeedback>{errors.educationlevel}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="contributortype">Tipo de Contribuyente:</Label>
                  <Input
                    type="select"
                    name="contributortype"
                    id="contributortype"
                    onChange={handleChange}
                    value={form.contributortype}
                    invalid={!!errors.contributortype}
                    required
                  >
                    <option value="">Selecciona una opción</option>
                    {selectOptions.contributortype.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Input>
                  {errors.contributortype && (
                    <FormFeedback>{errors.contributortype}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="active">Estado del Empleado:</Label>
                  <Input
                    type="select"
                    name="active"
                    id="active"
                    onChange={handleChange}
                    value={form.active}
                    invalid={!!errors.active}
                    required
                  >
                    <option value="">Selecciona una opción</option>
                    {selectOptions.active.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Input>
                  {errors.active && (
                    <FormFeedback>{errors.active}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
            </Row>

            <h4 className="mt-4 mb-3">Tallas</h4>
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label for="shirtsize">Talla de Camisa:</Label>
                  <Input
                    type="select"
                    name="shirtsize"
                    id="shirtsize"
                    onChange={handleChange}
                    value={form.shirtsize}
                    invalid={!!errors.shirtsize}
                  >
                    <option value="">Selecciona una opción</option>
                    {selectOptions.shirtsize.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Input>
                  {errors.shirtsize && (
                    <FormFeedback>{errors.shirtsize}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="pantssize">Talla de Pantalón:</Label>
                  <Input
                    type="select"
                    name="pantssize"
                    id="pantssize"
                    onChange={handleChange}
                    value={form.pantssize}
                    invalid={!!errors.pantssize}
                  >
                    <option value="">Selecciona una opción</option>
                    {selectOptions.pantssize.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Input>
                  {errors.pantssize && (
                    <FormFeedback>{errors.pantssize}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="shoesize">Talla de Zapatos:</Label>
                  <Input
                    type="select"
                    name="shoesize"
                    id="shoesize"
                    onChange={handleChange}
                    value={form.shoesize}
                    invalid={!!errors.shoesize}
                  >
                    <option value="">Selecciona una opción</option>
                    {selectOptions.shoesize.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Input>
                  {errors.shoesize && (
                    <FormFeedback>{errors.shoesize}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
            </Row>

            <h4 className="mt-4 mb-3">Información Sociodemográfica</h4>
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label for="dependents_count">Número de personas a cargo:</Label>
                  <Input
                    type="number"
                    name="dependents_count"
                    id="dependents_count"
                    placeholder="0"
                    onChange={handleChange}
                    value={form.dependents_count}
                    invalid={!!errors.dependents_count}
                    min="0"
                  />
                  {errors.dependents_count && (
                    <FormFeedback>{errors.dependents_count}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="children_count">Número de hijos:</Label>
                  <Input
                    type="number"
                    name="children_count"
                    id="children_count"
                    placeholder="0"
                    onChange={handleChange}
                    value={form.children_count}
                    invalid={!!errors.children_count}
                    min="0"
                  />
                  {errors.children_count && (
                    <FormFeedback>{errors.children_count}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="is_head_of_family">Cabeza de familia:</Label>
                  <Input
                    type="select"
                    name="is_head_of_family"
                    id="is_head_of_family"
                    onChange={handleChange}
                    value={form.is_head_of_family}
                    invalid={!!errors.is_head_of_family}
                  >
                    <option value="">Selecciona una opción</option>
                    <option value={true}>Sí</option>
                    <option value={false}>No</option>
                  </Input>
                  {errors.is_head_of_family && (
                    <FormFeedback>{errors.is_head_of_family}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label for="housing_type">Tipo de vivienda:</Label>
                  <Input
                    type="select"
                    name="housing_type"
                    id="housing_type"
                    onChange={handleChange}
                    value={form.housing_type}
                    invalid={!!errors.housing_type}
                  >
                    <option value="">Selecciona una opción</option>
                    {selectOptions.housing_type.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Input>
                  {errors.housing_type && (
                    <FormFeedback>{errors.housing_type}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="ethnic_group">Grupo étnico:</Label>
                  <Input
                    type="select"
                    name="ethnic_group"
                    id="ethnic_group"
                    onChange={handleChange}
                    value={form.ethnic_group}
                    invalid={!!errors.ethnic_group}
                  >
                    <option value="">Selecciona una opción</option>
                    {selectOptions.ethnic_group.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Input>
                  {errors.ethnic_group && (
                    <FormFeedback>{errors.ethnic_group}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="socioeconomic_stratum">Estrato socioeconómico:</Label>
                  <Input
                    type="select"
                    name="socioeconomic_stratum"
                    id="socioeconomic_stratum"
                    onChange={handleChange}
                    value={form.socioeconomic_stratum}
                    invalid={!!errors.socioeconomic_stratum}
                  >
                    <option value="">Selecciona una opción</option>
                    {selectOptions.socioeconomic_stratum.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Input>
                  {errors.socioeconomic_stratum && (
                    <FormFeedback>{errors.socioeconomic_stratum}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label for="residence_place">Lugar de residencia:</Label>
                  <Input
                    type="text"
                    name="residence_place"
                    id="residence_place"
                    placeholder="Ingresa el lugar de residencia"
                    onChange={handleChange}
                    value={form.residence_place}
                    invalid={!!errors.residence_place}
                  />
                  {errors.residence_place && (
                    <FormFeedback>{errors.residence_place}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label for="has_disability">Persona en condición de discapacidad:</Label>
                  <Input
                    type="select"
                    name="has_disability"
                    id="has_disability"
                    onChange={handleChange}
                    value={form.has_disability}
                    invalid={!!errors.has_disability}
                  >
                    <option value="">Selecciona una opción</option>
                    <option value={true}>Sí</option>
                    <option value={false}>No</option>
                  </Input>
                  {errors.has_disability && (
                    <FormFeedback>{errors.has_disability}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label for="disability_type">Tipo de discapacidad:</Label>
                  <Input
                    type="select"
                    name="disability_type"
                    id="disability_type"
                    onChange={handleChange}
                    value={form.disability_type}
                    invalid={!!errors.disability_type}
                    disabled={!form.has_disability}
                  >
                    <option value="">Selecciona una opción</option>
                    {selectOptions.disability_type.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Input>
                  {errors.disability_type && (
                    <FormFeedback>{errors.disability_type}</FormFeedback>
                  )}
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

export default EmployeeForm;
