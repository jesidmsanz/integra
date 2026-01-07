import fetchApi from './fetchApi';

const normativasApi = {
  // Crear nueva normativa
  create: async (normativaData) => {
    try {
      const response = await fetchApi.post('/normativas', normativaData);
      return response.data;
    } catch (error) {
      console.error('Error creando normativa:', error);
      throw error;
    }
  },

  // Obtener todas las normativas
  list: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();

      if (filters.tipo && filters.tipo !== '') {
        queryParams.append('tipo', filters.tipo);
      }
      if (filters.activa !== undefined && filters.activa !== '') {
        queryParams.append('activa', filters.activa);
      }
      if (filters.fecha_vigencia) {
        queryParams.append('fecha_vigencia', filters.fecha_vigencia);
      }
      if (filters.search && filters.search.trim() !== '') {
        queryParams.append('search', filters.search.trim());
      }

      const url = `/normativas${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await fetchApi.get(url);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo normativas:', error);
      throw error;
    }
  },

  // Obtener normativa por ID
  getById: async (id) => {
    try {
      const response = await fetchApi.get(`/normativas/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo normativa:', error);
      throw error;
    }
  },

  // Actualizar normativa
  update: async (id, updateData) => {
    try {
      console.log('📤 Frontend: Enviando updateData:', updateData);
      const response = await fetchApi.put(`/normativas/${id}`, updateData);
      console.log('📥 Frontend: Respuesta recibida:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error actualizando normativa:', error);
      throw error;
    }
  },

  // Eliminar normativa
  delete: async (id) => {
    try {
      const response = await fetchApi.delete(`/normativas/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando normativa:', error);
      throw error;
    }
  },

  // Obtener normativas vigentes
  getVigentes: async (fecha) => {
    try {
      const queryParams = new URLSearchParams();
      if (fecha) queryParams.append('fecha', fecha);

      const url = `/normativas/vigentes${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await fetchApi.get(url);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo normativas vigentes:', error);
      throw error;
    }
  },

  // Obtener normativa vigente por tipo
  getVigenteByTipo: async (tipo, fecha) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('tipo', tipo);
      if (fecha) queryParams.append('fecha', fecha);

      const url = `/normativas/vigente?${queryParams.toString()}`;
      const response = await fetchApi.get(url);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo normativa vigente:', error);
      throw error;
    }
  }
};

export default normativasApi;
