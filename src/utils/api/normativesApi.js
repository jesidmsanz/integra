import { fetchApi } from "./fetchApi";

const mainRoute = "normatives";

export const normativesApi = {
  // Obtener todas las normativas
  list: (page = 1, limit = 10, activeOnly = false) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      active_only: activeOnly.toString(),
    });
    return fetchApi.get(`/${mainRoute}?${params}`);
  },

  // Obtener normativa por ID
  getById: (id) => {
    return fetchApi.get(`/${mainRoute}/${id}`);
  },

  // Obtener normativa vigente para una fecha específica
  getActiveByDate: (date) => {
    return fetchApi.get(`/${mainRoute}/active-by-date/${date}`);
  },

  // Crear nueva normativa
  create: (data) => {
    return fetchApi.post(`/${mainRoute}`, data);
  },

  // Actualizar normativa
  update: (id, data) => {
    return fetchApi.put(`/${mainRoute}/${id}`, data);
  },

  // Desactivar normativa
  deactivate: (id) => {
    return fetchApi.delete(`/${mainRoute}/${id}/deactivate`);
  },

  // Eliminar normativa
  remove: (id) => {
    return fetchApi.delete(`/${mainRoute}/${id}`);
  },
};


