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

// Type News según la tabla de conceptos laborales
const typeNewsData = [
  // a. Licencia de Maternidad (ILM)
  {
    code: 'ILM',
    name: 'Licencia de Maternidad',
    duration: 'Abierto',
    payment: '100% - No se cancela auxilio transporte',
    percentage: '100',
    amount: null,
    category: 'Licencia',
    affects: JSON.stringify({
      basicmonthlysalary: true,
      transportationassistance: false,
      mobilityassistance: false,
      health: true,
      pension: true,
      cesantias: true,
      intereses_cesantias: true,
      prima: true,
      vacaciones: true
    }),
    applies_to: JSON.stringify(['female']),
    isDiscount: false,
    calculateperhour: false,
    notes: 'Licencia de maternidad según normativa colombiana',
    active: true
  },
  
  // b. Licencia de Paternidad (ILP)
  {
    code: 'ILP',
    name: 'Licencia de Paternidad',
    duration: 'Abierto',
    payment: '100% - No se cancela auxilio transporte',
    percentage: '100',
    amount: null,
    category: 'Licencia',
    affects: JSON.stringify({
      basicmonthlysalary: true,
      transportationassistance: false,
      mobilityassistance: false,
      health: true,
      pension: true,
      cesantias: true,
      intereses_cesantias: true,
      prima: true,
      vacaciones: true
    }),
    applies_to: JSON.stringify(['male']),
    isDiscount: false,
    calculateperhour: false,
    notes: 'Licencia de paternidad según normativa colombiana',
    active: true
  },
  
  // c. Licencia No Remunerada
  {
    code: 'LNR',
    name: 'Licencia No Remunerada',
    duration: 'Abierto',
    payment: '0% - No se cancela auxilio transporte',
    percentage: '0',
    amount: null,
    category: 'Licencia',
    affects: JSON.stringify({
      basicmonthlysalary: true,
      transportationassistance: false,
      mobilityassistance: false,
      health: true,
      pension: true
    }),
    applies_to: JSON.stringify(['male', 'female']),
    isDiscount: true,
    calculateperhour: false,
    notes: 'Licencia no remunerada. No afecta cesantías, prima ni vacaciones.',
    active: true
  },
  
  // d. Licencia Remunerada
  {
    code: 'LR',
    name: 'Licencia Remunerada',
    duration: 'Abierto',
    payment: '100% - No se cancela auxilio transporte',
    percentage: '100',
    amount: null,
    category: 'Licencia',
    affects: JSON.stringify({
      basicmonthlysalary: true,
      transportationassistance: false,
      mobilityassistance: false,
      health: true,
      pension: true
    }),
    applies_to: JSON.stringify(['male', 'female']),
    isDiscount: false,
    calculateperhour: false,
    notes: 'Licencia remunerada. No afecta cesantías, prima ni vacaciones.',
    active: true
  },
  
  // e. Licencia por Luto
  {
    code: 'LL',
    name: 'Licencia por Luto',
    duration: 'Abierto',
    payment: '100% - No se cancela auxilio transporte',
    percentage: '100',
    amount: null,
    category: 'Licencia',
    affects: JSON.stringify({
      basicmonthlysalary: true,
      transportationassistance: false,
      mobilityassistance: false,
      health: true,
      pension: true
    }),
    applies_to: JSON.stringify(['male', 'female']),
    isDiscount: false,
    calculateperhour: false,
    notes: 'Licencia por luto. No afecta cesantías, prima ni vacaciones.',
    active: true
  },
  
  // f. Incapacidad por Enfermedad General Inicial (IAM)
  {
    code: 'IAM',
    name: 'Incapacidad por Enfermedad General Inicial',
    duration: 'Abierto',
    payment: '66.67% - No se cancela auxilio transporte',
    percentage: '66.67',
    amount: null,
    category: 'Incapacidad',
    affects: JSON.stringify({
      basicmonthlysalary: true,
      transportationassistance: false,
      mobilityassistance: false,
      health: true,
      pension: true,
      cesantias: true,
      intereses_cesantias: true,
      prima: true,
      vacaciones: true
    }),
    applies_to: JSON.stringify(['male', 'female']),
    isDiscount: false,
    calculateperhour: false,
    notes: 'Primeros 2 días pagados por empleador. Del 3er día, EPS (si tiene 1 mes cotizado). Si liquidación < salario mínimo, llevar a mínimo.',
    active: true
  },
  
  // g. Incapacidad por Enfermedad Prórroga (IPA)
  {
    code: 'IPA',
    name: 'Incapacidad por Enfermedad Prórroga',
    duration: 'Abierto',
    payment: '66.67% - No se cancela auxilio transporte',
    percentage: '66.67',
    amount: null,
    category: 'Incapacidad',
    affects: JSON.stringify({
      basicmonthlysalary: true,
      transportationassistance: false,
      mobilityassistance: false,
      health: true,
      pension: true,
      cesantias: true,
      intereses_cesantias: true,
      prima: true,
      vacaciones: true
    }),
    applies_to: JSON.stringify(['male', 'female']),
    isDiscount: false,
    calculateperhour: false,
    notes: 'Debe ser reconocida totalmente por EPS (si tiene 1 mes cotizado). Si liquidación < salario mínimo, llevar a mínimo.',
    active: true
  },
  
  // h. Incapacidad Inicial por Accidente Trabajo (IRP)
  {
    code: 'IRP',
    name: 'Incapacidad Inicial por Accidente Trabajo',
    duration: 'Abierto',
    payment: '100% - No se cancela auxilio transporte',
    percentage: '100',
    amount: null,
    category: 'Incapacidad',
    affects: JSON.stringify({
      basicmonthlysalary: true,
      transportationassistance: false,
      mobilityassistance: false,
      health: true,
      pension: true,
      cesantias: true,
      intereses_cesantias: true,
      prima: true,
      vacaciones: true
    }),
    applies_to: JSON.stringify(['male', 'female']),
    isDiscount: false,
    calculateperhour: false,
    notes: 'Se paga 100% desde el primer día. Primer día pagado por empleador, del segundo día reconocido por ARL.',
    active: true
  },
  
  // i. Incapacidad Prórroga por Accidente Trabajo (IPR)
  {
    code: 'IPR',
    name: 'Incapacidad Prórroga por Accidente Trabajo',
    duration: 'Abierto',
    payment: '100% - No se cancela auxilio transporte',
    percentage: '100',
    amount: null,
    category: 'Incapacidad',
    affects: JSON.stringify({
      basicmonthlysalary: true,
      transportationassistance: false,
      mobilityassistance: false,
      health: true,
      pension: true,
      cesantias: true,
      intereses_cesantias: true,
      prima: true,
      vacaciones: true
    }),
    applies_to: JSON.stringify(['male', 'female']),
    isDiscount: false,
    calculateperhour: false,
    notes: 'Se paga 100%, asumido por ARL.',
    active: true
  },
  
  // u. Retroactivo Salario
  {
    code: 'RETRO',
    name: 'Retroactivo Salario',
    duration: 'Abierto',
    payment: 'Aumento salarial',
    percentage: null,
    amount: null,
    category: 'Otro',
    affects: JSON.stringify({
      basicmonthlysalary: true,
      transportationassistance: false,
      mobilityassistance: false,
      health: true,
      pension: true,
      arl: true,
      ccf: true,
      vacaciones: true,
      cesantias: true,
      intereses_cesantias: true,
      prima: true
    }),
    applies_to: JSON.stringify(['male', 'female']),
    isDiscount: false,
    calculateperhour: false,
    notes: 'Retroactivo de salario. Afecta todos los conceptos de seguridad social y prestaciones.',
    active: true
  }
];

