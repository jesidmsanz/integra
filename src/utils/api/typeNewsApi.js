import fetchApi, { getAxiosError } from "./fetchApi";

const mainRoute = "type_news";

const typeNewsApi = {
  list: async (page = 1, limit = 30) => {
    try {
      const { data } = await fetchApi.get(
        `${mainRoute}?page=${page}&limit=${limit}`
      );
      return data.body;
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
