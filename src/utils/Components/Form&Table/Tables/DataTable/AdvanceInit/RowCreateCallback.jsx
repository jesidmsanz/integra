import { RowCreateCallBackSpan, SearchTableButton } from "@/Constant/constant";
import {
  RowCreateCallData,
  RowCreateCallList,
  RowCreateCallColumn,
} from "@/Data/Form&Table/Table/DataTable/RowCreateCallbackData";
import { useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { Card, CardBody, CardHeader, Col, Input, Label } from "reactstrap";

const RowCreateCallback = () => {
  const [filterText, setFilterText] = useState("");

  const filteredItems = RowCreateCallList.filter((item) =>
    Object.values(item).some(
      (value) =>
        value &&
        typeof value === "string" &&
        value.toLowerCase().includes(filterText.toLowerCase())
    )
  );

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div
        id="row_create_filter"
        className="dataTables_filter d-flex align-items-center"
      >
        <Label className="me-1">{SearchTableButton}:</Label>
        <Input
          onChange={(e) => setFilterText(e.target.value)}
          type="search"
          value={filterText}
        />
      </div>
    );
  }, [filterText]);

  return (
    <Col sm="12">
      <Card>
        <CardHeader className="pb-0 card-no-border">
          <h4>{RowCreateCallBackSpan}</h4>
          {RowCreateCallData.map((item, index) => (
            <span key={index}>{item}</span>
          ))}
        </CardHeader>
        <CardBody>
          <div className="table-responsive custom-scrollbar" id="row_create">
            <DataTable
              data={filteredItems}
              columns={RowCreateCallColumn}
              highlightOnHover
              striped
              pagination
              className="display dataTable custom-scrollbar"
              subHeader
              subHeaderComponent={subHeaderComponentMemo}
            />
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default RowCreateCallback;
