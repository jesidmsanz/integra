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

// Normativas de ejemplo a insertar
const normativasEjemplo = [
  // 1. Horas Base Mensuales
  {
    nombre: 'Horas Base Mensuales 2025',
    tipo: 'horas_base_mensuales',
    valor: 220,
    unidad: 'horas',
    multiplicador: null,
    codigo: null,
    vigencia_desde: '2025-01-01',
    vigencia_hasta: null,
    descripcion: 'Horas base mensuales para cálculo de horas laborales según normativa colombiana',
    activa: true,
    created_by: 1
  },
  
  // 2. Hora Ordinaria Diurna
  {
    nombre: 'Hora Ordinaria Diurna',
    tipo: 'tipo_hora_laboral',
    valor: 0,
    unidad: 'porcentaje',
    multiplicador: 1.0,
    codigo: 'HO',
    vigencia_desde: '2025-01-01',
    vigencia_hasta: null,
    descripcion: 'Hora ordinaria trabajada entre las 6:00 am y 9:00 pm de lunes a sábado. Sin recargos.',
    activa: true,
    created_by: 1
  },
  
  // 3. Hora Extra Diurna
  {
    nombre: 'Hora Extra Diurna',
    tipo: 'tipo_hora_laboral',
    valor: 0,
    unidad: 'porcentaje',
    multiplicador: 1.25,
    codigo: 'HED',
    vigencia_desde: '2025-01-01',
    vigencia_hasta: null,
    descripcion: 'Hora extra trabajada posterior a la jornada ordinaria entre las 6:00 am y 9:00 pm de lunes a sábado. Recargo +25%',
    activa: true,
    created_by: 1
  },
  
  // 4. Recargo Nocturno Ordinario
  {
    nombre: 'Recargo Nocturno Ordinario',
    tipo: 'tipo_hora_laboral',
    valor: 0,
    unidad: 'porcentaje',
    multiplicador: 0.35,
    codigo: 'RNO',
    vigencia_desde: '2025-01-01',
    vigencia_hasta: null,
    descripcion: 'Recargo por horas trabajadas entre las 9:00 pm y 6:00 am de lunes a sábado. Recargo +35%',
    activa: true,
    created_by: 1
  },
  
  // 5. Hora Extra Nocturna
  {
    nombre: 'Hora Extra Nocturna',
    tipo: 'tipo_hora_laboral',
    valor: 0,
    unidad: 'porcentaje',
    multiplicador: 1.75,
    codigo: 'HEN',
    vigencia_desde: '2025-01-01',
    vigencia_hasta: null,
    descripcion: 'Hora extra trabajada posterior a la jornada ordinaria entre las 9:00 pm y 6:00 am de lunes a sábado. Recargo +75%',
    activa: true,
    created_by: 1
  },
  
  // 6. Recargo Dominical/Festivo Diurno
  {
    nombre: 'Recargo Dominical/Festivo Diurno',
    tipo: 'tipo_hora_laboral',
    valor: 0,
    unidad: 'porcentaje',
    multiplicador: 0.80,
    codigo: 'RDD',
    vigencia_desde: '2025-01-01',
    vigencia_hasta: null,
    descripcion: 'Recargo por horas trabajadas en domingos y festivos entre las 6:00 am y 9:00 pm. Recargo +80%',
    activa: true,
    created_by: 1
  },
  
  // 7. Hora Extra Dominical Diurna
  {
    nombre: 'Hora Extra Dominical Diurna',
    tipo: 'tipo_hora_laboral',
    valor: 0,
    unidad: 'porcentaje',
    multiplicador: 2.05,
    codigo: 'HEDD',
    vigencia_desde: '2025-01-01',
    vigencia_hasta: null,
    descripcion: 'Hora extra trabajada posterior a la jornada ordinaria en domingos y festivos entre las 6:00 am y 9:00 pm. Recargo +105%',
    activa: true,
    created_by: 1
  },
  
  // 8. Recargo Dominical/Festivo Nocturno
  {
    nombre: 'Recargo Dominical/Festivo Nocturno',
    tipo: 'tipo_hora_laboral',
    valor: 0,
    unidad: 'porcentaje',
    multiplicador: 1.15,
    codigo: 'RDN',
    vigencia_desde: '2025-01-01',
    vigencia_hasta: null,
    descripcion: 'Recargo por horas trabajadas en domingos y festivos entre las 9:00 pm y 6:00 am. Recargo +115%',
    activa: true,
    created_by: 1
  },
  
  // 9. Hora Extra Dominical Nocturna
  {
    nombre: 'Hora Extra Dominical Nocturna',
    tipo: 'tipo_hora_laboral',
    valor: 0,
    unidad: 'porcentaje',
    multiplicador: 2.55,
    codigo: 'HEDN',
    vigencia_desde: '2025-01-01',
    vigencia_hasta: null,
    descripcion: 'Hora extra trabajada posterior a la jornada ordinaria en domingos y festivos entre las 9:00 pm y 6:00 am. Recargo +155%',
    activa: true,
    created_by: 1
  }
];

