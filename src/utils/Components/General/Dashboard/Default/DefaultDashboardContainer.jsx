"use client";
import Breadcrumbs from "@/CommonComponent/Breadcrumb";
import {
  DashboardTitle,
  DefaultDashboardTitle,
  DefaultTitle,
} from "@/Constant/constant";
// import { directoriesApi } from "@/utils/api";
import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { useAppSelector } from "@/Redux/Hooks";
import { Error1 } from "@/Data/Pages/PagesSvgIcons.tsx";

const DefaultDashboardContainer = () => {
  const exampleGet = async () => {
    try {
      // const result = await directoriesApi.list(1, 5);
      // console.log("result :>> ", result);
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  // useEffect(() => {
  //   exampleGet();
  // }, []);
  return (
    <>
      <Breadcrumbs
        pageTitle={DashboardTitle}
        parent={DashboardTitle}
        title={DefaultTitle}
      />
      <div className="page-wrapper compact-wrapper" id="pageWrapper">
        <div className="error-wrapper">
          <Container className="default-dashboard" fluid>
            <div className="svg-wrraper">
              <Error1 />
            </div>
            <Col md="8" className="offset-md-2">
              <h1>En Construcción</h1>
              {/* <p className="sub-content">
                {
                  "Parece que estás intentando acceder a una página que no está disponible. Esto puede deberse a que no has iniciado sesión o que la página ha sido movida o no existe."
                }
              </p> */}
            </Col>
          </Container>
        </div>
      </div>
    </>
  );
};

export default DefaultDashboardContainer;
