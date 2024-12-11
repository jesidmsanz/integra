import Breadcrumbs from "@/utils/CommonComponent/Breadcrumb";
import { employeesApi, newsApi } from "@/utils/api";
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
  Container,
  Card,
  CardBody,
} from "reactstrap";

const initialState = {
  EmployeeId: null,
};

const LiquidationForm = ({ setViewForm, isUpdate, setIsUpdate }) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState(null);

  let formRef = createRef();

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
    // const newErrors = validateForm();
    // if (Object.keys(newErrors).length === 0) {
    //   setLoading(true);
    //   try {
    //     const save = isUpdate
    //       ? await newsApi.update(dataToUpdate.id, form)
    //       : await newsApi.create(form);
    //     console.log("save :>> ", save);
    //     if (save?.id) {
    //       setForm(initialState);
    //       setViewForm(false);
    //       setIsUpdate(false);
    //       fetchData(1);
    //       isUpdate
    //         ? toast.success("El registro se actualizo exitosamente", {
    //             position: "top-center",
    //           })
    //         : toast.success("El registro se guardó exitosamente", {
    //             position: "top-center",
    //           });
    //     }
    //   } catch (error) {
    //     toast.error("Hubo un error al guardar el registro");
    //     console.error("Error al guardar el registro", error);
    //   } finally {
    //     setLoading(false);
    //   }
    // } else {
    //   setErrors(newErrors);
    // }
  };

  const loadEmployees = async () => {
    try {
      const response = await employeesApi.list();
      if (response.length) setEmployees(response);
    } catch (error) {
      console.error("Error al cargar los empleados", error);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  return (
    <>
      <Breadcrumbs
        pageTitle="Liquidaciòn"
        parent="Liquidaciòn"
        // title="Todo el Liquidaciòn"
      />
      <Container fluid>
        <Card>
          <CardBody>
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
                    <Label for="name">Empleados:</Label>
                    <Input
                      type="select"
                      name="EmployeeId"
                      id="EmployeeId"
                      onChange={handleChange}
                      value={form.EmployeeId}
                      invalid={!!errors.EmployeeId}
                      required
                    >
                      <option value="">Selecciona un empleado</option>
                      {employees?.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {employee.Name}
                        </option>
                      ))}
                    </Input>
                    {errors.EmployeeId && (
                      <FormFeedback>{errors.EmployeeId}</FormFeedback>
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
          </CardBody>
        </Card>
      </Container>
    </>
  );
};
export default LiquidationForm;
