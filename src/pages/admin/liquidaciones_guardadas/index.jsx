import React from "react";
import RootLayout from "../layout";
import LiquidationsDashboard from "@/utils/Components/Admin/Liquidation/LiquidationDashboard";

const LiquidacionesGuardadas = () => {
  return (
    <RootLayout>
      <LiquidationsDashboard />
    </RootLayout>
  );
};

export default LiquidacionesGuardadas;
