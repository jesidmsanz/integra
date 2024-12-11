import { Card, Col, Row } from "reactstrap";
import { TableHeadOption } from "@/Constant/constant";
import {
  TableHeadOptionBody,
  TableHeadOptionData,
  TableHeadOptionHead,
} from "@/Data/Form&Table/Table/ReactstrapTable/BasicTable/BasicTableData";
import CommonTable from "./Common/CommonTable";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

export const TableHeadOptions = () => {
  return (
    <Col sm="6">
      <Card>
        <CommonCardHeader
          title={TableHeadOption}
          subTitle={TableHeadOptionData}
        />
        <Row className="card-block">
          <Col sm="12" lg="12" xl="12">
            <CommonTable headClass="table-dark" headData={TableHeadOptionHead}>
              {TableHeadOptionBody.map((data) => (
                <tr key={data.id}>
                  <th scope="row">{data.id}</th>
                  <td>{data.firstName}</td>
                  <td>{data.lastName}</td>
                  <td>{data.userName}</td>
                </tr>
              ))}
            </CommonTable>
          </Col>
        </Row>
      </Card>
    </Col>
  );
};
