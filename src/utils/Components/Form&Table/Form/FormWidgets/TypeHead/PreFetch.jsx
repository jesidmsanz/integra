import { Typeahead } from "react-bootstrap-typeahead";
import { Card, Col, CardBody, Form } from "reactstrap";
import { PreFetchHeading } from "@/Constant/constant";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";
import { CountryDataList, PreFetchData } from "@/Data/Form&Table/Form/FormData";

const PreFetch = () => {
  return (
    <Col sm="12" md="6">
      <Card>
        <CommonCardHeader
          title={PreFetchHeading}
          subTitle={PreFetchData}
          headClass="pb-0"
        />
        <CardBody>
          <div id="the-basics">
            <Form className="theme-form">
              <div>
                <Typeahead
                  options={CountryDataList}
                  placeholder="Countries"
                  id="PreFetch"
                />
              </div>
            </Form>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default PreFetch;
