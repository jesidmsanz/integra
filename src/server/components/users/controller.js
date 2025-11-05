import * as uuid from "uuid";
import * as bcrypt from "bcrypt";
import db from "@/db/index";

function create(obj) {
  return new Promise(async (resolve, reject) => {
    try {
      const { Users } = await db();
      
      // Verificar si el usuario ya existe
      const existingUser = await Users.findByUsername(obj.email);
      
      if (existingUser) {
        reject(new Error("El usuario con este email ya existe"));
        return;
      }
      
      // Encriptar contraseña si existe
      const userData = { ...obj };
      if (userData.password) {
        userData.password = bcrypt.hashSync(userData.password, 10);
      }
      
      // Valores por defecto
      userData.uuid = uuid.v4();
      userData.accessToken = "";
      userData.refreshToken = "";
      userData.roles = userData.roles || [];
      
      // Crear usuario usando el método create del store
      const result = await Users.create(userData);
      resolve(result);
    } catch (error) {
      console.log("ERROR to create user", error);
      reject(error);
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
    try {
      const { Users } = await db();
      const result = await Users.findAll();
      resolve(result);
    } catch (error) {
      console.log("ERROR in users findAll:", error);
      reject(error);
    }
  });
}

function findAllActive() {
  return new Promise(async (resolve, reject) => {
    try {
      const { Users } = await db();
      const result = await Users.findAllActive();
      resolve(result);
    } catch (error) {
      console.log("ERROR in users findAllActive:", error);
      reject(error);
    }
  });
}

function findById(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const { Users } = await db();
      const user = await Users.findById(id);
      if (!user) {
        reject(new Error("Usuario no encontrado"));
        return;
      }
      resolve(user);
    } catch (error) {
      console.log("ERROR in users findById:", error);
      reject(error);
    }
  });
}

function update(id, userData) {
  return new Promise(async (resolve, reject) => {
    try {
      const { Users } = await db();
      
      // Si se intenta cambiar la contraseña, validar primero
      if (userData.currentPassword && userData.newPassword) {
        // Verificar si la contraseña actual es válida
        const user = await Users.findById(id);
        if (!user) {
          reject(new Error("Usuario no encontrado"));
          return;
        }
        
        if (!(await bcrypt.compare(userData.currentPassword, user.password))) {
          reject(new Error("La contraseña actual no es correcta"));
          return;
        }
        
        // Encriptar la nueva contraseña
        userData.password = bcrypt.hashSync(userData.newPassword, 10);
      }
      
      // Eliminar campos que no se guardan en la BD
      const dataToUpdate = { ...userData };
      delete dataToUpdate.currentPassword;
      delete dataToUpdate.newPassword;
      
      // Si no hay password, eliminarlo también
      if (!dataToUpdate.password) {
        delete dataToUpdate.password;
      }
      
      const user = await Users.update(id, dataToUpdate);
      resolve(user);
    } catch (error) {
      console.log("ERROR in users update:", error);
      reject(error);
    }
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
  findAllActive,
  findById,
  update,
  changePassword,
  updateRefreshToken,
  updateAccessToken,
  resetPassword,
};
