import { Card, CardBody, Col, Row } from "reactstrap";
import { VariationOfAddon } from "@/Constant/constant";
import VariationAddonsFormContent from "./VariationAddonsFormContent";
import { VariationOfAddonsCardFooter } from "./VariationOfAddonsCardFooter";
import { VariationOfAddonData } from "@/Data/Form&Table/Form/FormData";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

const VariationOfAddons = () => {
  return (
    <Col xl="6">
      <Card>
        <CommonCardHeader
          title={VariationOfAddon}
          subTitle={VariationOfAddonData}
          headClass="pb-0"
        />
        <CardBody className="card-wrapper input-radius">
          <Row>
            <Col>
              <VariationAddonsFormContent />
            </Col>
          </Row>
        </CardBody>
        <VariationOfAddonsCardFooter />
      </Card>
    </Col>
  );
};

export default VariationOfAddons;
