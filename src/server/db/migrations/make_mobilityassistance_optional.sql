-- Hacer el campo mobilityassistance opcional (nullable) en la tabla employees
ALTER TABLE employees 
ALTER COLUMN mobilityassistance DROP NOT NULL;

-- Si hay valores NULL, establecerlos en 0 (opcional, solo si es necesario)
-- UPDATE employees SET mobilityassistance = 0 WHERE mobilityassistance IS NULL;

