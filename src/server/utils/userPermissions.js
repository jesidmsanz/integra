"use strict";

/**
 * Obtiene todos los permisos de un usuario basado en sus roles
 */
async function getUserPermissions(userId) {
  try {
    const db = require("../db/index");
    const { Users, Roles, RolePermissions } = await db();

    // Obtener el usuario con sus roles
    const user = await Users.findById(userId);
    if (!user || !user.roles || user.roles.length === 0) {
      return [];
    }

    // Obtener los IDs de los roles desde los nombres
    const roleNames = Array.isArray(user.roles) ? user.roles : [];
    const roles = await Promise.all(
      roleNames.map(async (roleName) => {
        const role = await Roles.findByName(roleName);
        return role ? role.id : null;
      })
    );

    const roleIds = roles.filter((id) => id !== null);

    if (roleIds.length === 0) {
      return [];
    }

    // Obtener todos los permisos de todos los roles del usuario
    const allPermissions = new Set();
    for (const roleId of roleIds) {
      const permissions = await RolePermissions.findRolePermissions(roleId);
      permissions.forEach((perm) => allPermissions.add(perm));
    }

    return Array.from(allPermissions);
  } catch (error) {
    console.error("Error obteniendo permisos del usuario:", error);
    return [];
  }
}

module.exports = { getUserPermissions };

