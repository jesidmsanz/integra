import { Formik } from "formik";
import { useState } from "react";
import { ValidationsForms } from "@/Constant/constant";
import { Card, CardBody, Col } from "reactstrap";
import { FormValidations } from "./FormValidations";
import {
  FormValidationSchema,
  ValidationFormData,
  ValidationFormInitialValue,
} from "@/Data/Form&Table/Form/FormData";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

const ValidationForm = () => {
  const [submitErrors, setSubmitError] = useState(false);

  const handleSubmit = (values, { resetForm }) => {
    resetForm();
    setSubmitError(false);
  };

  return (
    <Col xl="6">
      <Card className="height-equal">
        <CommonCardHeader
          title={ValidationsForms}
          subTitle={ValidationFormData}
        />
        <CardBody>
          <Formik
            initialValues={ValidationFormInitialValue}
            onSubmit={handleSubmit}
            validationSchema={FormValidationSchema}
          >
            {({ errors }) => (
              <FormValidations
                submitErrors={submitErrors}
                setSubmitError={setSubmitError}
                errors={errors}
              />
            )}
          </Formik>
        </CardBody>
      </Card>
    </Col>
  );
};

export default ValidationForm;
