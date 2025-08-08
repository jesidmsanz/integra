import React from "react";

export const ApprovalNewsListFilterHeader = () => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h5 className="mb-0">Novedades Pendientes de Aprobación</h5>
      </div>
      <div>
        <button className="btn btn-primary btn-sm">
          <i className="fa fa-refresh me-1" />
          Actualizar
        </button>
      </div>
    </div>
  );
}; 