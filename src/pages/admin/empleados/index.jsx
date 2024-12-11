import React from "react";
import RootLayout from "../layout";
import EmployeeListContainer from "@/utils/Components/Admin/Employee/EmployeeList/EmployeeListContainer";

const Directory = () => {
  return (
    <RootLayout>
      <EmployeeListContainer />
    </RootLayout>
  );
};

export default Directory;
