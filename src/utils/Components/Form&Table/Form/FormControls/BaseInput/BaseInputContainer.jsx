"use client";
import React from "react";
import { Container, Row } from "reactstrap";
import BasicForm from "./BasicForm";
import FloatingForm from "./FloatingForm";
import SelectSizing from "./SelectSizing";
import FormControlSizing from "./FormControlSizing";
import FileInput from "./FileInput/FileInput";
import FlatInputStyle from "./FlatInputStyle";
import BasicHtmlInputControl from "./BasicHtmlInputControl/BasicHtmlInputControl";
import BasicFloatingInputControl from "./BasicFloatingInputControl/BasicFloatingInputControl";
import EdgesInputStyle from "./EdgesInputStyle/EdgesInputStyle";
import RaiseInputStyle from "./RaiseInputStyle/RaiseInputStyle";
import { BaseInputs, FormControls } from "@/Constant/constant";
import Breadcrumbs from "@/CommonComponent/Breadcrumb";

const BaseInputContainer = () => {
  return (
    <>
      <Breadcrumbs
        pageTitle={BaseInputs}
        parent={FormControls}
        title={BaseInputs}
      />
      <Container fluid>
        <Row>
          <BasicForm />
          <FloatingForm />
          <SelectSizing />
          <FormControlSizing />
          <FileInput />
          <FlatInputStyle />
          <BasicHtmlInputControl />
          <BasicFloatingInputControl />
          <EdgesInputStyle />
          <RaiseInputStyle />
        </Row>
      </Container>
    </>
  );
};

export default BaseInputContainer;
