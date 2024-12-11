import SVG from "@/CommonComponent/SVG/Svg";
import { Back, Href } from "@/Constant/constant";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import {
  handleBookmarkChange,
  setBookmark,
  setFlip,
} from "@/Redux/Reducers/HeaderBookmarkSlice";
import Link from "next/link";
import { useState } from "react";
import { Button, Input } from "reactstrap";

export const BookmarkBack = () => {
  const dispatch = useAppDispatch();
  const { linkItemsArray } = useAppSelector((store) => store.headerBookMark);
  const [searchedItems, setSearchedItems] = useState([]);
  const [searchWord, setSearchWord] = useState("");

  const searchItems = (e) => {
    let copyArray = [...linkItemsArray];
    let result = copyArray.filter((item, i) =>
      item.title?.toLowerCase().includes(e.toLowerCase())
    );
    setSearchedItems(result);
  };

  const handleBackButton = () => {
    dispatch(setFlip(false));
    dispatch(setBookmark(true));
    setSearchWord("");
  };

  const bookMarkInputChange = (e) => {
    setSearchWord(e.target.value);
    searchItems(e.target.value);
  };

  return (
    <div className="back">
      <ul>
        <li>
          <div className="bookmark-dropdown flip-back-content">
            <Input
              type="text"
              placeholder="search..."
              onChange={(e) => bookMarkInputChange(e)}
              value={searchWord}
            />
          </div>
          <div
            className={`filled-bookmark Typeahead-menu  ${
              searchWord ? "is-open" : ""
            } custom-scrollbar`}
          >
            {searchedItems?.map((item, i) => (
              <div key={i} className="ProfileCard u-cf">
                <div className="ProfileCard-avatar">
                  <SVG iconId={`stroke-${item.icon}`} />
                </div>
                <div className="ProfileCard-details">
                  <div className="ProfileCard-realName">
                    <Link href={Href} color="transparent" className="realname">
                      {item.title}
                    </Link>
                    <span className="pull-right">
                      <a href={Href}>
                        <i
                          onClick={() =>
                            dispatch(
                              handleBookmarkChange(linkItemsArray[item.id - 1])
                            )
                          }
                          className={`fa fa-star-o mt-1 icon-star ${
                            linkItemsArray[item.id - 1].bookmarked
                              ? "starred"
                              : ""
                          }`}
                        ></i>
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {!searchedItems.length && <p>Opps!! There are no result found.</p>}
          </div>
        </li>
        <li onClick={handleBackButton}>
          <Button
            tag="a"
            color="transparent"
            className="txt-primary f-w-700 d-block flip-back"
            id="flip-back"
          >
            {Back}
          </Button>
        </li>
      </ul>
    </div>
  );
};
