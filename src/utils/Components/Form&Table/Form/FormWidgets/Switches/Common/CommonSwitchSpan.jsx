import { Input, Label } from "reactstrap";

const CommonSwitchSpan = ({ color, defaultChecked }) => {
  return (
    <Label className="switch mb-0">
      <Input type="checkbox" defaultChecked={defaultChecked} />
      <span className={`switch-state bg-${color}`}></span>
    </Label>
  );
};

export default CommonSwitchSpan;
