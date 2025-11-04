const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function updateStructure() {
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
    const sqlPath = path.join(__dirname, 'update_role_permissions_structure.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('🔄 Actualizando estructura de role_permissions...');
    await client.query(sql);
    
    console.log('✅ Estructura actualizada exitosamente');
    
  } catch (error) {
    console.error('❌ Error ejecutando migración:', error.message);
    console.error(error);
  } finally {
    await client.end();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  updateStructure().then(() => {
    console.log('\n✅ Ahora puedes ejecutar: node src/server/db/migrations/run_create_superadmin.js');
  });
}

module.exports = updateStructure;

