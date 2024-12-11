import { ChooseBanks, ImagePath } from "@/Constant/constant";
import { PopularBankList } from "@/Data/Form&Table/Form/FormData";
import { useAppSelector } from "@/Redux/Hooks";
import Image from "next/image";
import { Col, FormGroup, Input, Label } from "reactstrap";

export const BankLogoList = ({ getUserData }) => {
  const { bankDetailsForm } = useAppSelector((state) => state.formWizardTwo);
  const { bankName } = bankDetailsForm;

  return (
    <Col xs="12">
      <h6>{ChooseBanks}</h6>
      <div className="bank-selection">
        <FormGroup check className="radio radio-primary ps-0">
          <ul className="radio-wrapper d-flex flex-row mb-3">
            {PopularBankList.map((data, index) => (
              <li key={index}>
                <Input
                  id={data.bankName}
                  type="radio"
                  name="bankName"
                  value={data.bankName}
                  checked={bankName === data.bankName}
                  onChange={getUserData}
                />
                <Label htmlFor={data.bankName} check>
                  <Image
                    priority
                    width={100}
                    height={52}
                    src={`${ImagePath}/forms/${data.imageName}`}
                    alt={data.bankName}
                  />
                  <span>{data.bankName}</span>
                </Label>
              </li>
            ))}
          </ul>
        </FormGroup>
      </div>
    </Col>
  );
};
