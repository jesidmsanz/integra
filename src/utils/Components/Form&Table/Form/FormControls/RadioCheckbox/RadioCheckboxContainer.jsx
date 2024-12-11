"use client";
import React from "react";
import { Container, Row } from "reactstrap";
import DefaultCheckbox from "./DefaultCheckbox/DefaultCheckbox";
import CustomCheckbox from "./CustomCheckbox/CustomCheckbox";
import DefaultRadio from "./DefaultRadio/DefaultRadio";
import ImagesWithCheckbox from "./ImagesWithCheckbox/ImagesWithCheckbox";
import ImagesWithRadio from "./ImagesWithRadio/ImagesWithRadio";
import CustomRadio from "./CustomRadio/CustomRadio";
import DefaultSwitches from "./DefaultSwitches/DefaultSwitches";
import InlineInputTypes from "./InlineInputTypes/InlineInputTypes";
import AnimatedButtons from "./AnimatedButtons/AnimatedButtons";
import BasicRadioAndCheckbox from "./BasicRadioAndCheckbox/BasicRadioAndCheckbox";
import RadioToggleButtons from "./RadioToggleButtons";
import OutlinedCheckboxStyles from "./OutlinedCheckboxStyles";
import { CheckboxAndRadio, FormControls } from "@/Constant/constant";
import Breadcrumbs from "@/CommonComponent/Breadcrumb";

const RadioCheckboxContainer = () => {
  return (
    <>
      <Breadcrumbs
        pageTitle={CheckboxAndRadio}
        parent={FormControls}
        title={CheckboxAndRadio}
      />
      <Container fluid>
        <Row>
          <DefaultCheckbox />
          <CustomCheckbox />
          <DefaultRadio />
          <ImagesWithCheckbox />
          <ImagesWithRadio />
          <CustomRadio />
          <DefaultSwitches />
          <InlineInputTypes />
          <AnimatedButtons />
          <BasicRadioAndCheckbox />
          <RadioToggleButtons />
          <OutlinedCheckboxStyles />
        </Row>
      </Container>
    </>
  );
};

export default RadioCheckboxContainer;
