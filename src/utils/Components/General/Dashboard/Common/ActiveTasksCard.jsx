import {
  ActiveTasksData,
  MonthlyDropdownList,
} from "@/Data/General/Dashboard/DashboardData";
import React, { useState } from "react";
import { Card, CardBody, FormGroup, Input, Label } from "reactstrap";
import { DropdownWithHeader } from "./DropdownWithHeader";
import { ActiveTasksTitle, Href } from "@/Constant/constant";
import Link from "next/link";
import SVG from "@/CommonComponent/SVG/Svg";

export const ActiveTasksCard = ({ colClass }) => {
  const [tasks, setTasks] = useState(ActiveTasksData);

  const handleDelete = (itemId) => {
    const updatedTasks = tasks.filter((task) => task.id !== itemId);
    setTasks(updatedTasks);
  };

  return (
    <div className={colClass}>
      <Card>
        <DropdownWithHeader
          headerClass="card-no-border pb-0"
          heading={ActiveTasksTitle}
          dropDownList={MonthlyDropdownList}
          dropDownClass="icon-dropdown"
          dropDownIcon={true}
        />
        <CardBody className="active-task">
          <ul>
            {tasks.map((item) => (
              <li
                className={`d-flex ${item.id === 1 ? "pt-0" : ""}`}
                key={item.id}
              >
                <div className="flex-shrink-0">
                  <FormGroup check>
                    <Input type="checkbox" value="" />
                    <Label check></Label>
                  </FormGroup>
                </div>
                <div className="flex-grow-1">
                  <Link href="/app/todo">
                    <h5>{item.title}</h5>
                  </Link>
                  <p>{item.text}</p>
                </div>
                <span
                  className="delete-option"
                  onClick={() => handleDelete(item.id)}
                >
                  <Link href={Href} onClick={(e) => e.preventDefault()}>
                    <SVG className="remove" iconId="Delete" />
                  </Link>
                </span>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </div>
  );
};
