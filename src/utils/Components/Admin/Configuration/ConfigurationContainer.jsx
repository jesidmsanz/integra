import React, { useState } from "react";
import { Container, Card, CardBody, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import Breadcrumbs from "@/utils/CommonComponent/Breadcrumb";
import UsersTab from "./UsersTab";
import RolesTab from "./RolesTab";
import PermissionsTab from "./PermissionsTab";

const ConfigurationContainer = () => {
  const [activeTab, setActiveTab] = useState("1");

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <>
      <Breadcrumbs pageTitle="Configuración" parent="Sistema" />
      <Container fluid>
        <Card>
          <CardBody>
            <Nav tabs className="border-tab">
              <NavItem>
                <NavLink
                  className={activeTab === "1" ? "active" : ""}
                  onClick={() => toggle("1")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="icofont icofont-users me-2"></i>
                  Usuarios
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === "2" ? "active" : ""}
                  onClick={() => toggle("2")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="icofont icofont-user-suited me-2"></i>
                  Roles
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === "3" ? "active" : ""}
                  onClick={() => toggle("3")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="icofont icofont-key me-2"></i>
                  Permisos
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab} className="tab-content">
              <TabPane tabId="1">
                <UsersTab />
              </TabPane>
              <TabPane tabId="2">
                <RolesTab />
              </TabPane>
              <TabPane tabId="3">
                <PermissionsTab />
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default ConfigurationContainer;

