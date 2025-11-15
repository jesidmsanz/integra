import fetchApi, { getAxiosError } from "./fetchApi";

const mainRoute = "positions";

const list = async () => {
  try {
    const { data } = await fetchApi.get(`${mainRoute}/`);
    return data.body || data;
  } catch (error) {
    return { error: true, message: getAxiosError(error) };
  }
};

const listActive = async () => {
  try {
    const { data } = await fetchApi.get(`${mainRoute}/active`);
    return data.body || data;
  } catch (error) {
    return { error: true, message: getAxiosError(error) };
  }
};

const getById = async (id) => {
  try {
    const { data } = await fetchApi.get(`${mainRoute}/${id}`);
    return data.body || data;
  } catch (error) {
    return { error: true, message: getAxiosError(error) };
  }
};

const create = async (positionData) => {
  try {
    const { data } = await fetchApi.post(`${mainRoute}/`, positionData);
    return data.body || data;
  } catch (error) {
    return { error: true, message: getAxiosError(error) };
  }
};

const update = async (id, positionData) => {
  try {
    const { data } = await fetchApi.put(`${mainRoute}/${id}`, positionData);
    return data.body || data;
  } catch (error) {
    return { error: true, message: getAxiosError(error) };
  }
};

const remove = async (id) => {
  try {
    const { data } = await fetchApi.delete(`${mainRoute}/${id}`);
    return data.body || data;
  } catch (error) {
    return { error: true, message: getAxiosError(error) };
  }
};

const positionsApi = {
  list,
  listActive,
  getById,
  create,
  update,
  remove,
};

export default positionsApi;

