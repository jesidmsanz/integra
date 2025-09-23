import React from "react";
import RootLayout from "./layout";
import NewsStatusReport from "@/utils/Components/Admin/Liquidation/NewsStatusReport";
import Breadcrumbs from "@/utils/CommonComponent/Breadcrumb";

const ReporteNovedades = () => {
  return (
    <RootLayout>
      <Breadcrumbs pageTitle="Reporte de Estados de Novedades" parent="Liquidación" />
      <NewsStatusReport />
    </RootLayout>
  );
};

export default ReporteNovedades;
