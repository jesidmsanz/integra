import { Card, CardBody, Col, Input } from "reactstrap";
import {
  FormControlSizings,
  FormControlSizingsPlaceholder,
} from "@/Constant/constant";
import { FormControlSizingData } from "@/Data/Form&Table/Form/FormData";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

const FormControlSizing = () => {
  return (
    <Col md="6">
      <Card>
        <CommonCardHeader
          title={FormControlSizings}
          subTitle={FormControlSizingData}
          headClass="pb-0"
        />
        <CardBody>
          <Input
            bsSize="sm"
            type="text"
            placeholder={FormControlSizingsPlaceholder}
          />
        </CardBody>
      </Card>
    </Col>
  );
};

export default FormControlSizing;
