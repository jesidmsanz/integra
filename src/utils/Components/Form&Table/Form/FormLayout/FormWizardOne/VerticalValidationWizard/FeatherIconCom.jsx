import * as Icon from "react-feather";

const FeatherIconCom = ({ iconName, className }) => {
  const IconComp = Icon[iconName];
  return <IconComp className={className} />;
};

export default FeatherIconCom;
