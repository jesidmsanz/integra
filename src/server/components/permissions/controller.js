import db from "@/db/index";

function findAll() {
  return new Promise(async (resolve, reject) => {
    try {
      const { Permissions } = await db();
      const result = await Permissions.findAll();
      resolve(result);
    } catch (error) {
      console.log("ERROR in permissions findAll:", error);
      reject(error);
    }
  });
}

function findById(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const { Permissions } = await db();
      const permission = await Permissions.findById(id);
      if (!permission) {
        reject(new Error("Permiso no encontrado"));
        return;
      }
      resolve(permission);
    } catch (error) {
      console.log("ERROR in permissions findById:", error);
      reject(error);
    }
  });
}

function create(permissionData) {
  return new Promise(async (resolve, reject) => {
    try {
      const { Permissions } = await db();
      const permission = await Permissions.create(permissionData);
      resolve(permission);
    } catch (error) {
      console.log("ERROR in permissions create:", error);
      reject(error);
    }
  });
}

function update(id, permissionData) {
  return new Promise(async (resolve, reject) => {
    try {
      const { Permissions } = await db();
      const permission = await Permissions.update(id, permissionData);
      resolve(permission);
    } catch (error) {
      console.log("ERROR in permissions update:", error);
      reject(error);
    }
  });
}

function remove(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const { Permissions } = await db();
      await Permissions.remove(id);
      resolve({ success: true });
    } catch (error) {
      console.log("ERROR in permissions remove:", error);
      reject(error);
    }
  });
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};

