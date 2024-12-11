"use client";
import React from "react";
import { Container, Row } from "reactstrap";
import ClipboardOnTextInput from "./ClipboardOnTextInput";
import ClipboardOnTextarea from "./ClipboardOnTextarea";
import ClipboardOnParagraph from "./ClipboardOnParagraph";
import CopyPortionFromParagraph from "./CopyPortionFromParagraph";
import { Clipboard, FormWidgets } from "@/Constant/constant";
import Breadcrumbs from "@/CommonComponent/Breadcrumb";

const ClipBoardContainer = () => {
  return (
    <>
      <Breadcrumbs
        pageTitle={Clipboard}
        parent={FormWidgets}
        title={Clipboard}
      />
      <Container fluid>
        <Row>
          <ClipboardOnTextInput />
          <ClipboardOnTextarea />
          <ClipboardOnParagraph />
          <CopyPortionFromParagraph />
        </Row>
      </Container>
    </>
  );
};

export default ClipBoardContainer;
