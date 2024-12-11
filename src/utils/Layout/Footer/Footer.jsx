import React from "react";
import { Col, Container, Row } from "reactstrap";

const Footer = () => {
  return (
    <footer className="footer">
      <Container fluid>
        <Row>
          <Col md="6" className="p-0 footer-copyright">
            <p className="mb-0">Copyright 2024 © IT49.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
