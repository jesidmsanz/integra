"use client";
import React from "react";
import { Container, Row } from "reactstrap";
import AddRows from "./AddRows";
import ChildRows from "./ChildRows/ChildRows";
import RowSelectionAndDeletion from "./RowSelectionAndDeletion/RowSelectionAndDeletion";
import CustomFiltering from "./CustomFiltering/CustomFiltering";
import { DataTables, APIDataTables } from "@/Constant/constant";
import Breadcrumbs from "@/CommonComponent/Breadcrumb";

const ApiTableContainer = () => {
  return (
    <>
      <Breadcrumbs
        pageTitle={APIDataTables}
        parent={DataTables}
        title={APIDataTables}
      />
      <Container fluid>
        <Row>
          <AddRows />
          <ChildRows />
          <RowSelectionAndDeletion />
          <CustomFiltering />
        </Row>
      </Container>
    </>
  );
};

export default ApiTableContainer;
