import { Card, Col, Form } from "reactstrap";
import { BasicHtmlInputControls } from "@/Constant/constant";
import { BasicHtmlCardBody } from "./BasicHtmlCardBody";
import { BasicHtmlCardFooter } from "./BasicHtmlCardFooter";
import { BasicHtmlInputControlData } from "@/Data/Form&Table/Form/FormData";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

const BasicHtmlInputControl = () => {
  return (
    <Col xl="6">
      <Card className="height-equal">
        <CommonCardHeader
          title={BasicHtmlInputControls}
          subTitle={BasicHtmlInputControlData}
          headClass="pb-0"
        />
        <Form className="theme-form" onSubmit={(e) => e.preventDefault()}>
          <BasicHtmlCardBody />
          <BasicHtmlCardFooter />
        </Form>
      </Card>
    </Col>
  );
};

export default BasicHtmlInputControl;
