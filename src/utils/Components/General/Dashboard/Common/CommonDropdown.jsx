import React, { useState } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";

export const CommonDropdown= ({ dropDownList, dropDownTitle, caret, dropDownClass, dropDownIcon }) => {
  const [open, setOpen] = useState(false);
  const toggle = () => {
    setOpen(!open);
  };

  return (
    <Dropdown isOpen={open} toggle={toggle} className={dropDownClass ? dropDownClass : ""}>
      <DropdownToggle color="transparent" caret={caret ? true : false}>
        {dropDownIcon ? <i className="icon-more-alt" /> : dropDownTitle}
      </DropdownToggle>
      <DropdownMenu end={true}>
        {dropDownList.map((item, index) => (
          <DropdownItem key={index}>{item}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};
