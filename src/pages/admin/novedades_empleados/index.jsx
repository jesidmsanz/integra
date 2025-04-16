import React from "react";
import RootLayout from "../layout";
import EmployeeNewsListContainer from "@/utils/Components/Admin/EmployeeNews/EmployeeNewsList/EmployeeNewsListContainer";

const EmployeeNews = () => {
  return (
    <RootLayout>
      <EmployeeNewsListContainer />
    </RootLayout>
  );
};

export default EmployeeNews;
