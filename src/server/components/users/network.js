import passport from "passport";
import controller from "./controller";
import response from "../../network/response";
import baseHandler from "../../network/baseHandler";
import { generateAccessToken } from "@/utils/auth/generateAccessToken";
import jwt from "jsonwebtoken";

const handler = baseHandler();
const apiURL = "/api/users";

//Authenticated
// handler.use(passport.authenticate("jwt", { session: false }));

// GET: api/users
handler.get(`${apiURL}`, async function (req, res) {
  try {
    const result = await controller.findAll();
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error al consultar los usuarios", 400, error);
  }
});

// GET: api/users/active
handler.get(`${apiURL}/active`, async function (req, res) {
  try {
    const result = await controller.findAllActive();
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error on users", 400, error);
  }
});

// GET: api/users/1
handler.get(`${apiURL}/:id`, async function (req, res) {
  try {
    const result = await controller.findById(req.params.id);
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error on users", 400, error);
  }
});

// POST: api/users
handler.post(`${apiURL}/`, async function (req, res) {
  try {
    const user = await controller.create(req.body);
    response.success(req, res, user);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error al registrar el usuario", 400, error);
  }
});

// PUT: api/users/:id
handler.put(`${apiURL}/:id`, async function (req, res) {
  try {
    const user = await controller.update(req.params.id, req.body);
    response.success(req, res, user);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error al actualizar el usuario", 400, error);
  }
});

// POST: /api/users/auth/refresh-token
handler.post(`${apiURL}/auth/refresh-token`, (req, res) => {
  const { refreshToken } = req.body;
  console.log("Update AccessToken");
  
  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token is required" });
  }
  
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        console.error("Error verificando refresh token:", err.message);
        return res.status(403).json({ error: "Invalid or expired refresh token" });
      }
      
      const { userId } = decoded;
      
      if (!userId) {
        console.error("User ID is missing from decoded token");
        return res.status(403).json({ error: "Invalid token: User ID not found" });
      }
      
      try {
        const newAccessToken = generateAccessToken({ _id: userId });
        
        if (!newAccessToken) {
          console.error("Error generando nuevo access token");
          return res.status(500).json({ error: "Error generating access token" });
        }
        
        await controller.updateAccessToken(userId, newAccessToken);
        return res.json({ accessToken: newAccessToken });
      } catch (error) {
        console.error("Error actualizando access token:", error);
        return res.status(500).json({ error: "Error updating access token" });
      }
    }
  );
});

// POST: api/users/change-password
handler.post(`${apiURL}/change-password`, async function (req, res) {
  try {
    req.body.id = req.user.id;
    const result = await controller.changePassword(req.body);
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error al registrar el usuario", 400, error);
  }
});

// POST: api/users/reset-password
handler.post(`${apiURL}/reset-password`, async function (req, res) {
  try {
    req.body.id = req.user.id;
    const result = await controller.resetPassword(req.body);
    response.success(req, res, result);
  } catch (error) {
    console.log("ERROR: ", error);
    response.error(req, res, "Error al registrar el usuario", 400, error);
  }
});

export default handler;
