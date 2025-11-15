"use strict";

module.exports = function setupPositions(Model, db, sequelize) {
  function findAll() {
    return Model.findAll({
      order: [['name', 'ASC']]
    });
  }

  function findAllActive() {
    return Model.findAll({
      where: { active: true },
      order: [['name', 'ASC']]
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
      console.log("Error to create position", error);
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

  function deleteById(id) {
    return Model.destroy({
      where: { id },
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

