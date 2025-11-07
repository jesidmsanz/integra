-- Migración para extender normativas con campos para tipos de horas laborales
-- Fecha: 2025-01-25

-- 1. Agregar nuevos tipos al ENUM
-- Nota: PostgreSQL no soporta IF NOT EXISTS en ALTER TYPE, así que usamos DO block
DO $$
BEGIN
    -- Intentar agregar horas_base_mensuales
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'horas_base_mensuales' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'enum_normativas_tipo')
    ) THEN
        ALTER TYPE enum_normativas_tipo ADD VALUE 'horas_base_mensuales';
    END IF;
    
    -- Intentar agregar tipo_hora_laboral
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'tipo_hora_laboral' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'enum_normativas_tipo')
    ) THEN
        ALTER TYPE enum_normativas_tipo ADD VALUE 'tipo_hora_laboral';
    END IF;
END $$;

-- 2. Agregar campo multiplicador (para tipos de horas laborales)
ALTER TABLE normativas 
ADD COLUMN IF NOT EXISTS multiplicador DECIMAL(10, 4) NULL;

-- 3. Agregar campo codigo (para identificar tipos de horas)
ALTER TABLE normativas 
ADD COLUMN IF NOT EXISTS codigo VARCHAR(20) NULL;

-- 4. Agregar índice para búsqueda por código
CREATE INDEX IF NOT EXISTS idx_normativas_codigo ON normativas(codigo);

-- 5. Agregar campo hour_type_id a employee_news para vincular con normativa
ALTER TABLE employee_news 
ADD COLUMN IF NOT EXISTS hour_type_id INTEGER NULL;

-- 6. Agregar foreign key constraint si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'employee_news_hour_type_id_fkey'
    ) THEN
        ALTER TABLE employee_news 
        ADD CONSTRAINT employee_news_hour_type_id_fkey 
        FOREIGN KEY (hour_type_id) REFERENCES normativas(id);
    END IF;
END $$;

-- 7. Agregar índice para búsqueda por hour_type_id
CREATE INDEX IF NOT EXISTS idx_employee_news_hour_type_id ON employee_news(hour_type_id);

-- 8. Comentarios explicativos
COMMENT ON COLUMN normativas.multiplicador IS 'Multiplicador del salario base para calcular valor hora. Ej: 1.25 = 125% (hora extra diurna)';
COMMENT ON COLUMN normativas.codigo IS 'Código corto para identificar el tipo de hora. Ej: HO, HED, HEN, RNO, etc.';
COMMENT ON COLUMN employee_news.hour_type_id IS 'Referencia a la normativa que define el tipo de hora laboral aplicable a esta novedad';

