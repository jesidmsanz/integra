import fetchApi, { getAxiosError } from "./fetchApi";

const mainRoute = "type_news";

const typeNewsApi = {
  list: async (page = 1, limit = 30) => {
    try {
      // Construir query params solo si son válidos para evitar enviar "undefined"
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
          pagination: body.pagination
        };
      } else if (response.data && response.data.data) {
        // Si tiene data directamente
        return {
          data: response.data.data || [],
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
          totalPages: response.data.totalPages,
          pagination: response.data.pagination
        };
      } else if (Array.isArray(response.data)) {
        // Si es un array directo (fallback para compatibilidad)
        return {
          data: response.data,
          total: response.data.length,
          page: 1,
          limit: response.data.length,
          totalPages: 1,
          pagination: {}
        };
      } else {
        // Fallback
        return {
          data: [],
          total: 0,
          page: 1,
          limit: limit,
          totalPages: 0,
          pagination: {}
        };
      }
    } catch (error) {
      console.error("Error al obtener la lista de tipos de novedades", error);
      throw error;
    }
  },

  create: async (formData) => {
    try {
      const { data } = await fetchApi.post(mainRoute, formData);
      return data.body;
    } catch (error) {
      console.error("Error al crear el tipo de novedad", error);
      throw error;
    }
  },

  update: async (id, obj) => {
    try {
      const { data } = await fetchApi.put(`${mainRoute}/${id}`, obj);
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
};

export default typeNewsApi;
