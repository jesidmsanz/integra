const fs = require('fs');
const path = require('path');
const setupDatabase = require('../lib/postgresql');

async function runNormativasMigration() {
  try {
    console.log('🔄 Iniciando migración de la tabla normativas...');
    
    // Usar la configuración del proyecto
    const config = {
      host: 'localhost',
      port: 5432,
      database: 'integra_db',
      username: 'postgres',
      password: '1234',
      dialect: 'postgres'
    };

    console.log('🔧 Configuración de BD:', {
      host: config.host,
      port: config.port,
      database: config.database,
      username: config.username
    });

    const sequelize = setupDatabase(config);
    
    // Probar conexión
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida');
    
    console.log('📝 Ejecutando migración...');
    
    // Ejecutar la migración de normativas
    const migrationSQL = `
      -- Crear tabla normativas
      CREATE TABLE IF NOT EXISTS normativas (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('salario_minimo', 'auxilio_transporte', 'hora_extra', 'recargo_nocturno', 'recargo_domingo', 'vacaciones', 'cesantias', 'prima', 'otro')),
        valor DECIMAL(15, 2) NOT NULL,
        unidad VARCHAR(20) NOT NULL DEFAULT 'pesos' CHECK (unidad IN ('pesos', 'porcentaje', 'horas', 'dias')),
        vigencia_desde DATE NOT NULL,
        vigencia_hasta DATE,
        descripcion TEXT,
        activa BOOLEAN NOT NULL DEFAULT true,
        created_by INTEGER NOT NULL REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Agregar comentarios
      COMMENT ON TABLE normativas IS 'Tabla para almacenar normativas de salarios y prestaciones';
      COMMENT ON COLUMN normativas.nombre IS 'Nombre de la normativa (ej: Salario Mínimo 2025)';
      COMMENT ON COLUMN normativas.tipo IS 'Tipo de normativa';
      COMMENT ON COLUMN normativas.valor IS 'Valor de la normativa';
      COMMENT ON COLUMN normativas.unidad IS 'Unidad del valor (pesos, porcentaje, horas, días)';
      COMMENT ON COLUMN normativas.vigencia_desde IS 'Fecha desde cuando es vigente';
      COMMENT ON COLUMN normativas.vigencia_hasta IS 'Fecha hasta cuando es vigente (null = vigente indefinidamente)';
      COMMENT ON COLUMN normativas.descripcion IS 'Descripción detallada de la normativa';
      COMMENT ON COLUMN normativas.activa IS 'Si la normativa está activa';
      COMMENT ON COLUMN normativas.created_by IS 'Usuario que creó la normativa';

      -- Crear índices
      CREATE INDEX IF NOT EXISTS idx_normativas_tipo ON normativas(tipo);
      CREATE INDEX IF NOT EXISTS idx_normativas_activa ON normativas(activa);
      CREATE INDEX IF NOT EXISTS idx_normativas_vigencia ON normativas(vigencia_desde, vigencia_hasta);
      CREATE INDEX IF NOT EXISTS idx_normativas_created_by ON normativas(created_by);

      -- Crear trigger para updated_at
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';

      DROP TRIGGER IF EXISTS update_normativas_updated_at ON normativas;
      CREATE TRIGGER update_normativas_updated_at
        BEFORE UPDATE ON normativas
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `;

    await sequelize.query(migrationSQL);
    console.log('✅ Migración de normativas ejecutada exitosamente');
    
    // Verificar que la tabla se creó correctamente
    const [results] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'normativas' 
      ORDER BY ordinal_position;
    `);
    
    console.log('📋 Estructura de la tabla normativas:');
    console.table(results);
    
    await sequelize.close();
    console.log('✅ Migración completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error ejecutando migración:', error);
    process.exit(1);
  }
}

runNormativasMigration();
