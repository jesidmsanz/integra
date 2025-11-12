require('dotenv').config();
const { Pool } = require('pg');

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || '10.10.10.54',
  user: process.env.DB_USERNAME || 'integra',
  password: process.env.DB_PASSWORD || 'Asd123*-',
  database: process.env.DB_NAME || 'integra_db',
  port: parseInt(process.env.DB_PORT || '5432'),
};

const pool = new Pool(dbConfig);

// Normativas actualizadas según la tabla de conceptos laborales
const normativasActualizadas = [
  // 1. Hora Ordinaria (HO)
  {
    codigo: 'HO',
    nombre: 'Hora Ordinaria',
    tipo: 'tipo_hora_laboral',
    valor: 0,
    unidad: 'porcentaje',
    multiplicador: 1.0,
    descripcion: 'Horas ordinarias trabajadas. Sin recargos.',
    vigencia_desde: '2025-01-01',
    vigencia_hasta: null,
  },
  
  // 2. Hora Extra Diurna (HED)
  {
    codigo: 'HED',
    nombre: 'Hora Extra Diurna',
    tipo: 'tipo_hora_laboral',
    valor: 0,
    unidad: 'porcentaje',
    multiplicador: 1.25, // 125% = +25%
    descripcion: 'Hora extra trabajada posterior a la jornada 7.67 entre las 6:00 AM y 8:00 PM de lunes a sábado. Recargo +25%',
    vigencia_desde: '2025-01-01',
    vigencia_hasta: null,
  },
  
  // 3. Hora Extra Diurna Festiva (HEDF)
  {
    codigo: 'HEDF',
    nombre: 'Hora Extra Diurna Festiva',
    tipo: 'tipo_hora_laboral',
    valor: 0,
    unidad: 'porcentaje',
    multiplicador: 2.00, // 200% = +100%
    descripcion: 'Hora extra trabajada posterior a la jornada 7.67 entre las 6:00 AM y 8:00 PM en domingos y festivos. Recargo +100%',
    vigencia_desde: '2025-01-01',
    vigencia_hasta: null,
  },
  
  // 4. Hora Extra Nocturna (HEN)
  {
    codigo: 'HEN',
    nombre: 'Hora Extra Nocturna',
    tipo: 'tipo_hora_laboral',
    valor: 0,
    unidad: 'porcentaje',
    multiplicador: 1.75, // 175% = +75%
    descripcion: 'Hora extra trabajada posterior a la jornada 7.67 entre las 9:00 PM y 6:00 AM de lunes a sábado. Recargo +75%',
    vigencia_desde: '2025-01-01',
    vigencia_hasta: null,
  },
  
  // 5. Hora Extra Nocturna Festiva (HENF)
  {
    codigo: 'HENF',
    nombre: 'Hora Extra Nocturna Festiva',
    tipo: 'tipo_hora_laboral',
    valor: 0,
    unidad: 'porcentaje',
    multiplicador: 2.50, // 250% = +150%
    descripcion: 'Hora extra trabajada posterior a la jornada 7.67 entre las 9:00 PM y 6:00 AM en domingos y festivos. Recargo +150%',
    vigencia_desde: '2025-01-01',
    vigencia_hasta: null,
  },
  
  // 6. Recargo Nocturno Ordinario (RNO)
  {
    codigo: 'RNO',
    nombre: 'Recargo Nocturno Ordinario',
    tipo: 'tipo_hora_laboral',
    valor: 0,
    unidad: 'porcentaje',
    multiplicador: 0.35, // +35% adicional
    descripcion: 'Recargo por horas trabajadas entre las 9:00 PM y 6:00 AM de lunes a sábado. Recargo +35%',
    vigencia_desde: '2025-01-01',
    vigencia_hasta: null,
  },
  
  // 7. Recargo Nocturno Dominical/Festivo Compensado (RNFC)
  {
    codigo: 'RNFC',
    nombre: 'Recargo Nocturno Dominical/Festivo Compensado',
    tipo: 'tipo_hora_laboral',
    valor: 0,
    unidad: 'porcentaje',
    multiplicador: 1.10, // 110% = +10%
    descripcion: 'Recargo por horas trabajadas entre las 9:00 PM y 6:00 AM en domingos y festivos (compensado). Recargo +10%',
    vigencia_desde: '2025-01-01',
    vigencia_hasta: null,
  },
  
  // 8. Recargo Nocturno Dominical/Festivo No Compensado (RNF)
  {
    codigo: 'RNF',
    nombre: 'Recargo Nocturno Dominical/Festivo No Compensado',
    tipo: 'tipo_hora_laboral',
    valor: 0,
    unidad: 'porcentaje',
    multiplicador: 2.10, // 210% = +110%
    descripcion: 'Recargo por horas trabajadas entre las 9:00 PM y 6:00 AM en domingos y festivos (no compensado). Recargo +110%',
    vigencia_desde: '2025-01-01',
    vigencia_hasta: null,
  },
  
  // 9. Recargo Dominical Compensado (RDC)
  {
    codigo: 'RDC',
    nombre: 'Recargo Dominical Compensado',
    tipo: 'tipo_hora_laboral',
    valor: 0,
    unidad: 'porcentaje',
    multiplicador: 0.75, // +75% adicional
    descripcion: 'Recargo por jornada laboral en domingos y festivos (compensado). Recargo +75%',
    vigencia_desde: '2025-01-01',
    vigencia_hasta: null,
  },
  
  // 10. Recargo Dominical No Compensado (RD)
  {
    codigo: 'RD',
    nombre: 'Recargo Dominical No Compensado',
    tipo: 'tipo_hora_laboral',
    valor: 0,
    unidad: 'porcentaje',
    multiplicador: 1.75, // 175% = +75%
    descripcion: 'Recargo por jornada laboral en domingos y festivos (no compensado). Recargo +75%',
    vigencia_desde: '2025-01-01',
    vigencia_hasta: null,
  },
];

