import { create } from "zustand";

interface User {
  id: string;
  name: string;
  phone: string;
  role: string;
}

export const useUserStore = create((set) => ({
  user: null,
  setUser: (user: User) => set({ user }),
}));
