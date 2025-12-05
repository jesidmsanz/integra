const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Configuración de la base de datos desde variables de entorno o valores por defecto
const dbConfig = {
  host: process.env.DB_HOST || '10.10.10.54',
  user: process.env.DB_USERNAME || 'integra',
  password: process.env.DB_PASSWORD || 'Asd123*-',
  database: process.env.DB_NAME || 'integra_db',
  port: process.env.DB_PORT || 5432,
};

const pool = new Pool(dbConfig);

async function runMigration() {
  try {
    console.log('🔄 Iniciando migración para agregar columna basic_salary_proportional...');
    
    // Leer el archivo SQL de migración
    const migrationPath = path.join(__dirname, '20250131000002-add-basic-salary-proportional-to-liquidation-details.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📝 Ejecutando migración...');
    await pool.query(migrationSQL);
    
    console.log('✅ Migración completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    if (error.message.includes('already exists')) {
      console.log('ℹ️  La columna ya existe, no es necesario ejecutar la migración');
    } else {
      throw error;
    }
  } finally {
    await pool.end();
  }
}

// Ejecutar la migración si se llama directamente
if (require.main === module) {
  runMigration()
    .then(() => {
      console.log('\n✅ Proceso completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}

module.exports = runMigration;

