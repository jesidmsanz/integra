-- Migración para actualizar la tabla type_news
-- Ejecutar este script en la base de datos PostgreSQL

-- 1. Cambiar el tipo de datos de affects y applies_to a TEXT para almacenar JSON
ALTER TABLE type_news 
ALTER COLUMN affects TYPE TEXT,
ALTER COLUMN applies_to TYPE TEXT;

-- 2. Cambiar el tipo de datos de percentage a VARCHAR para mayor flexibilidad
ALTER TABLE type_news 
ALTER COLUMN percentage TYPE VARCHAR(100);

-- 3. Eliminar la columna status (ya no se usa)
ALTER TABLE type_news DROP COLUMN IF EXISTS status;

-- 4. Eliminar la columna noaplicaauxiliotransporte (ya no se usa)
ALTER TABLE type_news DROP COLUMN IF EXISTS noaplicaauxiliotransporte;

-- 5. Agregar valor por defecto para calculateperhour
ALTER TABLE type_news 
ALTER COLUMN calculateperhour SET DEFAULT false;

-- 6. Actualizar comentarios de las columnas
COMMENT ON COLUMN type_news.affects IS 'Campos de dinero afectados (JSON string)';
COMMENT ON COLUMN type_news.applies_to IS 'Opciones de género aplicables (JSON string)';
COMMENT ON COLUMN type_news.percentage IS 'Porcentaje de la novedad';
COMMENT ON COLUMN type_news.calculateperhour IS 'Calcular por hora';

-- 7. Verificar que la tabla se actualizó correctamente
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'type_news' 
ORDER BY ordinal_position; 