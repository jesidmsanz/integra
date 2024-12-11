"use strict";
const { Op, QueryTypes } = require("sequelize");

module.exports = function setupCountry(Model, db) {
  function findAll() {
    return Model.findAll();
  }

  function findAllActive() {
    return sequelize.query(
      ` select * from employees where users.status = true`,
      {
        type: QueryTypes.SELECT,
      }
    );
  }

  function findById(id) {
    return Model.findByPk(id);
  }

  async function create(form) {
    try {
      const result = await Model.create(form);
      return result.toJSON();
    } catch (error) {
      console.log("Error to create", error);
      return { error };
    }
  }

  async function update(id, model) {
    const cond = {
      where: { id },
    };
    const result = await Model.update(model, cond);
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
