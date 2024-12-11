import { Card, CardBody, Col } from "reactstrap";
import CommonCardFooter from "../Common/CommonCardFooter";
import { InlineStyles } from "@/Constant/constant";
import InlineStyleForm from "./InlineStyleForm";
import { InlineStyeData } from "@/Data/Form&Table/Form/FormData";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

const InlineStyle = () => {
  return (
    <Col sm="12">
      <Card>
        <CommonCardHeader
          title={InlineStyles}
          subTitle={InlineStyeData}
          headClass="pb-0"
        />
        <CardBody className="megaoptions-border-space-sm">
          <InlineStyleForm />
        </CardBody>
        <CommonCardFooter
          footerClass="text-end"
          color1="warning"
          color2="light-warning"
          btn2Class="list-light-warning"
        />
      </Card>
    </Col>
  );
};

export default InlineStyle;
