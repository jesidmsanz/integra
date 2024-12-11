import { Card, CardBody, Col, Row } from "reactstrap";
import { AnimatedButton } from "@/Constant/constant";
import { AnimatedRadio } from "./AnimatedRadio";
import { AnimatedCheckbox } from "./AnimatedCheckbox";
import { AnimatedButtonData } from "@/Data/Form&Table/Form/FormData";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

const AnimatedButtons = () => {
  return (
    <Col xl="6">
      <Card className="height-equal">
        <CommonCardHeader
          title={AnimatedButton}
          subTitle={AnimatedButtonData}
          headClass="pb-0"
        />
        <CardBody>
          <Row className="g-3">
            <AnimatedRadio />
            <AnimatedCheckbox />
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

export default AnimatedButtons;
