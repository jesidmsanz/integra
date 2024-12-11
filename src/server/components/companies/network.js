import passport from "passport";
import controller from "./controller";
import response from "../../network/response";
import baseHandler from "@/server/network/baseHandler";

const handler = baseHandler();
const apiURL = "/api/companies";


// GET: api/companies
handler.get(`${apiURL}/`, async function (req, res) {
  try {
    const result = await controller.findAll();
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error on companies", 400, error);
  }
});

// GET: api/companies/active
handler.get(`${apiURL}/active`, async function (req, res) {
  try {
    const result = await controller.findAllActive();
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error on companies", 400, error);
  }
});

// GET: api/companies/1
handler.get(`${apiURL}/:id`, async function (req, res) {
  try {
    const result = await controller.findById(req.params.id);
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error on companies", 400, error);
  }
});

// POST: api/companies
handler.post(`${apiURL}/`, async function (req, res) {
  try {
    const result = await controller.create(req.body);
    console.log("result network", result);
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error on companies", 400, error);
  }
});

// PUT: api/companies/1
handler.put(`${apiURL}/:id`, async function (req, res) {
  try {
    const result = await controller.update(req.params.id, req.body);
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error on companies", 400, error);
  }
});

// DELETE: api/companies
handler.delete(`${apiURL}/:id`, async function (req, res) {
  try {
    console.log("delete: companies");
    const model = await controller.deleteById(req.params.id);
    response.success(req, res, model);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error on companies", 400, error);
  }
});

export default handler;
