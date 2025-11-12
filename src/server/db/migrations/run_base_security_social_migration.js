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
    console.log('🔄 Iniciando migración para agregar columna base_security_social...');
    console.log('🔧 Configuración de BD:', {
      host: dbConfig.host,
      database: dbConfig.database,
      user: dbConfig.user
    });

    // Leer el archivo SQL de migración
    const migrationPath = path.join(__dirname, '20250125000001-add-base-security-social-to-liquidation-details.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📝 Ejecutando migración...');
    await pool.query(migrationSQL);
    
    console.log('✅ Migración completada exitosamente');
    console.log('🎉 La columna base_security_social ha sido agregada a liquidation_details');
    
    // Verificar que la columna fue creada
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'liquidation_details' 
      AND column_name = 'base_security_social'
    `);
    
    if (result.rows.length > 0) {
      console.log('\n📊 Columna base_security_social verificada:');
      console.table(result.rows);
    } else {
      console.log('⚠️  La columna no se encontró después de la migración');
    }
    
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

