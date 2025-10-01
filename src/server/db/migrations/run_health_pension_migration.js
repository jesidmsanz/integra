const { Client } = require('pg');

async function runMigration() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'integra_db',
    user: 'postgres',
    password: 'postgres' // Cambia esto por tu contraseña real
  });

  try {
    console.log('🔄 Conectando a la base de datos...');
    await client.connect();
    console.log('✅ Conectado exitosamente');

    console.log('🔄 Ejecutando migración para agregar campos de descuentos...');
    
    const migrationSQL = `
      ALTER TABLE liquidation_details 
      ADD COLUMN IF NOT EXISTS health_discount DECIMAL(15,2) NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS pension_discount DECIMAL(15,2) NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS social_security_discounts DECIMAL(15,2) NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS absence_discounts DECIMAL(15,2) NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS proportional_discounts DECIMAL(15,2) NOT NULL DEFAULT 0;
    `;

    await client.query(migrationSQL);
    
    console.log('✅ Migración ejecutada exitosamente');
    console.log('📋 Campos agregados a liquidation_details:');
    console.log('   - health_discount (Descuento de salud 4%)');
    console.log('   - pension_discount (Descuento de pensión 4%)');
    console.log('   - social_security_discounts (Total seguridad social)');
    console.log('   - absence_discounts (Descuentos por ausentismo)');
    console.log('   - proportional_discounts (Descuentos proporcionales)');
    
    console.log('🎉 ¡Migración completada! Ya puedes guardar liquidaciones con descuentos de salud y pensión.');
    
  } catch (error) {
    console.error('❌ Error ejecutando migración:', error.message);
  } finally {
    await client.end();
  }
}

runMigration();

