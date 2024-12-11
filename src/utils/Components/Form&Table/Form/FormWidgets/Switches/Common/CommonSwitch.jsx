import { Input, Label } from "reactstrap";

const CommonSwitch = ({ defaultChecked, color, disabled }) => {
  return (
    <Label className="form-switch form-check-inline" check>
      <Input
        className={`switch-${color} check-size`}
        type="checkbox"
        role="switch"
        defaultChecked={defaultChecked}
        disabled={disabled}
      />
    </Label>
  );
};

export default CommonSwitch;
