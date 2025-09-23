import fetchApi, { getAxiosError } from "./fetchApi";

const mainRoute = "type_news";

const typeNewsApi = {
  list: async (page = 1, limit = 30) => {
    try {
      const response = await fetchApi.get(
        `${mainRoute}?page=${page}&limit=${limit}`
      );
      
      // Manejar diferentes estructuras de respuesta
      if (response.data && response.data.body) {
        // Si tiene body, usar la estructura del body
        return response.data.body.data || response.data.body || [];
      } else if (response.data && response.data.data) {
        // Si tiene data directamente
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        // Si es un array directo
        return response.data;
      } else {
        // Fallback
        return [];
      }
    } catch (error) {
      console.error("Error al obtener la lista de tipos de novedades", error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const { data } = await fetchApi.post(mainRoute, data);
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
