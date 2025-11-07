import passport from "passport";
import controller from "./controller";
import response from "../../network/response";
import baseHandler from "@/server/network/baseHandler";

const handler = baseHandler();
const apiURL = "/api/normativas";

// GET: api/normativas
handler.get(`${apiURL}/`, async function (req, res) {
  try {
    const result = await controller.list(req.query);
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error on normativas", 400, error);
  }
});

// GET: api/normativas/vigentes
handler.get(`${apiURL}/vigentes`, async function (req, res) {
  try {
    const result = await controller.getVigentes(req.query.fecha);
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error on normativas", 400, error);
  }
});

// GET: api/normativas/:tipo/vigente
handler.get(`${apiURL}/:tipo/vigente`, async function (req, res) {
  try {
    const result = await controller.getVigenteByTipo(req.params.tipo, req.query.fecha);
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error on normativas", 400, error);
  }
});

// GET: api/normativas/:id
handler.get(`${apiURL}/:id`, async function (req, res) {
  try {
    const result = await controller.findById(req.params.id);
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error on normativas", 400, error);
  }
});

// POST: api/normativas
handler.post(`${apiURL}/`, async function (req, res) {
  try {
    const result = await controller.create(req.body);
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error on normativas", 400, error);
  }
});

// PUT: api/normativas/:id
handler.put(`${apiURL}/:id`, async function (req, res) {
  try {
    console.log('🌐 Network: Recibida petición PUT para normativa', req.params.id);
    console.log('🌐 Network: Datos recibidos:', JSON.stringify(req.body, null, 2));
    const result = await controller.update(req.params.id, req.body);
    console.log('🌐 Network: Resultado del controller:', result);
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error on normativas", 400, error);
  }
});

// DELETE: api/normativas/:id
handler.delete(`${apiURL}/:id`, async function (req, res) {
  try {
    const result = await controller.deleteById(req.params.id);
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error on normativas", 400, error);
  }
});

export default handler;