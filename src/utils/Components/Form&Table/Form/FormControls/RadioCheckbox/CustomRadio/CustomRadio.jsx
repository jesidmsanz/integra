import { Card, CardBody, Col, Row } from "reactstrap";
import { CustomRadios } from "@/Constant/constant";
import { BorderedRadio } from "./BorderedRadio";
import { IconsRadio } from "./IconsRadio";
import { FilledRadio } from "./FilledRadio";
import { CustomRadioData } from "@/Data/Form&Table/Form/FormData";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

const CustomRadio = () => {
  return (
    <Col sm="12">
      <Card>
        <CommonCardHeader
          title={CustomRadios}
          subTitle={CustomRadioData}
          headClass="pb-0"
        />
        <CardBody>
          <Row className="g-3">
            <BorderedRadio />
            <IconsRadio />
            <FilledRadio />
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

export default CustomRadio;
