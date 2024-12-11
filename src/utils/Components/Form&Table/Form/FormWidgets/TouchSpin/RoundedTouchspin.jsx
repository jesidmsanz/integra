import React, { useState } from "react";
import { Card, CardBody, Col } from "reactstrap";
import { RoundedTouchSpins } from "@/Constant/constant";
import { CommonTouchspin } from "./Common/CommonTouchspin";
import {
  DefaultTouchSpinData,
  TouchSpinData,
} from "@/Data/Form&Table/Form/FormData";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

const RoundedTouchspin = () => {
  const initialValues = DefaultTouchSpinData.map((data) => data.value);
  const [values, setValues] = useState(initialValues);
  const handleIncrement = (index) => {
    setValues((prevValues) => {
      return prevValues.map((value, i) => (i === index ? value + 1 : value));
    });
  };
  const handleDecrement = (index) => {
    setValues((prevValues) => {
      return prevValues.map((value, i) =>
        i === index && value > 0 ? value - 1 : value
      );
    });
  };

  return (
    <Col xl="12">
      <Card>
        <CommonCardHeader
          title={RoundedTouchSpins}
          subTitle={TouchSpinData}
          headClass="pb-0"
        />
        <CardBody className="common-flex rounded-touchspin">
          {DefaultTouchSpinData.map((data) => (
            <CommonTouchspin
              key={data.id}
              faAngle
              color={data.color}
              value={values[data.id - 1]}
              onIncrement={() => handleIncrement(data.id - 1)}
              onDecrement={() => handleDecrement(data.id - 1)}
            />
          ))}
        </CardBody>
      </Card>
    </Col>
  );
};

export default RoundedTouchspin;
