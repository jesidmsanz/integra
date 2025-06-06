import { useCallback, useState } from "react";
import DataTable from "react-data-table-component";
import { Button, Card, CardBody, Col } from "reactstrap";
import RowSelectionAndDeletionHeader from "./RowSelectionAndDeletionHeader";
import { DeleteSelectDataButton } from "@/Constant/constant";
import {
  DeleteDataColumn,
  DeleteRowDataList,
} from "@/Data/Form&Table/Table/DataTable/RowSelectionAndDeletionData";

const RowSelectionAndDeletion = () => {
  const [data, setData] = useState(DeleteRowDataList);
  const [selectedRows, setSelectedRows] = useState < any > [];
  const [toggleCleared, setToggleCleared] = useState(false);
  const handleRowSelected = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);
  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete:\r ${selectedRows.map((r) => r.name)}?`
      )
    ) {
      setToggleCleared(!toggleCleared);
      setData(
        data.filter((item) =>
          selectedRows.filter((elem) => elem.id === item.id).length > 0
            ? false
            : true
        )
      );
      setSelectedRows("");
    }
  };
  return (
    <Col sm="12">
      <Card>
        <RowSelectionAndDeletionHeader />
        <CardBody>
          <div className="table-responsive">
            {selectedRows.length !== 0 && (
              <Button color="secondary" onClick={handleDelete} className="mb-3">
                {DeleteSelectDataButton}
              </Button>
            )}
            <div id="row-select-delete">
              <DataTable
                data={data}
                columns={DeleteDataColumn}
                striped
                highlightOnHover
                pagination
                selectableRows
                onSelectedRowsChange={handleRowSelected}
                clearSelectedRows={toggleCleared}
                className="display custom-scrollbar"
              />
            </div>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default RowSelectionAndDeletion;
