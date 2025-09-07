import { NextApiRequest, NextApiResponse } from "next";
import normativesController from "../../../server/components/normatives/controller";

export default async function handler(req, res) {
  const { method, query } = req;
  const { params } = query;

  try {
    switch (method) {
      case "GET":
        if (params && params.length > 0) {
          if (params[0] === "active-by-date" && params[1]) {
            // GET /api/normatives/active-by-date/{date}
            return await normativesController.getActiveByDate(req, res);
          } else if (params[0]) {
            // GET /api/normatives/{id}
            req.params = { id: params[0] };
            return await normativesController.getById(req, res);
          }
        } else {
          // GET /api/normatives
          return await normativesController.list(req, res);
        }
        break;

      case "POST":
        // POST /api/normatives
        return await normativesController.create(req, res);

      case "PUT":
        if (params && params[0]) {
          // PUT /api/normatives/{id}
          req.params = { id: params[0] };
          return await normativesController.update(req, res);
        }
        break;

      case "DELETE":
        if (params && params[0]) {
          if (params[1] === "deactivate") {
            // DELETE /api/normatives/{id}/deactivate
            req.params = { id: params[0] };
            return await normativesController.deactivate(req, res);
          } else {
            // DELETE /api/normatives/{id}
            req.params = { id: params[0] };
            return await normativesController.remove(req, res);
          }
        }
        break;

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        res.status(405).json({
          success: false,
          message: `Método ${method} no permitido`,
        });
    }
  } catch (error) {
    console.error("Error en API de normativas:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
}


