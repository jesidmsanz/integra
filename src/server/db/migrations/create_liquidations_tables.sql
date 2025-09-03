-- Crear tabla liquidations
CREATE TABLE IF NOT EXISTS liquidations (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    period VARCHAR(7) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    total_employees INTEGER NOT NULL DEFAULT 0,
    total_basic_salary DECIMAL(15,2) NOT NULL DEFAULT 0,
    total_transportation_assistance DECIMAL(15,2) NOT NULL DEFAULT 0,
    total_mobility_assistance DECIMAL(15,2) NOT NULL DEFAULT 0,
    total_novedades DECIMAL(15,2) NOT NULL DEFAULT 0,
    total_discounts DECIMAL(15,2) NOT NULL DEFAULT 0,
    total_net_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    notes TEXT,
    approved_at TIMESTAMP,
    approved_by INTEGER,
    paid_at TIMESTAMP,
    paid_by INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_liquidations_company FOREIGN KEY (company_id) REFERENCES companies(id),
    CONSTRAINT fk_liquidations_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_liquidations_approved_by FOREIGN KEY (approved_by) REFERENCES users(id),
    CONSTRAINT fk_liquidations_paid_by FOREIGN KEY (paid_by) REFERENCES users(id),
    CONSTRAINT unique_company_period UNIQUE (company_id, period)
);

-- Crear tabla liquidation_details
CREATE TABLE IF NOT EXISTS liquidation_details (
    id SERIAL PRIMARY KEY,
    liquidation_id INTEGER NOT NULL,
    employee_id INTEGER NOT NULL,
    basic_salary DECIMAL(15,2) NOT NULL DEFAULT 0,
    transportation_assistance DECIMAL(15,2) NOT NULL DEFAULT 0,
    mobility_assistance DECIMAL(15,2) NOT NULL DEFAULT 0,
    total_novedades DECIMAL(15,2) NOT NULL DEFAULT 0,
    total_discounts DECIMAL(15,2) NOT NULL DEFAULT 0,
    net_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_liquidation_details_liquidation FOREIGN KEY (liquidation_id) REFERENCES liquidations(id) ON DELETE CASCADE,
    CONSTRAINT fk_liquidation_details_employee FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Crear tabla liquidation_news
CREATE TABLE IF NOT EXISTS liquidation_news (
    id SERIAL PRIMARY KEY,
    liquidation_detail_id INTEGER NOT NULL,
    employee_news_id INTEGER NOT NULL,
    type_news_id INTEGER NOT NULL,
    hours DECIMAL(10,2),
    days DECIMAL(10,2),
    amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_liquidation_news_detail FOREIGN KEY (liquidation_detail_id) REFERENCES liquidation_details(id) ON DELETE CASCADE,
    CONSTRAINT fk_liquidation_news_employee_news FOREIGN KEY (employee_news_id) REFERENCES employee_news(id),
    CONSTRAINT fk_liquidation_news_type_news FOREIGN KEY (type_news_id) REFERENCES type_news(id)
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_liquidations_company_id ON liquidations(company_id);
CREATE INDEX IF NOT EXISTS idx_liquidations_user_id ON liquidations(user_id);
CREATE INDEX IF NOT EXISTS idx_liquidations_period ON liquidations(period);
CREATE INDEX IF NOT EXISTS idx_liquidations_status ON liquidations(status);
CREATE INDEX IF NOT EXISTS idx_liquidations_company_period ON liquidations(company_id, period);

CREATE INDEX IF NOT EXISTS idx_liquidation_details_liquidation_id ON liquidation_details(liquidation_id);
CREATE INDEX IF NOT EXISTS idx_liquidation_details_employee_id ON liquidation_details(employee_id);

CREATE INDEX IF NOT EXISTS idx_liquidation_news_detail_id ON liquidation_news(liquidation_detail_id);
CREATE INDEX IF NOT EXISTS idx_liquidation_news_employee_news_id ON liquidation_news(employee_news_id);
CREATE INDEX IF NOT EXISTS idx_liquidation_news_type_news_id ON liquidation_news(type_news_id);

-- Agregar constraint para el status
ALTER TABLE liquidations ADD CONSTRAINT chk_liquidations_status 
CHECK (status IN ('draft', 'approved', 'paid', 'cancelled'));
