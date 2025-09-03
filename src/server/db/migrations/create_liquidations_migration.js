const fs = require("fs");
const path = require("path");
const setupDatabase = require("../lib/postgresql");

async function createLiquidationsTables() {
  try {
    console.log("🔄 Iniciando creación de tablas de liquidaciones...");

    // Usar la configuración del proyecto
    const config = {
      host: "localhost",
      port: 5432,
      database: "integra_db", // Nombre correcto de la base de datos
      username: "postgres",
      password: "1234", // Contraseña correcta de PostgreSQL
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
      "create_liquidations_tables.sql"
    );
    const migrationSQL = fs.readFileSync(migrationPath, "utf8");

    // Ejecutar la migración
    console.log("📝 Ejecutando migración...");
    await sequelize.query(migrationSQL);

    console.log("✅ Migración completada exitosamente");
    console.log("🎉 Las tablas de liquidaciones han sido creadas");

    // Verificar las tablas creadas
    const [results] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('liquidations', 'liquidation_details', 'liquidation_news')
      ORDER BY table_name
    `);

    console.log("\n📊 Tablas de liquidaciones creadas:");
    results.forEach((row) => {
      console.log(`   ✅ ${row.table_name}`);
    });

    await sequelize.close();
  } catch (error) {
    console.error("❌ Error durante la migración:", error);

    if (error.message.includes("password")) {
      console.log(
        "\n💡 Solución: Actualiza la contraseña en el archivo create_liquidations_migration.js"
      );
      console.log(
        '   Cambia la línea: password: "1234" por tu contraseña real'
      );
    }

    process.exit(1);
  }
}

// Ejecutar la migración si se llama directamente
if (require.main === module) {
  createLiquidationsTables();
}

module.exports = createLiquidationsTables;
