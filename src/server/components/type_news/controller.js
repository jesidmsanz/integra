const db = require("../../db/index.js");

function findAll(page = 1, limit = 30) {
  return new Promise(async (resolve, reject) => {
    try {
      const { TypeNews } = await db();
      
      // Calcular offset para la paginación
      const offset = (page - 1) * limit;
      
      // Obtener el total de registros
      const total = await TypeNews.count();
      
      // Obtener los datos paginados
      const result = await TypeNews.findAll({
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['id', 'ASC']]
      });
      
      // Devolver objeto con datos y metadata de paginación
      const response = {
        data: result,
        total: total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      };
      
      resolve(response);
    } catch (error) {
      console.error("❌ Error en controlador findAll:", error);
      reject(error);
    }
  });
}

function findAllActive() {
  return new Promise(async (resolve, reject) => {
    const { TypeNews } = await db();
    const result = await TypeNews.findAllActive();
    resolve(result);
  });
}

function findById(id) {
  return new Promise(async (resolve, reject) => {
    const { TypeNews } = await db();
    const result = await TypeNews.findById(id);
    resolve(result);
  });
}

function create(obj) {
  return new Promise(async (resolve, reject) => {
    const { TypeNews } = await db();
    const result = await TypeNews.create(obj);
    resolve(result);
  });
}

function update(_id, obj) {
  return new Promise(async (resolve, reject) => {
    const { TypeNews } = await db();
    const result = await TypeNews.update(_id, obj);
    resolve(result);
  });
}

function deleteById(id) {
  return new Promise(async (resolve, reject) => {
    const { TypeNews } = await db();
    const result = await TypeNews.deleteById(id);
    resolve(result);
  });
}

module.exports = {
  findAll,
  findAllActive,
  findById,
  create,
  update,
  deleteById,
};
