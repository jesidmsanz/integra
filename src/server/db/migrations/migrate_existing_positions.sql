-- Script para migrar los cargos existentes a la tabla positions
-- Este script inserta todos los cargos que están en selectOptions.position del formulario

INSERT INTO positions (name, active, "createdAt", "updatedAt")
VALUES
  ('Auxiliar de Servicios Generales', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('GERENTE OPERATIVO', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Conserje', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Supervisor Operativo', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Todero/Piscinero', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Todero ', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Todero/Salvavidas', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Auxiliar de Cocina', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Operaria de Aseo', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Operario de Aseo', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Psicóloga', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Salvavidas', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Jardinero', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Supervisor De Aseo', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Todero', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Coordinador Talento Humano', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Ejecutiva Comercial', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Contador', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Gerente Comercial', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('ORIENTADOR', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (name) DO NOTHING;

