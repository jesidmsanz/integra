const fs = require('fs');
const path = require('path');
const readline = require('readline');
const setupDatabase = require('../lib/postgresql');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function runMigration() {
  try {
    console.log('🔄 Iniciando migración de la tabla type_news...');
    
    // Solicitar credenciales al usuario
    const password = await question('🔐 Ingresa la contraseña de PostgreSQL para el usuario postgres: ');
    
    // Configuración de la base de datos
    const config = {
      host: 'localhost',
      port: 5432,
      database: 'integra_db', // Nombre correcto de la base de datos
      username: 'postgres',
      password: password,
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
    console.log('🔌 Probando conexión...');
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
    rl.close();
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    
    if (error.message.includes('password')) {
      console.log('\n💡 La contraseña ingresada es incorrecta');
      console.log('   Verifica que sea la contraseña correcta de PostgreSQL');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 No se puede conectar a PostgreSQL');
      console.log('   Verifica que PostgreSQL esté ejecutándose en localhost:5432');
    }
    
    rl.close();
    process.exit(1);
  }
}

// Ejecutar la migración si se llama directamente
if (require.main === module) {
  runMigration();
}

module.exports = runMigration; 