import { MaximumAge, MinimumAge } from "@/Constant/constant";
import { Input } from "reactstrap";

const TableSearchBar = ({ handleMinAgeChange, handleMaxAgeChange }) => {
  return (
    <div className="table-responsive dataTables_wrapper me-0 custom-scrollbar">
      <table>
        <tbody className="dataTables_filter">
          <tr>
            <td>{MinimumAge}</td>
            <td>
              <Input
                onChange={handleMinAgeChange}
                type="search"
                name="minValue"
              />
            </td>
          </tr>
          <tr>
            <td>{MaximumAge}</td>
            <td>
              <Input
                onChange={handleMaxAgeChange}
                type="search"
                name="maxValue"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TableSearchBar;
