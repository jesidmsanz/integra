import DataTable from "react-data-table-component";
import { Card, CardBody, Col, Input, Label } from "reactstrap";
import { ChildrenRowsTitle, SearchTableButton } from "@/Constant/constant";
import CustomExpandableComponent from "./CustomExpandableComponent";
import {
  ChildRowColumn,
  ChildRowData,
} from "@/Data/Form&Table/Table/DataTable/ChildRowsData";
import { ZeroConfigurationData } from "@/Data/Form&Table/Table/DataTable/ZeroConfiguration";
import { useMemo, useState } from "react";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

const ChildRows = () => {
  const [filterText, setFilterText] = useState("");

  const filteredItems = ZeroConfigurationData.filter(
    (item) =>
      item.office &&
      item.office.toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div
        id="API-chield-row_filter"
        className="dataTables_filter d-flex align-items-center"
      >
        <Label className="me-2">{SearchTableButton}:</Label>
        <Input
          onChange={(e) =>
            setFilterText(e.target.value)
          }
          type="search"
          value={filterText}
        />
      </div>
    );
  }, [filterText]);

  return (
    <Col sm="12">
      <Card>
        <CommonCardHeader title={ChildrenRowsTitle} subTitle={ChildRowData} />
        <CardBody>
          <div className="table-responsive">
            <div id="API-chield-row">
              <DataTable
                data={filteredItems}
                columns={ChildRowColumn}
                pagination
                expandableRows
                expandableRowsComponent={CustomExpandableComponent}
                striped
                highlightOnHover
                className="display custom-scrollbar"
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

export default ChildRows;
