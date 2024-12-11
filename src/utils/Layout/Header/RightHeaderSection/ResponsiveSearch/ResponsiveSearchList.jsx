import SVG from "@/CommonComponent/SVG/Svg";
import { useAppDispatch } from "@/Redux/Hooks";
import { setResponsiveSearch } from "@/Redux/Reducers/LayoutSlice";
import Link from "next/link";

const ResponsiveSearchList = ({ searchedArray, setSearchedWord }) => {
  const dispatch = useAppDispatch();

  const handleSearch = () => {
    setSearchedWord("");
    dispatch(setResponsiveSearch());
  };

  return (
    <>
      {searchedArray?.map((item, index) => (
        <div className="ProfileCard u-cf" key={index}>
          <div className="ProfileCard-details ps-2">
            <div className="ProfileCard-realName">
              <Link
                className="realname  w-auto d-flex justify-content-start gap-2"
                href={`${item.path}`}
                onClick={handleSearch}
              >
                <SVG iconId={`fill-${item.icon}`} />
                {item.title}
              </Link>
            </div>
          </div>
        </div>
      ))}
      {!searchedArray?.length && <p>Opps!! There are no result found.</p>}
    </>
  );
};

export default ResponsiveSearchList;
