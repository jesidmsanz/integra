//@ts-nocheck
import { useState } from "react";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import { NetBanking, SelectYourBank } from "@/Constant/constant";
import FeatherIconCom from "./FeatherIconCom";
import { NetBankingList } from "@/Data/Form&Table/Form/FormData";

export const NetBankingAccordion = ({ netBankingFormValues, getUserData }) => {
  const [open, setOpen] = useState("");
  const toggle = (id) => (open === id ? setOpen("") : setOpen(id));
  const { bankName } = netBankingFormValues;

  return (
    <Accordion open={open} toggle={toggle} className="dark-accordion">
      <AccordionItem>
        <AccordionHeader targetId="1">
          {NetBanking}
          <FeatherIconCom
            iconName={open === "1" ? "ChevronUp" : "ChevronDown"}
            className="svg-color"
          />
        </AccordionHeader>
        <AccordionBody accordionId="1" className="weight-title card-wrapper">
          <h6 className="sub-title f-14">{SelectYourBank}</h6>
          <Row className="choose-bank">
            {NetBankingList.map((data, index) => (
              <Col sm="6" key={index}>
                {data.bankList.map((bankNames, number) => (
                  <FormGroup check key={number} className="radio radio-primary">
                    <Input
                      id={bankNames}
                      type="radio"
                      name="bankName"
                      onChange={getUserData}
                      checked={bankNames === bankName}
                      value={bankNames}
                    />
                    <Label htmlFor={bankNames} check>
                      {bankNames} {number}
                    </Label>
                  </FormGroup>
                ))}
              </Col>
            ))}
          </Row>
        </AccordionBody>
      </AccordionItem>
    </Accordion>
  );
};
