-- Agregar columna total_earnings a liquidation_details
-- Esta columna guarda el total devengado (salario + auxilios + novedades positivas)

ALTER TABLE liquidation_details 
ADD COLUMN IF NOT EXISTS total_earnings DECIMAL(15, 2) NOT NULL DEFAULT 0;

COMMENT ON COLUMN liquidation_details.total_earnings IS 'Total devengado (salario + auxilios + novedades positivas)';

