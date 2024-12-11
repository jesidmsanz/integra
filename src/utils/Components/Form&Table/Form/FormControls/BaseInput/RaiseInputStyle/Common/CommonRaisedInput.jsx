import { Col, FormGroup, Input, Label, Row } from "reactstrap";

const CommonRaisedInput = ({
  inputType,
  label,
  placeholder,
  inputClass,
  rows,
}) => {
  return (
    <Row>
      <Col>
        <FormGroup>
          <Label check>{label}</Label>
          <Input
            className={`input-air-primary custom-scrollbar ${inputClass}`}
            type={inputType}
            placeholder={placeholder}
            rows={rows}
          />
        </FormGroup>
      </Col>
    </Row>
  );
};

export default CommonRaisedInput;
