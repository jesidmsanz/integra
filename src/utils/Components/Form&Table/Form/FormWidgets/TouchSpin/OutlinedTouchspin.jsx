import { useState } from "react";
import { Card, CardBody, Col } from "reactstrap";
import { OutlinedTouchspinTitle } from "@/Constant/constant";
import { CommonTouchspin } from "./Common/CommonTouchspin";
import {
  DefaultTouchSpinData,
  TouchSpinData,
} from "@/Data/Form&Table/Form/FormData";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

const OutlinedTouchspin = () => {
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
    <Col xl="6">
      <Card>
        <CommonCardHeader
          title={OutlinedTouchspinTitle}
          subTitle={TouchSpinData}
          headClass="pb-0"
        />
        <CardBody className="common-flex">
          {DefaultTouchSpinData.map((data) => (
            <CommonTouchspin
              key={data.id}
              outline
              color={data.color}
              value={values[data.id - 1]}
              onIncrement={() => handleIncrement(data.id - 1)}
              onDecrement={() => handleDecrement(data.id - 1)}
              btnClass={`spin-border-${data.color}`}
            />
          ))}
        </CardBody>
      </Card>
    </Col>
  );
};

export default OutlinedTouchspin;
