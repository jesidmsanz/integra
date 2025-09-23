const { Pool } = require('pg');

// Configuración de la base de datos
const dbConfig = {
  host: '10.10.10.54',
  user: 'integra',
  password: 'Asd123*-',
  database: 'integra_db',
  port: 5432,
};

const pool = new Pool(dbConfig);

async function runMigration(sqlFile) {
  const fs = require('fs');
  const path = require('path');
  
  try {
    console.log(`🔄 Ejecutando migración: ${sqlFile}`);
    
    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, sqlFile);
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Ejecutar la migración
    const result = await pool.query(sql);
    
    console.log(`✅ Migración completada: ${sqlFile}`);
    if (result.rows) {
      console.log(`📊 Registros afectados: ${result.rowCount}`);
    }
    
    return result;
  } catch (error) {
    console.error(`❌ Error en migración ${sqlFile}:`, error.message);
    throw error;
  }
}

async function runRemainingMigrations() {
  try {
    console.log('🚀 Ejecutando migraciones restantes...\n');
    
    // Solo ejecutar las migraciones que faltan
    await runMigration('20250124_create_liquidation_news_tracking.sql');
    console.log('');
    
    await runMigration('20250124_create_liquidated_periods.sql');
    console.log('');
    
    console.log('🎉 Migraciones restantes completadas exitosamente!');
    
  } catch (error) {
    console.error('💥 Error ejecutando migraciones:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runRemainingMigrations();
