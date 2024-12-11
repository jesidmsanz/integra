import React from "react";
import RootLayout from "../layout";
import CompanyListContainer from "@/utils/Components/Admin/Company/CompanyList/CompanyListContainer";

const Company = () => {
  return (
    <RootLayout>
      <CompanyListContainer />
    </RootLayout>
  );
};

export default Company;
