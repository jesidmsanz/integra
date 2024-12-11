import { Card, Col, Form } from "reactstrap";
import { EdgesInputStyles } from "@/Constant/constant";
import { EdgesInputCardBody } from "./EdgesInputCardBody";
import { EdgesInputCardFooter } from "./EdgesInputCardFooter";
import { EdgeInputStyleData } from "@/Data/Form&Table/Form/FormData";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

const EdgesInputStyle = () => {
  return (
    <Col md="6">
      <Card>
        <CommonCardHeader
          title={EdgesInputStyles}
          subTitle={EdgeInputStyleData}
          headClass="pb-0"
        />
        <Form
          className="theme-form dark-inputs custom-scrollbar"
          onSubmit={(e) => e.preventDefault()}
        >
          <EdgesInputCardBody />
          <EdgesInputCardFooter />
        </Form>
      </Card>
    </Col>
  );
};

export default EdgesInputStyle;
