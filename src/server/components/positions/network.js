import passport from "passport";
import controller from "./controller";
import response from "../../network/response";
import baseHandler from "@/server/network/baseHandler";

const handler = baseHandler();
const apiURL = "/api/positions";

// GET: api/positions
handler.get(`${apiURL}/`, async function (req, res) {
  try {
    const result = await controller.findAll();
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error on positions", 400, error);
  }
});

// GET: api/positions/active
handler.get(`${apiURL}/active`, async function (req, res) {
  try {
    const result = await controller.findAllActive();
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error on positions", 400, error);
  }
});

// GET: api/positions/1
handler.get(`${apiURL}/:id`, async function (req, res) {
  try {
    const result = await controller.findById(req.params.id);
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error on positions", 400, error);
  }
});

// POST: api/positions
handler.post(`${apiURL}/`, async function (req, res) {
  try {
    const result = await controller.create(req.body);
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error on positions", 400, error);
  }
});

// PUT: api/positions/1
handler.put(`${apiURL}/:id`, async function (req, res) {
  try {
    const result = await controller.update(req.params.id, req.body);
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error on positions", 400, error);
  }
});

// DELETE: api/positions/1
handler.delete(`${apiURL}/:id`, async function (req, res) {
  try {
    const result = await controller.deleteById(req.params.id);
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error on positions", 400, error);
  }
});

export default handler;

