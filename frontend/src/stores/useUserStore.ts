import { create } from "zustand";
import { persist } from "zustand/middleware";
import axois from "../lib/axios";
import toast from "react-hot-toast";

export const useUserStore = create(
  persist(
    (set, get) => ({
      // States
      user: null,
      loading: false,
      accessToken: null,

      // Actions
      login: async (phone: string, password: string) => {
        set({ loading: true });
        try {
          if (!phone || !password) {
            toast.error("Please enter phone and password");
            return;
          }

          const response = await axois.post("/api/admin/login", {
            phoneNo: phone,
            password,
          });

          const user = response.data.data;

          if (window.secureToken) {
            await window.secureToken.save(user.tokens.refreshToken);
          } else {
            toast.error("failed to store Token");
          }
          set({ user, loading: false, accessToken: user.tokens.accessToken });
          toast.success("Logged in successfully");
        } catch (error: unknown) {
          console.log("Error: " + error);
          set({ loading: false });
          toast.error("Login failed");
        }
      },

      logout: async () => {
        set({ user: null, accessToken: null });

        try {
          await axois.post(
            "/api/admin/logout",
            {}, // body
            {
              headers: {
                "refresh-token": `${await window.secureToken.get()}`, // actual headers
              },
            }
          );

          if (window.secureToken) {
            await window.secureToken.clear();
          }
          toast.success("Logged out successfully");
        } catch (error) {
          console.log("ERROR: " + error);
          set({ loading: false });
          toast.error("Logout failed");
        }
      },

      checkAuth: async () => {
        try {
          let refreshToken: string | null = null;
          if (window.secureToken) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            refreshToken = await window.secureToken.get();
          } else {
            throw Error("failed to get token");
          }
          console.log(get().accessToken);
          // currently don't have the endpoint for it
          const res = await axois.get("/api/admin/profile", {
            headers: {
              Authorization: `Bearer ${get().accessToken}`,
            },
          });
          const user = res.data.data;

          set({ user, loading: false });
        } catch (error) {
          set({ loading: false });
        }
      },
    }),
    {
      name: "user-storage",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      partialize: (state: any) => ({
        user: state.user,
        accessToken: state.accessToken,
      }), // only persists user and not loading state
    }
  )
);
