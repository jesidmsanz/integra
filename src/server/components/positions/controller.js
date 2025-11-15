const db = require("../../db/index.js");

function findAll() {
  return new Promise(async (resolve, reject) => {
    try {
      const { Positions } = await db();
      const result = await Positions.findAll();
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

function findAllActive() {
  return new Promise(async (resolve, reject) => {
    try {
      const { Positions } = await db();
      const result = await Positions.findAllActive();
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

function findById(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const { Positions } = await db();
      const result = await Positions.findById(id);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

function create(obj) {
  return new Promise(async (resolve, reject) => {
    try {
      const { Positions } = await db();
      const result = await Positions.create(obj);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

function update(_id, obj) {
  return new Promise(async (resolve, reject) => {
    try {
      const { Positions } = await db();
      const result = await Positions.update(_id, obj);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

function deleteById(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const { Positions } = await db();
      const result = await Positions.deleteById(id);
      resolve(result);
    } catch (error) {
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
};

