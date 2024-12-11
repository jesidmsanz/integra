import { Card, CardBody, Col, Input, Label } from "reactstrap";
import {
  ButtonChecked,
  ButtonCheckedSuccessRadio,
  ButtonDarkRadio,
  OutlinedCheckboxStyle,
  SingleToggle,
} from "@/Constant/constant";
import { OutlineCheckboxData } from "@/Data/Form&Table/Form/FormData";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

const OutlinedCheckboxStyles = () => {
  return (
    <Col md="6">
      <Card>
        <CommonCardHeader
          title={OutlinedCheckboxStyle}
          subTitle={OutlineCheckboxData}
          headClass="pb-0"
        />
        <CardBody className="common-flex main-checkbox-toggle">
          <Input
            className="btn-check"
            id="btn-check-outlined"
            type="checkbox"
          />
          <Label
            className="btn btn-outline-info"
            htmlFor="btn-check-outlined"
            check
          >
            {SingleToggle}
          </Label>
          <Input
            className="btn-check"
            id="btn-check-2-outlined"
            type="checkbox"
            defaultChecked
          />
          <Label
            className="btn btn-outline-danger"
            htmlFor="btn-check-2-outlined"
            check
          >
            {ButtonChecked}
          </Label>
          <Input
            className="btn-check"
            id="success-outlined"
            type="radio"
            name="options-outlined"
            defaultChecked
          />
          <Label
            className="btn btn-outline-success"
            htmlFor="success-outlined"
            check
          >
            {ButtonCheckedSuccessRadio}
          </Label>
          <Input
            className="btn-check"
            id="danger-outlined"
            type="radio"
            name="options-outlined"
          />
          <Label
            className="btn btn-outline-dark"
            htmlFor="danger-outlined"
            check
          >
            {ButtonDarkRadio}
          </Label>
        </CardBody>
      </Card>
    </Col>
  );
};

export default OutlinedCheckboxStyles;
