"use client";
import {
  DefaultInputMask,
  FormControls,
  InputMasks,
} from "@/Constant/constant";
import { InputMaskData } from "@/Data/Form&Table/Form/FormData";
import React from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import DateFormat from "./DateFormat";
import TimeFormat from "./TimeFormat";
import DefaultInputMaskForm from "./DefaultInputMaskForm";
import Breadcrumbs from "@/CommonComponent/Breadcrumb";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

const InputMaskContainer = () => {
  return (
    <>
      <Breadcrumbs
        pageTitle={InputMasks}
        parent={FormControls}
        title={InputMasks}
      />
      <Container fluid>
        <Row>
          <Col xs="12">
            <Card>
              <CommonCardHeader
                title={InputMasks}
                subTitle={InputMaskData}
                headClass="pb-0"
              />
              <CardBody>
                <Row className="g-3">
                  <DateFormat />
                  <TimeFormat />
                  <Col xs="12">
                    <div className="card-wrapper border rounded-3 light-card checkbox-checked">
                      <h6 className="sub-title">{DefaultInputMask}</h6>
                      <DefaultInputMaskForm />
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default InputMaskContainer;
