import { create } from "zustand";
import axois from "../lib/axios";

interface User {
  id: string;
  name: string;
  phone: string;
  role: string;
}

export const useUserStore = create((set) => ({
  user: null,
  loading: false,
  setUser: (user: User) => set({ user }),

  login: async (phone: string, password: string) => {
    set({ loading: true });

    try {
      if (!phone || !password) {
        throw new Error("Phone and password are required");
      }

      const response = await axois.post("/api/admin/login", {
        phoneNo: phone,
        password,
      });

      const user = response.data.data;
      console.log("User: " + user);

      set({ user, loading: false });
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },

  logout: async () => set({ user: null }),
}));
