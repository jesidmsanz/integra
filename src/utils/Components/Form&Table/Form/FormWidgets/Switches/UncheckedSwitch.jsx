import { Card, CardBody, Col, Label } from "reactstrap";
import { UncheckedSwitches } from "@/Constant/constant";
import CommonSwitchSpan from "./Common/CommonSwitchSpan";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";
import {
  UncheckedSwitchData,
  UncheckedSwitchDataList,
} from "@/Data/Form&Table/Form/FormData";

const UncheckedSwitch = () => {
  return (
    <Col xl="4" sm="6">
      <Card className="height-equal">
        <CommonCardHeader
          title={UncheckedSwitches}
          subTitle={UncheckedSwitchData}
          headClass="pb-0"
        />
        <CardBody className="common-flex flex-column switch-wrapper">
          {UncheckedSwitchDataList.map(({ color, text }, index) => (
            <div className="d-flex align-items-center" key={index}>
              <div className="text-end">
                <CommonSwitchSpan color={color} defaultChecked />
              </div>
              <Label className="m-l-10" check>
                {text}
              </Label>
            </div>
          ))}
        </CardBody>
      </Card>
    </Col>
  );
};

export default UncheckedSwitch;
