"use client";
import React from "react";
import { Col } from "reactstrap";
import { UserSection } from "./UserSection";

export const RightHeaderSection = () => {
  return (
    <Col
      xxl="7"
      xl="6"
      xs="auto"
      className="nav-right box-col-6 pull-right right-header p-0 ms-auto"
    >
      <ul className="nav-menus">
        <UserSection />
      </ul>
    </Col>
  );
};
