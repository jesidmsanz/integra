import { Card, Col, Row } from "reactstrap";
import { StripedRowWithInverseTables } from "@/Constant/constant";
import {
  StripedRowBody,
  StripedRowData,
  StripedRowHead,
} from "@/Data/Form&Table/Table/ReactstrapTable/BasicTable/BasicTableData";
import CommonTable from "./Common/CommonTable";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

export const StripedRowInverseTable = () => {
  return (
    <Col sm="6">
      <Card>
        <CommonCardHeader
          title={StripedRowWithInverseTables}
          subTitle={StripedRowData}
        />
        <Row className="card-block">
          <Col sm="12" lg="12" xl="12">
            <CommonTable
              strip
              tableClass="table-inverse"
              headData={StripedRowHead}
            >
              {StripedRowBody.map((data) => (
                <tr key={data.id}>
                  <th scope="row">{data.id}</th>
                  <td>{data.dessert}</td>
                  <td>{data.calories}</td>
                  <td>{data.fat}</td>
                  <td>{data.price}</td>
                </tr>
              ))}
            </CommonTable>
          </Col>
        </Row>
      </Card>
    </Col>
  );
};
