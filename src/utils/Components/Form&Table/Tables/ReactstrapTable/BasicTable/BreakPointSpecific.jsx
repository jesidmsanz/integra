import { Card, Col, Row } from "reactstrap";
import { BreakpointSpecifics } from "@/Constant/constant";
import {
  BreakPointBody,
  BreakPointData,
  BreakPointHead,
} from "@/Data/Form&Table/Table/ReactstrapTable/BasicTable/BasicTableData";
import CommonTable from "./Common/CommonTable";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

export const BreakPointSpecific = () => {
  return (
    <Col sm="12">
      <Card>
        <CommonCardHeader
          title={BreakpointSpecifics}
          subTitle={BreakPointData}
        />
        <Row className="card-block">
          <Col sm="12" lg="12" xl="12">
            <CommonTable size="sm" headData={BreakPointHead}>
              {BreakPointBody.map((data) => (
                <tr key={data.id}>
                  <th scope="row">{data.id}</th>
                  <td>{data.name}</td>
                  <td>{data.orderId}</td>
                  <td>{data.price}</td>
                  <td>{data.quantity}</td>
                  <td>{data.total}</td>
                </tr>
              ))}
            </CommonTable>
          </Col>
        </Row>
      </Card>
    </Col>
  );
};
