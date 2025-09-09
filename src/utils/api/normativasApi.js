import fetchApi from './fetchApi';

const normativasApi = {
  // Crear nueva normativa
  create: async (normativaData) => {
    try {
      const response = await fetchApi('/normativas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(normativaData),
      });
      return response;
    } catch (error) {
      console.error('Error creando normativa:', error);
      throw error;
    }
  },

  // Obtener todas las normativas
  list: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.tipo) queryParams.append('tipo', filters.tipo);
      if (filters.activa !== undefined) queryParams.append('activa', filters.activa);
      if (filters.fecha_vigencia) queryParams.append('fecha_vigencia', filters.fecha_vigencia);
      if (filters.search) queryParams.append('search', filters.search);

      const url = `/normativas${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await fetchApi(url);
      return response;
    } catch (error) {
      console.error('Error obteniendo normativas:', error);
      throw error;
    }
  },

  // Obtener normativa por ID
  getById: async (id) => {
    try {
      const response = await fetchApi(`/normativas/${id}`);
      return response;
    } catch (error) {
      console.error('Error obteniendo normativa:', error);
      throw error;
    }
  },

  // Actualizar normativa
  update: async (id, updateData) => {
    try {
      const response = await fetchApi(`/normativas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      return response;
    } catch (error) {
      console.error('Error actualizando normativa:', error);
      throw error;
    }
  },

  // Eliminar normativa
  delete: async (id) => {
    try {
      const response = await fetchApi(`/normativas/${id}`, {
        method: 'DELETE',
      });
      return response;
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
      const response = await fetchApi(url);
      return response;
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
      const response = await fetchApi(url);
      return response;
    } catch (error) {
      console.error('Error obteniendo normativa vigente:', error);
      throw error;
    }
  }
};

export default normativasApi;
