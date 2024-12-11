import { Card, CardBody, Col, Row } from "reactstrap";
import { CustomCheckboxTitle } from "@/Constant/constant";
import { BorderedCheckboxs } from "./BorderedCheckboxs";
import { IconCheckboxs } from "./IconCheckboxs";
import { FilledCheckboxs } from "./FilledCheckboxs";
import { CustomCheckboxData } from "@/Data/Form&Table/Form/FormData";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

const CustomCheckbox = () => {
  return (
    <Col sm="12">
      <Card>
        <CommonCardHeader
          title={CustomCheckboxTitle}
          subTitle={CustomCheckboxData}
          headClass="pb-0"
        />
        <CardBody>
          <Row className="g-3">
            <BorderedCheckboxs />
            <IconCheckboxs />
            <FilledCheckboxs />
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

export default CustomCheckbox;
