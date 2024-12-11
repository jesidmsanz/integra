import React from "react";

const SVG = (props) => {
  const { iconId, style, ...res } = props;
  return (
    <svg {...res} style={style}>
      <use href={`/assets/svg/icon-sprite.svg#${iconId}`}></use>
    </svg>
  );
};

export default SVG;
