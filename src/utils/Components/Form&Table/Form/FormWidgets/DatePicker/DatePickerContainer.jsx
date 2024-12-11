"use client";
import React from "react";
import { Container, Row } from "reactstrap";
import DefaultCalendar from "./DefaultCalendar";
import BootstrapCalendar from "./ReactstrapCalendar/BootstrapCalendar";
import DatesPicker from "./DatesPicker/DatesPicker";
import TimePicker from "./TimePicker/TimePicker";
import { DatePicker, FormWidgets } from "@/Constant/constant";
import Breadcrumbs from "@/CommonComponent/Breadcrumb";

const DatePickerContainer = () => {
  return (
    <>
      <Breadcrumbs
        pageTitle={DatePicker}
        parent={FormWidgets}
        title={DatePicker}
      />
      <Container fluid>
        <Row>
          <DefaultCalendar />
          <BootstrapCalendar />
          <DatesPicker />
          <TimePicker />
        </Row>
      </Container>
    </>
  );
};

export default DatePickerContainer;
