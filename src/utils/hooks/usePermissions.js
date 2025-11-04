import { useSession } from "next-auth/react";

/**
 * Hook para verificar permisos del usuario
 * @returns {Object} Objeto con funciones para verificar permisos
 */
export function usePermissions() {
  const { data: session } = useSession();

  /**
   * Verifica si el usuario tiene un permiso específico
   * @param {string} permissionKey - Clave del permiso (ej: "payslip.view")
   * @returns {boolean}
   */
  const hasPermission = (permissionKey) => {
    if (!session || !session.permissions) {
      return false;
    }
    return session.permissions.includes(permissionKey);
  };

  /**
   * Verifica si el usuario tiene al menos uno de los permisos especificados
   * @param {string[]} permissionKeys - Array de claves de permisos
   * @returns {boolean}
   */
  const hasAnyPermission = (permissionKeys) => {
    if (!session || !session.permissions || !Array.isArray(permissionKeys)) {
      return false;
    }
    return permissionKeys.some((key) => session.permissions.includes(key));
  };

  /**
   * Verifica si el usuario tiene todos los permisos especificados
   * @param {string[]} permissionKeys - Array de claves de permisos
   * @returns {boolean}
   */
  const hasAllPermissions = (permissionKeys) => {
    if (!session || !session.permissions || !Array.isArray(permissionKeys)) {
      return false;
    }
    return permissionKeys.every((key) => session.permissions.includes(key));
  };

  /**
   * Verifica si el usuario tiene un rol específico
   * @param {string} roleName - Nombre del rol (ej: "superadmin")
   * @returns {boolean}
   */
  const hasRole = (roleName) => {
    if (!session || !session.roles) {
      return false;
    }
    return session.roles.includes(roleName);
  };

  /**
   * Obtiene todos los permisos del usuario
   * @returns {string[]}
   */
  const getPermissions = () => {
    return session?.permissions || [];
  };

  /**
   * Obtiene todos los roles del usuario
   * @returns {string[]}
   */
  const getRoles = () => {
    return session?.roles || [];
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    getPermissions,
    getRoles,
    permissions: session?.permissions || [],
    roles: session?.roles || [],
  };
}

export default usePermissions;

