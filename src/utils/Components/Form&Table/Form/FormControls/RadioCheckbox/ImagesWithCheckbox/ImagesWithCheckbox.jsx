import { Card, CardBody, Col, Row } from "reactstrap";
import { ImagesWithCheckboxTitle } from "@/Constant/constant";
import { DynamicImagesWithCheckbox } from "./DynamicImagesWithCheckbox";
import { CustomImagesWithCheckbox } from "./CustomImagesWithCheckbox";
import { ImageWithCheckboxData } from "@/Data/Form&Table/Form/FormData";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

const ImagesWithCheckbox = () => {
  return (
    <Col sm="12">
      <Card>
        <CommonCardHeader
          title={ImagesWithCheckboxTitle}
          subTitle={ImageWithCheckboxData}
          headClass="pb-0"
        />
        <CardBody>
          <div className="main-img-checkbox">
            <Row className="g-3">
              <CustomImagesWithCheckbox />
              <DynamicImagesWithCheckbox />
            </Row>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default ImagesWithCheckbox;
