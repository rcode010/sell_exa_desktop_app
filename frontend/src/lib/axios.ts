import axios from "axios";
import { useUserStore } from "../stores/useUserStore";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const url = "http://localhost:3000";

const axiosInstance = axios.create({
  baseURL: "https://solution-squad-backend-development.onrender.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to automatically include token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - logout user
      useUserStore.getState().logout();
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
