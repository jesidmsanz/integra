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
  Row
} from "reactstrap";
// import { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';

// const formik = useFormik({
//   initialValues: {

//   },
// });

const Education = ({title, isOpen, toggle }) => {
  return (
    <>
      <Modal centered={true} isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>{title}</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="exampleEmail">Universidad:</Label>
              <Input type="text" name="university" id="university" placeholder=""/>
            </FormGroup>

            <FormGroup>
              <Label for="exampleEmail">Titulo Español:</Label>
              <Input type="text" name="career" id="career" placeholder="" />
            </FormGroup>

            <FormGroup>
              <Label for="exampleEmail">Titulo Ingles:</Label>
              <Input type="text" name="degree" id="degree" placeholder="" />
            </FormGroup>

            <FormGroup>
              <Label for="exampleEmail">Ciudad:</Label>
              <Input type="text" name="city" id="city" placeholder="" />
            </FormGroup>

            <FormGroup>
              <Label for="exampleEmail">Pais:</Label>
              <Input type="text" name="country" id="country" placeholder="" />
            </FormGroup>

            <Row>
              <Col md="6">
                <FormGroup>
                  <Label for="exampleEmail">Año inicio:</Label>
                  <Input type="date" name="start_date" id="start_date" />
                </FormGroup>
              </Col>

              <Col md="6">
                <FormGroup>
                  <Label for="exampleEmail">Año fin:</Label>
                  <Input type="date" name="end_date" id="end_date" />
                </FormGroup>
              </Col>
            </Row>

            <Button color="primary"  className="rounded-pill w-100 pb-0 dark-toggle-btn">Guardar</Button>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};
export default Education;
