import axios from "axios";
import publicEnv from "../publicEnv";
import { getSession, signOut } from "next-auth/react";

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
    console.log("Error :>> ", error.response?.data?.message || "Unknown error");
    
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
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
          
          if (response.data && response.data.accessToken) {
            const newAccessToken = response.data.accessToken;
            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
          } else {
            throw new Error("No access token received");
          }
        } catch (refreshError) {
          console.error("❌ Refresh token failed:", refreshError.response?.data || refreshError.message);
          // Redirigir al login cuando falla el refresh token
          signOut({ redirect: true, callbackUrl: "/auth/login" });
          return Promise.reject(refreshError);
        }
      } else {
        // No hay refresh token, redirigir al login
        console.error("❌ No refresh token available, redirecting to login");
        signOut({ redirect: true, callbackUrl: "/auth/login" });
        return Promise.reject(error);
      }
    }
    
    // Si es un error de red o sin respuesta, también redirigir si parece ser un error de autenticación
    if (!error.response && (error.message?.includes("token") || error.message?.includes("401") || error.message?.includes("403"))) {
      console.error("❌ Network error with authentication, redirecting to login");
      signOut({ redirect: true, callbackUrl: "/auth/login" });
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

export function getAxiosError({ response }) {
  return response?.data?.error || "Has ocurred an error.";
}

export default fetchApi;
