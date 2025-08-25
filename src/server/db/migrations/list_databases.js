const setupDatabase = require('../lib/postgresql');

async function listDatabases() {
  try {
    console.log('🔍 Listando bases de datos disponibles en PostgreSQL...');
    
    // Conectar a la base de datos por defecto 'postgres'
    const config = {
      host: 'localhost',
      port: 5432,
      database: 'postgres', // Base de datos por defecto
      username: 'postgres',
      password: '1234',
      dialect: 'postgres'
    };

    const sequelize = setupDatabase(config);
    
    // Probar conexión
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL establecida');

    // Listar todas las bases de datos
    const [results] = await sequelize.query(`
      SELECT datname FROM pg_database 
      WHERE datistemplate = false 
      ORDER BY datname;
    `);
    
    console.log('\n📊 Bases de datos disponibles:');
    results.forEach((db, index) => {
      console.log(`${index + 1}. ${db.datname}`);
    });

    // Verificar si existe la base de datos 'integra'
    const integraExists = results.find(db => db.datname === 'integra');
    if (integraExists) {
      console.log('\n✅ La base de datos "integra" existe');
    } else {
      console.log('\n❌ La base de datos "integra" NO existe');
      console.log('💡 Necesitas crear la base de datos primero');
    }
    
    await sequelize.close();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('no existe la base de datos')) {
      console.log('\n💡 La base de datos por defecto no existe');
      console.log('   Verifica que PostgreSQL esté instalado correctamente');
    }
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  listDatabases();
}

module.exports = listDatabases; 