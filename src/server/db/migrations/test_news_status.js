const { Pool } = require('pg');

// Configuración de la base de datos
const dbConfig = {
  host: '10.10.10.54',
  user: 'integra',
  password: 'Asd123*-',
  database: 'integra_db',
  port: 5432,
};

const pool = new Pool(dbConfig);

async function testNewsStatus() {
  try {
    console.log('🔍 Verificando estado de novedades...\n');
    
    // Verificar novedades por estado
    const statusQuery = `
      SELECT 
        en.id,
        en."employeeId",
        en.active,
        en.approved,
        en.liquidation_status,
        en."startDate",
        en."endDate",
        e.fullname as employee_name,
        e.documentnumber as employee_document,
        tn.name as type_news_name
      FROM employee_news en
      INNER JOIN employees e ON en."employeeId" = e.id
      INNER JOIN type_news tn ON en."typeNewsId" = tn.id
      ORDER BY en.id ASC
      LIMIT 20;
    `;
    
    const result = await pool.query(statusQuery);
    
    console.log('📊 Estado de las primeras 20 novedades:');
    console.log('ID | Empleado | Activa | Aprobada | Estado Liquidación | Tipo');
    console.log('---|----------|--------|----------|-------------------|-----');
    
    result.rows.forEach(row => {
      const activeStatus = row.active ? '✅' : '❌';
      const approvedStatus = row.approved ? '✅' : '❌';
      const liquidationStatus = row.liquidation_status || 'N/A';
      
      console.log(
        `${row.id.toString().padStart(2)} | ${row.employee_name.substring(0, 15).padEnd(15)} | ${activeStatus.padEnd(7)} | ${approvedStatus.padEnd(8)} | ${liquidationStatus.padEnd(17)} | ${row.type_news_name.substring(0, 15)}`
      );
    });
    
    // Estadísticas por estado
    const statsQuery = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN active = true THEN 1 END) as active_count,
        COUNT(CASE WHEN active = false THEN 1 END) as inactive_count,
        COUNT(CASE WHEN approved = true THEN 1 END) as approved_count,
        COUNT(CASE WHEN approved = false THEN 1 END) as not_approved_count,
        COUNT(CASE WHEN liquidation_status = 'pending' THEN 1 END) as pending_count,
        COUNT(CASE WHEN liquidation_status = 'liquidated' THEN 1 END) as liquidated_count,
        COUNT(CASE WHEN liquidation_status = 'excluded' THEN 1 END) as excluded_count
      FROM employee_news;
    `;
    
    const statsResult = await pool.query(statsQuery);
    const stats = statsResult.rows[0];
    
    console.log('\n📈 Estadísticas generales:');
    console.log(`Total novedades: ${stats.total}`);
    console.log(`Activas: ${stats.active_count}`);
    console.log(`Inactivas: ${stats.inactive_count}`);
    console.log(`Aprobadas: ${stats.approved_count}`);
    console.log(`No aprobadas: ${stats.not_approved_count}`);
    console.log(`Pendientes de liquidación: ${stats.pending_count}`);
    console.log(`Liquidadas: ${stats.liquidated_count}`);
    console.log(`Excluidas: ${stats.excluded_count}`);
    
  } catch (error) {
    console.error('❌ Error verificando estado de novedades:', error.message);
  } finally {
    await pool.end();
  }
}

testNewsStatus();
