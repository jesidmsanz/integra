import fetchApi, { getAxiosError } from "./fetchApi";

const mainRoute = "roles";

const list = async () => {
  try {
    const { data } = await fetchApi.get(mainRoute);
    return data.body || data;
  } catch (error) {
    return { error: true, message: getAxiosError(error) };
  }
};

const detail = async (id) => {
  try {
    const { data } = await fetchApi.get(`${mainRoute}/${id}`);
    return data.body || data;
  } catch (error) {
    return { error: true, message: getAxiosError(error) };
  }
};

const create = async (roleData) => {
  try {
    const { data } = await fetchApi.post(mainRoute, roleData);
    return data.body || data;
  } catch (error) {
    return { error: true, message: getAxiosError(error) };
  }
};

const update = async (id, roleData) => {
  try {
    const { data } = await fetchApi.put(`${mainRoute}/${id}`, roleData);
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

const rolesApi = {
  list,
  detail,
  create,
  update,
  remove,
};

export default rolesApi;