async function insertNormativasEjemplo() {
  let client;
  try {
    console.log('🔄 Iniciando inserción de normativas de ejemplo...\n');
    
    client = await pool.connect();
    console.log('✅ Conexión a la base de datos establecida\n');
    
    // Verificar si ya existen normativas de ejemplo
    const checkQuery = await client.query(`
      SELECT COUNT(*) as count 
      FROM normativas 
      WHERE tipo = 'tipo_hora_laboral' 
      AND codigo IN ('HO', 'HED', 'RNO', 'HEN', 'RDD', 'HEDD', 'RDN', 'HEDN')
    `);
    
    const existingCount = parseInt(checkQuery.rows[0].count);
    
    if (existingCount > 0) {
      console.log(`⚠️  Ya existen ${existingCount} normativas de ejemplo.`);
      console.log('¿Deseas continuar? Se insertarán las que no existan.\n');
    }
    
    let inserted = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const normativa of normativasEjemplo) {
      try {
        // Verificar si ya existe una normativa con el mismo código (para tipos de hora)
        if (normativa.codigo) {
          const exists = await client.query(`
            SELECT id FROM normativas 
            WHERE tipo = $1 AND codigo = $2 AND activa = true
          `, [normativa.tipo, normativa.codigo]);
          
          if (exists.rows.length > 0) {
            console.log(`⏭️  Omitida: ${normativa.nombre} (${normativa.codigo}) - Ya existe`);
            skipped++;
            continue;
          }
        } else {
          // Para horas base, verificar si ya existe una vigente
          const exists = await client.query(`
            SELECT id FROM normativas 
            WHERE tipo = $1 
            AND activa = true 
            AND vigencia_desde <= CURRENT_DATE
            AND (vigencia_hasta IS NULL OR vigencia_hasta >= CURRENT_DATE)
          `, [normativa.tipo]);
          
          if (exists.rows.length > 0) {
            console.log(`⏭️  Omitida: ${normativa.nombre} - Ya existe una vigente`);
            skipped++;
            continue;
          }
        }
        
        // Insertar la normativa
        const insertQuery = `
          INSERT INTO normativas (
            nombre, tipo, valor, unidad, multiplicador, codigo,
            vigencia_desde, vigencia_hasta, descripcion, activa, created_by, created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
          ) RETURNING id, nombre, codigo
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
          normativa.activa,
          normativa.created_by
        ]);
        
        const insertedNormativa = result.rows[0];
        console.log(`✅ Insertada: ${insertedNormativa.nombre}${insertedNormativa.codigo ? ` (${insertedNormativa.codigo})` : ''} - ID: ${insertedNormativa.id}`);
        inserted++;
        
      } catch (error) {
        console.error(`❌ Error insertando ${normativa.nombre}:`, error.message);
        errors++;
      }
    }
    
    console.log('\n📊 Resumen:');
    console.log(`   ✅ Insertadas: ${inserted}`);
    console.log(`   ⏭️  Omitidas: ${skipped}`);
    console.log(`   ❌ Errores: ${errors}`);
    
    // Verificar las normativas insertadas
    console.log('\n🔍 Verificando normativas insertadas...\n');
    
    const verifyQuery = await client.query(`
      SELECT 
        id, nombre, codigo, tipo, multiplicador, activa,
        vigencia_desde, vigencia_hasta
      FROM normativas 
      WHERE tipo IN ('horas_base_mensuales', 'tipo_hora_laboral')
      AND activa = true
      ORDER BY tipo, codigo NULLS FIRST, nombre
    `);
    
    console.log('📋 Normativas activas encontradas:');
    verifyQuery.rows.forEach(row => {
      const codigo = row.codigo ? `[${row.codigo}]` : '';
      const mult = row.multiplicador ? ` (${row.multiplicador}x)` : '';
      console.log(`   - ${row.nombre} ${codigo}${mult}`);
    });
    
    console.log('\n🎉 Proceso completado!');
    
  } catch (error) {
    console.error('\n❌ Error durante la inserción:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

// Ejecutar la inserción
insertNormativasEjemplo();

