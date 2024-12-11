/* eslint-disable @next/next/no-img-element */
import SVG from "@/CommonComponent/SVG/Svg";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";
import { ImagePath, VariationRadios } from "@/Constant/constant";
import {
  VariationRadioData,
  VariationRadioDataList,
} from "@/Data/Form&Table/Form/FormData";
import { Card, CardBody, Col, FormGroup, Input, Label, Row } from "reactstrap";

const VariationRadio = () => {
  return (
    <Col xs="12">
      <Card>
        <CommonCardHeader
          title={VariationRadios}
          subTitle={VariationRadioData}
          headClass="pb-0"
        />
        <CardBody>
          <Row className="g-3">
            {VariationRadioDataList.map(({ colClass, title, child }, index) => (
              <Col xl="4" className={colClass ? colClass : ""} key={index}>
                <div className="card-wrapper border rounded-3 h-100 checkbox-checked">
                  <h6 className="sub-title">{title}</h6>
                  {child.map(
                    ({
                      id,
                      labelText,
                      image,
                      icon,
                      name,
                      defaultChecked,
                      iconColor,
                    }) => (
                      <div className="payment-wrapper" key={id}>
                        <div className="payment-first">
                          <FormGroup className="radio radio-primary" check>
                            <Input
                              id={`ptm-${id}`}
                              type="radio"
                              name={name}
                              value="option1"
                              defaultChecked={defaultChecked}
                            />
                            <Label className="mb-0" htmlFor={`ptm-${id}`} check>
                              {labelText}
                            </Label>
                          </FormGroup>
                        </div>
                        {(image || icon) && (
                          <div className="payment-second">
                            {image && (
                              <img
                                className="img-fluid"
                                src={`${ImagePath}/${image}`}
                                alt="ecommerce"
                              />
                            )}
                            {icon && (
                              <SVG
                                className={`mega-icons stroke-${iconColor}`}
                                iconId={icon}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </Col>
            ))}
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

export default VariationRadio;
