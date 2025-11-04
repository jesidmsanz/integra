import controller from "./controller";
import response from "../../network/response";
import baseHandler from "../../network/baseHandler";

const handler = baseHandler();
const apiURL = "/api/role-permissions";

// GET: api/role-permissions/:roleId
handler.get(`${apiURL}/:roleId`, async function (req, res) {
  try {
    const result = await controller.getRolePermissions(req.params.roleId);
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error al consultar los permisos del rol", 400, error);
  }
});

// PUT: api/role-permissions/:roleId
handler.put(`${apiURL}/:roleId`, async function (req, res) {
  try {
    const { permissionKeys } = req.body;
    const result = await controller.updateRolePermissions(req.params.roleId, permissionKeys);
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error al actualizar los permisos del rol", 400, error);
  }
});

// POST: api/role-permissions/:roleId/assign
handler.post(`${apiURL}/:roleId/assign`, async function (req, res) {
  try {
    const { permissionKey } = req.body;
    const result = await controller.assignPermission(req.params.roleId, permissionKey);
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error al asignar el permiso", 400, error);
  }
});

// DELETE: api/role-permissions/:roleId/remove
handler.delete(`${apiURL}/:roleId/remove`, async function (req, res) {
  try {
    const { permissionKey } = req.body;
    const result = await controller.removePermission(req.params.roleId, permissionKey);
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error al remover el permiso", 400, error);
  }
});

export default handler;

