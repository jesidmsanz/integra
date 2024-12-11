import { Card, CardBody, Col } from "reactstrap";
import CommonCardFooter from "../Common/CommonCardFooter";
import { SolidBorderStyles } from "@/Constant/constant";
import SolidBorderStyleForm from "./SolidBorderStyleForm";
import { SolidBorderStyleData } from "@/Data/Form&Table/Form/FormData";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

const SolidBorderStyle = () => {
  return (
    <Col sm="12" xxl="6" className="box-col-6">
      <Card>
        <CommonCardHeader
          title={SolidBorderStyles}
          subTitle={SolidBorderStyleData}
          headClass="pb-0"
        />
        <CardBody>
          <SolidBorderStyleForm />
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

export default SolidBorderStyle;
