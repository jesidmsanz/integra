import React from "react";
import { Card, CardBody, Col } from "reactstrap";
import { VariationOfSwitchesTitle } from "@/Constant/constant";
import { VariationOfSwitcheOne } from "./VariationOfSwitcheOne";
import { VariationOfSwitcheTwo } from "./VariationOfSwitcheTwo";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";
import { VariationSwitchData } from "@/Data/Form&Table/Form/FormData";

const VariationOfSwitches = () => {
  return (
    <Col md="6">
      <Card>
        <CommonCardHeader
          title={VariationOfSwitchesTitle}
          subTitle={VariationSwitchData}
          headClass="pb-0"
        />
        <CardBody className="common-flex">
          <ul className="tg-list common-flex">
            <VariationOfSwitcheOne />
            <VariationOfSwitcheTwo />
          </ul>
        </CardBody>
      </Card>
    </Col>
  );
};

export default VariationOfSwitches;
