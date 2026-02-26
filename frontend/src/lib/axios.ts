/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useUserStore } from "../stores/useUserStore";

const axiosInstance = axios.create({
  baseURL: "https://solution-squad-backend-development.onrender.com",
  timeout: 30000, // 30 seconds timeout to prevent hanging requests
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  failedQueue = [];
};

// Add request interceptor to automatically include token
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = useUserStore.getState().accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },

  // If there's an error in the request setup
  (error) => Promise.reject(error),
);

// Add response interceptor to handle 401 errors | token refresh
axiosInstance.interceptors.response.use(
  // If the response is successful, just return it
  (response) => response,

  // If there's an error response
  async (error) => {
    const originalRequest = error.config;

    // If there's no user or access token, return the error
    const { user, accessToken } = useUserStore.getState();
    if (!user || !accessToken) {
      return Promise.reject(error);
    }

    // if not a 401 or already retried or is refresh/login endpoint
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url.includes("/api/admin/refresh-token") ||
      originalRequest.url.includes("/api/admin/login") ||
      originalRequest.url.includes("/api/admin/logout")
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue the request while refresh is in progress
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => {
          const newToken = useUserStore.getState().accessToken;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Attempt to refresh the token
      const success = await useUserStore.getState().refreshAuth();

      if (success) {
        // Refresh succeeded - retry all queued requests
        processQueue();

        const newToken = useUserStore.getState().accessToken;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } else {
        // Refresh failed - logout
        processQueue(new Error("Authentication refresh failed"));
        await useUserStore.getState().logout();
        return Promise.reject(error);
      }
    } catch (refreshError) {
      processQueue(refreshError);
      await useUserStore.getState().logout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosInstance;
