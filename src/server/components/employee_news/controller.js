const db = require("../../db/index.js");

function findAll() {
  return new Promise(async (resolve, reject) => {
    const { EmployeeNews } = await db();
    const result = await EmployeeNews.findAll();
    resolve(result);
  });
}

function findAllActive() {
  return new Promise(async (resolve, reject) => {
    const { EmployeeNews } = await db();
    const result = await EmployeeNews.findAllActive();
    resolve(result);
  });
}

function findById(id) {
  return new Promise(async (resolve, reject) => {
    const { EmployeeNews } = await db();
    const result = await EmployeeNews.findById(id);
    resolve(result);
  });
}

function create(obj) {
  return new Promise(async (resolve, reject) => {
    try {
      const { EmployeeNews } = await db();
      
      // Crear una copia del objeto para no modificar el original
      const createData = { ...obj };
      
      // Si hay un archivo subido, guardar el path
      if (createData.document) {
        createData.document = `/files/${createData.document}`;
      }
      
      console.log("Datos para crear:", createData);
      
      const result = await EmployeeNews.create(createData);
      resolve(result);
    } catch (error) {
      console.error("Error en create controller:", error);
      reject(error);
    }
  });
}

function update(_id, obj) {
  return new Promise(async (resolve, reject) => {
    try {
      const { EmployeeNews } = await db();
      
      // Crear una copia del objeto para no modificar el original
      const updateData = { ...obj };
      
      // Si hay un archivo subido, guardar el path
      if (updateData.document) {
        updateData.document = `/files/${updateData.document}`;
      }
      
      console.log("=== UPDATE CONTROLLER ===");
      console.log("ID a actualizar:", _id);
      console.log("Datos para actualizar:", updateData);
      console.log("Campo approved:", updateData.approved);
      
      const result = await EmployeeNews.update(_id, updateData);
      console.log("Resultado de la actualización:", result);
      
      // Verificar que se actualizó correctamente
      if (result && result[0] > 0) {
        console.log("✅ Registro actualizado exitosamente");
        const updatedRecord = await EmployeeNews.findById(_id);
        console.log("Registro actualizado:", updatedRecord);
      } else {
        console.log("❌ No se actualizó ningún registro");
      }
      
      resolve(result);
    } catch (error) {
      console.error("Error en update controller:", error);
      reject(error);
    }
  });
}

function deleteById(id) {
  return new Promise(async (resolve, reject) => {
    const { EmployeeNews } = await db();
    const result = await EmployeeNews.deleteById(id);
    resolve(result);
  });
}

function getPendingByPeriod(startDate, endDate, companyId) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("🔄 Obteniendo novedades pendientes por período...");
      console.log("📅 Fecha inicio:", startDate);
      console.log("📅 Fecha fin:", endDate);
      console.log("🏢 Empresa ID:", companyId);
      
      const { EmployeeNews } = await db();
      const result = await EmployeeNews.getPendingByPeriod(startDate, endDate, companyId);
      
      console.log("📋 Novedades encontradas:", result.length);
      resolve(result);
    } catch (error) {
      console.error("❌ Error en getPendingByPeriod controller:", error);
      reject(error);
    }
  });
}

module.exports = {
  findAll,
  findAllActive,
  findById,
  create,
  update,
  deleteById,
  getPendingByPeriod,
};
