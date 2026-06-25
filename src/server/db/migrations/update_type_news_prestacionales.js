/**
 * Migración: Actualizar affects.prestacionales para tipos de novedad por hora.
 *
 * Problema: Las horas extra (HED, HEN, HEDF, HENF) y recargos (RDC, RD, RNO, RNFC, RNF)
 * son salario según el Art. 127 CST y deben sumarse a la base de seguridad social
 * (salud 4% + pensión 4%). Sin este flag, el sistema los excluye del cálculo de descuentos.
 *
 * Uso: node src/server/db/migrations/update_type_news_prestacionales.js
 */

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || '10.10.10.54',
  user: process.env.DB_USERNAME || 'integra',
  password: process.env.DB_PASSWORD || 'Asd123*-',
  database: process.env.DB_NAME || 'integra_db',
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Categorías que constituyen salario bajo el Art. 127 CST
// y por tanto deben afectar la base de seguridad social.
const CATEGORIAS_PRESTACIONALES = ['Hora Extra', 'Recargo'];

async function updatePrestacionales() {
  let client;
  try {
    client = await pool.connect();
    console.log('✅ Conexión establecida\n');

    // Obtener todos los tipos de novedad de estas categorías
    const { rows } = await client.query(
      `SELECT id, name, code, category, affects
       FROM type_news
       WHERE category = ANY($1::text[])
       AND active = true
       ORDER BY category, code`,
      [CATEGORIAS_PRESTACIONALES]
    );

    console.log(`📋 Tipos de novedad encontrados: ${rows.length}\n`);

    let actualizados = 0;
    let sinCambios = 0;

    for (const row of rows) {
      let affects = {};
      try {
        affects = typeof row.affects === 'string' && row.affects
          ? JSON.parse(row.affects)
          : row.affects || {};
      } catch {
        affects = {};
      }

      if (affects.prestacionales === true) {
        console.log(`⏭️  Sin cambio: [${row.code}] ${row.name} — ya tiene prestacionales: true`);
        sinCambios++;
        continue;
      }

      // Agregar prestacionales: true manteniendo todos los demás flags
      affects.prestacionales = true;
      const affectsJson = JSON.stringify(affects);

      await client.query(
        `UPDATE type_news SET affects = $1, "updatedAt" = NOW() WHERE id = $2`,
        [affectsJson, row.id]
      );

      console.log(`✅ Actualizado: [${row.code}] ${row.name} (${row.category})`);
      actualizados++;
    }

    console.log('\n📊 Resumen:');
    console.log(`   ✅ Actualizados: ${actualizados}`);
    console.log(`   ⏭️  Sin cambios: ${sinCambios}`);
    console.log('\n🎉 Migración completada.');
    console.log('   Los descuentos de salud/pensión ahora incluirán horas extra y recargos en la base.');

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

updatePrestacionales();
