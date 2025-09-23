-- Eliminar restricción única que impide múltiples liquidaciones por mes
-- Esto permite liquidaciones quincenales (1-15 y 16-30 del mismo mes)

-- Primero, eliminar el índice único existente
DROP INDEX IF EXISTS liquidations_company_id_period;

-- Verificar que se eliminó correctamente
SELECT 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE tablename = 'liquidations' 
AND indexname LIKE '%company_id%period%';
