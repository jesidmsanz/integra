import fetchApi, { getAxiosError } from "./fetchApi";

const mainRoute = "liquidations";

const liquidationsApi = {
  list: async (page = 1, limit = 30) => {
    try {
      const response = await fetchApi.get(
        `/${mainRoute}?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      throw getAxiosError(error);
    }
  },

  getById: async (id) => {
    try {
      console.log("🔍 Obteniendo liquidación por ID:", id);
      const response = await fetchApi.get(`/${mainRoute}/${id}`);
      return response.data;
    } catch (error) {
      throw getAxiosError(error);
    }
  },

  create: async (obj) => {
    try {
      const response = await fetchApi.post(`/${mainRoute}`, obj);
      return response.data;
    } catch (error) {
      throw getAxiosError(error);
    }
  },

  update: async (id, obj) => {
    try {
      const response = await fetchApi.put(`/${mainRoute}/${id}`, obj);
      return response.data;
    } catch (error) {
      throw getAxiosError(error);
    }
  },

  approve: async (id, approvedBy) => {
    try {
      const response = await fetchApi.put(
        `/${mainRoute}/${id}/approve`,
        approvedBy
      );
      return response.data;
    } catch (error) {
      throw getAxiosError(error);
    }
  },

  markAsPaid: async (id) => {
    try {
      const response = await fetchApi.put(`/${mainRoute}/${id}/paid`);
      return response.data;
    } catch (error) {
      throw getAxiosError(error);
    }
  },

  delete: async (id) => {
    try {
      const response = await fetchApi.delete(`/${mainRoute}/${id}`);
      return response.data;
    } catch (error) {
      throw getAxiosError(error);
    }
  },

  generatePDF: async (id, employeeId = null) => {
    try {
      const params = employeeId ? `?employee_id=${employeeId}` : "";
      const response = await fetchApi.get(`/${mainRoute}/pdf/${id}${params}`);
      return response.data;
    } catch (error) {
      throw getAxiosError(error);
    }
  },

  sendBulkEmails: async (liquidationId, employees) => {
    try {
      const response = await fetchApi.post(`/${mainRoute}/send-emails`, {
        liquidationId,
        employees
      });
      return response.data;
    } catch (error) {
      throw getAxiosError(error);
    }
  },
};

export default liquidationsApi;
