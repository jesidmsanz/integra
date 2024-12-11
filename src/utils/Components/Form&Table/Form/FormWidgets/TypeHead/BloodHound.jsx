import { Typeahead } from "react-bootstrap-typeahead";
import { Card, CardBody, Col, Form } from "reactstrap";
import { BloodHoundHeading } from "@/Constant/constant";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";
import { BloodHoundData, StateOfUsa } from "@/Data/Form&Table/Form/FormData";

const BloodHound = () => {
  return (
    <Col sm="12" md="6">
      <Card>
        <CommonCardHeader title={BloodHoundHeading} subTitle={BloodHoundData} headClass="pb-0" />
        <CardBody>
          <div id="bloodhound">
            <Form className="theme-form">
              <div>
                <Typeahead options={StateOfUsa} placeholder="States of USA" id="BloodHound" />
              </div>
            </Form>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default BloodHound;
