"use client";
import React from "react";
import { Container, Row } from "reactstrap";
import { CommonTableComponent } from "./Common/CommonTableComponent";
import {
  AlertTitle,
  BadgesTable,
  CheckboxTitle,
  InputsTable,
  ProgressbarTitle,
  RadioButtonsTitle,
  ReactstrapTable,
  SelectTable,
  SwitchTable,
  TableComponents,
  TooltipTriggersTitle,
  UIComponentsTitle,
} from "@/Constant/constant";
import {
  AlertTableData,
  BadgeTableData,
  CheckBoxTableData,
  InputTableData,
  ProgressTableData,
  RadioBoxTableData,
  SelectBoxTableData,
  SwitchTableData,
  TooltipTableData,
  UiComponentData,
} from "@/Data/Form&Table/Table/ReactstrapTable/TableComponent/TableComponent";
import Breadcrumbs from "@/CommonComponent/Breadcrumb";

const TableComponentContainer = () => {
  return (
    <>
      <Breadcrumbs
        pageTitle={TableComponents}
        parent={ReactstrapTable}
        title={TableComponents}
      />
      <Container fluid>
        <Row>
          <CommonTableComponent
            title={UIComponentsTitle}
            data={UiComponentData}
          />
          <CommonTableComponent title={AlertTitle} data={AlertTableData} />
          <CommonTableComponent
            title={ProgressbarTitle}
            data={ProgressTableData}
            tableClass="checkbox-td-width"
          />
          <CommonTableComponent
            title={CheckboxTitle}
            data={CheckBoxTableData}
            tableClass="checkbox-td-width"
          />
          <CommonTableComponent
            title={RadioButtonsTitle}
            data={RadioBoxTableData}
            tableClass="radio-first-col-width"
          />
          <CommonTableComponent
            title={SelectTable}
            data={SelectBoxTableData}
            tableClass="checkbox-td-width"
          />
          <CommonTableComponent
            title={InputsTable}
            data={InputTableData}
            tableClass="checkbox-td-width"
          />
          <CommonTableComponent title={BadgesTable} data={BadgeTableData} />
          <CommonTableComponent
            title={TooltipTriggersTitle}
            data={TooltipTableData}
          />
          <CommonTableComponent title={SwitchTable} data={SwitchTableData} />
        </Row>
      </Container>
    </>
  );
};

export default TableComponentContainer;
