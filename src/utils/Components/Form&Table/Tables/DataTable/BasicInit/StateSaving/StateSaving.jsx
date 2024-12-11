import DataTable from "react-data-table-component";
import { Card, CardBody, Col, Input, Label } from "reactstrap";
import { StateSavingCardHeader } from "./StateSavingCardHeader";
import { useMemo, useState } from "react";
import {
  StateSavingColumns,
  StateSavingDataList,
} from "@/Data/Form&Table/Table/DataTable/StateSavingData";
import { SearchTableButton } from "@/Constant/constant";

const StateSaving = () => {
  const [filterText, setFilterText] = useState("");
  const [filteredItems, setFilteredItems] = useState(StateSavingDataList);

  const handleFilterChange = (text) => {
    setFilterText(text);

    if (text.length > 0) {
      const filteredData = StateSavingDataList.filter((item) => {
        return Object.values(item).some((value) => {
          if (typeof value === "string") {
            return value.toLowerCase() === text.toLowerCase();
          } else if (typeof value === "number") {
            return value.toString() === text;
          }
          return false;
        });
      });
      setFilteredItems(filteredData);
    } else {
      setFilteredItems(StateSavingDataList);
    }
  };

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div
        id="basic-9_filter"
        className="dataTables_filter d-flex align-items-center"
      >
        <Label className="me-2">{SearchTableButton}:</Label>
        <Input
          onChange={(e) => {
            handleFilterChange(e.target.value);
          }}
          type="search"
          value={filterText}
        />
      </div>
    );
  }, [filterText]);

  return (
    <Col sm="12">
      <Card>
        <StateSavingCardHeader />
        <CardBody>
          <div className="table-responsive state-saving">
            <DataTable
              className="custom-scrollbar"
              data={filteredItems}
              columns={StateSavingColumns}
              striped
              pagination
              subHeader
              subHeaderComponent={subHeaderComponentMemo}
            />
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default StateSaving;
