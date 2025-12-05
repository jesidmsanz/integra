-- Migración para agregar columna basic_salary_proportional a liquidation_details
-- Fecha: 2025-01-31

-- Agregar columna basic_salary_proportional
ALTER TABLE liquidation_details 
ADD COLUMN IF NOT EXISTS basic_salary_proportional DECIMAL(15, 2) NOT NULL DEFAULT 0;

-- Agregar comentario
COMMENT ON COLUMN liquidation_details.basic_salary_proportional IS 'Salario básico proporcional (considerando días trabajados y novedades)';

