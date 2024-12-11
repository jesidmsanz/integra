import { Typeahead } from "react-bootstrap-typeahead";
import { Card, Col, CardBody, Form } from "reactstrap";
import { BasicTypeAheadTitle } from "@/Constant/constant";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";
import { BasicTypeHeadData, StateOfUsa } from "@/Data/Form&Table/Form/FormData";

const BasicTypeAhead = () => {
  return (
    <Col sm="12" md="6">
      <Card>
        <CommonCardHeader
          title={BasicTypeAheadTitle}
          subTitle={BasicTypeHeadData}
          headClass="pb-0"
        />
        <CardBody>
          <div id="the-basics">
            <Form className="theme-form">
              <div>
                <Typeahead
                  options={StateOfUsa}
                  placeholder="States of USA"
                  id="Basic TypeAhead"
                />
              </div>
            </Form>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default BasicTypeAhead;
