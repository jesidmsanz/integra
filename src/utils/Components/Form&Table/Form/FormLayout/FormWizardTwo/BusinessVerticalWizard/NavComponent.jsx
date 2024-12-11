import { BusinessVerticalData } from "@/Data/Form&Table/Form/FormData";
import { Nav, NavItem, NavLink } from "reactstrap";

const NavComponent = ({ callbackActive, activeTab }) => {
  const handleTab = (id) => {
    if (id !== undefined) callbackActive(id);
  };

  return (
    <Nav className="nav-pills horizontal-options">
      {BusinessVerticalData.map((data, index) => (
        <NavItem key={index}>
          <NavLink
            className={`${activeTab === index + 1 ? "active" : ""}`}
            onClick={() => handleTab(data.activeTab)}
          >
            <div className="horizontal-wizard">
              <div className="stroke-icon-wizard">
                <span>{index + 1}</span>
              </div>
              <div className="horizontal-wizard-content business-wizard">
                <h6>{data.title}</h6>
              </div>
            </div>
          </NavLink>
        </NavItem>
      ))}
    </Nav>
  );
};

export default NavComponent;
