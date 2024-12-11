import { Card, CardBody, Col, Label } from "reactstrap";
import { BordersWithIcon } from "@/Constant/constant";
import CommonSwitchSpan from "./Common/CommonSwitchSpan";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";
import {
  BorderIconSwitchData,
  BorderIconSwitchDataList,
} from "@/Data/Form&Table/Form/FormData";

const BordersWithIcons = () => {
  return (
    <Col xl="4">
      <Card className="height-equal">
        <CommonCardHeader
          title={BordersWithIcon}
          subTitle={BorderIconSwitchData}
          headClass="pb-0"
        />
        <CardBody className="common-flex flex-column switch-wrapper ">
          {BorderIconSwitchDataList.map(({ color, text }, index) => (
            <div className="d-flex align-items-center" key={index}>
              <div className="text-end icon-state switch-outline">
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

export default BordersWithIcons;
