import { Card, CardBody, Col } from "reactstrap";
import { DefaultStyleMegaOptions } from "@/Constant/constant";
import DefaultStyleForm from "./DefaultStyleForm";
import { MegaOptionDefaultData } from "@/Data/Form&Table/Form/FormData";
import CommonCardFooter from "../Common/CommonCardFooter";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

const DefaultStyle = () => {
  return (
    <Col sm="12" xxl="6" className="box-col-6">
      <Card>
        <CommonCardHeader
          title={DefaultStyleMegaOptions}
          subTitle={MegaOptionDefaultData}
          headClass="pb-0"
        />
        <CardBody className="megaoptions-border-space-sm">
          <DefaultStyleForm />
        </CardBody>
        <CommonCardFooter
          footerClass="text-end"
          color1="primary"
          color2="light"
        />
      </Card>
    </Col>
  );
};

export default DefaultStyle;
