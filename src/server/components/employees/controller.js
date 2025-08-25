const db = require("../../db/index.js");

function findAll(page = 1, limit = 30, searchTerm = "") {
  return new Promise(async (resolve, reject) => {
    try {
      const { Employees } = await db();
      
      // Traer TODOS los empleados
      const result = await Employees.findAll({
        order: [['id', 'ASC']]
      });
      
      // Devolver todos los datos
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

function findAllActive() {
  return new Promise(async (resolve, reject) => {
    const { Employees } = await db();
    const result = await Employees.findAllActive();
    resolve(result);
  });
}

function findById(id) {
  return new Promise(async (resolve, reject) => {
    const { Employees } = await db();
    const result = await Employees.findById(id);
    resolve(result);
  });
}

function create(obj) {
  return new Promise(async (resolve, reject) => {
    const { Employees } = await db();
    const result = await Employees.create(obj);
    resolve(result);
  });
}

function update(_id, obj) {
  return new Promise(async (resolve, reject) => {
    const { Employees } = await db();
    const result = await Employees.update(_id, obj);
    resolve(result);
  });
}

function deleteById(id) {
  return new Promise(async (resolve, reject) => {
    const { Employees } = await db();
    const result = await Employees.deleteById(id);
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
