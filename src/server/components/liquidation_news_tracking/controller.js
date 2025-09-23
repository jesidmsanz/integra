const db = require("../../db/index.js");

function create(trackingData) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("🔄 Creando registro de trazabilidad...");
      console.log("📊 Datos:", trackingData);
      
      const { LiquidationNewsTracking } = await db();
      const result = await LiquidationNewsTracking.create(trackingData);
      
      console.log("✅ Registro de trazabilidad creado:", result.id);
      resolve(result);
    } catch (error) {
      console.error("❌ Error en create controller:", error);
      reject(error);
    }
  });
}

function findByLiquidationId(liquidationId) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("🔄 Obteniendo trazabilidad por liquidación ID:", liquidationId);
      
      const { LiquidationNewsTracking } = await db();
      const result = await LiquidationNewsTracking.findByLiquidationId(liquidationId);
      
      console.log("📋 Registros de trazabilidad encontrados:", result.length);
      resolve(result);
    } catch (error) {
      console.error("❌ Error en findByLiquidationId controller:", error);
      reject(error);
    }
  });
}

function findByEmployeeNewsId(employeeNewsId) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("🔄 Obteniendo trazabilidad por novedad de empleado ID:", employeeNewsId);
      
      const { LiquidationNewsTracking } = await db();
      const result = await LiquidationNewsTracking.findByEmployeeNewsId(employeeNewsId);
      
      console.log("📋 Registros de trazabilidad encontrados:", result.length);
      resolve(result);
    } catch (error) {
      console.error("❌ Error en findByEmployeeNewsId controller:", error);
      reject(error);
    }
  });
}

function getTrackingStats(companyId = null, startDate = null, endDate = null) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("🔄 Obteniendo estadísticas de trazabilidad...");
      console.log("📊 Parámetros:", { companyId, startDate, endDate });
      
      const { LiquidationNewsTracking } = await db();
      const result = await LiquidationNewsTracking.getTrackingStats(companyId, startDate, endDate);
      
      console.log("📊 Estadísticas obtenidas:", result.length, "tipos de estado");
      resolve(result);
    } catch (error) {
      console.error("❌ Error en getTrackingStats controller:", error);
      reject(error);
    }
  });
}

function getIncludedNews(liquidationId) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("🔄 Obteniendo novedades incluidas en liquidación:", liquidationId);
      
      const { LiquidationNewsTracking } = await db();
      const result = await LiquidationNewsTracking.getIncludedNews(liquidationId);
      
      console.log("📋 Novedades incluidas encontradas:", result.length);
      resolve(result);
    } catch (error) {
      console.error("❌ Error en getIncludedNews controller:", error);
      reject(error);
    }
  });
}

function getExcludedNews(liquidationId) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("🔄 Obteniendo novedades excluidas de liquidación:", liquidationId);
      
      const { LiquidationNewsTracking } = await db();
      const result = await LiquidationNewsTracking.getExcludedNews(liquidationId);
      
      console.log("📋 Novedades excluidas encontradas:", result.length);
      resolve(result);
    } catch (error) {
      console.error("❌ Error en getExcludedNews controller:", error);
      reject(error);
    }
  });
}

function deleteByLiquidationId(liquidationId) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("🔄 Eliminando trazabilidad por liquidación ID:", liquidationId);
      
      const { LiquidationNewsTracking } = await db();
      const result = await LiquidationNewsTracking.deleteByLiquidationId(liquidationId);
      
      console.log("✅ Trazabilidad eliminada para liquidación:", liquidationId);
      resolve({ success: true, message: "Trazabilidad eliminada exitosamente" });
    } catch (error) {
      console.error("❌ Error en deleteByLiquidationId controller:", error);
      reject(error);
    }
  });
}

function updateStatus(id, status, notes = null) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("🔄 Actualizando estado de trazabilidad ID:", id);
      console.log("📊 Nuevo estado:", status);
      
      const { LiquidationNewsTracking } = await db();
      const result = await LiquidationNewsTracking.updateStatus(id, status, notes);
      
      console.log("✅ Estado de trazabilidad actualizado");
      resolve(result);
    } catch (error) {
      console.error("❌ Error en updateStatus controller:", error);
      reject(error);
    }
  });
}

module.exports = {
  create,
  findByLiquidationId,
  findByEmployeeNewsId,
  getTrackingStats,
  getIncludedNews,
  getExcludedNews,
  deleteByLiquidationId,
  updateStatus,
};
