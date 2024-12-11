import React, { useState } from "react";
import { Button } from "reactstrap";
import Education from "@/Components/Education/EducationForm";

const EducationList = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <>
      <Button
        color="primary"
        className="btn-primary"
        onClick={toggleModal}
      >
        Agregar Educación Superior
      </Button>

      <Education title="Educación Superior" isOpen={modalOpen} toggle={toggleModal} />
    </>
  );
};

export default EducationList;
