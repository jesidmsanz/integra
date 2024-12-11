"use client";
import SVG from "@/CommonComponent/SVG/Svg";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { setBookmark } from "@/Redux/Reducers/HeaderBookmarkSlice";
import { BookmarkBack } from "./BookmarkBack";
import { BookmarkListData } from "./BookmarkListData";

export const HeaderBookmark = () => {
  const { flip, bookmark } = useAppSelector((state) => state.headerBookMark);
  const dispatch = useAppDispatch();

  return (
    <li
      className="onhover-dropdown"
      onClick={() => dispatch(setBookmark(!bookmark))}
    >
      <SVG iconId="fill-star" />
      <div
        className={`onhover-show-div bookmark-flip ${
          bookmark || flip ? "active" : ""
        }`}
      >
        <div className="flip-card">
          <div className={`flip-card-inner ${flip ? "flipped" : ""}`}>
            <BookmarkListData />
            <BookmarkBack />
          </div>
        </div>
      </div>
    </li>
  );
};
