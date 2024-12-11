const db = require("../../db/index.js");

function findAll() {
  return new Promise(async (resolve, reject) => {
    const { Contracts } = await db();
    const result = await Contracts.findAll();
    resolve(result);
  });
}

function findAllActive() {
  return new Promise(async (resolve, reject) => {
    const { Contracts } = await db();
    const result = await Contracts.findAllActive();
    resolve(result);
  });
}

function findById(id) {
  return new Promise(async (resolve, reject) => {
    const { Contracts } = await db();
    const result = await Contracts.findById(id);
    resolve(result);
  });
}

function create(obj) {
  return new Promise(async (resolve, reject) => {
    const { Contracts } = await db();
    const result = await Contracts.create(obj);
    resolve(result);
  });
}

function update(_id, obj) {
  return new Promise(async (resolve, reject) => {
    const { Contracts } = await db();
    const result = await Contracts.update(_id, obj);
    resolve(result);
  });
}

function deleteById(id) {
  return new Promise(async (resolve, reject) => {
    const { Contracts } = await db();
    const result = await Contracts.deleteById(id);
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
