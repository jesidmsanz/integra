"use client";
import React from "react";
import { Container, Row } from "reactstrap";
import VariationRadio from "./VariationRadio";
import VariationCheckbox from "./VariationCheckbox/VariationCheckbox";
import DefaultStyle from "./DefaultStyle/DefaultStyle";
import WithoutBordersStyle from "./WithoutBordersStyle/WithoutBordersStyle";
import SolidBorderStyle from "./SolidBorderStyle/SolidBorderStyle";
import OfferStyleBorder from "./OfferStyleBorder/OfferStyleBorder";
import InlineStyle from "./InlineStyle/InlineStyle";
import VerticalStyle from "./VerticalStyle/VerticalStyle";
import HorizontalStyle from "./HorizontalStyle/HorizontalStyle";
import { FormControls, MegaOptions } from "@/Constant/constant";
import Breadcrumbs from "@/CommonComponent/Breadcrumb";

const MegaOptionContainer = () => {
  return (
    <>
      <Breadcrumbs
        pageTitle={MegaOptions}
        parent={FormControls}
        title={MegaOptions}
      />
      <Container fluid>
        <Row>
          <VariationRadio />
          <VariationCheckbox />
          <DefaultStyle />
          <WithoutBordersStyle />
          <SolidBorderStyle />
          <OfferStyleBorder />
          <InlineStyle />
          <VerticalStyle />
          <HorizontalStyle />
        </Row>
      </Container>
    </>
  );
};

export default MegaOptionContainer;
