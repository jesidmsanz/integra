import { typeNewsApi } from "@/utils/api";
import React, { useEffect, useState } from "react";
import {
  Col,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";

const initialStateModal = {
  NewId: null,
};

export default function AddNews({ show }) {
  const [news, setNews] = useState([]);
  const [form, setForm] = useState(initialStateModal);

  const handleChangeModal = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const loadNews = async () => {
    try {
      const response = await typeNewsApi.list();
      if (response.length) setNews(response);
    } catch (error) {
      console.error("Error al cargar los tipos de novedades", error);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  return (
    <Modal centered={true} isOpen={show} size="xl">
      <ModalHeader>
        <h2>Agregar Novedad</h2>
      </ModalHeader>
      <ModalBody>
        <Col md="4">
          <FormGroup>
            <Label for="name">Novedades:</Label>
            <Input
              type="select"
              name="NewId"
              id="name"
              onChange={handleChangeModal}
              value={form.NewId}
              required
            >
              <option value="" selected>
                Selecciona una opción
              </option>

              {news.map((i) => (
                <option value={i.id} key={i.id}>
                  {i.name}
                </option>
              ))}
            </Input>
          </FormGroup>
        </Col>
      </ModalBody>
    </Modal>
  );
}
