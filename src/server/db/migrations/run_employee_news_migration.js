const fs = require("fs");
const path = require("path");
const setupDatabase = require("../lib/postgresql");

async function runEmployeeNewsMigration() {
  try {
    console.log("🔄 Iniciando creación de tabla employee_news...");

    // Usar la configuración del proyecto
    const config = {
      host: "localhost",
      port: 5432,
      database: "integra_db",
      username: "postgres",
      password: "1234",
      dialect: "postgres",
    };

    console.log("🔧 Configuración de BD:", {
      host: config.host,
      port: config.port,
      database: config.database,
      username: config.username,
    });

    const sequelize = setupDatabase(config);

    // Probar conexión
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos establecida");

    // Leer el script SQL de migración
    const migrationPath = path.join(
      __dirname,
      "create_employee_news_table.sql"
    );
    const migrationSQL = fs.readFileSync(migrationPath, "utf8");

    // Ejecutar la migración
    console.log("📝 Ejecutando migración...");
    await sequelize.query(migrationSQL);

    console.log("✅ Migración completada exitosamente");
    console.log("🎉 La tabla employee_news ha sido creada");

    // Verificar que la tabla se creó correctamente
    const [results] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'employee_news' 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `);

    console.log("\n📊 Estructura de la tabla employee_news:");
    results.forEach((row) => {
      console.log(`   ${row.column_name}: ${row.data_type} ${row.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });

    // Verificar específicamente el campo approved
    const approvedColumn = results.find(row => row.column_name === 'approved');
    if (approvedColumn) {
      console.log("\n✅ Campo 'approved' encontrado correctamente");
      console.log(`   Tipo: ${approvedColumn.data_type}`);
      console.log(`   Nullable: ${approvedColumn.is_nullable}`);
    } else {
      console.log("\n❌ Campo 'approved' NO encontrado");
    }

    await sequelize.close();
  } catch (error) {
    console.error("❌ Error durante la migración:", error);
    throw error;
  }
}

// Ejecutar la migración si se llama directamente
if (require.main === module) {
  runEmployeeNewsMigration()
    .then(() => {
      console.log("🎉 Migración completada exitosamente");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Error en la migración:", error);
      process.exit(1);
    });
}

module.exports = runEmployeeNewsMigration;
