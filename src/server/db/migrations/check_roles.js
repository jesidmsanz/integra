const { Client } = require('pg');

async function checkRoles() {
  const client = new Client({
    host: process.env.DB_HOST || '10.10.10.54',
    port: 5432,
    database: process.env.DB_NAME || 'integra_db',
    user: process.env.DB_USERNAME || 'integra',
    password: process.env.DB_PASSWORD || 'Asd123*-'
  });

  try {
    await client.connect();
    console.log('✅ Conectado a la base de datos');

    // Verificar si la tabla roles existe
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'roles'
      );
    `);

    console.log('📋 Tabla roles existe:', tableExists.rows[0].exists);

    if (tableExists.rows[0].exists) {
      // Verificar roles
      const roles = await client.query('SELECT * FROM roles ORDER BY id');
      console.log(`\n📋 Roles encontrados: ${roles.rows.length}`);
      roles.rows.forEach(role => {
        console.log(`   - ID: ${role.id}, Name: ${role.name}, Active: ${role.active}`);
      });

      // Verificar permisos del superadmin
      if (roles.rows.length > 0) {
        const superadminRole = roles.rows.find(r => r.name === 'superadmin');
        if (superadminRole) {
          const permissions = await client.query(
            'SELECT permission_key FROM role_permissions WHERE role_id = $1',
            [superadminRole.id]
          );
          console.log(`\n📋 Permisos del superadmin: ${permissions.rows.length}`);
          permissions.rows.forEach(perm => {
            console.log(`   - ${perm.permission_key}`);
          });
        }
      }
    } else {
      console.log('❌ La tabla roles no existe. Ejecuta primero create_roles_permissions_tables.sql');
    }

    // Verificar usuarios con rol superadmin
    const users = await client.query('SELECT id, email, roles FROM users LIMIT 5');
    console.log(`\n📋 Usuarios encontrados: ${users.rows.length}`);
    users.rows.forEach(user => {
      console.log(`   - ID: ${user.id}, Email: ${user.email}, Roles: ${JSON.stringify(user.roles)}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkRoles();

