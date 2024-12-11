"use client";
import React, { useEffect } from "react";
import { Row } from "reactstrap";
import { MobileView } from "./MobileView";
import { HeaderMenu } from "./HeaderMenu/HeaderMenu";
import { RightHeaderSection } from "./RightHeaderSection/RightHeaderSection";
import { useAppSelector } from "@/Redux/Hooks";

const Header = () => {
  const { toggleSidebar } = useAppSelector((state) => state.layout);

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth < 992) {
        document.getElementById("page-headers")?.classList.add("close_icon");
        document
          .getElementById("sidebar-wrappers")
          ?.classList.add("close_icon");
      } else {
        document.getElementById("page-headers")?.classList.remove("close_icon");
        document
          .getElementById("sidebar-wrappers")
          ?.classList.remove("close_icon");
      }
    });
  }, []);

  return (
    <div
      className={`page-header ${toggleSidebar ? "close_icon" : ""}`}
      id="page-headers"
    >
      <Row className="header-wrapper m-0">
        <MobileView />
        <HeaderMenu />
        <RightHeaderSection />
      </Row>
    </div>
  );
};

export default Header;
