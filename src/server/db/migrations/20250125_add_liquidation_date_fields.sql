-- Agregar campos de fechas y frecuencia de pago a la tabla liquidations
-- Esto permitirá mostrar rangos de fechas específicos y identificar liquidaciones quincenales

-- Agregar las nuevas columnas
ALTER TABLE liquidations 
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE,
ADD COLUMN IF NOT EXISTS payment_frequency VARCHAR(20) DEFAULT 'Mensual',
ADD COLUMN IF NOT EXISTS cut_number INTEGER;

-- Crear constraint para payment_frequency
ALTER TABLE liquidations 
ADD CONSTRAINT check_payment_frequency 
CHECK (payment_frequency IN ('Quincenal', 'Mensual'));

-- Crear constraint para cut_number
ALTER TABLE liquidations 
ADD CONSTRAINT check_cut_number 
CHECK (cut_number IS NULL OR (cut_number >= 1 AND cut_number <= 2));

-- Actualizar registros existentes con valores por defecto
-- Para registros existentes, usar el período como fecha de inicio y fin del mes
UPDATE liquidations 
SET start_date = (period || '-01')::DATE,
    end_date = (period || '-01')::DATE + INTERVAL '1 month' - INTERVAL '1 day',
    payment_frequency = 'Mensual'
WHERE start_date IS NULL OR end_date IS NULL;

-- Hacer las columnas NOT NULL después de actualizar los datos existentes
ALTER TABLE liquidations 
ALTER COLUMN start_date SET NOT NULL,
ALTER COLUMN end_date SET NOT NULL,
ALTER COLUMN payment_frequency SET NOT NULL;

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_liquidations_start_date ON liquidations(start_date);
CREATE INDEX IF NOT EXISTS idx_liquidations_end_date ON liquidations(end_date);
CREATE INDEX IF NOT EXISTS idx_liquidations_payment_frequency ON liquidations(payment_frequency);
