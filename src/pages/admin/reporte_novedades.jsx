import React from "react";
import NewsStatusReport from "@/utils/Components/Admin/Liquidation/NewsStatusReport";
import Breadcrumbs from "@/utils/CommonComponent/Breadcrumb";

const ReporteNovedades = () => {
  return (
    <>
      <Breadcrumbs pageTitle="Reporte de Estados de Novedades" parent="Liquidación" />
      <NewsStatusReport />
    </>
  );
};

export default ReporteNovedades;
