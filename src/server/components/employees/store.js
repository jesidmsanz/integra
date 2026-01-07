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

  function findAllActive(startDate = null) {
    let query = `SELECT * FROM employees WHERE employees.active = true`;
    // Si se proporciona startDate, filtrar por fecha de finalización de contrato
    // Solo traer empleados que:
    // 1. No tengan fecha de finalización (contrato indefinido)
    // 2. O tengan fecha de finalización >= startDate (aún activos durante el período)
    if (startDate) {
      query += ` AND (employees.contractenddate IS NULL OR DATE(employees.contractenddate) >= DATE(:startDate))`;
    }

    const replacements = startDate ? { startDate } : {};

    return sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements,
    });
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
