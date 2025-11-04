import controller from "./controller";
import response from "../../network/response";
import baseHandler from "../../network/baseHandler";

const handler = baseHandler();
const apiURL = "/api/roles";

// GET: api/roles
handler.get(`${apiURL}`, async function (req, res) {
  try {
    const result = await controller.findAll();
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error al consultar los roles", 400, error);
  }
});

// GET: api/roles/:id
handler.get(`${apiURL}/:id`, async function (req, res) {
  try {
    const result = await controller.findById(req.params.id);
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error al consultar el rol", 400, error);
  }
});

// POST: api/roles
handler.post(`${apiURL}`, async function (req, res) {
  try {
    const role = await controller.create(req.body);
    response.success(req, res, role);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error al crear el rol", 400, error);
  }
});

// PUT: api/roles/:id
handler.put(`${apiURL}/:id`, async function (req, res) {
  try {
    const role = await controller.update(req.params.id, req.body);
    response.success(req, res, role);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error al actualizar el rol", 400, error);
  }
});

// DELETE: api/roles/:id
handler.delete(`${apiURL}/:id`, async function (req, res) {
  try {
    const result = await controller.remove(req.params.id);
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error al eliminar el rol", 400, error);
  }
});

export default handler;

