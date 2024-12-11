import React from "react";
import { Container, Row } from "reactstrap";
import StockResult from "./StockResult";
import RowCreateCallback from "./RowCreateCallback";
import { DataTables, AdvanceInit } from "@/Constant/constant";
import Breadcrumbs from "@/CommonComponent/Breadcrumb";

const AdvanceInitContainer = () => {
  return (
    <>
      <Breadcrumbs pageTitle={AdvanceInit} parent={DataTables} title={AdvanceInit} />
      <Container fluid>
        <Row>
          <StockResult />
          <RowCreateCallback />
        </Row>
      </Container>
    </>
  );
};

export default AdvanceInitContainer;
