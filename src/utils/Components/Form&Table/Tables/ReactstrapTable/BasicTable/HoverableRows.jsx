import { Card, Col } from "reactstrap";
import { HoverableRowsWithHorizontalBorders } from "@/Constant/constant";
import {
  HoverableRowBody,
  HoverableRowData,
  HoverableRowHead,
} from "@/Data/Form&Table/Table/ReactstrapTable/BasicTable/BasicTableData";
import CommonTable from "./Common/CommonTable";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

export const HoverableRows = () => {
  return (
    <Col sm="12">
      <Card className="hoverable-table">
        <CommonCardHeader
          title={HoverableRowsWithHorizontalBorders}
          subTitle={HoverableRowData}
        />
        <CommonTable
          tableClass="signal-table"
          headData={HoverableRowHead}
          hover
        >
          {HoverableRowBody.map((data) => (
            <tr key={data.id}>
              <th scope="row">{data.id}</th>
              <td className="d-flex align-items-center">
                {data.icon}
                <span className={`font-${data.color}`}>{data.status}</span>
              </td>
              <td>{data.signalName}</td>
              <td>{data.security}</td>
              <td>{data.stage}</td>
              <td>{data.schedule}</td>
              <td>{data.teamLead}</td>
            </tr>
          ))}
        </CommonTable>
      </Card>
    </Col>
  );
};
