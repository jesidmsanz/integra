import db from "@/db/index";

function getRolePermissions(roleId) {
  return new Promise(async (resolve, reject) => {
    try {
      const { RolePermissions } = await db();
      const permissionIds = await RolePermissions.findRolePermissions(roleId);
      resolve(permissionIds);
    } catch (error) {
      console.log("ERROR in getRolePermissions:", error);
      reject(error);
    }
  });
}

function updateRolePermissions(roleId, permissionKeys) {
  return new Promise(async (resolve, reject) => {
    try {
      const { RolePermissions } = await db();
      await RolePermissions.updateRolePermissions(roleId, permissionKeys);
      resolve({ success: true });
    } catch (error) {
      console.log("ERROR in updateRolePermissions:", error);
      reject(error);
    }
  });
}

function assignPermission(roleId, permissionKey) {
  return new Promise(async (resolve, reject) => {
    try {
      const { RolePermissions } = await db();
      const result = await RolePermissions.assignPermission(roleId, permissionKey);
      resolve(result);
    } catch (error) {
      console.log("ERROR in assignPermission:", error);
      reject(error);
    }
  });
}

function removePermission(roleId, permissionKey) {
  return new Promise(async (resolve, reject) => {
    try {
      const { RolePermissions } = await db();
      const result = await RolePermissions.removePermission(roleId, permissionKey);
      resolve({ success: result });
    } catch (error) {
      console.log("ERROR in removePermission:", error);
      reject(error);
    }
  });
}

module.exports = {
  getRolePermissions,
  updateRolePermissions,
  assignPermission,
  removePermission,
};

