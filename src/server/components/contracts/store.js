"use strict";
const { Op, QueryTypes } = require("sequelize");

module.exports = function setupCountry(Model, db, sequelize) {
  function findAll() {
    return Model.findAll();
  }

  function findAllActive() {
    return sequelize.query(` select * from contracts where Active = true`, {
      type: QueryTypes.SELECT,
    });
  }

  function findById(id) {
    return Model.findByPk(id);
  }

  async function create(model) {
    const result = await new Model(model).save();
    return result;
  }

  async function update(_id, model) {
    const cond = { _id };
    const result = await Model.updateOne(cond, { $set: model });
    return result ? Model.findOne(cond) : false;
  }

  function deleteById(_id) {
    return Model.deleteOne({
      _id,
    });
  }

  return {
    findAll,
    findAllActive,
    findById,
    create,
    update,
    deleteById,
  };
};
