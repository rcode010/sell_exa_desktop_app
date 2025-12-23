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
        } catch (error) {
          set({ loading: false });
          console.error("Logout error:", error);
          toast.error("Logout failed");
        } finally {
          await window.secureToken.clear();
        }
      },

      refreshAuth: async () => {
        try {
          const refreshToken = await window.secureToken?.get();

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

          set({ accessToken });

          return true;
        } catch (error) {
          console.error("Auth refresh failed: ", error);

          // Clear everything on refresh failure
          set({ user: null, accessToken: null });
          await window.secureToken?.clear();

          return false;
        }
      },
      getProfile: async () => {
        try {
          set({ loading: true });

          const accessToken = get().accessToken;

          if (!accessToken) {
            throw new Error("No access token available!");
          }

          const res = await axios.get("/api/admin/profile", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const user = res.data.data;
          set({ user });
          set({ loading: false });

          return true;
        } catch (error) {
          console.error("get profile failed: ", error);
          return false;
        }
      },
      getAllAdmins: async () => {
        try {
          set({ loading: true });

          const accessToken = get().accessToken;

          if (!accessToken) {
            throw new Error("No access token available!");
          }

          const res = await axios.get("/api/admin/some", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const admins = res.data.data;
          set({ admins });
          set({ loading: false });

          return true;
        } catch (error) {
          console.error("get profile failed: ", error);
          return false;
        }
      },
      createAdmin: async (data: newUser) => {
        try {
          set({ loading: true });
          console.log(data);
          const accessToken = get().accessToken;

          if (!accessToken) {
            throw new Error("No access token available!");
          }

          const res = await axios.post("/api/admin", data, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          console.log(res.data);
          
          set({ loading: false });
          toast.success("Admin added successfully");
          return true;
        } catch (error: any) {
          set({ loading: false });

          toast.error(`Admin creation failed: ${error.message}`);
          console.log("get profile failed: ", error);
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
