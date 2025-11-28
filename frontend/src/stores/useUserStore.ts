// import Store from "electron-store";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axois from "../lib/axios";
import toast from "react-hot-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Initializing an object of electron's filesystem
// const electronStore = new Store();

export const useUserStore = create(
  persist(
    (set) => ({
      // States
      user: null,
      loading: false,
      setUser: (user: User) => {
        set({ user });
        // electronStore.set("user", user);
      },

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

          set({ user, loading: false });
          // electronStore.set("user", user);
          toast.success("Logged in successfully");
        } catch (error: unknown) {
          console.log("Error: " + error);
          set({ loading: false });
          toast.error("Login failed");
        }
      },

      logout: () => {
        set({ user: null });
        // electronStore.delete("user");
        toast.success("Logged out successfully");
      },
    }),
    {
      name: "user-storage",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      partialize: (state: any) => ({ user: state.user }), // only persists user and not loading state
    }
  )
);
