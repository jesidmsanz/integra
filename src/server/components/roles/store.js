"use strict";

module.exports = function setupRoles(RolesModel, db, sequelize) {
  function findAll() {
    return RolesModel.findAll({
      where: { active: true },
      order: [["name", "ASC"]],
    });
  }

  function findById(id) {
    return RolesModel.findByPk(id);
  }

  function findByName(name) {
    return RolesModel.findOne({
      where: { name, active: true },
    });
  }

  async function create(roleData) {
    const role = await RolesModel.create(roleData);
    return role.toJSON ? role.toJSON() : role;
  }

  async function update(id, roleData) {
    const role = await RolesModel.findByPk(id);
    if (!role) {
      throw new Error("Rol no encontrado");
    }
    await role.update(roleData);
    return role.toJSON ? role.toJSON() : role;
  }

  async function remove(id) {
    const role = await RolesModel.findByPk(id);
    if (!role) {
      throw new Error("Rol no encontrado");
    }
    await role.update({ active: false });
    return true;
  }

  return {
    findAll,
    findById,
    findByName,
    create,
    update,
    remove,
  };
};

