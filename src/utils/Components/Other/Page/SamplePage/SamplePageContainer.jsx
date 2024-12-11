"use client";
import Breadcrumbs from "@/CommonComponent/Breadcrumb";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";
import { Page, SampleCard, SamplePage } from "@/Constant/constant";
import { SamplePageData } from "@/Data/Pages/PagesData";
import { Card, CardBody, Col, Container, Row } from "reactstrap";

const SamplePageContainer = () => {
  return (
    <>
      <Breadcrumbs pageTitle={SamplePage} parent={Page} title={SamplePage} />
      <Container fluid>
        <Row>
          <Col sm="12">
            <Card>
              <CommonCardHeader title={SampleCard} subTitle={SamplePageData} />
              <CardBody>
                <p>{`"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`}</p>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SamplePageContainer;
