"use client";
import React from "react";
import { Col } from "reactstrap";
import { MobileHeaderMenu } from "./MobileHeaderMenu";

export const HeaderMenu = () => {
  return (
    <Col
      xxl="5"
      xl="6"
      xs="auto"
      className="left-header box-col-6 horizontal-wrapper p-0"
    >
      <div className="left-menu-header">
        <MobileHeaderMenu />
        <ul className="header-left"></ul>
      </div>
    </Col>
  );
};
