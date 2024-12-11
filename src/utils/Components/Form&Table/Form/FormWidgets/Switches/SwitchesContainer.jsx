"use client";
import React from "react";
import { Container, Row } from "reactstrap";
import CustomSwitch from "./CustomSwitch";
import IconsSwitch from "./Iconsswitch";
import UncheckedSwitch from "./UncheckedSwitch";
import BordersWithIcons from "./BordersWithIcons";
import DisabledOutlineSwitch from "./DisabledOutlineSwitch";
import VariationOfSwitches from "./VariationOfSwitches/VariationOfSwitches";
import SwitchSizing from "./SwitchSizing";
import SwitchWithIcons from "./SwitchWithIcons";
import { FormWidgets, Switch } from "@/Constant/constant";
import Breadcrumbs from "@/CommonComponent/Breadcrumb";

const SwitchesContainer = () => {
  return (
    <>
      <Breadcrumbs pageTitle={Switch} parent={FormWidgets} title={Switch} />
      <Container fluid>
        <Row>
          <CustomSwitch />
          <IconsSwitch />
          <UncheckedSwitch />
          <BordersWithIcons />
          <DisabledOutlineSwitch />
          <VariationOfSwitches />
          <SwitchSizing />
          <SwitchWithIcons />
        </Row>
      </Container>
    </>
  );
};

export default SwitchesContainer;
