import { Card, CardBody, Col, Row } from "reactstrap";
import { CustomSwitches } from "@/Constant/constant";
import CommonSwitch from "./Common/CommonSwitch";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";
import {
  CustomSwitchData,
  CustomSwitchDataList,
} from "@/Data/Form&Table/Form/FormData";

const CustomSwitch = () => {
  return (
    <Col md="12">
      <Card>
        <CommonCardHeader
          title={CustomSwitches}
          subTitle={CustomSwitchData}
          headClass="pb-0"
        />
        <CardBody>
          <Row className="g-3">
            {CustomSwitchDataList.map(
              ({ id, item, cardClass, formClass, disabled, sm }) => (
                <Col md="4" sm={sm} key={id}>
                  <div
                    className={`card-wrapper border rounded-3 ${cardClass} `}
                  >
                    <div className={`form-check-size ${formClass}`}>
                      {item.map((item, index) => (
                        <CommonSwitch
                          color={item}
                          defaultChecked
                          disabled={disabled}
                          key={index}
                        />
                      ))}
                    </div>
                  </div>
                </Col>
              )
            )}
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

export default CustomSwitch;
