import { Card, CardBody, Col, Label, Media } from "reactstrap";
import { IconsSwitches as IconsSwitches } from "@/Constant/constant";
import CommonSwitchSpan from "./Common/CommonSwitchSpan";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";
import {
  IconSwitchData,
  IconSwitchDataList,
} from "@/Data/Form&Table/Form/FormData";

const IconsSwitch = () => {
  return (
    <Col xl="4" sm="6">
      <Card className="height-equal">
        <CommonCardHeader
          title={IconsSwitches}
          subTitle={IconSwitchData}
          headClass="pb-0"
        />
        <CardBody className="common-flex flex-column switch-wrapper">
          {IconSwitchDataList.map(({ color, text }, index) => (
            <div className="d-flex" key={index}>
              <div className="flex-grow-0 text-end icon-state">
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

export default IconsSwitch;
