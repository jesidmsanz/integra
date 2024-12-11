"use client";
import React from "react";
import { Container, Row } from "reactstrap";
import ButtonAddons from "./ButtonAddons";
import CustomForms from "./CustomForms/CustomForms";
import CustomFileInput from "./CustomFileInput";
import ButtonsWithDropdowns from "./ButtonsWithDropdowns/ButtonsWithDropdowns";
import SegmentedButtons from "./SegmentedButtons";
import CheckboxesAndRadios from "./CheckboxesAndRadios";
import Sizing from "./Sizing";
import MultipleInputs from "./MultipleInputs";
import BasicInputGroups from "./BasicInputGroups/BasicInputGroups";
import VariationOfAddons from "./VariationOfAddons/VariationOfAddons";
import { FormControls, InputGroup } from "@/Constant/constant";
import Breadcrumbs from "@/CommonComponent/Breadcrumb";

const InputGroupContainer = () => {
  return (
    <>
      <Breadcrumbs
        pageTitle={InputGroup}
        parent={FormControls}
        title={InputGroup}
      />
      <Container fluid>
        <Row>
          <ButtonAddons />
          <CustomForms />
          <CustomFileInput />
          <ButtonsWithDropdowns />
          <SegmentedButtons />
          <CheckboxesAndRadios />
          <Sizing />
          <MultipleInputs />
          <BasicInputGroups />
          <VariationOfAddons />
        </Row>
      </Container>
    </>
  );
};

export default InputGroupContainer;
