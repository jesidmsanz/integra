import fetchApi, { getAxiosError } from "./fetchApi";

const mainRoute = "employee_news";

const employeeNewsApi = {
  list: async (page = 1, limit = 30) => {
    try {
      const params = new URLSearchParams();
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      if (!Number.isNaN(pageNum) && pageNum > 0) params.set("page", pageNum.toString());
      if (!Number.isNaN(limitNum) && limitNum > 0) params.set("limit", limitNum.toString());

      const url = params.toString() ? `${mainRoute}?${params.toString()}` : mainRoute;
      const response = await fetchApi.get(url);

      console.log("🔍 Respuesta completa de fetchApi:", response);

      // Manejar diferentes estructuras de respuesta
      if (response.data && response.data.body) {
        // Si tiene body, usar la estructura del body
        const body = response.data.body;
        return {
          data: body.data || [],
          total: body.total,
          page: body.page,
          limit: body.limit,
          totalPages: body.totalPages,
        };
      } else if (response.data && response.data.data) {
        // Si tiene data directamente
        return {
          data: response.data.data || [],
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
          totalPages: response.data.totalPages,
        };
      } else if (Array.isArray(response.data)) {
        // Si es un array directo (fallback para compatibilidad)
        return {
          data: response.data,
          total: response.data.length,
          page: 1,
          limit: response.data.length,
          totalPages: 1,
        };
      } else {
        // Fallback
        return {
          data: [],
          total: 0,
          page: 1,
          limit: limitNum,
          totalPages: 0,
        };
      }
    } catch (error) {
      console.error("Error al obtener la lista de novedades de empleados", error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const { data } = await fetchApi.get(`${mainRoute}/${id}`);
      return data.body;
    } catch (error) {
      console.error("Error al obtener la novedad por ID", error);
      throw error;
    }
  },

  create: async (obj) => {
    try {
      let config = {};
      // Si es FormData (con archivo), no establecer Content-Type
      if (obj instanceof FormData) {
        config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
      }

      const { data } = await fetchApi.post(mainRoute, obj, config);
      return data.body;
    } catch (error) {
      console.error("Error al crear el tipo de novedad", error);
      throw error;
    }
  },

  update: async (id, obj) => {
    try {
      console.log("=== EMPLOYEE NEWS API UPDATE ===");
      console.log("ID:", id);
      console.log("obj:", obj);
      console.log("Es FormData:", obj instanceof FormData);
      
      let config = {};
      
      // Si es FormData (con archivo), configurar para multipart
      if (obj instanceof FormData) {
        config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
        console.log("Usando FormData - config:", config);
      } else {
        // Para objetos JSON normales, usar application/json
        config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        console.log("Usando JSON - config:", config);
        
        // Solo para objetos normales, eliminar document si no existe
        if (!obj.document) delete obj.document;
      }
      
      console.log("Config final:", config);
      console.log("Datos a enviar:", obj);

      const { data } = await fetchApi.put(`${mainRoute}/${id}`, obj, config);
      console.log("Respuesta del servidor:", data);
      return data.body;
    } catch (error) {
      console.error("Error al actualizar el tipo de novedad", error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await fetchApi.delete(`${mainRoute}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar el tipo de novedad", error);
      throw error;
    }
  },

  getPendingByPeriod: async (startDate, endDate, companyId) => {
    try {
      console.log("🔄 Obteniendo novedades pendientes por período...");
      console.log("📅 Parámetros:", { startDate, endDate, companyId });
      
      const response = await fetchApi.get(
        `${mainRoute}/pending-by-period?startDate=${startDate}&endDate=${endDate}&companyId=${companyId}`
      );
      
      console.log("📊 Respuesta de novedades pendientes:", response.data);
      return response.data.body || response.data || [];
    } catch (error) {
      console.error("Error al obtener novedades pendientes por período", error);
      throw error;
    }
  },

  getByLiquidationStatus: async (status, companyId = null, startDate = null, endDate = null) => {
    try {
      console.log("🔄 Obteniendo novedades por estado de liquidación...");
      console.log("📊 Parámetros:", { status, companyId, startDate, endDate });
      
      let url = `${mainRoute}/by-liquidation-status?status=${status}`;
      if (companyId) url += `&companyId=${companyId}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;
      
      const response = await fetchApi.get(url);
      
      console.log("📊 Respuesta de novedades por estado:", response.data);
      return response.data.body || response.data || [];
    } catch (error) {
      console.error("Error al obtener novedades por estado de liquidación", error);
      throw error;
    }
  },

  markAsLiquidated: async (employeeNewsIds, liquidationId) => {
    try {
      console.log("🔄 Marcando novedades como liquidadas...");
      console.log("📊 Parámetros:", { employeeNewsIds, liquidationId });
      
      const response = await fetchApi.put(`${mainRoute}/mark-as-liquidated`, {
        employeeNewsIds,
        liquidationId
      });
      
      console.log("✅ Novedades marcadas como liquidadas");
      return response.data;
    } catch (error) {
      console.error("Error al marcar novedades como liquidadas", error);
      throw error;
    }
  },

  restoreToPending: async (employeeNewsIds) => {
    try {
      console.log("🔄 Restaurando novedades a pendientes...");
      console.log("📊 Parámetros:", { employeeNewsIds });
      
      const response = await fetchApi.put(`${mainRoute}/restore-to-pending`, {
        employeeNewsIds
      });
      
      console.log("✅ Novedades restauradas a pendientes");
      return response.data;
    } catch (error) {
      console.error("Error al restaurar novedades a pendientes", error);
      throw error;
    }
  },
};

export default employeeNewsApi;
