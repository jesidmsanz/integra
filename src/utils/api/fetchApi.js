import axios from "axios";
import publicEnv from "../publicEnv";
import { getSession, setSession } from "next-auth/react";

const fetchApi = axios.create({
  baseURL: `${publicEnv.apiUrl || "/"}api/`,
});

fetchApi.interceptors.request.use(
  async (config) => {
    const session = await getSession();

    if (session && session.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para respuestas de error
fetchApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log("Error :>> ", error.response.data.message);
    if (
      error.response &&
      error.response.status === 403 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const session = await getSession();

      if (session && session.refreshToken) {
        try {
          const url = `${publicEnv.apiUrl}api/users/auth/refresh-token`;

          const response = await axios.post(url, {
            refreshToken: session.refreshToken,
          });
          const newAccessToken = response.data.accessToken;

          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          return axios(originalRequest);
        } catch (error) {
          console.error("Refresh token failed", error);
          signOut();
          return Promise.reject(error);
        }
      } else {
        signOut();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export function getAxiosError({ response }) {
  return response?.data?.error || "Has ocurred an error.";
}

export default fetchApi;
