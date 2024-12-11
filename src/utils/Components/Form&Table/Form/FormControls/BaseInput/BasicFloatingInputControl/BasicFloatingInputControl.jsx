import { Card, Col, Form } from "reactstrap";
import { BasicFloatingInputControls } from "@/Constant/constant";
import { BasicFloatingFooter } from "./BasicFloatingFooter";
import { BasicFloatingCardBody } from "./BasicFloatingCardBody";
import { FloatingInputData } from "@/Data/Form&Table/Form/FormData";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

const BasicFloatingInputControl = () => {
  return (
    <Col xl="6">
      <Card className="height-equal">
        <CommonCardHeader
          title={BasicFloatingInputControls}
          subTitle={FloatingInputData}
          headClass="pb-0"
        />
        <Form className="theme-form" onSubmit={(e) => e.preventDefault()}>
          <BasicFloatingCardBody />
          <BasicFloatingFooter />
        </Form>
      </Card>
    </Col>
  );
};

export default BasicFloatingInputControl;
