import { Stroke } from "@/Constant/constant";
import CommonUL from "./CommonUL";
import { Badge } from "reactstrap";

const StrokeIcon = ({ handleSideBarIconType, sideBarIconType }) => {
  return (
    <li
      data-attr="stroke-svg"
      className={`normal-sidebar border-0 ${
        sideBarIconType === "stroke" ? "active" : ""
      }`}
      onClick={() => handleSideBarIconType("stroke")}
    >
      <div className="header bg-light">
        <CommonUL />
      </div>
      <div className="body bg-light">
        <Badge color="primary">{Stroke}</Badge>
      </div>
    </li>
  );
};

export default StrokeIcon;
