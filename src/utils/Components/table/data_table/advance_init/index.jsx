"use client";
import React, { useEffect, useState } from "react";

const AdvanceInit = () => {
  const [MyAwesomeMap, setClient] = useState();
  useEffect(() => {
    (async () => {
      if (typeof window !== "undefined") {
        const newClient = (
          await import(
            "@/Components/Form&Table/Tables/DataTable/AdvanceInit/AdvanceInitContainer"
          )
        ).default;
        setClient(() => newClient);
      }
    })();
  }, []);
  return MyAwesomeMap ? <MyAwesomeMap /> : "";
};

export default AdvanceInit;
