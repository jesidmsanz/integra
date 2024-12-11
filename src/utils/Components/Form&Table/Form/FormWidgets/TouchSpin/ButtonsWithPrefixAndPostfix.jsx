import { useState } from "react";
import { Button, Card, CardBody, Col, Input, InputGroup } from "reactstrap";
import {
  ButtonsWithPrefixAndPostFixTitle,
  PostText,
  PreText,
} from "@/Constant/constant";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";
import { TouchSpinData } from "@/Data/Form&Table/Form/FormData";

const ButtonsWithPrefixAndPostfix = () => {
  const [values, setValues] = useState([0, 0]);
  const handleIncrement = (index) => {
    setValues((previousValues) => {
      return previousValues.map((value, i) =>
        i === index ? value + 1 : value
      );
    });
  };
  const handleDecrement = (index) => {
    setValues((previousValues) => {
      return previousValues.map((value, i) =>
        i === index && value > 0 ? value - 1 : value
      );
    });
  };

  return (
    <Col xl="6">
      <Card>
        <CommonCardHeader
          title={ButtonsWithPrefixAndPostFixTitle}
          subTitle={TouchSpinData}
          headClass="pb-0"
        />
        <CardBody className="common-flex pre-post-touchspin">
          <InputGroup>
            <Button
              color="warning"
              className="decrement-touchspin btn-touchspin px-3"
              onClick={() => handleDecrement(0)}
            >
              <i className="fa fa-minus"></i>
            </Button>
            <Button
              color="warning"
              outline
              id="button-addon1"
              className="px-2"
              type="button"
            >
              {PreText}
            </Button>
            <Input
              className="input-touchspin spin-outline-primary"
              type="number"
              value={values[0]}
              readOnly
            />
            <Button
              color="warning"
              className="increment-touchspin btn-touchspin px-3"
              onClick={() => handleIncrement(0)}
            >
              <i className="fa fa-plus"> </i>
            </Button>
          </InputGroup>
          <InputGroup>
            <Button
              color="warning"
              className="decrement-touchspin btn-touchspin px-3"
              onClick={() => handleDecrement(1)}
            >
              <i className="fa fa-minus"></i>
            </Button>
            <Input
              className="input-touchspin spin-outline-primary"
              type="number"
              value={values[1]}
              readOnly
            />
            <Button
              color="warning"
              outline
              id="button-addon2"
              className="px-2"
              type="button"
            >
              {PostText}
            </Button>
            <Button
              color="warning"
              className="increment-touchspin btn-touchspin px-3"
              onClick={() => handleIncrement(1)}
            >
              <i className="fa fa-plus"></i>
            </Button>
          </InputGroup>
        </CardBody>
      </Card>
    </Col>
  );
};

export default ButtonsWithPrefixAndPostfix;
