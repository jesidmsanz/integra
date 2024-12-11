import { CreditCard, ImagePath } from "@/Constant/constant";
import React from "react";
import { Col, FormGroup, Input, Label } from "reactstrap";
import CreditCardForm from "./CreditCardForm";
import Image from "next/image";

const CreditCardOption = ({ paymentMethodName, getUserData }) => {
  return (
    <Col xs="12">
      <div className="card-wrapper border rounded-3 pay-info light-card">
        <div>
          <div>
            <FormGroup check className="radio radio-primary">
              <Input
                id="shipping-choose6"
                type="radio"
                name="paymentMethodName"
                value="creditCard"
                checked={paymentMethodName === "creditCard"}
                onChange={getUserData}
              />
              <Label className="mb-0 f-w-500" htmlFor="shipping-choose6" check>
                {CreditCard}
              </Label>
            </FormGroup>
            <p>
              Transferring money securely through your bank account. Mastercard,
              Visa, Discover, and Stripe are all accepted
            </p>
          </div>
          <div>
            <Image
              priority
              width={101}
              height={50}
              src={`${ImagePath}/forms/credit-card.png`}
              alt="card"
            />
          </div>
        </div>
        <CreditCardForm />
      </div>
    </Col>
  );
};

export default CreditCardOption;
