'use strict';

/**
 * Migración para crear el rol superadmin y asignarle todos los permisos
 * También actualiza al menos un usuario existente para que tenga el rol superadmin
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Crear el rol superadmin
    await queryInterface.sequelize.query(`
      INSERT INTO roles (name, description, active, "createdAt", "updatedAt")
      VALUES (
        'superadmin',
        'Super Administrador - Acceso completo a todos los módulos del sistema',
        true,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
      ON CONFLICT (name) DO NOTHING;
    `);

    // 2. Obtener el ID del rol superadmin
    const [roles] = await queryInterface.sequelize.query(`
      SELECT id FROM roles WHERE name = 'superadmin';
    `);

    if (roles && roles.length > 0) {
      const superadminRoleId = roles[0].id;

      // 3. Asignar todos los permisos al rol superadmin
      const allPermissions = [
        'liquidation.create',
        'liquidation.view',
        'liquidation.approve',
        'liquidation.pay',
        'liquidation.export',
        'payslip.view',
        'employee.view',
        'employee.create',
        'employee.update',
        'employee.delete',
        'company.view',
        'company.create',
        'company.update',
        'company.delete',
        'news.view',
        'news.create',
        'news.register',
        'news.approve',
        'normative.view',
        'normative.create',
        'normative.update',
        'normative.delete',
        'report.view',
        'report.export',
        'config.users',
        'config.roles',
        'config.permissions',
      ];

      for (const permissionKey of allPermissions) {
        await queryInterface.sequelize.query(`
          INSERT INTO role_permissions (role_id, permission_key, "createdAt", "updatedAt")
          VALUES (${superadminRoleId}, '${permissionKey}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          ON CONFLICT (role_id, permission_key) DO NOTHING;
        `);
      }

      console.log(`✅ Rol superadmin creado con ID: ${superadminRoleId}`);
      console.log(`✅ ${allPermissions.length} permisos asignados al rol superadmin`);

      // 4. Actualizar al menos un usuario para que tenga el rol superadmin
      await queryInterface.sequelize.query(`
        UPDATE users 
        SET roles = ARRAY['superadmin']::VARCHAR[], "updatedAt" = CURRENT_TIMESTAMP
        WHERE (roles IS NULL OR array_length(roles, 1) IS NULL)
        LIMIT 1;
      `);

      console.log('✅ Usuario actualizado con rol superadmin');
    } else {
      console.error('❌ Error: No se pudo crear o encontrar el rol superadmin');
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Eliminar permisos del rol superadmin
    await queryInterface.sequelize.query(`
      DELETE FROM role_permissions 
      WHERE role_id IN (SELECT id FROM roles WHERE name = 'superadmin');
    `);

    // Eliminar el rol superadmin
    await queryInterface.sequelize.query(`
      DELETE FROM roles WHERE name = 'superadmin';
    `);

    console.log('✅ Rol superadmin eliminado');
  }
};

