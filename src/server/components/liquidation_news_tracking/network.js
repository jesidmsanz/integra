const { createHandler } = require("../../network/baseHandler");
const response = require("../../network/response");
const controller = require("./controller");

const handler = createHandler();
const apiURL = "/api/liquidation_news_tracking";

// POST: Crear registro de trazabilidad
handler.post(`${apiURL}`, async function (req, res) {
  try {
    const result = await controller.create(req.body);
    response.success(req, res, result);
  } catch (error) {
    console.log("❌ ERROR en POST /api/liquidation_news_tracking:", error);
    response.error(req, res, "Error creating liquidation news tracking", 400, error);
  }
});

// GET: Obtener trazabilidad por liquidación
handler.get(`${apiURL}/by-liquidation/:liquidationId`, async function (req, res) {
  try {
    const { liquidationId } = req.params;
    const result = await controller.findByLiquidationId(liquidationId);
    response.success(req, res, result);
  } catch (error) {
    console.log("❌ ERROR en GET /api/liquidation_news_tracking/by-liquidation/:liquidationId:", error);
    response.error(req, res, "Error getting liquidation news tracking", 400, error);
  }
});

// GET: Obtener trazabilidad por novedad de empleado
handler.get(`${apiURL}/by-employee-news/:employeeNewsId`, async function (req, res) {
  try {
    const { employeeNewsId } = req.params;
    const result = await controller.findByEmployeeNewsId(employeeNewsId);
    response.success(req, res, result);
  } catch (error) {
    console.log("❌ ERROR en GET /api/liquidation_news_tracking/by-employee-news/:employeeNewsId:", error);
    response.error(req, res, "Error getting liquidation news tracking", 400, error);
  }
});

// GET: Obtener estadísticas de trazabilidad
handler.get(`${apiURL}/stats`, async function (req, res) {
  try {
    const { companyId, startDate, endDate } = req.query;
    const result = await controller.getTrackingStats(companyId, startDate, endDate);
    response.success(req, res, result);
  } catch (error) {
    console.log("❌ ERROR en GET /api/liquidation_news_tracking/stats:", error);
    response.error(req, res, "Error getting tracking stats", 400, error);
  }
});

// GET: Obtener novedades incluidas en una liquidación
handler.get(`${apiURL}/included/:liquidationId`, async function (req, res) {
  try {
    const { liquidationId } = req.params;
    const result = await controller.getIncludedNews(liquidationId);
    response.success(req, res, result);
  } catch (error) {
    console.log("❌ ERROR en GET /api/liquidation_news_tracking/included/:liquidationId:", error);
    response.error(req, res, "Error getting included news", 400, error);
  }
});

// GET: Obtener novedades excluidas de una liquidación
handler.get(`${apiURL}/excluded/:liquidationId`, async function (req, res) {
  try {
    const { liquidationId } = req.params;
    const result = await controller.getExcludedNews(liquidationId);
    response.success(req, res, result);
  } catch (error) {
    console.log("❌ ERROR en GET /api/liquidation_news_tracking/excluded/:liquidationId:", error);
    response.error(req, res, "Error getting excluded news", 400, error);
  }
});

// PUT: Actualizar estado de trazabilidad
handler.put(`${apiURL}/:id/status`, async function (req, res) {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    if (!status) {
      return response.error(req, res, "El campo 'status' es requerido", 400);
    }
    
    const result = await controller.updateStatus(id, status, notes);
    response.success(req, res, result);
  } catch (error) {
    console.log("❌ ERROR en PUT /api/liquidation_news_tracking/:id/status:", error);
    response.error(req, res, "Error updating tracking status", 400, error);
  }
});

// DELETE: Eliminar trazabilidad por liquidación
handler.delete(`${apiURL}/by-liquidation/:liquidationId`, async function (req, res) {
  try {
    const { liquidationId } = req.params;
    const result = await controller.deleteByLiquidationId(liquidationId);
    response.success(req, res, result);
  } catch (error) {
    console.log("❌ ERROR en DELETE /api/liquidation_news_tracking/by-liquidation/:liquidationId:", error);
    response.error(req, res, "Error deleting liquidation news tracking", 400, error);
  }
});

module.exports = handler;
