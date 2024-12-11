import { ImagePath } from "@/Constant/constant";
import Image from "next/image";
import { Col } from "reactstrap";

const SearchNotFoundClass = ({ word }) => {
  return (
    <Col sm="12">
      <div>
        <div className="search-not-found text-center p-5">
          <Image
            width={100}
            height={100}
            className="img-100 mb-4"
            src={`${ImagePath}/other-images/sad5.gif`}
            alt=""
            priority
          />
          <p>{`Sorry, Not Found Any ${word}`}</p>
        </div>
      </div>
    </Col>
  );
};

export default SearchNotFoundClass;
