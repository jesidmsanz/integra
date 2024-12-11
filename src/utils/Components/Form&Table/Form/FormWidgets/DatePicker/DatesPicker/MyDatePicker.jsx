import { useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { Col, InputGroup, Label, Row } from "reactstrap";
import { RangeDatePicker } from "@/Constant/constant";

const MyDatePicker = () => {
  const [value, setValue] = useState([new DateObject(), new DateObject()]);

  return (
    <Row>
      <Col xxl="3">
        <Label className="box-col-12 text-start" check>
          {RangeDatePicker}
        </Label>
      </Col>
      <Col xxl="9" className="box-col-12">
        <InputGroup className="flatpicker-calender">
          <DatePicker
            inputClass="form-control"
            range
            value={value.length > 0 ? value : undefined}
            onChange={(dates) => setValue(dates)}
          />
        </InputGroup>
      </Col>
    </Row>
  );
};

export default MyDatePicker;
