"use strict";
const { Op, QueryTypes } = require("sequelize");

module.exports = function setupCountry(Model, db, sequelize) {
  function findAll() {
    return sequelize.query(
      `
    SELECT 
  en.*,
  CONCAT(u."firstName", ' ', u."lastName") AS approved_by_name,
  tn.name AS type_news_name,
  e.fullname AS employee_name
FROM employee_news en
INNER JOIN users u ON en."approvedBy" = u.id
INNER JOIN type_news tn ON en."typeNewsId" = tn.id
INNER JOIN employees e ON en."employeeId" = e.id
ORDER BY en.id DESC;
    `,
      {
        type: QueryTypes.SELECT,
      }
    );
  }

  function findAllActive() {
    return sequelize.query(
      ` select * from employee_news where employee_news.status = true`,
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
