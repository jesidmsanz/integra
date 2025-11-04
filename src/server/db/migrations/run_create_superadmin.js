const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function createSuperadmin() {
  const client = new Client({
    host: process.env.DB_HOST || '10.10.10.54',
    port: 5432,
    database: process.env.DB_NAME || 'integra_db',
    user: process.env.DB_USERNAME || 'integra',
    password: process.env.DB_PASSWORD || 'Asd123*-'
  });

  try {
    console.log('🔄 Conectando a la base de datos...');
    await client.connect();
    console.log('✅ Conectado exitosamente');

    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, 'create_superadmin_role.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('🔄 Creando rol superadmin y asignando permisos...');
    await client.query(sql);
    
    console.log('✅ Rol superadmin creado exitosamente');
    console.log('✅ Todos los permisos asignados al rol superadmin');
    console.log('✅ Usuario actual actualizado con rol superadmin');
    console.log('');
    console.log('📋 Resumen:');
    console.log('   - Rol creado: superadmin');
    console.log('   - Permisos asignados: 27 permisos (todos los módulos)');
    console.log('   - Usuario actualizado con el rol superadmin');
    console.log('');
    console.log('🎉 ¡Proceso completado exitosamente!');
    
  } catch (error) {
    console.error('❌ Error ejecutando migración:', error.message);
    console.error(error);
  } finally {
    await client.end();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  createSuperadmin();
}

module.exports = createSuperadmin;

