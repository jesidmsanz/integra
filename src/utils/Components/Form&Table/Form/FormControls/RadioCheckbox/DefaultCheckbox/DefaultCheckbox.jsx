import { Card, CardBody, Col, Input, Label, Row } from "reactstrap";
import { DefaultCheckboxTitle } from "@/Constant/constant";
import { DefaultChecks } from "./DefaultChecks";
import { Indeterminates } from "./Indeterminates";
import { DefaultCheckBoxData, DefaultCheckBoxDataList } from "@/Data/Form&Table/Form/FormData";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

const DefaultCheckbox = () => {
  return (
    <Col sm="12">
      <Card>
        <CommonCardHeader title={DefaultCheckboxTitle} subTitle={DefaultCheckBoxData} headClass="pb-0" />
        <CardBody>
          <Row className="g-3">
            <DefaultChecks />
            {DefaultCheckBoxDataList.map(({ title, span, className }, index) => (
              <Col sm="6" xl="4" key={index}>
                <div className="card-wrapper border rounded-3 checkbox-checked">
                  <h6 className="sub-title">{title}</h6>
                  {span.map(({ id, label, defaultChecked, disabled }, index) => (
                    <div className={`form-check ${className}`} key={index}>
                      <Input id={id} type="checkbox" defaultChecked={defaultChecked} disabled={disabled} />
                      <Label htmlFor={id} check>{label}</Label>
                    </div>
                  ))}
                </div>
              </Col>
            ))}
            <Indeterminates />
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

export default DefaultCheckbox;
