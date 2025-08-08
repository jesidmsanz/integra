import fetchApi, { getAxiosError } from "./fetchApi";

const mainRoute = "employee_news";

const employeeNewsApi = {
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
            'Content-Type': 'multipart/form-data',
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
      let config = {};
      
      // Si es FormData (con archivo), no establecer Content-Type
      if (obj instanceof FormData) {
        config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
      }

      const { data } = await fetchApi.put(`${mainRoute}/${id}`, obj, config);
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

export default employeeNewsApi;
