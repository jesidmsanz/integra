"use client";
import React, { Fragment } from "react";
import { FolderPlus } from "react-feather";
import Link from "next/link";
import { FolderPlusData } from "@/Data/Layout/LayoutData";

export const MobileHeaderMenu = () => {
  return (
    <ul className="app-list">
      <li className="onhover-dropdown">
        <div className="app-menu">
          <FolderPlus />
        </div>
        <ul className="onhover-show-div left-dropdown active">
          {FolderPlusData.map((data) => (
            <Fragment key={data.id}>
              <li>
                <Link href={data.link}>{data.text}</Link>
              </li>
            </Fragment>
          ))}
        </ul>
      </li>
    </ul>
  );
};
