import { UnlockingCreativity } from "@/Constant/constant";
import { useCallback, useState } from "react";

const TabHeader = ({ callbackNav }) => {
  const [modal, setModal] = useState(false);
  const toggle = useCallback(() => {
    setModal(!modal);
  }, [modal]);

  return (
    <div className="customizer-header">
      <i className="icon-close" onClick={() => callbackNav("", false)}></i>
      <h5 className="f-w-700">{UnlockingCreativity}</h5>
    </div>
  );
};

export default TabHeader;
