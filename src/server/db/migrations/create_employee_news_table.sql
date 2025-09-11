-- Crear tabla employee_news
CREATE TABLE IF NOT EXISTS employee_news (
    id SERIAL PRIMARY KEY,
    "companyId" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "typeNewsId" INTEGER NOT NULL,
    "startDate" TIMESTAMP NOT NULL,
    "startTime" TIME,
    "endDate" TIMESTAMP,
    "endTime" TIME,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    approved BOOLEAN,
    "approvedBy" INTEGER,
    observations TEXT,
    document VARCHAR(500),
    active BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    CONSTRAINT fk_employee_news_company FOREIGN KEY ("companyId") REFERENCES companies(id),
    CONSTRAINT fk_employee_news_employee FOREIGN KEY ("employeeId") REFERENCES employees(id),
    CONSTRAINT fk_employee_news_type_news FOREIGN KEY ("typeNewsId") REFERENCES type_news(id),
    CONSTRAINT fk_employee_news_approved_by FOREIGN KEY ("approvedBy") REFERENCES users(id)
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_employee_news_company_id ON employee_news("companyId");
CREATE INDEX IF NOT EXISTS idx_employee_news_employee_id ON employee_news("employeeId");
CREATE INDEX IF NOT EXISTS idx_employee_news_type_news_id ON employee_news("typeNewsId");
CREATE INDEX IF NOT EXISTS idx_employee_news_approved ON employee_news(approved);
CREATE INDEX IF NOT EXISTS idx_employee_news_status ON employee_news(status);
CREATE INDEX IF NOT EXISTS idx_employee_news_active ON employee_news(active);

-- Agregar constraint para el status
ALTER TABLE employee_news ADD CONSTRAINT chk_employee_news_status 
CHECK (status IN ('active', 'inactive'));

-- Comentarios en la tabla
COMMENT ON TABLE employee_news IS 'Tabla de novedades de empleados';
COMMENT ON COLUMN employee_news.approved IS 'Estado de aprobación (true: aprobado, false: rechazado, null: pendiente)';
COMMENT ON COLUMN employee_news.status IS 'Estado de la novedad (active/inactive)';
COMMENT ON COLUMN employee_news.document IS 'Path del documento subido';
COMMENT ON COLUMN employee_news.observations IS 'Observaciones adicionales';
