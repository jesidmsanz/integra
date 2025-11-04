import controller from "./controller";
import response from "../../network/response";
import baseHandler from "../../network/baseHandler";

const handler = baseHandler();
const apiURL = "/api/permissions";

// GET: api/permissions
handler.get(`${apiURL}`, async function (req, res) {
  try {
    const result = await controller.findAll();
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error al consultar los permisos", 400, error);
  }
});

// GET: api/permissions/:id
handler.get(`${apiURL}/:id`, async function (req, res) {
  try {
    const result = await controller.findById(req.params.id);
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error al consultar el permiso", 400, error);
  }
});

export default handler;

