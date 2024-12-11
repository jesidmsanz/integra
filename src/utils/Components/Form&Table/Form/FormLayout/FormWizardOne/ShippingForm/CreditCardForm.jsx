import {
  AboveInformationCorrect,
  CVVNumber,
  CardHolder,
  CardHolderPlaceholder,
  CardNumber,
  CardNumberPlaceholder,
  Expiration,
  ExpiryPlaceholder,
  UploadDocumentation,
} from "@/Constant/constant";
import { Col, Input, Label, FormGroup, Form, Row } from "reactstrap";

const CreditCardForm = () => {
  return (
    <Form className="g-3 needs-validation" noValidate>
      <Row>
        <Col md="12">
          <FormGroup>
            <Label>{CardHolder}</Label>
            <Input type="text" required placeholder={CardHolderPlaceholder} />
          </FormGroup>
        </Col>
        <Col md="4">
          <FormGroup>
            <Label>{CardNumber}</Label>
            <Input type="text" required placeholder={CardNumberPlaceholder} />
            <div className="invalid-feedback">
              Please enter your valid number
            </div>
          </FormGroup>
        </Col>
        <Col md="4">
          <FormGroup>
            <Label>{Expiration}</Label>
            <Input type="number" required placeholder={ExpiryPlaceholder} />
          </FormGroup>
        </Col>
        <Col md="4">
          <FormGroup>
            <Label>{CVVNumber}</Label>
            <Input type="text" required />
          </FormGroup>
        </Col>
        <Col xs="12">
          <FormGroup>
            <Label>{UploadDocumentation}</Label>
            <Input type="file" required />
          </FormGroup>
        </Col>
        <Col xs="12">
          <FormGroup check>
            <Input id="invalidCheck-c" type="checkbox" required />
            <Label check htmlFor="invalidCheck-c">
              {AboveInformationCorrect}
            </Label>
          </FormGroup>
        </Col>
      </Row>
    </Form>
  );
};

export default CreditCardForm;
