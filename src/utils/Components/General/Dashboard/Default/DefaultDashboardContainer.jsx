"use client";
import Breadcrumbs from "@/CommonComponent/Breadcrumb";
import { useSession } from "next-auth/react";
import React from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";

const DefaultDashboardContainer = () => {
  const { data: session } = useSession();
  const userName = session?.user?.firstName || session?.user?.Email || "Usuario";

  return (
    <>
      <Breadcrumbs
        pageTitle="Dashboard"
        parent="Dashboard"
        title="Bienvenido"
      />
      <Container fluid>
        <Row>
          <Col md="12">
            <Card style={{ 
              background: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '10px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              <CardBody style={{ padding: '40px' }}>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="flex-grow-1">
                    <h1 style={{ color: '#333', fontSize: '2.5rem', marginBottom: '15px', fontWeight: '600' }}>
                      ¡Bienvenido, {userName}!
                    </h1>
                  </div>
                  <div className="flex-shrink-0 ms-4">
                    <div style={{
                      width: '120px',
                      height: '120px',
                      background: '#f0f0f0',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '3rem',
                      color: '#667eea'
                    }}>
                      <i className="fa fa-user"></i>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default DefaultDashboardContainer;
