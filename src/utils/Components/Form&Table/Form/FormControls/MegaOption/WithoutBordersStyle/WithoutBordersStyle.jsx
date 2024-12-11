import { Card, CardBody, Col } from "reactstrap";
import CommonCardFooter from "../Common/CommonCardFooter";
import { WithoutBordersStyles } from "@/Constant/constant";
import WithoutBordersStyleForm from "./WithoutBordersStyleForm";
import { WithoutBorderData } from "@/Data/Form&Table/Form/FormData";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

const WithoutBordersStyle = () => {
  return (
    <Col sm="12" xxl="6" className="box-col-6">
      <Card>
        <CommonCardHeader
          title={WithoutBordersStyles}
          subTitle={WithoutBorderData}
          headClass="pb-0"
        />
        <CardBody>
          <WithoutBordersStyleForm />
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

export default WithoutBordersStyle;
