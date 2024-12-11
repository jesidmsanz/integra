import { Card, CardBody, Col, Row } from "reactstrap";
import { ImagesWitRadio } from "@/Constant/constant";
import CustomImagesWithRadio from "./CustomImagesWithRadio";
import DynamicImagesWithRadio from "./DynamicImagesWithRadio";
import { ImageWithRadioData } from "@/Data/Form&Table/Form/FormData";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

const ImagesWithRadio = () => {
  return (
    <Col sm="12">
      <Card>
        <CommonCardHeader
          title={ImagesWitRadio}
          subTitle={ImageWithRadioData}
          headClass="pb-0"
        />
        <CardBody>
          <div className="main-img-checkbox">
            <Row className="g-3">
              <CustomImagesWithRadio />
              <DynamicImagesWithRadio />
            </Row>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default ImagesWithRadio;
