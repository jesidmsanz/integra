-- Migración para agregar columna base_security_social a liquidation_details
-- Fecha: 2025-01-25

-- Agregar columna base_security_social
ALTER TABLE liquidation_details 
ADD COLUMN IF NOT EXISTS base_security_social DECIMAL(15, 2) NOT NULL DEFAULT 0;

-- Agregar comentario
COMMENT ON COLUMN liquidation_details.base_security_social IS 'Base de seguridad social (salario base + novedades prestacionales)';

