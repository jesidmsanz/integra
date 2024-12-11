import React from "react";
import { Col, Row } from "reactstrap";
import { CustomerCard } from "../../Dashboard/Common/CustomerCard";
import { CustomerCardData } from "@/Data/General/Widgets/WidgetsData";

export const CustomerDiscountCards = () => {
  return (
    <Col xl="6" className="col-xl-100 box-col-12">
      <Row>
        <Col md="5">
          <Row>
            <CustomerCard data={CustomerCardData} />
          </Row>
        </Col>
        <Col md="7"></Col>
      </Row>
    </Col>
  );
};
