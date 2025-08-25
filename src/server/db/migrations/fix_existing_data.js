const setupDatabase = require('../lib/postgresql');

async function fixExistingData() {
  try {
    console.log('🔧 Iniciando limpieza de datos existentes en type_news...');
    
    const config = {
      host: 'localhost',
      port: 5432,
      database: 'integra_db',
      username: 'postgres',
      password: '1234',
      dialect: 'postgres'
    };

    const sequelize = setupDatabase(config);
    
    // Probar conexión
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida');

    // Primero, ver qué datos problemáticos existen
    console.log('🔍 Verificando datos existentes...');
    const [existingData] = await sequelize.query(`
      SELECT id, name, affects, applies_to 
      FROM type_news 
      ORDER BY id
    `);

    console.log(`📊 Encontrados ${existingData.length} registros en type_news`);
    
    if (existingData.length === 0) {
      console.log('✅ No hay datos que limpiar');
      await sequelize.close();
      return;
    }

    // Mostrar datos problemáticos
    console.log('\n📋 Datos existentes:');
    existingData.forEach((record, index) => {
      console.log(`${index + 1}. ID: ${record.id}, Nombre: ${record.name}`);
      console.log(`   affects: "${record.affects}"`);
      console.log(`   applies_to: "${record.applies_to}"`);
      console.log('');
    });

    // Función para convertir affects al nuevo formato
    function convertAffects(oldAffects) {
      if (!oldAffects || typeof oldAffects !== 'string') {
        return JSON.stringify({
          basicmonthlysalary: false,
          hourlyrate: false,
          transportationassistance: false,
          mobilityassistance: false,
          discountvalue: false
        });
      }

      // Si ya es JSON válido, retornarlo
      try {
        JSON.parse(oldAffects);
        return oldAffects;
      } catch (e) {
        // Convertir formato antiguo a nuevo
        const affects = {
          basicmonthlysalary: oldAffects.toLowerCase().includes('salario') || oldAffects.toLowerCase().includes('salary'),
          hourlyrate: oldAffects.toLowerCase().includes('hora') || oldAffects.toLowerCase().includes('hour'),
          transportationassistance: oldAffects.toLowerCase().includes('transporte') || oldAffects.toLowerCase().includes('transport'),
          mobilityassistance: oldAffects.toLowerCase().includes('movilidad') || oldAffects.toLowerCase().includes('mobility'),
          discountvalue: oldAffects.toLowerCase().includes('descuento') || oldAffects.toLowerCase().includes('discount')
        };
        
        return JSON.stringify(affects);
      }
    }

    // Función para convertir applies_to al nuevo formato
    function convertAppliesTo(oldAppliesTo) {
      if (!oldAppliesTo || typeof oldAppliesTo !== 'string') {
        return JSON.stringify({
          masculino: false,
          femenino: false,
          ambos: true
        });
      }

      // Si ya es JSON válido, retornarlo
      try {
        JSON.parse(oldAppliesTo);
        return oldAppliesTo;
      } catch (e) {
        // Convertir formato antiguo a nuevo
        const appliesTo = {
          masculino: oldAppliesTo.toLowerCase().includes('masculino') || oldAppliesTo.toLowerCase().includes('male'),
          femenino: oldAppliesTo.toLowerCase().includes('femenino') || oldAppliesTo.toLowerCase().includes('female'),
          ambos: oldAppliesTo.toLowerCase().includes('ambos') || oldAppliesTo.toLowerCase().includes('both') || oldAppliesTo.toLowerCase().includes('todos')
        };
        
        return JSON.stringify(appliesTo);
      }
    }

    // Actualizar cada registro
    console.log('🔄 Actualizando datos al nuevo formato...');
    let updatedCount = 0;

    for (const record of existingData) {
      const newAffects = convertAffects(record.affects);
      const newAppliesTo = convertAppliesTo(record.applies_to);

      // Solo actualizar si es necesario
      if (newAffects !== record.affects || newAppliesTo !== record.applies_to) {
        await sequelize.query(`
          UPDATE type_news 
          SET affects = $1, applies_to = $2, "updatedAt" = NOW()
          WHERE id = $3
        `, {
          bind: [newAffects, newAppliesTo, record.id],
          type: sequelize.QueryTypes.UPDATE
        });

        console.log(`✅ Actualizado registro ID ${record.id}: ${record.name}`);
        updatedCount++;
      } else {
        console.log(`⏭️  Registro ID ${record.id} ya está en formato correcto`);
      }
    }

    console.log(`\n🎉 Proceso completado! ${updatedCount} registros actualizados`);

    // Verificar que los datos se convirtieron correctamente
    console.log('\n🔍 Verificando datos convertidos...');
    const [verifiedData] = await sequelize.query(`
      SELECT id, name, affects, applies_to 
      FROM type_news 
      ORDER BY id
    `);

    console.log('\n📊 Datos después de la conversión:');
    verifiedData.forEach((record, index) => {
      console.log(`${index + 1}. ID: ${record.id}, Nombre: ${record.name}`);
      try {
        const affectsObj = JSON.parse(record.affects);
        const appliesToObj = JSON.parse(record.applies_to);
        console.log(`   affects: ${JSON.stringify(affectsObj, null, 2)}`);
        console.log(`   applies_to: ${JSON.stringify(appliesToObj, null, 2)}`);
      } catch (e) {
        console.log(`   ❌ Error al parsear JSON: ${e.message}`);
      }
      console.log('');
    });

    await sequelize.close();
    
  } catch (error) {
    console.error('❌ Error durante la limpieza de datos:', error);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  fixExistingData();
}

module.exports = fixExistingData; 