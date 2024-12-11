"use client";
import SVG from "@/CommonComponent/SVG/Svg";
import { SearchHere } from "@/Constant/constant";
import { MenuList } from "@/Data/Layout/Menu";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { setResponsiveSearch } from "@/Redux/Reducers/LayoutSlice";
import { ChangeEvent, useEffect, useState } from "react";
import ResponsiveSearchList from "./ResponsiveSearchList";

export const ResponsiveHeaderSearch = () => {
  const [arr, setArr] = useState([]);
  const [searchedWord, setSearchedWord] = useState("");
  const [searchedArray, setSearchedArray] = useState([]);
  const { responsiveSearch } = useAppSelector((state) => state.layout);
  const dispatch = useAppDispatch();
  const toggleShow = () => dispatch(setResponsiveSearch());

  useEffect(() => {
    const suggestionArray = [];
    const getAllLink = (item, icon) => {
      if (item.children) {
        item.children.forEach((ele) => {
          getAllLink(ele, icon);
        });
      } else {
        suggestionArray.push({
          icon: icon,
          title: item.title,
          path: item.path || "",
        });
      }
    };
    MenuList?.forEach((item) => {
      item.Items?.forEach((child) => {
        getAllLink(child, child.icon);
      });
    });
    setArr(suggestionArray);
  }, []);

  const handleSearch = (e) => {
    if (!searchedWord) setSearchedWord("");
    setSearchedWord(e.target.value);
    let data = [...arr];
    let result = data.filter((item) =>
      item.title?.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setSearchedArray(result);
  };

  return (
    <li className="serchinput">
      <div className="serchbox" onClick={toggleShow}>
        <SVG iconId="fill-search" />
      </div>
      <div
        className={`form-group search-form ${responsiveSearch ? "open" : ""}`}
      >
        <input
          value={searchedWord}
          onChange={(e) => handleSearch(e)}
          type="text"
          className="shadow-none"
          placeholder={SearchHere}
        />
      </div>
      <div
        className={`Typeahead-menu header-menu custom-scrollbar ${
          searchedWord.length && responsiveSearch ? "is-open" : ""
        }`}
      >
        <ResponsiveSearchList
          searchedArray={searchedArray}
          setSearchedWord={setSearchedWord}
        />
      </div>
    </li>
  );
};
