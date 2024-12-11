import { Card, CardBody, Col, Row } from "reactstrap";
import { InlineInputType } from "@/Constant/constant";
import { InlineSwitche } from "./InlineSwitche";
import { InlineRadios } from "./InlineRadios";
import { InlineCheckboxs } from "./InlineCheckboxs";
import { InlineInputData } from "@/Data/Form&Table/Form/FormData";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

const InlineInputTypes = () => {
  return (
    <Col sm="12">
      <Card>
        <CommonCardHeader
          title={InlineInputType}
          subTitle={InlineInputData}
          headClass="pb-0"
          titleClass={null}
          users={null}
          icon={null}
        />
        <CardBody>
          <Row className="g-3">
            <InlineCheckboxs />
            <InlineRadios />
            <InlineSwitche />
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

export default InlineInputTypes;
