import { Card, CardBody, Col } from "reactstrap";
import CommonCardFooter from "../Common/CommonCardFooter";
import { VerticalStyles } from "@/Constant/constant";
import VerticalStyleForm from "./VerticalStyleForm";
import { VerticalStyleData } from "@/Data/Form&Table/Form/FormData";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

const VerticalStyle = () => {
  return (
    <Col sm="12" xxl="6" className="box-col-12">
      <Card className="height-equal">
        <CommonCardHeader
          title={VerticalStyles}
          subTitle={VerticalStyleData}
          headClass="pb-0"
        />
        <CardBody className="mb-3">
          <VerticalStyleForm />
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

export default VerticalStyle;
