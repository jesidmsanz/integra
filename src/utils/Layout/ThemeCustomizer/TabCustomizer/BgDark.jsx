import CommonUL from "./CommonUL";
import React from "react";

const BgDark = ({ handleCustomizerMix_Background, mixLayout }) => {
  return (
    <li
      className={`color-layout ${mixLayout === "dark-only" ? "active" : ""}`}
      data-attr="dark-only"
      onClick={() => handleCustomizerMix_Background("dark-only")}
    >
      <div className="header bg-dark">
        <CommonUL />
      </div>
      <div className="body">
        <ul>
          <li className="bg-dark sidebar"></li>
          <li className="bg-dark body"> </li>
        </ul>
      </div>
    </li>
  );
};

export default BgDark;
