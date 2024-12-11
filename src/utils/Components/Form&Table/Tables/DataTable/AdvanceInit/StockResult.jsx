import { Card, CardBody, CardHeader, Col, Input, Label } from "reactstrap";
import DataTable from "react-data-table-component";
import { SearchTableButton, StockResultTitle } from "@/Constant/constant";
import {
  StockResultColumn,
  StockResultData,
  StockResultList,
} from "@/Data/Form&Table/Table/DataTable/StockResultData";
import { useMemo, useState } from "react";

const StockResult = () => {
  const [filterText, setFilterText] = useState("");

  const filteredItems = StockResultData.filter((item) =>
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
        id="stock_filter"
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
          <h4>{StockResultTitle}</h4>
          {StockResultList.map((item, index) => (
            <span dangerouslySetInnerHTML={{ __html: item }} key={index} />
          ))}
        </CardHeader>
        <CardBody>
          <div className="table-responsive custom-scrollbar">
            <div id="stock_wrapper" className="dataTables_wrapper">
              <DataTable
                data={filteredItems}
                columns={StockResultColumn}
                striped
                fixedHeader
                fixedHeaderScrollHeight="50vh"
                className="display dataTable custom-scrollbar"
                subHeader
                subHeaderComponent={subHeaderComponentMemo}
              />
            </div>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default StockResult;
