const db = require("../../db/index.js");

function findAll() {
  return new Promise(async (resolve, reject) => {
    const { TypeNews } = await db();
    const result = await TypeNews.findAll();
    resolve(result);
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
