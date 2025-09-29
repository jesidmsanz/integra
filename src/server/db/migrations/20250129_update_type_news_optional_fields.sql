-- Migración para hacer opcionales los campos category y payment en type_news

-- Hacer el campo payment opcional
ALTER TABLE type_news ALTER COLUMN payment DROP NOT NULL;

-- Hacer el campo category opcional  
ALTER TABLE type_news ALTER COLUMN category DROP NOT NULL;

-- Comentarios para documentar los cambios
COMMENT ON COLUMN type_news.payment IS 'Información de pago (opcional)';
COMMENT ON COLUMN type_news.category IS 'Categoría de la novedad (opcional)';
