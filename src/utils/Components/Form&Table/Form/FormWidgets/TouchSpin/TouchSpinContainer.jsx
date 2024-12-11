"use client";
import React from "react";
import { Container, Row } from "reactstrap";
import DefaultTouchspin from "./DefaultTouchspin";
import OutlinedTouchspin from "./OutlinedTouchspin";
import IconsWithPrefixAndPostfix from "./IconsWithPrefixAndPostfix";
import ButtonsWithPrefixAndPostfix from "./ButtonsWithPrefixAndPostfix";
import RoundedTouchspins from "./RoundedTouchspin";
import { FormWidgets, Touchspin } from "@/Constant/constant";
import Breadcrumbs from "@/CommonComponent/Breadcrumb";

const TouchSpinContainer = () => {
  return (
    <>
      <Breadcrumbs
        pageTitle={Touchspin}
        parent={FormWidgets}
        title={Touchspin}
      />
      <Container fluid>
        <div className="bootstrap-touchspin">
          <Row>
            <DefaultTouchspin />
            <OutlinedTouchspin />
            <IconsWithPrefixAndPostfix />
            <ButtonsWithPrefixAndPostfix />
            <RoundedTouchspins />
          </Row>
        </div>
      </Container>
    </>
  );
};

export default TouchSpinContainer;
