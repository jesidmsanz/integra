"use client";
import React from "react";
import { Container, Row } from "reactstrap";
import HtmlSourcedData from "./HtmlSourcedData";
import AjaxSourcedData from "./AjaxSourcedData";
import JavaScriptSourcedData from "./JavaScriptSourcedData";
import ServerSideProcessing from "./ServerSideProcessing";
import { DataTables, DATASourceDataTables } from "@/Constant/constant";
import Breadcrumbs from "@/CommonComponent/Breadcrumb";

const DataSourceContainer = () => {
  return (
    <>
      <Breadcrumbs
        pageTitle={DATASourceDataTables}
        parent={DataTables}
        title={DATASourceDataTables}
      />
      <Container fluid>
        <Row>
          <HtmlSourcedData />
          <AjaxSourcedData />
          <JavaScriptSourcedData />
          <ServerSideProcessing />
        </Row>
      </Container>
    </>
  );
};

export default DataSourceContainer;
