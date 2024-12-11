import { CustomFilteringSearch } from "@/Constant/constant";
import {
  CustomFilteringList,
  FilteringTableColumn,
  FilteringTableData,
} from "@/Data/Form&Table/Table/DataTable/CustomFilteringData";
import { ChangeEvent, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Card, CardBody, Col } from "reactstrap";
import TableSearchBar from "./TableSearchBar";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

const CustomFiltering = () => {
  const [data, setData] = useState(FilteringTableData);
  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(100);

  useEffect(() => {
    const filteredData = FilteringTableData.filter((item) => {
      const age = item.age;
      return age >= minAge && age <= maxAge;
    });

    setData(filteredData);
  }, [minAge, maxAge]);

  const handleMinAgeChange = (event) => {
    setMinAge(parseInt(event.target.value, 10));
  };

  const handleMaxAgeChange = (event) => {
    setMaxAge(parseInt(event.target.value, 10));
  };

  return (
    <Col sm="12">
      <Card>
        <CommonCardHeader
          title={CustomFilteringSearch}
          subTitle={CustomFilteringList}
        />
        <CardBody>
          <TableSearchBar
            handleMinAgeChange={handleMinAgeChange}
            handleMaxAgeChange={handleMaxAgeChange}
          />
          <div className="table-responsive user-datatable">
            <div id="datatable-range_wrapper" className="dataTables_wrapper">
              <DataTable
                className="custom-scrollbar"
                data={data}
                columns={FilteringTableColumn}
                striped
                highlightOnHover
                pagination
              />
            </div>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default CustomFiltering;
