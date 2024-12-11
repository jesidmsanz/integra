import { Card, CardBody, Col } from "reactstrap";
import { DisabledOutlineSwitches } from "@/Constant/constant";
import CommonSwitchSpan from "./Common/CommonSwitchSpan";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";
import {
  DisableOutlineSwitchData,
  DisableOutlineSwitchDataList,
} from "@/Data/Form&Table/Form/FormData";

const DisabledOutlineSwitch = () => {
  return (
    <Col md="6">
      <Card>
        <CommonCardHeader
          title={DisabledOutlineSwitches}
          subTitle={DisableOutlineSwitchData}
          headClass="pb-0"
        />
        <CardBody className="common-flex">
          {DisableOutlineSwitchDataList.map((item, index) => (
            <div className="d-flex" key={index}>
              <div className="flex-grow-1 text-end icon-state switch-outline">
                <CommonSwitchSpan key={index} color={item} />
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </Col>
  );
};

export default DisabledOutlineSwitch;
