import React, { useState } from "react";
import {
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";

export const DropdownWithHeader = ({
  heading,
  dropDownList,
  headerClass,
  headingClass,
  dropDownTitle,
  caret,
  dropDownClass,
  dropDownIcon,
}) => {
  const [open, setOpen] = useState(false);
  const toggle = () => {
    setOpen(!open);
  };

  return (
    <CardHeader className={headerClass ? headerClass : ""}>
      <div className="header-top">
        <h4 className={headingClass ? headingClass : ""}>{heading}</h4>
        <Dropdown
          isOpen={open}
          toggle={toggle}
          className={dropDownClass ? dropDownClass : ""}
        >
          <DropdownToggle
            className="p-0 border border-0"
            color="transparent"
            caret={caret ? true : false}
          >
            {dropDownIcon ? <i className="icon-more-alt" /> : dropDownTitle}
          </DropdownToggle>
          <DropdownMenu end={true}>
            {dropDownList.map((item, index) => (
              <DropdownItem key={index}>{item}</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
    </CardHeader>
  );
};
