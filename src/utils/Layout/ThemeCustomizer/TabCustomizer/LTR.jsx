import { LTRBadges } from "@/Constant/constant";
import CommonUL from "./CommonUL";
import { Badge } from "reactstrap";

const LTR = ({ handleLayout, layout_type }) => {
  return (
    <li
      data-attr="ltr"
      className={`${layout_type === "ltr" ? "active" : ""}`}
      onClick={() => {
        handleLayout("ltr");
      }}
    >
      <div className="header bg-light">
        <CommonUL />
      </div>
      <div className="body">
        <ul>
          <li className="bg-light sidebar"></li>
          <li className="bg-light body">
            <Badge color="primary">{LTRBadges}</Badge>
          </li>
        </ul>
      </div>
    </li>
  );
};

export default LTR;
