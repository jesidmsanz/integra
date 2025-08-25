"use strict";
const { Op, QueryTypes } = require("sequelize");

module.exports = function setupCountry(Model, db, sequelize) {
  function findAll(options = {}) {
    const { order = [["id", "ASC"]] } = options;
    return Model.findAll({ order });
  }

  function count() {
    return Model.count();
  }

  function findAllActive() {
    return sequelize.query(
      ` select * from employees where employees.active = true`,
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
    return Model.destroy({
      where: { id: _id },
    });
  }

  return {
    findAll,
    count,
    findAllActive,
    findById,
    create,
    update,
    deleteById,
  };
};
