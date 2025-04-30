import Link from "next/link";
import { Filter } from "react-feather";

import { useState } from "react";

export const NewListFilterHeader = ({ setViewForm }) => {
  const [filterToggle, setFilterToggle] = useState(false);

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
      <Link
        className="btn btn-primary"
        onClick={() => setViewForm(true)}
        href=""
      >
        <i className="fa fa-plus" />
        Registrar Novedad
      </Link>
    </div>
  );
};
