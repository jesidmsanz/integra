import fetchApi from "./fetchApi";

const mainRoute = "/liquidation_news_tracking";

const liquidationNewsTrackingApi = {
  // Crear registro de trazabilidad
  create: async (trackingData) => {
    try {
      console.log("🔄 Creando registro de trazabilidad...");
      console.log("📊 Datos:", trackingData);
      
      const response = await fetchApi.post(mainRoute, trackingData);
      
      console.log("✅ Registro de trazabilidad creado");
      return response.data;
    } catch (error) {
      console.error("Error al crear registro de trazabilidad", error);
      throw error;
    }
  },

  // Obtener trazabilidad por liquidación
  getByLiquidationId: async (liquidationId) => {
    try {
      console.log("🔄 Obteniendo trazabilidad por liquidación ID:", liquidationId);
      
      const response = await fetchApi.get(`${mainRoute}/by-liquidation/${liquidationId}`);
      
      console.log("📊 Trazabilidad obtenida:", response.data);
      return response.data.body || response.data || [];
    } catch (error) {
      console.error("Error al obtener trazabilidad por liquidación", error);
      throw error;
    }
  },

  // Obtener trazabilidad por novedad de empleado
  getByEmployeeNewsId: async (employeeNewsId) => {
    try {
      console.log("🔄 Obteniendo trazabilidad por novedad de empleado ID:", employeeNewsId);
      
      const response = await fetchApi.get(`${mainRoute}/by-employee-news/${employeeNewsId}`);
      
      console.log("📊 Trazabilidad obtenida:", response.data);
      return response.data.body || response.data || [];
    } catch (error) {
      console.error("Error al obtener trazabilidad por novedad de empleado", error);
      throw error;
    }
  },

  // Obtener estadísticas de trazabilidad
  getStats: async (companyId = null, startDate = null, endDate = null) => {
    try {
      console.log("🔄 Obteniendo estadísticas de trazabilidad...");
      console.log("📊 Parámetros:", { companyId, startDate, endDate });
      
      let url = `${mainRoute}/stats`;
      const params = new URLSearchParams();
      
      if (companyId) params.append('companyId', companyId);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetchApi.get(url);
      
      console.log("📊 Estadísticas obtenidas:", response.data);
      return response.data.body || response.data || [];
    } catch (error) {
      console.error("Error al obtener estadísticas de trazabilidad", error);
      throw error;
    }
  },

  // Obtener novedades incluidas en una liquidación
  getIncludedNews: async (liquidationId) => {
    try {
      console.log("🔄 Obteniendo novedades incluidas en liquidación:", liquidationId);
      
      const response = await fetchApi.get(`${mainRoute}/included/${liquidationId}`);
      
      console.log("📊 Novedades incluidas obtenidas:", response.data);
      return response.data.body || response.data || [];
    } catch (error) {
      console.error("Error al obtener novedades incluidas", error);
      throw error;
    }
  },

  // Obtener novedades excluidas de una liquidación
  getExcludedNews: async (liquidationId) => {
    try {
      console.log("🔄 Obteniendo novedades excluidas de liquidación:", liquidationId);
      
      const response = await fetchApi.get(`${mainRoute}/excluded/${liquidationId}`);
      
      console.log("📊 Novedades excluidas obtenidas:", response.data);
      return response.data.body || response.data || [];
    } catch (error) {
      console.error("Error al obtener novedades excluidas", error);
      throw error;
    }
  },

  // Actualizar estado de trazabilidad
  updateStatus: async (id, status, notes = null) => {
    try {
      console.log("🔄 Actualizando estado de trazabilidad ID:", id);
      console.log("📊 Nuevo estado:", status);
      
      const response = await fetchApi.put(`${mainRoute}/${id}/status`, {
        status,
        notes
      });
      
      console.log("✅ Estado de trazabilidad actualizado");
      return response.data;
    } catch (error) {
      console.error("Error al actualizar estado de trazabilidad", error);
      throw error;
    }
  },

  // Eliminar trazabilidad por liquidación
  deleteByLiquidationId: async (liquidationId) => {
    try {
      console.log("🔄 Eliminando trazabilidad por liquidación ID:", liquidationId);
      
      const response = await fetchApi.delete(`${mainRoute}/by-liquidation/${liquidationId}`);
      
      console.log("✅ Trazabilidad eliminada");
      return response.data;
    } catch (error) {
      console.error("Error al eliminar trazabilidad por liquidación", error);
      throw error;
    }
  },
};

export default liquidationNewsTrackingApi;
