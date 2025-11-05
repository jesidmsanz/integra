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
  "/admin/contratos": ["employee.view"],
  
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
  
  // Dashboard - sin permisos específicos, pero requiere autenticación
  "/admin/dashboard": [],
};

/**
 * Obtiene los permisos requeridos para una ruta
 * @param {string} path - Ruta a verificar
 * @returns {string[]} Array de permisos requeridos
 */
export function getRequiredPermissions(path) {
  // Verificar ruta exacta primero
  if (PERMISSIONS_MAP[path]) {
    return PERMISSIONS_MAP[path];
  }
  
  // Verificar rutas de detalle (ej: /admin/empleados/detalle/123)
  // Si la ruta comienza con una ruta protegida, usar sus permisos
  for (const [route, permissions] of Object.entries(PERMISSIONS_MAP)) {
    if (path.startsWith(route + "/") || path.startsWith(route + "?")) {
      return permissions;
    }
  }
  
  // Si no se encuentra, retornar array vacío (requiere autenticación pero no permisos específicos)
  return [];
}

