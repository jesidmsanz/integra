-- Crear tabla positions (cargos)
CREATE TABLE IF NOT EXISTS positions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Crear índice para búsquedas por nombre
CREATE INDEX IF NOT EXISTS idx_positions_name ON positions(name);

-- Crear índice para búsquedas por estado activo
CREATE INDEX IF NOT EXISTS idx_positions_active ON positions(active);

