import Link from "next/link";
import { Filter } from "react-feather";
import { useState } from "react";

export const EmployeeNewsListFilterHeader = ({
  setViewForm,
  setIsUpdate,
  setDataToUpdate,
}) => {
  const [filterToggle, setFilterToggle] = useState(false);

  const handleRegisterClick = () => {
    // Resetear estados para crear nueva novedad
    if (setIsUpdate) setIsUpdate(false);
    if (setDataToUpdate) setDataToUpdate(null);
    setViewForm(true);
  };

  return (
    <div>
      <div className="light-box" onClick={() => setFilterToggle(!filterToggle)}>
        <a>
          <Filter className={`filter-icon ${filterToggle ? "hide" : "show"}`} />
          <i
            className={`icon-close filter-close ${
              filterToggle ? "show" : "hide"
            }`}
          />
        </a>
      </div>
      <Link className="btn btn-primary" onClick={handleRegisterClick} href="">
        <i className="fa fa-plus" />
        Registrar Novedad
      </Link>
    </div>
  );
};
