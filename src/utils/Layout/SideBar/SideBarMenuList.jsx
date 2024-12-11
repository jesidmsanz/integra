import { useAppSelector } from "@/Redux/Hooks";
import { Fragment, useState } from "react";
import Menulist from "./Menulist";
import { MenuList } from "@/Data/Layout/Menu";

const SidebarMenuList = () => {
  const [activeMenu, setActiveMenu] = useState([]);
  const { pinedMenu } = useAppSelector((state) => state.layout);
  const shouldHideMenu = (mainMenu) => {
    return mainMenu?.Items?.map((data) => data.title).every((titles) =>
      pinedMenu.includes(titles || "")
    );
  };

  return (
    <>
      {MenuList &&
        MenuList.map((mainMenu, index) => (
          <Fragment key={index}>
            <li
              className={`sidebar-main-title ${
                shouldHideMenu(mainMenu) ? "d-none" : ""
              }`}
            >
              <div>
                <h6 className={mainMenu.lanClass && mainMenu.lanClass}>
                  {mainMenu.title}
                </h6>
              </div>
            </li>
            <Menulist
              menu={mainMenu.Items}
              activeMenu={activeMenu}
              setActiveMenu={setActiveMenu}
              level={0}
            />
          </Fragment>
        ))}
    </>
  );
};

export default SidebarMenuList;
