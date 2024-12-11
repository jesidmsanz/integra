import { Button, Card, CardBody, Col, Input, InputGroup } from "reactstrap";
import {
  SegmentedButton,
  SegmentedButtonInfo,
  SegmentedButtonSecondary,
} from "@/Constant/constant";
import {
  SegmentButtonData,
  SegmentDataOne,
  SegmentDataTwo,
} from "@/Data/Form&Table/Form/FormData";
import ButtonDropdownList from "./ButtonsWithDropdowns/Common/ButtonDropdownList";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

const SegmentedButtons = () => {
  return (
    <Col md="6">
      <Card className="height-equal">
        <CommonCardHeader
          title={SegmentedButton}
          subTitle={SegmentButtonData}
          headClass="pb-0"
        />
        <CardBody className="main-segment-btn card-wrapper input-group-wrapper">
          <InputGroup>
            <Button color="info" outline>
              {" "}
              {SegmentedButtonInfo}
            </Button>
            <ButtonDropdownList color="info" divider options={SegmentDataOne} />
            <Input type="text" />
          </InputGroup>
          <InputGroup>
            <Input type="text" />
            <Button color="secondary" outline>
              {SegmentedButtonSecondary}
            </Button>
            <ButtonDropdownList
              color="secondary"
              divider
              options={SegmentDataTwo}
            />
          </InputGroup>
        </CardBody>
      </Card>
    </Col>
  );
};

export default SegmentedButtons;
