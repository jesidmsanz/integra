"use strict";

module.exports = function setupPermissions(PermissionsModel, db, sequelize) {
  function findAll() {
    return PermissionsModel.findAll({
      where: { active: true },
      order: [["category", "ASC"], ["name", "ASC"]],
    });
  }

  function findById(id) {
    return PermissionsModel.findByPk(id);
  }

  function findByKey(key) {
    return PermissionsModel.findOne({
      where: { key, active: true },
    });
  }

  function findByCategory(category) {
    return PermissionsModel.findAll({
      where: { category, active: true },
      order: [["name", "ASC"]],
    });
  }

  async function create(permissionData) {
    const permission = await PermissionsModel.create(permissionData);
    return permission.toJSON ? permission.toJSON() : permission;
  }

  async function update(id, permissionData) {
    const permission = await PermissionsModel.findByPk(id);
    if (!permission) {
      throw new Error("Permiso no encontrado");
    }
    await permission.update(permissionData);
    return permission.toJSON ? permission.toJSON() : permission;
  }

  async function remove(id) {
    const permission = await PermissionsModel.findByPk(id);
    if (!permission) {
      throw new Error("Permiso no encontrado");
    }
    await permission.update({ active: false });
    return true;
  }

  return {
    findAll,
    findById,
    findByKey,
    findByCategory,
    create,
    update,
    remove,
  };
};

