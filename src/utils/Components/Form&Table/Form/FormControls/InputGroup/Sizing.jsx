import {
  Card,
  CardBody,
  Col,
  Input,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import {
  DefaultInput,
  LargeInput,
  Sizings,
  SmallInput,
} from "@/Constant/constant";
import { SizingDatas } from "@/Data/Form&Table/Form/FormData";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

const Sizing = () => {
  return (
    <Col md="6">
      <Card>
        <CommonCardHeader
          title={Sizings}
          subTitle={SizingDatas}
          headClass="pb-0"
        />
        <CardBody className="card-wrapper input-group-wrapper">
          <InputGroup size="sm">
            <InputGroupText id="inputGroup-sizing-sm">
              {SmallInput}
            </InputGroupText>
            <Input type="text" />
          </InputGroup>
          <InputGroup size="default">
            <InputGroupText id="inputGroup-sizing-default">
              {DefaultInput}
            </InputGroupText>
            <Input type="text" />
          </InputGroup>
          <InputGroup size="lg">
            <InputGroupText id="inputGroup-sizing-lg">
              {LargeInput}
            </InputGroupText>
            <Input type="text" />
          </InputGroup>
        </CardBody>
      </Card>
    </Col>
  );
};

export default Sizing;
