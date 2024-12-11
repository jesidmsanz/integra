import { Typeahead } from "react-bootstrap-typeahead";
import { Card, CardBody, Col, Form } from "reactstrap";
import { CustomTemplate } from "@/Constant/constant";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";
import {
  CustomTemplateData,
  OscarWinnerData,
} from "@/Data/Form&Table/Form/FormData";

const CustomTemplates = () => {
  return (
    <Col sm="12" md="6">
      <Card>
        <CommonCardHeader
          title={CustomTemplate}
          subTitle={CustomTemplateData}
          headClass="pb-0"
        />
        <CardBody>
          <div id="custom-templates">
            <Form className="theme-form">
              <div>
                <Typeahead
                  options={OscarWinnerData}
                  placeholder="Oscar winners"
                  id="Custom Templates"
                />
              </div>
            </Form>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default CustomTemplates;
