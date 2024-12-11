import { Card, CardBody, Col, Input, InputGroup, Row } from "reactstrap";
import { CalendarDefault } from "@/Constant/constant";
import Calendar from "react-calendar";
import { useState } from "react";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

const DefaultCalendar = () => {
  const [dateValue, setDateValue] = useState < Date > new Date();

  return (
    <Col xl="6">
      <Card>
        <CommonCardHeader title={CalendarDefault} headClass="pb-0" />
        <CardBody className="card-wrapper">
          <Row className="g-3">
            <Col xs="12">
              <InputGroup className="main-inline-calender">
                <Input
                  placeholder={`${dateValue.getDate()} - ${
                    dateValue.getMonth() + 1
                  } - ${dateValue.getFullYear()} `}
                  className="mb-2 flatpickr-input"
                  readOnly
                />
                <Calendar
                  onChange={(value) => setDateValue(value)}
                  value={dateValue}
                  className="w-100"
                />
              </InputGroup>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

export default DefaultCalendar;
