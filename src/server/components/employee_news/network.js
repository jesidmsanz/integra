import passport from "passport";
import controller from "./controller";
import response from "../../network/response";
import baseHandler from "@/server/network/baseHandler";
import { upload, requestLogger } from "../../middleware/upload";

console.log("=== EMPLOYEE NEWS NETWORK LOADING ===");

const handler = baseHandler();
const apiURL = "/api/employee_news";

// GET: api/employee_news
handler.get(`${apiURL}/`, async function (req, res) {
  try {
    const { page, limit } = req.query;
    
    // Si hay parámetros de paginación, usar findAllPaginated
    if (page || limit) {
      const result = await controller.findAllPaginated(page, limit);
      response.success(req, res, result);
    } else {
      // Si no hay paginación, usar findAll normal
      const result = await controller.findAll();
      response.success(req, res, result);
    }
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error on employee_news", 400, error);
  }
});

// GET: api/employee_news/active
handler.get(`${apiURL}/active`, async function (req, res) {
  try {
    const result = await controller.findAllActive();
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error on employee_news", 400, error);
  }
});

// GET: api/employee_news/pending-by-period
handler.get(`${apiURL}/pending-by-period`, async function (req, res) {
  try {
    const { startDate, endDate, companyId } = req.query;
    
    console.log("🔄 GET /api/employee_news/pending-by-period");
    console.log("📅 Parámetros:", { startDate, endDate, companyId });
    
    if (!startDate || !endDate || !companyId) {
      return response.error(req, res, "Faltan parámetros requeridos: startDate, endDate, companyId", 400);
    }
    
    const result = await controller.getPendingByPeriod(startDate, endDate, companyId);
    response.success(req, res, result);
  } catch (error) {
    console.log("❌ ERROR en GET /api/employee_news/pending-by-period:", error);
    response.error(req, res, "Error on employee_news", 400, error);
  }
});

handler.get(`${apiURL}/by-liquidation-status`, async function (req, res) {
  try {
    const { status, companyId, startDate, endDate } = req.query;
    
    console.log("🔄 GET /api/employee_news/by-liquidation-status");
    console.log("📊 Parámetros:", { status, companyId, startDate, endDate });
    
    if (!status) {
      return response.error(req, res, "El parámetro 'status' es requerido", 400);
    }
    
    const result = await controller.getByLiquidationStatus(status, companyId, startDate, endDate);
    response.success(req, res, result);
  } catch (error) {
    console.log("❌ ERROR en GET /api/employee_news/by-liquidation-status:", error);
    response.error(req, res, "Error on employee_news", 400, error);
  }
});

handler.put(`${apiURL}/mark-as-liquidated`, async function (req, res) {
  try {
    const { employeeNewsIds, liquidationId } = req.body;
    
    console.log("🔄 PUT /api/employee_news/mark-as-liquidated");
    console.log("📊 Parámetros:", { employeeNewsIds, liquidationId });
    
    if (!employeeNewsIds || !Array.isArray(employeeNewsIds) || employeeNewsIds.length === 0) {
      return response.error(req, res, "employeeNewsIds debe ser un array no vacío", 400);
    }
    
    if (!liquidationId) {
      return response.error(req, res, "liquidationId es requerido", 400);
    }
    
    const result = await controller.markAsLiquidated(employeeNewsIds, liquidationId);
    response.success(req, res, result);
  } catch (error) {
    console.log("❌ ERROR en PUT /api/employee_news/mark-as-liquidated:", error);
    response.error(req, res, "Error on employee_news", 400, error);
  }
});

handler.put(`${apiURL}/restore-to-pending`, async function (req, res) {
  try {
    const { employeeNewsIds } = req.body;
    
    console.log("🔄 PUT /api/employee_news/restore-to-pending");
    console.log("📊 Parámetros:", { employeeNewsIds });
    
    if (!employeeNewsIds || !Array.isArray(employeeNewsIds) || employeeNewsIds.length === 0) {
      return response.error(req, res, "employeeNewsIds debe ser un array no vacío", 400);
    }
    
    const result = await controller.restoreToPending(employeeNewsIds);
    response.success(req, res, result);
  } catch (error) {
    console.log("❌ ERROR en PUT /api/employee_news/restore-to-pending:", error);
    response.error(req, res, "Error on employee_news", 400, error);
  }
});

// GET: api/employee_news/1
handler.get(`${apiURL}/:id`, async function (req, res) {
  try {
    const result = await controller.findById(req.params.id);
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error on employee_news", 400, error);
  }
});

// POST: api/employee_news
handler.post(`${apiURL}/`, requestLogger, async function (req, res) {
  try {
    console.log("=== DEBUG UPLOAD ===");
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    console.log("req.files:", req.files);

    // Combinar datos del formulario con el archivo
    const formData = {
      ...req.body,
      document: req.file ? req.file.filename : null
    };

    console.log("formData:", formData);

    const result = await controller.create(formData);
    console.log("result network", result);
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error on employee_news", 400, error);
  }
});

// PUT: api/employee_news/1
handler.put(`${apiURL}/:id`, requestLogger, async function (req, res) {
  try {
    console.log("=== DEBUG UPDATE UPLOAD ===");
    console.log("req.params.id:", req.params.id);
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    console.log("req.files:", req.files);
    console.log("Content-Type:", req.headers['content-type']);

    // Combinar datos del formulario con el archivo
    const formData = {
      ...req.body,
      ...(req.file ? { document: req.file.filename } : {})
    };

    console.log("formData update:", formData);
    console.log("formData keys:", Object.keys(formData));
    console.log("formData values:", Object.values(formData));

    console.log("Llamando a controller.update...");
    const result = await controller.update(req.params.id, formData);
    console.log("Resultado del controller:", result);
    
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR EN NETWORK: ", error);
    console.log("Error stack:", error.stack);
    response.error(req, res, "Error on employee_news", 500, error);
  }
});

// DELETE: api/employee_news/1
handler.delete(`${apiURL}/:id`, async function (req, res) {
  try {
    const result = await controller.deleteById(req.params.id);
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error on employee_news", 400, error);
  }
});

export default handler;
