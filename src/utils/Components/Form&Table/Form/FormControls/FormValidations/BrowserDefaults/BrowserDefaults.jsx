import { Card, Col } from "reactstrap";
import { BrowserDefault } from "@/Constant/constant";
import { BrowserDefaultsCardBody } from "./BrowserDefaultsCardBody";
import { BrowserDefaultData } from "@/Data/Form&Table/Form/FormData";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

const BrowserDefaults = () => {
  return (
    <Col xl="6">
      <Card className="height-equal">
        <CommonCardHeader
          title={BrowserDefault}
          subTitle={BrowserDefaultData}
        />
        <BrowserDefaultsCardBody />
      </Card>
    </Col>
  );
};

export default BrowserDefaults;
