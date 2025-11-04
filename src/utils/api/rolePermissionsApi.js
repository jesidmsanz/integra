import fetchApi, { getAxiosError } from "./fetchApi";

const mainRoute = "role-permissions";

const getRolePermissions = async (roleId) => {
  try {
    const { data } = await fetchApi.get(`${mainRoute}/${roleId}`);
    return data.body || data;
  } catch (error) {
    return { error: true, message: getAxiosError(error) };
  }
};

const updateRolePermissions = async (roleId, permissionKeys) => {
  try {
    const { data } = await fetchApi.put(`${mainRoute}/${roleId}`, { permissionKeys });
    return data.body || data;
  } catch (error) {
    return { error: true, message: getAxiosError(error) };
  }
};

const rolePermissionsApi = {
  getRolePermissions,
  updateRolePermissions,
};

export default rolePermissionsApi;

