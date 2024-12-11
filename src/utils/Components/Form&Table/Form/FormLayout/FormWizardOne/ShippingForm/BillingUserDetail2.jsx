import { Col, FormGroup, Input, Label } from "reactstrap";
import {
  Country,
  EnterYourQueries,
  OtherNotes,
  RememberMeForNextTime,
  State,
  ZipCode,
} from "@/Constant/constant";

export const BillingUserDetail2 = ({ studentValidationForm, getUserData }) => {
  const { country, state, zip, otherNotes } = studentValidationForm;
  const CountryList = [
    "Africa",
    "India",
    "Indonesia",
    "Netherlands",
    "U.K",
    "U.S",
  ];

  return (
    <>
      <Col sm="4">
        <FormGroup>
          <Label check>{Country}</Label>
          <Input
            type="select"
            value={country}
            onChange={getUserData}
            name="country"
          >
            <option value="">Select Country</option>
            {CountryList.map((item, index) => (
              <option value={item} key={index}>
                {item}
              </option>
            ))}
          </Input>
        </FormGroup>
      </Col>
      <Col sm="4">
        <FormGroup>
          <Label check>{State}</Label>
          <Input
            value={state}
            onChange={getUserData}
            name="state"
            type="text"
            placeholder="Enter state"
          />
        </FormGroup>
      </Col>
      <Col sm="4">
        <FormGroup>
          <Label check>{ZipCode}</Label>
          <Input value={zip} onChange={getUserData} type="text" name="zip" />
        </FormGroup>
      </Col>
      <Col xs="12" className="mb-2">
        <FormGroup check>
          <Input
            name="rememberNextTime"
            onChange={getUserData}
            id="invalid-check-wizard"
            type="checkbox"
            required
          />
          <Label className="d-block" htmlFor="invalid-check-wizard" check>
            {RememberMeForNextTime}
          </Label>
        </FormGroup>
      </Col>
      <Col xs="12">
        <FormGroup>
          <Label htmlFor="exampleFormControlTextarea-01" check>
            {OtherNotes}
          </Label>
          <Input
            value={otherNotes}
            onChange={getUserData}
            type="textarea"
            name="otherNotes"
            rows={3}
            placeholder={EnterYourQueries}
          />
        </FormGroup>
      </Col>
    </>
  );
};
