-- Agregar campos de descuentos de salud y pensión a liquidation_details
ALTER TABLE liquidation_details 
ADD COLUMN health_discount DECIMAL(15,2) NOT NULL DEFAULT 0 COMMENT 'Descuento de salud (4%)',
ADD COLUMN pension_discount DECIMAL(15,2) NOT NULL DEFAULT 0 COMMENT 'Descuento de pensión (4%)',
ADD COLUMN social_security_discounts DECIMAL(15,2) NOT NULL DEFAULT 0 COMMENT 'Total descuentos de seguridad social (salud + pensión)',
ADD COLUMN absence_discounts DECIMAL(15,2) NOT NULL DEFAULT 0 COMMENT 'Descuentos por ausentismo',
ADD COLUMN proportional_discounts DECIMAL(15,2) NOT NULL DEFAULT 0 COMMENT 'Descuentos proporcionales por novedades';
