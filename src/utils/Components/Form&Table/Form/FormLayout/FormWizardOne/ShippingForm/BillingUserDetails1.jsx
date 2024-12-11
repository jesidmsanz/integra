import { Col, FormGroup, Input, Label } from "reactstrap";
import {
  Address,
  DunzoMail,
  ContactNumber,
  Email,
  EnterFirstName,
  EnterLastName,
  EnterNumber,
  FirstName,
  LastName,
} from "@/Constant/constant";

export const BillingUserDetails1 = ({ studentValidationForm, getUserData }) => {
  const { firstName, lastName, contact, email, address } =
    studentValidationForm;

  return (
    <>
      <Col sm="6">
        <FormGroup>
          <Label check>
            {FirstName}
            <span className="txt-danger">*</span>
          </Label>
          <Input
            value={firstName}
            onChange={getUserData}
            name="firstName"
            type="text"
            placeholder={EnterFirstName}
          />
        </FormGroup>
      </Col>
      <Col sm="6">
        <FormGroup>
          <Label check>
            {LastName}
            <span className="txt-danger">*</span>
          </Label>
          <Input
            value={lastName}
            onChange={getUserData}
            name="lastName"
            type="text"
            placeholder={EnterLastName}
          />
        </FormGroup>
      </Col>
      <Col sm="6">
        <FormGroup>
          <Label check>{ContactNumber}</Label>
          <Input
            value={contact}
            onChange={getUserData}
            name="contact"
            type="number"
            placeholder={EnterNumber}
          />
        </FormGroup>
      </Col>
      <Col sm="6">
        <Label check>
          {Email}
          <span className="txt-danger">*</span>
        </Label>
        <Input
          value={email}
          onChange={getUserData}
          name="email"
          type="email"
          placeholder={DunzoMail}
        />
      </Col>
      <Col sm="12">
        <FormGroup>
          <Label check>{Address}</Label>
          <Input
            value={address}
            onChange={getUserData}
            type="textarea"
            name="address"
            rows={3}
          />
        </FormGroup>
      </Col>
    </>
  );
};
