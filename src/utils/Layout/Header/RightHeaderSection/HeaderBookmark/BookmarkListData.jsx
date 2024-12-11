import SVG from "@/CommonComponent/SVG/Svg";
import { AddNewBookmark, Bookmark } from "@/Constant/constant";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { setBookmark, setFlip } from "@/Redux/Reducers/HeaderBookmarkSlice";
import { useRouter } from "next/navigation";
import { Button, Col, Row } from "reactstrap";

export const BookmarkListData = () => {
  const { bookmarkedData } = useAppSelector((state) => state.headerBookMark);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const handleFlip = () => {
    dispatch(setFlip(true));
  };

  return (
    <div className="front">
      <h6 className="f-18 mb-0 dropdown-title">{Bookmark}</h6>
      <ul className="bookmark-dropdown">
        <li className="custom-scrollbar">
          <Row>
            {bookmarkedData.map((item, index) => (
              <Col xs="4" className="text-center" key={index}>
                <div
                  className="bookmark-content"
                  onClick={() => router.push(`${item.path}`)}
                >
                  <div className="bookmark-icon">
                    <SVG iconId={`stroke-${item.icon}`} />
                  </div>
                  <span>{item.title}</span>
                </div>
              </Col>
            ))}
          </Row>
        </li>
        <li className="text-center m-0" onClick={handleFlip}>
          <Button
            tag="a"
            color="transparent"
            className="txt-primary flip-btn f-w-700"
            id="flip-btn"
          >
            {AddNewBookmark}
          </Button>
        </li>
      </ul>
    </div>
  );
};
