/**
 * Mapeo de rutas a permisos requeridos
 * Cada ruta puede requerir uno o más permisos
 */
export const PERMISSIONS_MAP = {
  // Liquidaciones
  "/admin/liquidacion": ["liquidation.create"],
  "/admin/liquidaciones_guardadas": ["liquidation.view"],
  "/admin/volantes_pago": ["payslip.view"],
  
  // Empleados
  "/admin/empleados": ["employee.view"],
  
  // Empresas
  "/admin/empresas": ["company.view"],
  
  // Normativas
  "/admin/normativas": ["normative.view"],
  
  // Novedades
  "/admin/novedades": ["news.view"],
  "/admin/novedades_empleados": ["news.register"],
  "/admin/aprobacion_novedades": ["news.approve"],
  
  // Configuración
  "/admin/configuracion": ["config.users", "config.roles", "config.permissions"],
};

/**
 * Obtiene los permisos requeridos para una ruta
 * @param {string} path - Ruta a verificar
 * @returns {string[]} Array de permisos requeridos
 */
export function getRequiredPermissions(path) {
  return PERMISSIONS_MAP[path] || [];
}

