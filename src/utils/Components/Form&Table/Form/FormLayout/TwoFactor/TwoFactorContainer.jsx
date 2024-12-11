"use client";
import React from "react";
import { Container, Row } from "reactstrap";
import TwoFactorAuthentication from "./TwoFactorAuthentication/TwoFactorAuthentication";
import EmailVerification from "./EmailVerification/EmailVerification";
import { FormLayout, TwoFactor } from "@/Constant/constant";
import Breadcrumbs from "@/CommonComponent/Breadcrumb";

const TwoFactorContainer = () => {
  return (
    <>
      <Breadcrumbs
        pageTitle={TwoFactor}
        parent={FormLayout}
        title={TwoFactor}
      />
      <Container fluid>
        <Row>
          <TwoFactorAuthentication />
          <EmailVerification />
        </Row>
      </Container>
    </>
  );
};

export default TwoFactorContainer;
