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
    const { EmployeeNews } = await db();
    
    // Si hay un archivo subido, guardar el path
    if (obj.document) {
      obj.document = `/files/${obj.document}`;
    }
    
    const result = await EmployeeNews.create(obj);
    resolve(result);
  });
}

function update(_id, obj) {
  return new Promise(async (resolve, reject) => {
    const { EmployeeNews } = await db();
    
    // Si hay un archivo subido, guardar el path
    if (obj.document) {
      obj.document = `/files/${obj.document}`;
    }
    
    const result = await EmployeeNews.update(_id, obj);
    resolve(result);
  });
}

function deleteById(id) {
  return new Promise(async (resolve, reject) => {
    const { EmployeeNews } = await db();
    const result = await EmployeeNews.deleteById(id);
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
