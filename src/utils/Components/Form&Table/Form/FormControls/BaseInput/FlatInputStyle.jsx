import {
  Card,
  CardBody,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import {
  FlatInputStyles,
  PleaseDoComments,
  SelectYourFavoriteRomanNumber,
  SelectYourMultiplePaintings,
} from "@/Constant/constant";
import {
  FlatInputStyleList,
  FlatInputTypeData,
  FlateStyleDataList,
} from "@/Data/Form&Table/Form/FormData";
import CommonSelectInput from "./Common/CommonSelectInput";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

const FlatInputStyle = () => {
  return (
    <Col md="6">
      <Card>
        <CommonCardHeader
          title={FlatInputStyles}
          subTitle={FlatInputTypeData}
          headClass="pb-0"
        />
        <Form className="theme-form dark-inputs custom-scrollbar">
          <CardBody>
            <CommonSelectInput
              label={SelectYourFavoriteRomanNumber}
              inputClass="btn-square"
              span={FlatInputStyleList}
            />
            <CommonSelectInput
              label={SelectYourMultiplePaintings}
              inputClass="btn-square"
              span={FlateStyleDataList}
              multiple
            />
            <Row>
              <Col>
                <FormGroup>
                  <Label check>{PleaseDoComments}</Label>
                  <Input
                    type="textarea"
                    className="btn-square custom-scrollbar"
                    rows={3}
                  ></Input>
                </FormGroup>
              </Col>
            </Row>
          </CardBody>
        </Form>
      </Card>
    </Col>
  );
};

export default FlatInputStyle;
