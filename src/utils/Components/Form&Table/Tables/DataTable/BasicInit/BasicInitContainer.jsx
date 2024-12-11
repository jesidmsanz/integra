"use client";
import React from "react";
import { Container, Row } from "reactstrap";
import { ZeroConfigurationTable } from "./ZeroConfigurationTable";
import StateSaving from "./StateSaving/StateSaving";
import ScrollVerticalDynamicHeight from "./ScrollVerticalDynamicHeight";
import { DataTables, BasicDataTables } from "@/Constant/constant";
import Breadcrumbs from "@/CommonComponent/Breadcrumb";

const BasicInitContainer = () => {
  return (
    <>
      <Breadcrumbs pageTitle={BasicDataTables} parent={DataTables} title={BasicDataTables} />
      <Container fluid>
        <Row>
          <ZeroConfigurationTable />
          <StateSaving />
          <ScrollVerticalDynamicHeight />
        </Row>
      </Container>
    </>
  );
};

export default BasicInitContainer;
