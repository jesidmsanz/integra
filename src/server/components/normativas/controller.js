const db = require("../../db/index.js");

function list(filters = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      const { Normativas } = await db();
      const result = await Normativas.findAll(filters);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

function findById(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const { Normativas } = await db();
      const result = await Normativas.findById(id);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

function create(obj) {
  return new Promise(async (resolve, reject) => {
    try {
      const { Normativas } = await db();
      const result = await Normativas.create(obj);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

function update(_id, obj) {
  return new Promise(async (resolve, reject) => {
    try {
      const { Normativas } = await db();
      const result = await Normativas.update(_id, obj);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

function deleteById(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const { Normativas } = await db();
      const result = await Normativas.deleteById(id);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

function getVigentes(fecha = new Date()) {
  return new Promise(async (resolve, reject) => {
    try {
      const { Normativas } = await db();
      const result = await Normativas.getVigentes(fecha);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

function getVigenteByTipo(tipo, fecha = new Date()) {
  return new Promise(async (resolve, reject) => {
    try {
      const { Normativas } = await db();
      const result = await Normativas.getVigenteByTipo(tipo, fecha);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  list,
  findById,
  create,
  update,
  deleteById,
  getVigentes,
  getVigenteByTipo,
};