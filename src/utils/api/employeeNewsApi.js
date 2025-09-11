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
};

export default employeeNewsApi;
