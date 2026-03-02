/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { newUser } from "../types/user";
import { User } from "../types/user";
import { AxiosError } from "axios";

// Module-level lock: prevents initAuth from running twice concurrently.
// React StrictMode double-fires effects — without this guard the second call
// would try to refresh with an already-rotated token and get a 401.
let isAuthInitializing = false;

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
              },
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

      refreshAuth: async (silent = false) => {
        set({ checkingAuth: true });

        try {
          const refreshToken = await window.secureToken?.get();

          if (!refreshToken) {
            // No token = normal "not logged in" state, not an error
            set({ checkingAuth: false });
            return false;
          }

          const res = await axios.post(
            "/api/admin/refresh-token",
            {},
            {
              headers: {
                "x-refresh-token": refreshToken,
              },
            },
          );

          const data = res.data.data;
          const newAccessToken = data.accessToken || data.tokens?.accessToken;
          const newRefreshToken =
            data.refreshToken || data.tokens?.refreshToken;

          if (!newAccessToken)
            throw new Error("Backend did not return an access token");

          // Only update the stored refresh token if the server issued a new one
          if (newRefreshToken) {
            await window.secureToken?.save(newRefreshToken);
          }

          set({ accessToken: newAccessToken, checkingAuth: false });
          return true;
        } catch (error: any) {
          console.error("Auth refresh failed: ", error);

          // Only treat as "explicit invalid" when the server explicitly tells us
          // the token is invalid/expired via a specific message — NOT just any 401,
          // because the interceptor itself can generate 401s for other reasons.
          const serverMsg: string = error.response?.data?.message ?? "";
          const isExplicitInvalid =
            serverMsg.toLowerCase().includes("invalid") ||
            serverMsg.toLowerCase().includes("expired");

          // Clear everything on refresh failure
          set({ user: null, accessToken: null, checkingAuth: false });
          await window.secureToken?.clear();

          // When called silently (initAuth on startup) never show any toast —
          // the router will quietly redirect to /login if user is null.
          if (!silent) {
            if (isExplicitInvalid) {
              toast.error("Session expired. Please login again.");
            } else {
              toast.error("Auth refresh failed");
            }
          }

          return false;
        }
      },

      initAuth: async () => {
        // Guard: if another initAuth call is already in-flight, bail out immediately.
        // This prevents React StrictMode's double-effect from running two parallel
        // refreshes — which would consume a rotated refresh token prematurely.
        if (isAuthInitializing) return;
        isAuthInitializing = true;

        set({ checkingAuth: true });

        try {
          const refreshToken = await window.secureToken.get();

          if (refreshToken) {
            // Silently exchange the stored refresh token for a fresh access token
            const success = await get().refreshAuth(true);

            if (success) {
              // Access token refreshed — now hydrate the user profile
              await get().getProfile();
            } else {
              // Refresh failed — token is invalid/expired; clear stale state quietly
              set({ user: null, accessToken: null });
            }
          } else if (get().accessToken && !get().user) {
            // In-memory access token exists but profile missing — fetch it
            await get().getProfile();
          } else {
            // No tokens at all — clear any stale persisted user and let the
            // router redirect to /login naturally (no toast needed)
            set({ user: null, accessToken: null });
          }
        } catch (error) {
          console.error("Auth initialization error:", error);
          set({ user: null, accessToken: null });
        } finally {
          set({ checkingAuth: false });
          isAuthInitializing = false;
        }
      },

      getProfile: async () => {
        try {
          const hasData = !!get().user;
          if (!hasData) set({ loading: true });

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
          const hasData = get().admins.length > 0;
          if (!hasData) set({ loading: true });

          const res = await axios.get("/api/admin/all");

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

      deleteAdmin: async (id: string) => {
        try {
          set({ loading: true });

          const response = await axios.delete(`/api/admin`, {
            headers: {
              "admin-id": id,
            },
          });

          if (!response.data.success) {
            throw new Error("Delete admin failed");
          }

          try {
            await get().getAllAdmins();
          } catch (refreshError) {
            console.error(
              "Failed to refresh, using server response:",
              refreshError,
            );
            // Optimistically update with server response
            set((state: any) => ({
              admins: state.admins.map((admin: User) =>
                admin._id === id ? response.data.data : admin,
              ),
            }));
          }

          toast.success("Admin deleted successfully!");
          set({ loading: false });
          return true;
        } catch (error) {
          const err = error as AxiosError<{ message?: string }>;

          console.log("Error: " + err.message);
          toast.error(err.response?.data?.message || "Something went wrong");

          set({ loading: false });
          return false;
        }
      },

      updateAdmin: async (data: any) => {
        try {
          set({ loading: true });

          if (!data.oldPassword || !data.newPassword) {
            toast.error("all fields are required");
            set({ loading: false });
            return false;
          }

          const response = await axios.patch(`/api/admin`, data);

          if (!response.data.success) {
            throw new Error("Update admin failed");
          }

          set({ loading: false });
          return true;
        } catch (error) {
          const err = error as AxiosError<{ message?: string }>;

          console.log("Error: " + err.message);
          toast.error(err.response?.data?.message || "Something went wrong");

          set({ loading: false });
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
    },
  ),
);
