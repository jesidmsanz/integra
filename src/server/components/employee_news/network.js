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
    const result = await controller.findAll();
    response.success(req, res, result);
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
