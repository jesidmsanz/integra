import React from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import { BasicRadioAndCheckboxTitle } from "@/Constant/constant";
import { SimpleCheckboxs } from "./SimpleCheckboxs";
import { SimpleRadio } from "./SimpleRadio";
import { BasicRadioCheckboxData } from "@/Data/Form&Table/Form/FormData";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

const BasicRadioAndCheckbox = () => {
  return (
    <Col xl="6">
      <Card className="height-equal">
        <CommonCardHeader
          title={BasicRadioAndCheckboxTitle}
          subTitle={BasicRadioCheckboxData}
          headClass="pb-0"
        />
        <CardBody className="mb-4">
          <Row className="g-3">
            <SimpleCheckboxs />
            <SimpleRadio />
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

export default BasicRadioAndCheckbox;
