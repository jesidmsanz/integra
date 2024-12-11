"use client";
import React from "react";
import { Container, Row } from "reactstrap";
import TooltipFormValidation from "./TooltipFormValidation/TooltipFormValidation";
import BrowserDefaults from "./BrowserDefaults/BrowserDefaults";
import ValidationForm from "./ValidationForm/ValidationForm";
import { FormControls, ValidationForms } from "@/Constant/constant";
import Breadcrumbs from "@/CommonComponent/Breadcrumb";

const FormValidationsContainer = () => {
  return (
    <>
      <Breadcrumbs
        pageTitle={ValidationForms}
        parent={FormControls}
        title={ValidationForms}
      />
      <Container fluid>
        <Row>
          <TooltipFormValidation />
          <BrowserDefaults />
          <ValidationForm />
        </Row>
      </Container>
    </>
  );
};

export default FormValidationsContainer;
