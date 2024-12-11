import { Card, CardBody, Col } from "reactstrap";
import { FormValidationTooltip } from "@/Constant/constant";
import { Formik } from "formik";
import { TooltipValidationForm } from "./TooltipValidationForm";
import { useState } from "react";
import {
  TooltipInitialValue,
  TooltipValidationSchema,
  TooltipValidations,
} from "@/Data/Form&Table/Form/FormData";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

const TooltipFormValidation = () => {
  const [submitErrors, setSubmitError] = useState(false);

  const submitHandler = (values, { resetForm }) => {
    resetForm();
    setSubmitError(false);
  };

  return (
    <Col sm="12">
      <Card>
        <CommonCardHeader
          title={FormValidationTooltip}
          subTitle={TooltipValidations}
          headClass="pb-0"
        />
        <CardBody>
          <Formik
            initialValues={TooltipInitialValue}
            onSubmit={submitHandler}
            validationSchema={TooltipValidationSchema}
          >
            {({ errors }) => (
              <TooltipValidationForm
                errors={errors}
                setSubmitError={setSubmitError}
                submitErrors={submitErrors}
              />
            )}
          </Formik>
        </CardBody>
      </Card>
    </Col>
  );
};

export default TooltipFormValidation;
