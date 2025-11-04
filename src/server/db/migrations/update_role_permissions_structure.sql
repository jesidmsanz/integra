-- Actualizar la estructura de role_permissions para usar permission_key en lugar de permission_id

-- Primero, eliminar la tabla si existe con la estructura antigua
DROP TABLE IF EXISTS role_permissions CASCADE;

-- Crear la tabla con la nueva estructura
CREATE TABLE IF NOT EXISTS role_permissions (
    id SERIAL PRIMARY KEY,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_key VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_role_permission UNIQUE (role_id, permission_key)
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_key ON role_permissions(permission_key);

