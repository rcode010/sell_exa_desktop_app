/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { newUser, User } from "../types/user";
import { AxiosError } from "axios";

let isAuthInitializing = false;

export const useUserStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      admins: [],
      accessToken: null,
      isHydrated: false,
      loading: false,
      checkingAuth: true, // Start true to block Router redirects

      // Actions
      setHydrated: () => set({ isHydrated: true }),
      setAccessToken: (token: any) => set({ accessToken: token }),

      login: async (phone: string, password: string) => {
        if (!phone || !password) {
          toast.error("Please enter phone and password");
          return false;
        }
        set({ loading: true });
        try {
          const response = await axios.post("/api/admin/login", {
            phoneNo: phone,
            password,
          });
          const user = response.data.data;
          await window.secureToken?.save(user.tokens.refreshToken);
          set({
            user,
            loading: false,
            accessToken: user.tokens.accessToken,
          });
          toast.success("Logged in successfully");
          return true;
        } catch (error: any) {
          set({ loading: false });
          toast.error(error.response?.data?.message || "Login failed");
          return false;
        }
      },

      logout: async () => {
        try {
          const refreshToken = await window.secureToken.get();
          set({ user: null, accessToken: null, admins: [] });
          if (refreshToken) {
            await axios.post("/api/admin/logout", {}, {
              headers: { "refresh-token": refreshToken },
            });
          }
          toast.success("Logged out successfully");
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          await window.secureToken.clear();
        }
      },

      refreshAuth: async (silent = false) => {
        try {
          const refreshToken = await window.secureToken?.get();
          if (!refreshToken) return false;

          const res = await axios.post("/api/admin/refresh-token", {}, {
            headers: { "x-refresh-token": refreshToken },
          });

          const data = res.data.data;
          const newAccessToken = data.accessToken || data.tokens?.accessToken;
          const newRefreshToken = data.refreshToken || data.tokens?.refreshToken;

          if (!newAccessToken) throw new Error("No access token");

          if (newRefreshToken) await window.secureToken?.save(newRefreshToken);

          set({ accessToken: newAccessToken });
          return true;
        } catch (error: any) {
          // If the refresh token itself is expired/invalid (401/403)
          if (error.response?.status === 401 || error.response?.status === 403) {
            set({ user: null, accessToken: null });
            await window.secureToken?.clear();
            if (!silent) toast.error("Session expired. Please login again.");
          }
          return false;
        }
      },

      initAuth: async () => {
        if (isAuthInitializing) return;
        isAuthInitializing = true;
        set({ checkingAuth: true });

        try {
          const refreshToken = await window.secureToken.get();

          if (refreshToken) {
            // 1. Get new Access Token
            const success = await get().refreshAuth(true);
            if (success) {
              // 2. Hydrate the user profile before releasing the lock
              await get().getProfile();
            } else {
              set({ user: null, accessToken: null });
            }
          } else {
            set({ user: null, accessToken: null });
          }
        } catch (error) {
          console.error("Auth init failed:", error);
          set({ user: null, accessToken: null });
        } finally {
          // 3. Only now can the Router see the 'user' state
          set({ checkingAuth: false });
          isAuthInitializing = false;
        }
      },

      getProfile: async () => {
        try {
          const res = await axios.get("/api/admin/profile");
          set({ user: res.data.data });
          return true;
        } catch (error: any) {
          return false;
        }
      },

      getAllAdmins: async () => {
        try {
          if (get().admins.length === 0) set({ loading: true });
          const res = await axios.get("/api/admin/all");
          set({ admins: res.data.data, loading: false });
          return true;
        } catch (error: any) {
          set({ loading: false });
          return false;
        }
      },

      createAdmin: async (data: newUser) => {
        try {
          set({ loading: true });
          await axios.post("/api/admin", data);
          set({ loading: false });
          toast.success("Admin added");
          return true;
        } catch (error: any) {
          set({ loading: false });
          toast.error(error.response?.data?.message || "Failed");
          return false;
        }
      },

      deleteAdmin: async (id: string) => {
        try {
          set({ loading: true });
          await axios.delete(`/api/admin`, { headers: { "admin-id": id } });
          await get().getAllAdmins();
          toast.success("Admin deleted");
          set({ loading: false });
          return true;
        } catch (error: any) {
          set({ loading: false });
          return false;
        }
      },

      updateAdmin: async (data: any) => {
        try {
          set({ loading: true });
          await axios.patch(`/api/admin`, data);
          set({ loading: false });
          return true;
        } catch (error: any) {
          set({ loading: false });
          return false;
        }
      },
    }),
    {
      name: "user-storage",
      partialize: (state: any) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);