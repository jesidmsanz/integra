/* eslint-disable react-hooks/exhaustive-deps */
import SVG from "@/CommonComponent/SVG/Svg";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { handlePined } from "@/Redux/Reducers/LayoutSlice";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const Menulist = ({ menu, setActiveMenu, activeMenu, level }) => {
  const { pinedMenu } = useAppSelector((state) => state.layout);
  const { sidebarIconType } = useAppSelector((state) => state.themeCustomizer);
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  // const { t } = useTranslation("common");

  const ActiveNavLinkUrl = (path, active) => {
    return pathname === path ? (active ? active : true) : "";
  };

  const shouldSetActive = ({ item }) => {
    var returnValue = false;
    if (item?.path === pathname) {
      returnValue = true;
    }
    if (!returnValue && item?.children) {
      item?.children.every((subItem) => {
        returnValue = shouldSetActive({ item: subItem });
        return !returnValue;
      });
    }
    return returnValue;
  };

  useEffect(() => {
    menu?.forEach((item) => {
      let gotValue = shouldSetActive({ item });
      if (gotValue) {
        let temp = [...activeMenu];
        temp[level] = item.title;
        setActiveMenu(temp);
      }
    });
    ActiveNavLinkUrl();
  }, []);

  return (
    <>
      {menu?.map((item, index) => (
        <li
          key={index}
          className={`${level === 0 ? "sidebar-list" : ""} ${
            pinedMenu.includes(item.title || "") ? "pined" : ""
          }  ${
            (item.children
              ? item.children
                  .map((innerItem) => ActiveNavLinkUrl(innerItem.path))
                  .includes(true)
              : ActiveNavLinkUrl(item.path)) || activeMenu[level] === item.title
              ? "active"
              : ""
          } `}
        >
          {level === 0 && (
            <i
              className="fa fa-thumb-tack"
              onClick={() => dispatch(handlePined(item.title))}
            ></i>
          )}
          <Link
            className={`${level === 0 ? "sidebar-link sidebar-title" : ""}  ${
              (item.children
                ? item.children
                    .map((innerItem) => ActiveNavLinkUrl(innerItem.path))
                    .includes(true)
                : ActiveNavLinkUrl(item.path)) ||
              activeMenu[level] === item.title
                ? "active"
                : ""
            }`}
            href={item?.path ? item?.path : "#"}
            onClick={(e) => {
              if (item.children) {
                e.preventDefault();
                const temp = [...activeMenu];
                temp[level] = temp[level] === item.title ? "" : item.title;
                setActiveMenu(temp);
              } else {
                const temp = [...activeMenu];
                temp[level] = item.title;
                setActiveMenu(temp);
              }
            }}
          >
            {item.icon && (
              <SVG
                className={`${sidebarIconType}-icon`}
                iconId={`${sidebarIconType}-${item.icon}`}
              />
            )}
            <span className={item.lanClass && item.lanClass}>{item.title}</span>
            {item.children && (
              <div className="according-menu">
                <i className="fa fa-angle-right" />
              </div>
            )}
          </Link>
          {item.children && (
            <ul
              className={`${
                level / 2 === 0
                  ? "sidebar-submenu"
                  : "submenu-content opensubmegamenu"
              }`}
              style={{
                display: `${
                  (item.children
                    ? item.children
                        .map((innerItem) => ActiveNavLinkUrl(innerItem.path))
                        .includes(true)
                    : ActiveNavLinkUrl(item.path)) ||
                  activeMenu[level] === item.title
                    ? "block"
                    : "none"
                }`,
              }}
            >
              <Menulist
                menu={item.children}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                level={level + 1}
              />
            </ul>
          )}
        </li>
      ))}
    </>
  );
};

export default Menulist;
