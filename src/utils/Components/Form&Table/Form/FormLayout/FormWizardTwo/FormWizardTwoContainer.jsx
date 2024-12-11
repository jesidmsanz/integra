"use client";
import React from "react";
import { Container, Row } from "reactstrap";
import CustomHorizontalWizard from "./CustomHorizontalWizard/CustomHorizontalWizard";
import BusinessVerticalWizard from "./BusinessVerticalWizard/BusinessVerticalWizard";
import { FormLayout, StepFormWizard } from "@/Constant/constant";
import Breadcrumbs from "@/CommonComponent/Breadcrumb";

const FormWizardTwoContainer = () => {
  return (
    <>
      <Breadcrumbs
        pageTitle={StepFormWizard}
        parent={FormLayout}
        title={StepFormWizard}
      />
      <Container fluid>
        <Row>
          <CustomHorizontalWizard heading="Custom horizontal wizard" xs={12} />
          <BusinessVerticalWizard
            heading="Business vertical wizard"
            firstXl={3}
            secondXl={9}
            horizontalWizardClass="vertical-options"
          />
          <CustomHorizontalWizard
            differentId
            heading="Custom vertical wizard"
            horizontalWizardClass="vertical-options vertical-variations"
            firstXl={3}
            secondXl={9}
          />
          <BusinessVerticalWizard
            heading="Business horizontal wizard"
            xs={12}
          />
        </Row>
      </Container>
    </>
  );
};

export default FormWizardTwoContainer;
