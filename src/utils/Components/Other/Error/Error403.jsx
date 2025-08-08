"use client";
import { Error3 } from "@/Data/Pages/PagesSvgIcons.tsx";
import { useRouter } from "next/navigation";
import { Button, Col, Container } from "reactstrap";

const Error403Container = () => {
  const BackToHomePage = "BACK TO HOME PAGE";
  const router = useRouter();

  return (
    <div className="page-wrapper compact-wrapper" id="pageWrapper">
      <div className="error-wrapper">
        <Container>
          <div className="svg-wrraper">
            <Error3 />
          </div>
          <Col md="8" className="offset-md-2">
            <h3>{"Page Not Found"}</h3>
            <p className="sub-content">
              {
                "The page you are attempting to reach is currently not available. This may be because the page does not exist or has been moved."
              }
            </p>
            <Button tag="a" color="primary" onClick={() => router.back()}>
              {BackToHomePage}
            </Button>
          </Col>
        </Container>
      </div>
    </div>
  );
};

export default Error403Container;
