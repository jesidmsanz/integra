const db = require("../../db/index.js");

function findAll() {
  return new Promise(async (resolve, reject) => {
    const { Companies } = await db();
    const result = await Companies.findAll();
    resolve(result);
  });
}

function findAllActive() {
  return new Promise(async (resolve, reject) => {
    const { Companies } = await db();
    const result = await Companies.findAllActive();
    resolve(result);
  });
}

function findById(id) {
  return new Promise(async (resolve, reject) => {
    const { Companies } = await db();
    const result = await Companies.findById(id);
    resolve(result);
  });
}

function create(obj) {
  return new Promise(async (resolve, reject) => {
    const { Companies } = await db();
    const result = await Companies.create(obj);
    resolve(result);
  });
}

function update(_id, obj) {
  return new Promise(async (resolve, reject) => {
    const { Companies } = await db();
    const result = await Companies.update(_id, obj);
    resolve(result);
  });
}

function deleteById(id) {
  return new Promise(async (resolve, reject) => {
    const { Companies } = await db();
    const result = await Companies.deleteById(id);
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