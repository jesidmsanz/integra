const fs = require('fs');
const path = require('path');
const setupDatabase = require('../lib/postgresql');

async function runMigration() {
  try {
    console.log('🔄 Iniciando migración de la tabla type_news...');
    
    // Usar la configuración del proyecto
    const config = {
      host: 'localhost',
      port: 5432,
      database: 'integra_db', // Nombre correcto de la base de datos
      username: 'postgres',
      password: '1234', // Contraseña correcta de PostgreSQL
      dialect: 'postgres'
    };

    console.log('🔧 Configuración de BD:', {
      host: config.host,
      port: config.port,
      database: config.database,
      username: config.username
    });

    const sequelize = setupDatabase(config);
    
    // Probar conexión
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida');

    // Leer el script SQL de migración
    const migrationPath = path.join(__dirname, 'update_type_news_table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Ejecutar la migración
    console.log('📝 Ejecutando migración...');
    await sequelize.query(migrationSQL);
    
    console.log('✅ Migración completada exitosamente');
    console.log('🎉 La tabla type_news ha sido actualizada');
    
    // Verificar la estructura actualizada
    const [results] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'type_news' 
      ORDER BY ordinal_position
    `);
    
    console.log('\n📊 Estructura actualizada de la tabla type_news:');
    console.table(results);
    
    await sequelize.close();
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    
    if (error.message.includes('password')) {
      console.log('\n💡 Solución: Actualiza la contraseña en el archivo run_migration.js');
      console.log('   Cambia la línea: password: "postgres" por tu contraseña real');
    }
    
    process.exit(1);
  }
}

// Ejecutar la migración si se llama directamente
if (require.main === module) {
  runMigration();
}

module.exports = runMigration; 