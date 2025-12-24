/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { newUser } from "../types/user";

export const useUserStore = create(
  persist(
    (set, get) => ({
      // Statess
      user: null,
      admins: [],
      accessToken: null,
      isHydrated: false,
      loading: false,
      checkingAuth: false,

      // Actions
      setHydrated: () => set({ isHydrated: true }),
      setAccessToken: (token: any) => set({ accessToken: token }),

      login: async (phone: string, password: string) => {
        // Ensure user and password are provided
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

          // Save refresh token to secure storage
          await window.secureToken?.save(user.tokens.refreshToken);

          set({
            user,
            loading: false,
            accessToken: user.tokens.accessToken,
          });

          toast.success("Logged in successfully");
          return true;
        } catch (error: any) {
          console.error("Login error:", error);
          set({ loading: false });

          const message = error.response?.data?.message || "Login failed";
          toast.error(message);

          return false;
        }
      },

      logout: async () => {
        try {
          const refreshToken = await window.secureToken.get();

          // Clear state first for instant UI update
          set({ user: null, accessToken: null });

          if (refreshToken) {
            await axios.post(
              "/api/admin/logout",
              {},
              {
                headers: { "refresh-token": `${refreshToken}` },
              }
            );
          }

          toast.success("Logged out successfully");
          return true;
        } catch (error) {
          set({ loading: false });
          console.error("Logout error:", error);
          toast.error("Logout failed");
          return false;
        } finally {
          await window.secureToken.clear();
        }
      },

      refreshAuth: async () => {
        set({ checkingAuth: true });

        try {
          const refreshToken = await window.secureToken?.get();

          console.log("Refresh token: " + refreshToken);

          if (!refreshToken) {
            throw new Error("No refresh token available!");
          }

          const res = await axios.post(
            "/api/admin/refresh-token",
            {},
            {
              headers: {
                "x-refresh-token": refreshToken,
              },
            }
          );

          const { accessToken, refreshToken: newRefreshToken } = res.data.data;

          // Save the new refresh token in secure storage
          await window.secureToken?.save(newRefreshToken);

          set({ accessToken, checkingAuth: false });

          return true;
        } catch (error) {
          console.error("Auth refresh failed: ", error);

          // Clear everything on refresh failure
          set({ user: null, accessToken: null, checkingAuth: false });
          await window.secureToken?.clear();

          return false;
        }
      },

      getProfile: async () => {
        try {
          set({ loading: true });

          const res = await axios.get("/api/admin/profile");

          const user = res.data.data;

          set({ user });
          set({ loading: false });
          return true;
        } catch (error: any) {
          console.error("Getting profile error:", error);
          set({ loading: false });

          const message =
            error.response?.data?.message || "Getting profile data failed";
          toast.error(message);

          return false;
        }
      },

      getAllAdmins: async () => {
        try {
          set({ loading: true });

          const res = await axios.get("/api/admin/some");

          const admins = res.data.data;

          set({ admins });
          set({ loading: false });
          return true;
        } catch (error: any) {
          console.error("get all admins error:", error);
          set({ loading: false });

          const message =
            error.response?.data?.message || "Getting admins failed";
          toast.error(message);

          return false;
        }
      },

      createAdmin: async (data: newUser) => {
        try {
          set({ loading: true });

          await axios.post("/api/admin", data);

          set({ loading: false });
          toast.success("Admin added successfully");
          return true;
        } catch (error: any) {
          console.error("Creating admin error:", error);
          set({ loading: false });

          const message =
            error.response?.data?.message || "Creating admin failed";
          toast.error(message);

          return false;
        }
      },
    }),
    {
      name: "user-storage",
      partialize: (state: any) => ({
        user: state.user,
      }),

      // Called when rehydration is complete
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