async function insertTypeNews() {
  let client;
  try {
    console.log('🔄 Iniciando inserción de type_news según tabla de conceptos laborales...\n');
    
    client = await pool.connect();
    console.log('✅ Conexión a la base de datos establecida\n');
    
    let inserted = 0;
    let updated = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const typeNews of typeNewsData) {
      try {
        // Verificar si ya existe un type_news con el mismo código
        const existsQuery = await client.query(`
          SELECT id, name, code, active 
          FROM type_news 
          WHERE code = $1
          LIMIT 1
        `, [typeNews.code]);
        
        if (existsQuery.rows.length > 0) {
          const existing = existsQuery.rows[0];
          
          // Actualizar el existente
          const updateQuery = `
            UPDATE type_news 
            SET 
              name = $1,
              duration = $2,
              payment = $3,
              percentage = $4,
              amount = $5,
              category = $6,
              affects = $7,
              applies_to = $8,
              "isDiscount" = $9,
              calculateperhour = $10,
              notes = $11,
              active = $12,
              "updatedAt" = CURRENT_TIMESTAMP
            WHERE id = $13
            RETURNING id, name, code
          `;
          
          const result = await client.query(updateQuery, [
            typeNews.name,
            typeNews.duration,
            typeNews.payment,
            typeNews.percentage,
            typeNews.amount,
            typeNews.category,
            typeNews.affects,
            typeNews.applies_to,
            typeNews.isDiscount,
            typeNews.calculateperhour,
            typeNews.notes,
            typeNews.active,
            existing.id
          ]);
          
          const updatedTypeNews = result.rows[0];
          console.log(`✅ Actualizado: ${updatedTypeNews.name} (${updatedTypeNews.code}) - ID: ${updatedTypeNews.id}`);
          updated++;
        } else {
          // Insertar nuevo
          const insertQuery = `
            INSERT INTO type_news (
              code, name, duration, payment, percentage, amount, category,
              affects, applies_to, "isDiscount", calculateperhour, notes, active,
              "createdAt", "updatedAt"
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
              CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            ) RETURNING id, name, code
          `;
          
          const result = await client.query(insertQuery, [
            typeNews.code,
            typeNews.name,
            typeNews.duration,
            typeNews.payment,
            typeNews.percentage,
            typeNews.amount,
            typeNews.category,
            typeNews.affects,
            typeNews.applies_to,
            typeNews.isDiscount,
            typeNews.calculateperhour,
            typeNews.notes,
            typeNews.active
          ]);
          
          const insertedTypeNews = result.rows[0];
          console.log(`➕ Insertado: ${insertedTypeNews.name} (${insertedTypeNews.code}) - ID: ${insertedTypeNews.id}`);
          inserted++;
        }
        
      } catch (error) {
        console.error(`❌ Error procesando ${typeNews.name} (${typeNews.code}):`, error.message);
        errors++;
      }
    }
    
    console.log('\n📊 Resumen:');
    console.log(`   ➕ Insertados: ${inserted}`);
    console.log(`   ✅ Actualizados: ${updated}`);
    console.log(`   ❌ Errores: ${errors}`);
    
    // Verificar los type_news finales
    console.log('\n🔍 Verificando type_news activos...\n');
    
    const verifyQuery = await client.query(`
      SELECT 
        id, name, code, category, active, percentage, "isDiscount"
      FROM type_news 
      WHERE active = true
      ORDER BY category, code
    `);
    
    console.log('📋 Type News activos encontrados:');
    verifyQuery.rows.forEach(row => {
      const codigo = row.code ? `[${row.code}]` : '[SIN CÓDIGO]';
      const porcentaje = row.percentage ? ` - ${row.percentage}%` : '';
      const descuento = row.isDiscount ? ' (Descuento)' : '';
      console.log(`   - ${row.name} ${codigo}${porcentaje}${descuento} - Categoría: ${row.category}`);
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
insertTypeNews();

