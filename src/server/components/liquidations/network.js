const passport = require("passport");
const controller = require("./controller");
const response = require("../../network/response");
const baseHandler = require("../../network/baseHandler");

const handler = baseHandler();
const apiURL = "/api/liquidations";

// GET: api/liquidations
handler.get(`${apiURL}/`, async function (req, res) {
  try {
    console.log("🔍 GET /api/liquidations - Iniciando...");
    const { page = 1, limit = 30, status, company_id } = req.query;
    console.log("📊 Parámetros:", { page, limit, status, company_id });

    const result = await controller.list(page, limit, status, company_id);
    console.log("✅ Resultado obtenido:", result);

    response.success(req, res, result);
  } catch (error) {
    console.log("❌ ERROR en GET /api/liquidations:", error);
    response.error(req, res, "Error on liquidations", 500, error);
  }
});

// GET: api/liquidations/1
handler.get(`${apiURL}/:id`, async function (req, res) {
  try {
    const result = await controller.getById(req.params.id);
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error on liquidations", 400, error);
  }
});

// POST: api/liquidations
handler.post(`${apiURL}/`, async function (req, res) {
  try {
    const result = await controller.create(req.body);
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    const errorMessage = error.message || "Error interno del servidor";
    response.error(req, res, errorMessage, 400, error);
  }
});

// PUT: api/liquidations/1/approve
handler.put(`${apiURL}/:id/approve`, async function (req, res) {
  try {
    console.log("🔍 PUT /api/liquidations/:id/approve - Iniciando...");
    console.log("📊 Parámetros:", { 
      id: req.params.id, 
      userId: req.user?.id,
      user: req.user 
    });
    
    // Validar que el usuario esté autenticado
    if (!req.user || !req.user.id) {
      console.log("❌ Usuario no autenticado");
      return response.error(req, res, "Usuario no autenticado", 401);
    }
    
    // Asegurar que el ID del usuario sea un número válido
    let userId = parseInt(req.user.id);
    if (isNaN(userId)) {
      console.log("❌ ID de usuario inválido:", req.user.id);
      console.log("🔧 Usando ID por defecto: 1");
      userId = 1; // ID por defecto para testing
    }
    
    const result = await controller.approve(req.params.id, userId);
    console.log("✅ Liquidación aprobada:", result);
    
    response.success(req, res, result);
  } catch (error) {
    console.log("❌ ERROR en PUT /api/liquidations/:id/approve:", error);
    response.error(req, res, "Error on liquidations", 400, error);
  }
});

// POST: api/liquidations/1/mark-as-paid
handler.post(`${apiURL}/:id/mark-as-paid`, async function (req, res) {
  try {
    const result = await controller.markAsPaid(req.params.id, req.user.id);
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error on liquidations", 400, error);
  }
});

// POST: api/liquidations/1/generate-pdf
handler.post(`${apiURL}/:id/generate-pdf`, async function (req, res) {
  try {
    const { employeeId } = req.body;
    const result = await controller.generatePDF(req.params.id, employeeId);
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error on liquidations", 400, error);
  }
});

// PUT: api/liquidations/1
handler.put(`${apiURL}/:id`, async function (req, res) {
  try {
    const result = await controller.update(req.params.id, req.body);
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error on liquidations", 400, error);
  }
});

// DELETE: api/liquidations/1
handler.delete(`${apiURL}/:id`, async function (req, res) {
  try {
    const result = await controller.deleteById(req.params.id);
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error on liquidations", 400, error);
  }
});

module.exports = handler;
