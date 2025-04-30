import * as uuid from "uuid";
import * as bcrypt from "bcrypt";
import db from "@/db/index";

function create(obj) {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(true);
    } catch (error) {
      console.log("ERROR to create user", error);
    }
  });
}

function getUser({ username }) {
  return new Promise(async (resolve, reject) => {
    try {
      const { Users } = await db();
      const user = await Users.findByUsername(username);
      resolve(user);
    } catch (error) {
      reject(error);
    }
  });
}

function findAll() {
  return new Promise(async (resolve, reject) => {
    const { Users } = await db();
    const result = await Users.findAll();
    resolve(result);
  });
}

function changePassword({ id, currentPassword, newPassword }) {
  return new Promise(async (resolve, reject) => {
    const { Users } = await db();
    //Verificar si la contraseña actual es válida
    const user = await Users.findById(id);
    if (!(await bcrypt.compare(currentPassword, user.password))) {
      resolve("La contraseña actual no coincide");
      return false;
    }
    const password = bcrypt.hashSync(newPassword, 10);
    const result = await Users.changePassword({ id, password });
    resolve(result);
  });
}

function updateRefreshToken(userId, refreshToken) {
  return new Promise(async (resolve, reject) => {
    const { Users } = await db();
    const result = await Users.updateRefreshToken(userId, refreshToken);
    resolve(result);
  });
}

function updateAccessToken(userId, accessToken) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userId) {
        throw new Error("User ID is required for updating access token");
      }
      const { Users } = await db();
      const result = await Users.updateAccessToken(userId, accessToken);
      resolve(result);
    } catch (error) {
      console.error("Error updating access token:", error);
      reject(error);
    }
  });
}

function resetPassword({ userId, newPassword }) {
  return new Promise(async (resolve, reject) => {
    const { Users } = await db();
    const password = bcrypt.hashSync(newPassword, 10);
    const result = await Users.changePassword({ id: userId, password });
    resolve(result);
  });
}

module.exports = {
  create,
  getUser,
  findAll,
  changePassword,
  updateRefreshToken,
  updateAccessToken,
  resetPassword,
};
