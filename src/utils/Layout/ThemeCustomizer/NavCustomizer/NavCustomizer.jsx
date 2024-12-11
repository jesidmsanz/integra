import { Href, ImagePath, QuickOption } from "@/Constant/constant";
import { Nav, NavLink } from "reactstrap";
import Image from "next/image";

const NavCustomizer = ({ callbackNav, selected }) => {
  return (
    <Nav className="flex-column nac-pills">
      <NavLink
        className={`${selected === "sidebar-type" ? "active" : ""} mb-2`}
        onClick={() => callbackNav("sidebar-type", true)}
        href={Href}
      >
        <div className="settings">
          <Image
            width={22}
            height={22}
            className="img-fluid"
            src={`${ImagePath}/customizer/1.png`}
            alt="icons"
            priority
          />
        </div>
        <span>{QuickOption}</span>
      </NavLink>
    </Nav>
  );
};

export default NavCustomizer;
