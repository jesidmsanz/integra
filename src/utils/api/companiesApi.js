import fetchApi, { getAxiosError } from "./fetchApi";

const mainRoute = "companies";

const list = async (page, pageSize, initialData) => {
  try {
    const { data } = await fetchApi.get(
      `${mainRoute}?currentPage=${page}&pageSize=${pageSize}`,
      initialData
    );
    return data.body;
  } catch (error) {
    return { error: true, message: getAxiosError(error) };
  }
};

const listActive = async (initialData) => {
  try {
    const { data } = await fetchApi.get(`${mainRoute}/active`, initialData);
    return data.body;
  } catch (error) {
    return { error: true, message: getAxiosError(error) };
  }
};

const detail = async (id, initialData) => {
  try {
    const { data } = await fetchApi.get(`${mainRoute}/${id}`, initialData);
    return data.body;
  } catch (error) {
    return { error: true, message: getAxiosError(error) };
  }
};

const create = async (initialData) => {
  try {
    const { data } = await fetchApi.post(mainRoute, initialData);
    return data.body;
  } catch (error) {
    return { error: true, message: getAxiosError(error) };
  }
};

const update = async (id, initialData) => {
  try {
    const { data } = await fetchApi.put(`${mainRoute}/${id}`, initialData);
    return data.body;
  } catch (error) {
    return { error: true, message: getAxiosError(error) };
  }
};

const remove = async (id) => {
  try {
    const { data } = await fetchApi.delete(`${mainRoute}/${id}`);
    return data.body;
  } catch (error) {
    console.log("error", error);
    return { error: true, message: getAxiosError(error) };
  }
};

const companiesApi = { list, listActive, detail, create, update, remove };
export default companiesApi;
