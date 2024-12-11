import {
  Col,
  FormFeedback,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Row,
} from "reactstrap";
import {
  FloatingInputGroup,
  FloatingInputGroupFeed,
} from "@/Constant/constant";

const CommonFloatingFormGroup = ({
  floatingLabel,
  inputClass,
  floatClass,
  invalid,
  required,
}) => {
  return (
    <Row className="mb-3">
      <Col sm="3">
        <Label check>{FloatingInputGroup}</Label>
      </Col>
      <Col sm="9">
        <InputGroup className={inputClass}>
          <InputGroupText>@</InputGroupText>
          <div className={`form-floating ${floatClass}`}>
            <Input type="text" invalid={invalid} required={required} />
            <Label check>{floatingLabel}</Label>
          </div>
          <FormFeedback>{FloatingInputGroupFeed}</FormFeedback>
        </InputGroup>
      </Col>
    </Row>
  );
};

export default CommonFloatingFormGroup;
