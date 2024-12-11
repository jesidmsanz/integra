import { Card, Col } from "reactstrap";
import { BasicInputGroup } from "@/Constant/constant";
import { BasicInputGroupsCardBody } from "./BasicInputGroupsCardBody";
import { BasicInputGroupsCardFooter } from "./BasicInputGroupsCardFooter";
import { BasicInputGroupData } from "@/Data/Form&Table/Form/FormData";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

const BasicInputGroups = () => {
  return (
    <Col xl="6">
      <Card>
        <CommonCardHeader
          title={BasicInputGroup}
          subTitle={BasicInputGroupData}
          headClass="pb-0"
        />
        <BasicInputGroupsCardBody />
        <BasicInputGroupsCardFooter />
      </Card>
    </Col>
  );
};

export default BasicInputGroups;
