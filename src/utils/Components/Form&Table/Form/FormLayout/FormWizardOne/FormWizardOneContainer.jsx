"use client";
import React from "react";
import { Container, Row } from "reactstrap";
import NumberingWizard from "./NumberingWizard/NumberingWizard";
import StudentValidationForm from "./StudentValidationForm/StudentValidationForm";
import VerticalValidationWizard from "./VerticalValidationWizard/VerticalValidationWizard";
import ShippingForm from "./ShippingForm/ShippingForm";
import { FormLayout, FormWizard } from "@/Constant/constant";
import Breadcrumbs from "@/CommonComponent/Breadcrumb";

const FormWizardOneContainer = () => {
  return (
    <>
      <Breadcrumbs
        pageTitle={FormWizard}
        parent={FormLayout}
        title={FormWizard}
      />
      <Container fluid>
        <Row>
          <NumberingWizard />
          <StudentValidationForm />
          <VerticalValidationWizard />
          <ShippingForm />
        </Row>
      </Container>
    </>
  );
};

export default FormWizardOneContainer;
