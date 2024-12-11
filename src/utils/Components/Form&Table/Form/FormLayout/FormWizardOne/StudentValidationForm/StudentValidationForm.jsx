import { Card, Col, CardBody } from "reactstrap";
import StudentValidationFormCardBody from "./StudentValidationFormCardBody";
import { StudentValidationFormHeading } from "@/Constant/constant";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";
import { StudentValidationData } from "@/Data/Form&Table/Form/FormData";

const StudentValidationForm = () => {
  return (
    <Col xl="6">
      <Card className="height-equal">
        <CommonCardHeader
          title={StudentValidationFormHeading}
          subTitle={StudentValidationData}
          headClass="pb-0"
        />
        <CardBody className="custom-input">
          <StudentValidationFormCardBody />
        </CardBody>
      </Card>
    </Col>
  );
};

export default StudentValidationForm;