async function updateNormativas() {
  let client;
  try {
    console.log('🔄 Iniciando actualización de normativas según tabla de conceptos laborales...\n');
    
    client = await pool.connect();
    console.log('✅ Conexión a la base de datos establecida\n');
    
    let updated = 0;
    let inserted = 0;
    let errors = 0;
    
    for (const normativa of normativasActualizadas) {
      try {
        // Buscar si existe una normativa con el mismo código
        const existsQuery = await client.query(`
          SELECT id, nombre, multiplicador, activa 
          FROM normativas 
          WHERE tipo = $1 AND codigo = $2
          ORDER BY vigencia_desde DESC
          LIMIT 1
        `, [normativa.tipo, normativa.codigo]);
        
        if (existsQuery.rows.length > 0) {
          const existing = existsQuery.rows[0];
          
          // Verificar si necesita actualización
          const needsUpdate = 
            parseFloat(existing.multiplicador) !== normativa.multiplicador ||
            existing.nombre !== normativa.nombre ||
            existing.activa !== true;
          
          if (needsUpdate) {
            // Actualizar la normativa existente
            const updateQuery = `
              UPDATE normativas 
              SET 
                nombre = $1,
                multiplicador = $2,
                descripcion = $3,
                vigencia_desde = $4,
                vigencia_hasta = $5,
                activa = true,
                updated_at = CURRENT_TIMESTAMP
              WHERE id = $6
              RETURNING id, nombre, codigo, multiplicador
            `;
            
            const result = await client.query(updateQuery, [
              normativa.nombre,
              normativa.multiplicador,
              normativa.descripcion,
              normativa.vigencia_desde,
              normativa.vigencia_hasta,
              existing.id
            ]);
            
            const updatedNormativa = result.rows[0];
            console.log(`✅ Actualizada: ${updatedNormativa.nombre} (${updatedNormativa.codigo}) - Multiplicador: ${updatedNormativa.multiplicador} - ID: ${updatedNormativa.id}`);
            updated++;
          } else {
            console.log(`⏭️  Sin cambios: ${existing.nombre} (${normativa.codigo}) - Multiplicador: ${existing.multiplicador}`);
          }
        } else {
          // Insertar nueva normativa
          // Primero obtener un usuario creador (usar el primero disponible o 1)
          const userQuery = await client.query(`
            SELECT id FROM users ORDER BY id LIMIT 1
          `);
          const createdBy = userQuery.rows.length > 0 ? userQuery.rows[0].id : 1;
          
          const insertQuery = `
            INSERT INTO normativas (
              nombre, tipo, valor, unidad, multiplicador, codigo,
              vigencia_desde, vigencia_hasta, descripcion, activa, created_by, created_at, updated_at
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            ) RETURNING id, nombre, codigo, multiplicador
          `;
          
          const result = await client.query(insertQuery, [
            normativa.nombre,
            normativa.tipo,
            normativa.valor,
            normativa.unidad,
            normativa.multiplicador,
            normativa.codigo,
            normativa.vigencia_desde,
            normativa.vigencia_hasta,
            normativa.descripcion,
            true, // activa
            createdBy
          ]);
          
          const insertedNormativa = result.rows[0];
          console.log(`➕ Insertada: ${insertedNormativa.nombre} (${insertedNormativa.codigo}) - Multiplicador: ${insertedNormativa.multiplicador} - ID: ${insertedNormativa.id}`);
          inserted++;
        }
        
      } catch (error) {
        console.error(`❌ Error procesando ${normativa.nombre} (${normativa.codigo}):`, error.message);
        errors++;
      }
    }
    
    console.log('\n📊 Resumen:');
    console.log(`   ✅ Actualizadas: ${updated}`);
    console.log(`   ➕ Insertadas: ${inserted}`);
    console.log(`   ❌ Errores: ${errors}`);
    
    // Verificar las normativas finales
    console.log('\n🔍 Verificando normativas de tipos de horas laborales...\n');
    
    const verifyQuery = await client.query(`
      SELECT 
        id, nombre, codigo, tipo, multiplicador, activa,
        vigencia_desde, vigencia_hasta
      FROM normativas 
      WHERE tipo = 'tipo_hora_laboral'
      AND activa = true
      ORDER BY codigo NULLS FIRST, nombre
    `);
    
    console.log('📋 Normativas activas de tipos de horas laborales:');
    verifyQuery.rows.forEach(row => {
      const codigo = row.codigo ? `[${row.codigo}]` : '[SIN CÓDIGO]';
      const mult = row.multiplicador ? ` (${row.multiplicador}x)` : '';
      const vigencia = row.vigencia_hasta ? ` hasta ${row.vigencia_hasta}` : ' (vigente)';
      console.log(`   - ${row.nombre} ${codigo}${mult}${vigencia}`);
    });
    
    // Desactivar normativas antiguas que ya no se usan
    console.log('\n🔄 Desactivando normativas antiguas que ya no se usan...\n');
    
    const oldCodes = ['HEDD', 'HEDN', 'RDD', 'RDN']; // Códigos antiguos a desactivar
    let deactivated = 0;
    
    for (const oldCode of oldCodes) {
      try {
        const deactivateQuery = await client.query(`
          UPDATE normativas 
          SET activa = false, updated_at = CURRENT_TIMESTAMP
          WHERE tipo = 'tipo_hora_laboral' 
          AND codigo = $1 
          AND activa = true
          RETURNING id, nombre, codigo
        `, [oldCode]);
        
        if (deactivateQuery.rows.length > 0) {
          deactivateQuery.rows.forEach(row => {
            console.log(`🔴 Desactivada: ${row.nombre} (${row.codigo}) - ID: ${row.id}`);
            deactivated++;
          });
        }
      } catch (error) {
        console.error(`❌ Error desactivando ${oldCode}:`, error.message);
      }
    }
    
    if (deactivated > 0) {
      console.log(`\n📊 Normativas desactivadas: ${deactivated}`);
    } else {
      console.log(`\n✅ No había normativas antiguas para desactivar`);
    }
    
    console.log('\n🎉 Proceso completado!');
    
  } catch (error) {
    console.error('\n❌ Error durante la actualización:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

// Ejecutar la actualización
updateNormativas();

