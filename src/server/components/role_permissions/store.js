"use strict";

module.exports = function setupRolePermissions(RolePermissionsModel, db, sequelize) {
  async function findByRoleId(roleId) {
    return RolePermissionsModel.findAll({
      where: { role_id: roleId },
    });
  }

  async function findByPermissionKey(permissionKey) {
    return RolePermissionsModel.findAll({
      where: { permission_key: permissionKey },
    });
  }

  async function findRolePermissions(roleId) {
    const rolePermissions = await RolePermissionsModel.findAll({
      where: { role_id: roleId },
      attributes: ["permission_key"],
    });
    return rolePermissions.map((rp) => rp.permission_key);
  }

  async function assignPermission(roleId, permissionKey) {
    const existing = await RolePermissionsModel.findOne({
      where: { role_id: roleId, permission_key: permissionKey },
    });

    if (existing) {
      return existing;
    }

    const rolePermission = await RolePermissionsModel.create({
      role_id: roleId,
      permission_key: permissionKey,
    });
    return rolePermission;
  }

  async function removePermission(roleId, permissionKey) {
    const deleted = await RolePermissionsModel.destroy({
      where: { role_id: roleId, permission_key: permissionKey },
    });
    return deleted > 0;
  }

  async function updateRolePermissions(roleId, permissionKeys) {
    // Eliminar todos los permisos actuales del rol
    await RolePermissionsModel.destroy({
      where: { role_id: roleId },
    });

    // Agregar los nuevos permisos usando las keys
    if (permissionKeys && permissionKeys.length > 0) {
      const rolePermissions = permissionKeys.map((permissionKey) => ({
        role_id: roleId,
        permission_key: permissionKey,
      }));

      await RolePermissionsModel.bulkCreate(rolePermissions);
    }

    return true;
  }

  return {
    findByRoleId,
    findByPermissionKey,
    findRolePermissions,
    assignPermission,
    removePermission,
    updateRolePermissions,
  };
};

