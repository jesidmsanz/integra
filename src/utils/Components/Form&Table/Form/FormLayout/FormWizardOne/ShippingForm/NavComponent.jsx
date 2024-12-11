import { ShippingNavData } from "@/Data/Form&Table/Form/FormData";
import { Nav, NavItem, NavLink } from "reactstrap";

const NavComponent = ({ callbackActive, activeTab }) => {
  const handleTab = (id) => {
    if (id !== undefined) {
      callbackActive(id);
    }
  };

  return (
    <Nav className="nav-pills horizontal-options shipping-options">
      {ShippingNavData.map((data, index) => (
        <NavItem className="w-100" key={index}>
          <NavLink
            className={`b-r-0 ${activeTab === index + 1 ? "active" : ""}`}
            onClick={() => handleTab(data.activeTab)}
          >
            <div className="cart-options">
              <div className="stroke-icon-wizard">
                <i className={`fa ${data.iconClassName}`} />
              </div>
              <div className="cart-options-content">
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
