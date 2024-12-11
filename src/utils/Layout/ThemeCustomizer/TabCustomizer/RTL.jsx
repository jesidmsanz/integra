import { RTLBadges } from "@/Constant/constant";
import CommonUL from "./CommonUL";
import { Badge } from "reactstrap";

const RTL = ({ handleLayout, layout_type }) => {
  return (
    <li
      data-attr="rtl"
      className={`${layout_type === "rtl" ? "active" : ""}`}
      onClick={() => handleLayout("rtl")}
    >
      <div className="header bg-light">
        <CommonUL />
      </div>
      <div className="body">
        <ul>
          <li className="bg-light body">
            <Badge color="primary">{RTLBadges}</Badge>
          </li>
          <li className="bg-light sidebar"></li>
        </ul>
      </div>
    </li>
  );
};

export default RTL;
