import { Card, CardBody, Col } from "reactstrap";
import CommonCardFooter from "../Common/CommonCardFooter";
import { HorizontalStyles } from "@/Constant/constant";
import HorizontalStyleForm from "./HorizontalStyleForm";
import { HorizontalStyleData } from "@/Data/Form&Table/Form/FormData";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

const HorizontalStyle = () => {
  return (
    <Col sm="12" xxl="6" className="box-col-12">
      <Card className="height-equal">
        <CommonCardHeader
          title={HorizontalStyles}
          subTitle={HorizontalStyleData}
          headClass="pb-0"
        />
        <CardBody>
          <HorizontalStyleForm />
        </CardBody>
        <CommonCardFooter
          footerClass="text-end"
          color1="primary"
          btn1Class="m-r-15"
          color2="light"
        />
      </Card>
    </Col>
  );
};

export default HorizontalStyle;
