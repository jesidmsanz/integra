import {
  Button,
  Card,
  CardBody,
  Col,
  Input,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import { useState } from "react";
import { IconsWithPrefixAndPostfixTitle } from "@/Constant/constant";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";
import { TouchSpinData } from "@/Data/Form&Table/Form/FormData";

const IconsWithPrefixAndPostfix = () => {
  const [values, setValues] = useState([0, 0]);
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
          title={IconsWithPrefixAndPostfixTitle}
          subTitle={TouchSpinData}
          headClass="pb-0"
        />
        <CardBody className="common-flex pre-post-touchspin">
          <InputGroup>
            <Button
              color="primary"
              className="decrement-touchspin btn-touchspin px-3"
              onClick={() => handleDecrement(0)}
            >
              <i className="fa fa-minus"></i>
            </Button>
            <InputGroupText>{"$"}</InputGroupText>
            <Input
              className="input-touchspin spin-outline-primary"
              type="number"
              value={values[0]}
              readOnly
            />
            <Button
              color="primary"
              className="increment-touchspin btn-touchspin px-3"
              onClick={() => handleIncrement(0)}
            >
              <i className="fa fa-plus"> </i>
            </Button>
          </InputGroup>
          <InputGroup>
            <Button
              color="primary"
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
            <InputGroupText className="input-group-text">{"%"}</InputGroupText>
            <Button
              color="primary"
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

export default IconsWithPrefixAndPostfix;
