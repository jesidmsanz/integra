/* eslint-disable @next/next/no-img-element */
import { ImagePath, WeAreComingSoon } from "@/Constant/constant";
import { Container } from "reactstrap";
import CountdownData from "./CountdownData";

const ComingSoonBgImageContainer = () => {
  return (
    <div className="page-wrapper compact-wrapper">
      <Container fluid className="p-0 m-0">
        <div className="comingsoon comingsoon-bgimg">
          <div className="comingsoon-inner text-center">
            <img src={`${ImagePath}/logo/logo-1.svg`} alt="coming soon" />
            <h5>{WeAreComingSoon}</h5>
            <div className="countdown" id="clockdiv">
              <CountdownData />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ComingSoonBgImageContainer;
