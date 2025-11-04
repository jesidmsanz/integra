-- Crear el rol superadmin
INSERT INTO roles (name, description, active, "createdAt", "updatedAt")
VALUES (
  'superadmin',
  'Super Administrador - Acceso completo a todos los módulos del sistema',
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (name) DO NOTHING;

-- Obtener el ID del rol superadmin
DO $$
DECLARE
  superadmin_role_id INTEGER;
BEGIN
  -- Obtener el ID del rol superadmin
  SELECT id INTO superadmin_role_id FROM roles WHERE name = 'superadmin';
  
  -- Si el rol existe, asignar todos los permisos
  IF superadmin_role_id IS NOT NULL THEN
    -- Asignar todos los permisos del sistema al rol superadmin
    INSERT INTO role_permissions (role_id, permission_key, "createdAt", "updatedAt")
    VALUES
      (superadmin_role_id, 'liquidation.create', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (superadmin_role_id, 'liquidation.view', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (superadmin_role_id, 'liquidation.approve', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (superadmin_role_id, 'liquidation.pay', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (superadmin_role_id, 'liquidation.export', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (superadmin_role_id, 'payslip.view', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (superadmin_role_id, 'employee.view', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (superadmin_role_id, 'employee.create', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (superadmin_role_id, 'employee.update', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (superadmin_role_id, 'employee.delete', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (superadmin_role_id, 'company.view', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (superadmin_role_id, 'company.create', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (superadmin_role_id, 'company.update', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (superadmin_role_id, 'company.delete', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (superadmin_role_id, 'news.view', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (superadmin_role_id, 'news.create', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (superadmin_role_id, 'news.register', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (superadmin_role_id, 'news.approve', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (superadmin_role_id, 'normative.view', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (superadmin_role_id, 'normative.create', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (superadmin_role_id, 'normative.update', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (superadmin_role_id, 'normative.delete', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (superadmin_role_id, 'report.view', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (superadmin_role_id, 'report.export', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (superadmin_role_id, 'config.users', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (superadmin_role_id, 'config.roles', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (superadmin_role_id, 'config.permissions', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT (role_id, permission_key) DO NOTHING;
    
    RAISE NOTICE 'Rol superadmin creado y permisos asignados exitosamente. Role ID: %', superadmin_role_id;
  ELSE
    RAISE NOTICE 'Error: No se pudo encontrar el rol superadmin';
  END IF;
END $$;

-- Actualizar usuarios existentes para que tengan el rol superadmin
-- NOTA: Esto actualizará el campo 'roles' (ARRAY) de los usuarios que ya existen
-- El campo roles en la tabla users es un ARRAY de strings
UPDATE users 
SET roles = ARRAY['superadmin']::VARCHAR[], "updatedAt" = CURRENT_TIMESTAMP
WHERE id = (SELECT id FROM users WHERE roles IS NULL OR array_length(roles, 1) IS NULL ORDER BY id LIMIT 1);

-- O si quieres actualizar todos los usuarios sin roles:
-- UPDATE users SET roles = ARRAY['superadmin']::VARCHAR[], "updatedAt" = CURRENT_TIMESTAMP WHERE roles IS NULL OR array_length(roles, 1) IS NULL;

