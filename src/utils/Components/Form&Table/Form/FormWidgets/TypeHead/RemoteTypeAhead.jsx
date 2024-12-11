import { Typeahead } from "react-bootstrap-typeahead";
import { Card, CardBody, Col, Form } from "reactstrap";
import { RemoteTypeAheadHeading } from "@/Constant/constant";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";
import {
  MoviesList,
  RemoteTypeHeadData,
} from "@/Data/Form&Table/Form/FormData";

const RemoteTypeAhead = () => {
  return (
    <Col sm="12" md="6">
      <Card>
        <CommonCardHeader
          title={RemoteTypeAheadHeading}
          subTitle={RemoteTypeHeadData}
          headClass="pb-0"
        />
        <CardBody>
          <div id="remote">
            <Form className="theme-form">
              <div>
                <Typeahead
                  options={MoviesList}
                  placeholder="Choose Option"
                  id="Remote TypeAhead"
                />
              </div>
            </Form>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default RemoteTypeAhead;
