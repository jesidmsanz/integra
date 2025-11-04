import fetchApi, { getAxiosError } from "./fetchApi";

const mainRoute = "permissions";

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

const permissionsApi = {
  list,
  detail,
};

export default permissionsApi;

