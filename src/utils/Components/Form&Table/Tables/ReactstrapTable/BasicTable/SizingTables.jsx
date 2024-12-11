import { Card, Col, Row } from "reactstrap";
import { SizingTable } from "@/Constant/constant";
import { SizingTableBody, SizingTableData, SizingTableHead } from "@/Data/Form&Table/Table/ReactstrapTable/BasicTable/BasicTableData";
import CommonTable from "./Common/CommonTable";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

export const SizingTables=()=> {
  return (
    <Col sm="12">
      <Card>
        <CommonCardHeader title={SizingTable} subTitle={SizingTableData}/>
        <Row className="card-block">
          <Col sm="12" lg="12" xl="12">
            <CommonTable size="lg" headData={SizingTableHead}>
              {SizingTableBody.map((data) => (
                <tr key={data.id}>
                  <th scope="row">{data.id}</th>
                  <td>{data.employeeName}</td>
                  <td>{data.date}</td>
                  <td className={`font-${data.color}`}>{data.status}</td>
                  <td>{data.hours}</td>
                  <td>{data.performance}</td>
                </tr>
              ))}
            </CommonTable>
          </Col>
        </Row>
      </Card>
    </Col>
  );
}
