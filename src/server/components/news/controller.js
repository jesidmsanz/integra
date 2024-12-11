const db = require("../../db/index.js");

function findAll() {
  return new Promise(async (resolve, reject) => {
    const { News } = await db();
    const result = await News.findAll();
    resolve(result);
  });
}

function findAllActive() {
  return new Promise(async (resolve, reject) => {
    const { News } = await db();
    const result = await News.findAllActive();
    resolve(result);
  });
}

function findById(id) {
  return new Promise(async (resolve, reject) => {
    const { News } = await db();
    const result = await News.findById(id);
    resolve(result);
  });
}

function create(obj) {
  return new Promise(async (resolve, reject) => {
    const { News } = await db();
    const result = await News.create(obj);
    resolve(result);
  });
}

function update(_id, obj) {
  return new Promise(async (resolve, reject) => {
    const { News } = await db();
    const result = await News.update(_id, obj);
    resolve(result);
  });
}

function deleteById(id) {
  return new Promise(async (resolve, reject) => {
    const { News } = await db();
    const result = await News.deleteById(id);
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
