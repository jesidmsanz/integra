const setupDatabase = require('../lib/postgresql');
const migration = require('./20250131000000_add_amount_field_to_type_news');

async function runAmountMigration() {
  try {
    console.log('🔄 Iniciando migración para agregar campo amount a type_news...');
    
    // Configuración de la base de datos con las credenciales proporcionadas
    const config = {
      host: '10.10.10.54',
      port: 5432,
      database: 'integra_db',
      username: 'integra',
      password: 'Asd123*-',
      dialect: 'postgres',
      logging: false // Desactivar logs de Sequelize para limpiar la salida
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

    // Verificar si la columna ya existe
    const [results] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'type_news' AND column_name = 'amount'
    `);

    if (results.length > 0) {
      console.log('⚠️  La columna "amount" ya existe en la tabla type_news');
      console.log('✅ Migración no necesaria, la columna ya está presente');
    } else {
      // Ejecutar la migración usando QueryInterface
      console.log('📝 Ejecutando migración...');
      const queryInterface = sequelize.getQueryInterface();
      
      await migration.up(queryInterface, sequelize.constructor);
      
      console.log('✅ Migración completada exitosamente');
      console.log('🎉 El campo "amount" ha sido agregado a la tabla type_news');
    }

    // Verificar la estructura actualizada
    const [columns] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'type_news' 
      AND column_name IN ('amount', 'percentage')
      ORDER BY ordinal_position
    `);

    console.log('\n📊 Campos relacionados en type_news:');
    console.table(columns);

    await sequelize.close();
    console.log('\n✅ Proceso completado exitosamente');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error.message);
    
    if (error.message.includes('password') || error.message.includes('authentication')) {
      console.log('\n💡 Error de autenticación. Verifica las credenciales.');
    } else if (error.message.includes('already exists')) {
      console.log('\n⚠️  La columna ya existe. Esto es normal si la migración ya se ejecutó antes.');
    } else {
      console.error('\n🔍 Detalles del error:', error);
    }
    
    process.exit(1);
  }
}

// Ejecutar la migración si se llama directamente
if (require.main === module) {
  runAmountMigration();
}

module.exports = runAmountMigration;

