import { Card, Col, Row } from "reactstrap";
import { CalendarBootstrap } from "@/Constant/constant";
import { BootstrapCalendarBody } from "./BootstrapCalendarBody";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

const BootstrapCalendar = () => {
  return (
    <Col xl="6">
      <Card>
        <CommonCardHeader title={CalendarBootstrap} headClass="pb-0" />
        <BootstrapCalendarBody />
      </Card>
    </Col>
  );
};

export default BootstrapCalendar;
