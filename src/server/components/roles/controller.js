import db from "@/db/index";

function findAll() {
  return new Promise(async (resolve, reject) => {
    try {
      const { Roles } = await db();
      const result = await Roles.findAll();
      // Asegurar que los resultados estén serializados correctamente
      const serializedResult = result.map(role => 
        role.toJSON ? role.toJSON() : role
      );
      console.log("Roles encontrados:", serializedResult.length);
      resolve(serializedResult);
    } catch (error) {
      console.log("ERROR in roles findAll:", error);
      reject(error);
    }
  });
}

function findById(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const { Roles } = await db();
      const role = await Roles.findById(id);
      if (!role) {
        reject(new Error("Rol no encontrado"));
        return;
      }
      resolve(role);
    } catch (error) {
      console.log("ERROR in roles findById:", error);
      reject(error);
    }
  });
}

function create(roleData) {
  return new Promise(async (resolve, reject) => {
    try {
      const { Roles } = await db();
      const role = await Roles.create(roleData);
      resolve(role);
    } catch (error) {
      console.log("ERROR in roles create:", error);
      reject(error);
    }
  });
}

function update(id, roleData) {
  return new Promise(async (resolve, reject) => {
    try {
      const { Roles } = await db();
      const role = await Roles.update(id, roleData);
      resolve(role);
    } catch (error) {
      console.log("ERROR in roles update:", error);
      reject(error);
    }
  });
}

function remove(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const { Roles } = await db();
      await Roles.remove(id);
      resolve({ success: true });
    } catch (error) {
      console.log("ERROR in roles remove:", error);
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

