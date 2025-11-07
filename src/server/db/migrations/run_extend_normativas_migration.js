require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Configuración de la base de datos (usar variables de entorno o valores por defecto)
const dbConfig = {
  host: process.env.DB_HOST || '10.10.10.54',
  user: process.env.DB_USERNAME || 'integra',
  password: process.env.DB_PASSWORD || 'Asd123*-',
  database: process.env.DB_NAME || 'integra_db',
  port: parseInt(process.env.DB_PORT || '5432'),
};

const pool = new Pool(dbConfig);

async function runMigration() {
  let client;
  try {
    console.log('🔄 Iniciando migración para extender normativas...\n');
    
    // Conectar a la base de datos
    client = await pool.connect();
    console.log('✅ Conexión a la base de datos establecida\n');
    
    // Leer el archivo SQL de migración
    const migrationPath = path.join(__dirname, '20250125000000-extend-normativas-for-hour-types.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📝 Ejecutando migración SQL...\n');
    
    // Ejecutar la migración
    await client.query(migrationSQL);
    
    console.log('✅ Migración completada exitosamente\n');
    
    // Verificar que los campos se agregaron correctamente
    console.log('🔍 Verificando estructura de tablas...\n');
    
    // Verificar tabla normativas
    const normativasCheck = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'normativas' 
      AND column_name IN ('multiplicador', 'codigo')
      ORDER BY column_name
    `);
    
    console.log('📊 Campos agregados a tabla normativas:');
    if (normativasCheck.rows.length > 0) {
      normativasCheck.rows.forEach(row => {
        console.log(`   ✅ ${row.column_name} (${row.data_type})`);
      });
    } else {
      console.log('   ⚠️  No se encontraron los campos (puede que ya existan)');
    }
    
    // Verificar tabla employee_news
    const employeeNewsCheck = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'employee_news' 
      AND column_name = 'hour_type_id'
    `);
    
    console.log('\n📊 Campo agregado a tabla employee_news:');
    if (employeeNewsCheck.rows.length > 0) {
      employeeNewsCheck.rows.forEach(row => {
        console.log(`   ✅ ${row.column_name} (${row.data_type})`);
      });
    } else {
      console.log('   ⚠️  No se encontró el campo (puede que ya exista)');
    }
    
    // Verificar tipos ENUM
    const enumCheck = await client.query(`
      SELECT enumlabel as enum_value
      FROM pg_enum 
      WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'enum_normativas_tipo')
      ORDER BY enumsortorder
    `);
    
    console.log('\n📊 Valores del ENUM enum_normativas_tipo:');
    const enumValues = enumCheck.rows.map(r => r.enum_value);
    if (enumValues.includes('horas_base_mensuales') && enumValues.includes('tipo_hora_laboral')) {
      console.log('   ✅ horas_base_mensuales');
      console.log('   ✅ tipo_hora_laboral');
    } else {
      console.log('   ⚠️  Algunos valores del ENUM pueden no haberse agregado');
      console.log('   Valores encontrados:', enumValues.join(', '));
    }
    
    console.log('\n🎉 Migración completada exitosamente!');
    
  } catch (error) {
    console.error('\n❌ Error durante la migración:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

// Ejecutar la migración
runMigration();

