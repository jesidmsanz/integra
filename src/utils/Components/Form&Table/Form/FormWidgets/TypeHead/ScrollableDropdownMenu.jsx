import { Typeahead } from "react-bootstrap-typeahead";
import { Card, CardBody, Col, Form } from "reactstrap";
import { ScrollableDropDownMenu } from "@/Constant/constant";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";
import {
  CountryDataList,
  ScrollableDropdownData,
} from "@/Data/Form&Table/Form/FormData";

const ScrollableDropdownMenu = () => {
  return (
    <Col sm="12" md="6">
      <Card>
        <CommonCardHeader
          title={ScrollableDropDownMenu}
          subTitle={ScrollableDropdownData}
          headClass="pb-0"
        />
        <CardBody>
          <div id="scrollable-dropdown-menu">
            <Form className="theme-form">
              <div>
                <Typeahead
                  options={CountryDataList}
                  placeholder="Countries"
                  id="Scrollable DropdownMenu"
                />
              </div>
            </Form>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default ScrollableDropdownMenu;
