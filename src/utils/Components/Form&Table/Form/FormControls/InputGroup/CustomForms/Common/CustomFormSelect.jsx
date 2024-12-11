import { Input } from "reactstrap";

const CustomFormSelect = ({ inputId, options, title }) => {
  return (
    <Input type="select" id={inputId}>
      <option defaultValue="">{title}</option>
      {options.map((item, i) => (
        <option key={i} value={i}>
          {item}
        </option>
      ))}
    </Input>
  );
};

export default CustomFormSelect;
