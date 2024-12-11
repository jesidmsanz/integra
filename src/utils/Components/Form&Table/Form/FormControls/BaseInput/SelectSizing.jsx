import { Card, CardBody, Col, Input } from "reactstrap";
import { SelectSizings } from "@/Constant/constant";
import {
  SizingFormData,
  SizingFormDataList,
} from "@/Data/Form&Table/Form/FormData";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

const SelectSizing = () => {
  return (
    <Col md="6">
      <Card>
        <CommonCardHeader
          title={SelectSizings}
          subTitle={SizingFormData}
          headClass="pb-0"
        />
        <CardBody>
          <Input bsSize="sm" type="select" name="select">
            {SizingFormDataList.map((item, index) => (
              <option value={index + 1} key={index}>
                {item}
              </option>
            ))}
          </Input>
        </CardBody>
      </Card>
    </Col>
  );
};

export default SelectSizing;
